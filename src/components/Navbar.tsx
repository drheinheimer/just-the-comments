import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatIcon from '@mui/icons-material/Chat';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              component="a" 
              href="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <ChatIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">
                Just the Comments
              </Typography>
            </Box>
          </Box>
          <IconButton
            color="inherit"
            component="a"
            href="https://github.com/drheinheimer/just-the-comments"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            sx={{ mr: 1 }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
