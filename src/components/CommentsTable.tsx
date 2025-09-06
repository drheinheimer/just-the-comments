import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid';

interface CommentEntry {
  page: number;
  author: string;
  text: string;
  modified: string;
}

interface CommentsTableProps {
  comments: CommentEntry[];
  loading?: boolean;
  onSelectionChange?: (selectionModel: GridRowSelectionModel) => void;
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
      }}>
        {params.value}
      </Box>
    ),
  },
];

export default function CommentsTable({ comments, loading = false, onSelectionChange }: CommentsTableProps) {
  // Add unique id for DataGrid (required)
  const rowsWithId = comments.map((comment, index) => ({
    id: index,
    ...comment,
  }));

  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    onSelectionChange?.(selectionModel);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rowsWithId}
        columns={columns}
        loading={loading}
        getRowHeight={() => 'auto'}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '12px',
            paddingBottom: '12px',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
          // Disable checkbox animations for faster response
          '& .MuiCheckbox-root': {
            transition: 'none !important',
            '& .MuiSvgIcon-root': {
              transition: 'none !important',
            },
          },
          // Also disable any checkbox ripple effects
          '& .MuiCheckbox-root .MuiTouchRipple-root': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
}
