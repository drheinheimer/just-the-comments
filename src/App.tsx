import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import CommentsTable from './components/CommentsTable'
import { saveAs } from 'file-saver'
import { Container, Typography, Box, Button } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";

interface CommentEntry {
  page: number;
  author: string;
  text: string;
  modified: string;
}

function formatDate(ts?: string): string {
  if (!ts) return "";
  const m = /D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(ts);
  if (m) {
    const [_, y, mo, d, h, mi, s] = m;
    const date = new Date(
      Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
    );
    return date.toISOString().replace("T", " ").replace(".000Z", "Z");
  }
  return new Date(ts).toISOString();
}

function App() {

  const [fileName, setFileName] = useState<string>("");
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const downloadCSV = useCallback(() => {
    const header = ["page", "author", "modified", "text"];
    const rows = comments.map((c) =>
      header
        .map((h) => `"${(c as any)[h]?.toString().replace(/"/g, '""') || ""}"`)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${fileName || "comments"}.csv`);
  }, [comments, fileName]);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) return;
    
    setFile(file);
    setError("");
    setComments([]);
    setLoading(true);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const loadingTask = (pdfjsLib as any).getDocument({ data });
      const pdf = await loadingTask.promise;

      const found: CommentEntry[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const annots = await page.getAnnotations();
        for (const a of annots as any[]) {
          const subtype = a.subtype || a.annotationType || "";

          // Only process text annotations
          if (subtype !== 'Text') continue;
          
          // Handle different content formats from PDF.js
          let contents = "";
          if (typeof a.contents === 'string') {
            contents = a.contents;
          } else if (a.contents && typeof a.contents === 'object') {
            // Handle object content (like rich text)
            if (a.contents.str) {
              contents = a.contents.str;
            } else if (a.contents.text) {
              contents = a.contents.text;
            } else if (Array.isArray(a.contents)) {
              contents = a.contents.join(' ');
            } else {
              contents = JSON.stringify(a.contents);
            }
          } else if (a.contentsObj) {
            // Fallback to contentsObj
            if (typeof a.contentsObj === 'string') {
              contents = a.contentsObj;
            } else if (a.contentsObj.str) {
              contents = a.contentsObj.str;
            } else {
              contents = JSON.stringify(a.contentsObj);
            }
          }
          
          // Extract author from various possible properties
          let author = "";
          if (a.titleObj && a.titleObj.str) {
            author = a.titleObj.str;
          } else if (a.title) {
            author = a.title;
          } else if (a.T) {
            // T is the PDF spec field for title/author
            author = typeof a.T === 'string' ? a.T : (a.T.str || "");
          } else if (a.user) {
            author = a.user;
          } else if (a.author) {
            author = a.author;
          } else if (a.userName) {
            author = a.userName;
          }
          
          const mod = a.modificationDate || a.modDate || a.modified || "";
          
          // Debug: log annotation properties to see what's available
          if (contents && contents.trim()) {
            console.log('Annotation properties:', Object.keys(a));
            console.log('Author candidates:', {
              title: a.title,
              user: a.user, 
              author: a.author,
              titleObj: a.titleObj,
              T: a.T,
              userName: a.userName
            });
          }
          
          if (contents && contents.trim()) {
            found.push({
              page: pageNum,
              author,
              text: contents.trim(),
              modified: formatDate(mod),
            });
          }
        }
      }

      setComments(found);
      if (found.length === 0) {
        // notifications.show({
        //   title: "No comments detected",
        //   message: "Parsing completed but found no annotations. PDF may have flattened comments.",
        //   color: "blue",
        // });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse PDF.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    };
    input.click();
  };


  return (
    <>
      <Navbar />

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 2 }}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Just the Comments
        </Typography> */}
        <Typography variant="body1">
          Extract comments from your documents. Inspired by <a target="_blank" rel="noopener noreferrer" href="https://www.sumnotes.net">SumNotes</a>, but totally free.
        </Typography>
        <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 500 }}>
          🔒 Your files stay in your browser—nothing is uploaded to any server.
        </Typography>

        {/* Dropzone */}
        <Box
          sx={{
            width: '100%',
            height: '250px',
            border: '2px dashed #ccc',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            mt: 3,
            transition: 'border-color 0.3s ease',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: '#f5f5f5',
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#666', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            {file ? file.name : 'Drop files here or click to browse'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Supports PDF, DOC, DOCX files
          </Typography>
        </Box>

        {/* Results Section */}
        {loading && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography>Processing PDF...</Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {comments.length > 0 && !loading && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Found {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </Typography>
              <Button 
                variant="contained" 
                onClick={downloadCSV}
                disabled={comments.length === 0}
              >
                Download CSV
              </Button>
            </Box>
            <CommentsTable comments={comments} loading={loading} />
          </Box>
        )}

        

      </Container>
    </>
  )
}

export default App
