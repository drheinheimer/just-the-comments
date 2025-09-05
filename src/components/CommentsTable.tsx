import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

interface CommentEntry {
  page: number;
  author: string;
  text: string;
  modified: string;
}

interface CommentsTableProps {
  comments: CommentEntry[];
  loading?: boolean;
}

const columns: GridColDef<CommentEntry>[] = [
  { 
    field: 'page', 
    headerName: 'Page', 
    width: 90,
    type: 'number'
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
  },
  {
    field: 'modified',
    headerName: 'Modified',
    width: 180,
  },
  {
    field: 'text',
    headerName: 'Comment',
    flex: 1,
    minWidth: 300,
    renderCell: (params) => (
      <Box sx={{ 
        whiteSpace: 'normal', 
        wordWrap: 'break-word', 
        lineHeight: 1.4,
        py: 1 
      }}>
        {params.value}
      </Box>
    ),
  },
];

export default function CommentsTable({ comments, loading = false }: CommentsTableProps) {
  // Add unique id for DataGrid (required)
  const rowsWithId = comments.map((comment, index) => ({
    id: index,
    ...comment,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        loading={loading}
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </Box>
  );
}
