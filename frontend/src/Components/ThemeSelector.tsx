import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText,
    Typography
} from '@mui/material';
import {
    Palette,
    LocalFireDepartment, // Fire-type theme
    Water, // Water-type theme
    Park, // Grass-type theme
    Bolt, // Electric-type theme
    Brightness4, // Dark mode
    Brightness7, // Light mode
    AutoAwesome, // Holographic theme
    Castle, // Dragon-type theme
    Psychology // Psychic-type theme
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeType, EffectType } from '../theme/ThemeContext';
import { EffectSelector, themeEffects } from '../theme/ThemeEffects';  // Import themeEffects from here

interface ThemeOption {
    name: string;
    icon: React.ReactNode;
    primaryColor: string;
    secondaryColor: string;
    backgroundEffect?: string;
}

const themeOptions: ThemeOption[] = [
    {
        name: "Light Mode",
        icon: <Brightness7 />,
        primaryColor: "#ffffff",
        secondaryColor: "#2196f3",
    },
    {
        name: "Dark Mode",
        icon: <Brightness4 />,
        primaryColor: "#121212",
        secondaryColor: "#bb86fc",
    },
    {
        name: "Fire Type",
        icon: <LocalFireDepartment sx={{ color: '#ff4d4d' }} />,
        primaryColor: "#ff4d4d",
        secondaryColor: "#ffaa33",
        backgroundEffect: "linear-gradient(45deg, #ff4d4d 0%, #ff8c1a 100%)"
    },
    {
        name: "Water Type",
        icon: <Water sx={{ color: '#3399ff' }} />,
        primaryColor: "#3399ff",
        secondaryColor: "#00ccff",
        backgroundEffect: "radial-gradient(circle, #3399ff 0%, #0066cc 100%)"
    },
    {
        name: "Grass Type",
        icon: <Park sx={{ color: '#33cc33' }} />,
        primaryColor: "#33cc33",
        secondaryColor: "#99ff66",
        backgroundEffect: "linear-gradient(135deg, #33cc33 0%, #66ff33 100%)"
    },
    {
        name: "Electric Type",
        icon: <Bolt sx={{ color: '#ffcc00' }} />,
        primaryColor: "#ffcc00",
        secondaryColor: "#ffff00",
        backgroundEffect: "repeating-linear-gradient(45deg, #ffcc00, #ffcc00 10px, #ffdb4d 10px, #ffdb4d 20px)"
    },
    {
        name: "Dragon Type",
        icon: <Castle sx={{ color: '#9933ff' }} />,
        primaryColor: "#9933ff",
        secondaryColor: "#cc99ff",
        backgroundEffect: "linear-gradient(to right, #9933ff, #ff33cc)"
    },
    {
        name: "Psychic Type",
        icon: <Psychology sx={{ color: '#ff33cc' }} />,
        primaryColor: "#ff33cc",
        secondaryColor: "#ff99ee",
        backgroundEffect: "radial-gradient(circle at top right, #ff33cc, #9933ff)"
    },
    {
        name: "Holographic",
        icon: <AutoAwesome sx={{ color: '#ffffff' }} />,
        primaryColor: "#ffffff",
        secondaryColor: "#rainbow",
        backgroundEffect: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)"
    }
];

const ThemeSelector: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { currentTheme, setTheme } = useTheme();
    const [selectedEffects, setSelectedEffects] = useState<EffectType[]>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (themeType: ThemeType) => {
        setTheme(themeType);
        // Optionally load default effects for the theme
        const defaultEffects = themeEffects
            .filter(effect => effect.defaultThemes.includes(themeType))
            .map(effect => effect.id);
        setSelectedEffects(defaultEffects);
        handleClose();
    };

    const handleEffectToggle = (effect: EffectType) => {
        setSelectedEffects(prev => 
            prev.includes(effect)
                ? prev.filter(e => e !== effect)
                : [...prev, effect]
        );
    };

    return (
        <Box>
            <Button
                startIcon={<Palette />}
                onClick={handleClick}
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)' as const // Add type assertion
                    }
                }}
            >
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Theme
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }
                }}
            >
                {themeOptions.map((option) => (
                    <MenuItem 
                        key={option.name}
                        onClick={() => handleThemeChange(option.name.toLowerCase().replace(' ', '_') as ThemeType)}
                        selected={currentTheme === option.name.toLowerCase().replace(' ', '_')}
                        sx={{
                            '&:hover': {
                                background: option.backgroundEffect || 'rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        <ListItemIcon>
                            {option.icon}
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                ml: 2,
                                background: (option.backgroundEffect || option.primaryColor) as string,
                                border: '2px solid',
                                borderColor: option.secondaryColor
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Visual Effects
                </Typography>
                <EffectSelector
                    selectedEffects={selectedEffects}
                    onEffectToggle={handleEffectToggle}
                />
            </Box>
        </Box>
    );
};

export default ThemeSelector;
