import React from 'react';
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Grid } from '@mui/material';
import { Close, AutoAwesome, LocalFireDepartment, Water, Bolt } from '@mui/icons-material';

export type EffectType = 
  | 'particles' 
  | 'floating_cards' 
  | 'fire_glow' 
  | 'water_ripple'
  | 'electric_spark'
  | 'psychic_waves'
  | 'dragon_aura'
  | 'holo_shine'
  | 'card_flip';

interface ThemeEffect {
  id: EffectType;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultThemes: string[];
  preview: string; // URL to preview gif/video
}

export const themeEffects: ThemeEffect[] = [
  {
    id: 'particles',
    name: 'Floating Particles',
    icon: <AutoAwesome />,
    description: 'Gentle particles floating in the background',
    defaultThemes: ['psychic', 'holographic'],
    preview: '/effects/particles.gif'
  },
  {
    id: 'fire_glow',
    name: 'Fire Glow',
    icon: <LocalFireDepartment />,
    description: 'Pulsing glow effect on card borders',
    defaultThemes: ['fire', 'dragon'],
    preview: '/effects/fire_glow.gif'
  },
  {
    id: 'water_ripple',
    name: 'Water Ripples',
    icon: <Water />,
    description: 'Subtle ripple effect on hover',
    defaultThemes: ['water'],
    preview: '/effects/water_ripple.gif'
  },
  {
    id: 'electric_spark',
    name: 'Electric Sparks',
    icon: <Bolt />,
    description: 'Sparking effect on interactions',
    defaultThemes: ['electric'],
    preview: '/effects/electric_spark.gif'
  },
  // ... more effects
];

interface EffectSelectorProps {
  selectedEffects: EffectType[];
  onEffectToggle: (effect: EffectType) => void;
}

export const EffectSelector: React.FC<EffectSelectorProps> = ({
  selectedEffects,
  onEffectToggle
}) => {
  const [previewEffect, setPreviewEffect] = React.useState<ThemeEffect | null>(null);

  return (
    <Box>
      <Grid container spacing={1}>
        {themeEffects.map((effect) => (
          <Grid item key={effect.id}>
            <Chip
              icon={effect.icon}
              label={effect.name}
              onClick={() => onEffectToggle(effect.id)}
              onMouseEnter={() => setPreviewEffect(effect)}
              onMouseLeave={() => setPreviewEffect(null)}
              color={selectedEffects.includes(effect.id) ? 'primary' : 'default'}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!previewEffect}
        onClose={() => setPreviewEffect(null)}
        maxWidth="sm"
        fullWidth
      >
        {previewEffect && (
          <>
            <DialogTitle>
              {previewEffect.name}
              <IconButton
                onClick={() => setPreviewEffect(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={previewEffect.preview} 
                  alt={previewEffect.name}
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
                <Box sx={{ mt: 2 }}>
                  {previewEffect.description}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};
