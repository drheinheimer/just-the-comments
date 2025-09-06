import { useCallback, useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import CommentsTable from './components/CommentsTable'
import { saveAs } from 'file-saver'
import { Container, Typography, Box, Button, Fab } from '@mui/material'
import { CloudUpload as CloudUploadIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'
import type { GridRowSelectionModel } from '@mui/x-data-grid'

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
  const [isDragOverlay, setIsDragOverlay] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSelectionChange = useCallback((selectionModel: GridRowSelectionModel) => {
    if (selectionModel.type === 'include') {
      // Use the selected ids directly
      const selectedIds = Array.from(selectionModel.ids) as number[];
      setSelectedRows(selectedIds);
    } else if (selectionModel.type === 'exclude') {
      // Calculate the inverse - all rows except the excluded ones
      const excludedIds = new Set(selectionModel.ids);
      const selectedIds = [];
      for (let i = 0; i < comments.length; i++) {
        if (!excludedIds.has(i)) {
          selectedIds.push(i);
        }
      }
      setSelectedRows(selectedIds);
    }
  }, [comments.length]);

  const downloadCSV = useCallback(() => {
    const header = ["page", "author", "modified", "text"];
    
    // Filter comments to only include selected rows
    const selectedComments = selectedRows.length > 0 
      ? selectedRows.map(index => comments[index]).filter(Boolean)
      : comments; // If none selected, export all
      
    const rows = selectedComments.map((c) =>
      header
        .map((h) => `"${(c as any)[h]?.toString().replace(/"/g, '""') || ""}"`)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    
    // Remove file extension from filename
    const baseFileName = fileName ? fileName.replace(/\.[^/.]+$/, '') : "comments";
    const filename = selectedRows.length > 0 
      ? `${baseFileName}_selected.csv`
      : `${baseFileName}.csv`;
    saveAs(blob, filename);
  }, [comments, fileName, selectedRows]);

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

  // Window-level drag and drop handlers for overlay
  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragOverlay(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragOverlay(false);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragOverlay(false);
      
      const droppedFile = e.dataTransfer?.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [handleFileSelect]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
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
        <Typography variant="body1" sx={{ mt: 1, textAlign: 'center', fontWeight: 500 }}>
          📝 Extract comments from your documents. 🔒 100% private.
        </Typography>

        {/* Upload Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUploadIcon />}
            onClick={handleClick}
            sx={{ px: 4, py: 1.5 }}
          >
            {file ? `Selected: ${file.name}` : 'Upload PDF Document'}
          </Button>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Or drag and drop anywhere on this page
          </Typography>
        </Box>

        {/* Full-screen drag overlay */}
        {isDragOverlay && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px dashed #1976d2',
              boxSizing: 'border-box',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              Drop your PDF here
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Release to upload and extract comments
            </Typography>
          </Box>
        )}

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
              >
                {selectedRows.length > 0 
                  ? `Download CSV (${selectedRows.length} selected)`
                  : 'Download CSV'
                }
              </Button>
            </Box>
            <CommentsTable 
              comments={comments} 
              loading={loading}
              onSelectionChange={handleSelectionChange}
            />
          </Box>
        )}

        

      </Container>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </>
  )
}

export default App
