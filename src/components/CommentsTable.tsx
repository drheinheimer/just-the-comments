import Box from '@mui/material/Box';
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid';
import { useMemo, useCallback } from 'react';

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
  // Memoize row data to prevent unnecessary re-computation
  const rowsWithId = useMemo(() => 
    comments.map((comment, index) => ({
      id: index,
      ...comment,
    })), [comments]
  );

  const handleSelectionChange = useCallback((selectionModel: GridRowSelectionModel) => {
    onSelectionChange?.(selectionModel);
  }, [onSelectionChange]);

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
        disableVirtualization={false}
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
            padding: '0 !important', // Remove padding that creates the circular background space
            '& .MuiSvgIcon-root': {
              transition: 'none !important',
            },
            // Remove the circular background entirely
            '&:before': {
              display: 'none',
            },
            '&:after': {
              display: 'none', 
            },
            // Add instant visual feedback on mousedown
            '&:active .MuiSvgIcon-root': {
            //   transform: 'scale(0.9)',
              opacity: '0.7',
            },
          },
          // Also disable any checkbox ripple effects
          '& .MuiCheckbox-root .MuiTouchRipple-root': {
            display: 'none',
          },
          // Remove the circular hover background
          '& .MuiCheckbox-root:hover': {
            backgroundColor: 'transparent !important',
          },
          // Optimize row rendering performance
          '& .MuiDataGrid-virtualScroller': {
            // Enable hardware acceleration
            transform: 'translateZ(0)',
          },
          // Reduce reflow on selection changes
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.08) !important',
            transition: 'none !important',
          },
        }}
      />
    </Box>
  );
}
