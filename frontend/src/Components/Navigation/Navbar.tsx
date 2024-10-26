import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Person,
  AdminPanelSettings,
  Dashboard,
  Casino,
  Store,
  Analytics
} from '@mui/icons-material';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/pack-simulator', label: 'Pack Simulator', icon: <Casino /> },
    { path: '/shop-tracker', label: 'Shop Tracker', icon: <Store /> },
    { path: '/analytics', label: 'Analytics', icon: <Analytics /> },
    { path: '/about', label: 'About', icon: <Person /> },
    { path: '/admin', label: 'Admin', icon: <AdminPanelSettings /> },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setAnchorEl(null)}
                  selected={location.pathname === item.path}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    {item.label}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
