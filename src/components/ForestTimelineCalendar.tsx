'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { format, addDays, setHours, setMinutes } from 'date-fns';

const forestTheme = {
  background: '#f1f8e9',
  paper: '#ffffff',
  primary: '#2e7d32',
  secondary: '#1b5e20',
  accent: '#81c784',
  text: '#1b5e20',
  textSecondary: '#558b2f',
  border: '#c5e1a5',
  hover: '#dcedc8'
};

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
  type: string;
}

const ROOMS: Room[] = [
  { id: 'r1', name: 'Forest View', color: '#33691e', capacity: 1, type: 'Quiet' },
  { id: 'r2', name: 'Garden Room', color: '#43a047', capacity: 6, type: 'Group' },
  { id: 'r3', name: 'Meadow Hall', color: '#7cb342', capacity: 12, type: 'Conference' },
  { id: 'r4', name: 'Nature Lab', color: '#558b2f', capacity: 4, type: 'Study' },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9);

export default function ForestTimelineCalendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    room: Room;
    hour: number;
  } | null>(null);

  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const isAvailable = (hour: number) => {
    return hour !== 12 && hour !== 13;
  };

  const handleSlotClick = (room: Room, hour: number) => {
    if (isAvailable(hour)) {
      setSelectedSlot({ room, hour });
      setBookingDialogOpen(true);
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        bgcolor: forestTheme.paper,
        borderRadius: 2,
        color: forestTheme.text,
        backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f1f8e9)'
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handlePrevDay}
          sx={{ 
            borderColor: forestTheme.primary,
            color: forestTheme.primary,
            '&:hover': {
              borderColor: forestTheme.secondary,
              bgcolor: forestTheme.hover
            }
          }}
        >
          Previous
        </Button>
        <Typography 
          variant="h6" 
          sx={{ 
            flex: 1, 
            textAlign: 'center',
            color: forestTheme.primary,
            fontWeight: 500
          }}
        >
          {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleNextDay}
          sx={{ 
            borderColor: forestTheme.primary,
            color: forestTheme.primary,
            '&:hover': {
              borderColor: forestTheme.secondary,
              bgcolor: forestTheme.hover
            }
          }}
        >
          Next
        </Button>
      </Box>

      <Box sx={{ position: 'relative', mt: 4 }}>
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: -25, 
          right: 0, 
          display: 'flex',
          pl: '150px'
        }}>
          {HOURS.map(hour => (
            <Typography
              key={hour}
              variant="caption"
              sx={{
                flex: 1,
                textAlign: 'center',
                color: forestTheme.textSecondary,
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {format(setHours(new Date(), hour), 'HH:mm')}
            </Typography>
          ))}
        </Box>

        {ROOMS.map((room) => (
          <Box
            key={room.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              '&:not(:last-child)': {
                borderBottom: '1px solid',
                borderColor: forestTheme.border,
                pb: 2
              }
            }}
          >
            <Box sx={{ width: '150px', pr: 2 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: room.color,
                  fontWeight: 500
                }} 
                noWrap
              >
                {room.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                <Chip 
                  size="small" 
                  label={`${room.capacity} people`}
                  sx={{ 
                    bgcolor: `${room.color}15`,
                    color: room.color,
                    borderRadius: '4px',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
                <Chip 
                  size="small" 
                  label={room.type}
                  sx={{ 
                    bgcolor: forestTheme.hover,
                    color: forestTheme.secondary,
                    borderRadius: '4px',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flex: 1, gap: '2px' }}>
              {HOURS.map(hour => {
                const available = isAvailable(hour);
                return (
                  <Tooltip
                    key={hour}
                    title={available ? 'Click to book' : 'Not available'}
                    arrow
                  >
                    <Box
                      onClick={() => handleSlotClick(room, hour)}
                      sx={{
                        flex: 1,
                        height: '40px',
                        bgcolor: available ? `${room.color}15` : '#fafafa',
                        border: '1px solid',
                        borderColor: available ? `${room.color}30` : forestTheme.border,
                        cursor: available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        '&:hover': available ? {
                          bgcolor: `${room.color}25`,
                          transform: 'scale(1.05)',
                          boxShadow: `0 0 0 1px ${room.color}40`
                        } : {},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                    >
                      {!isMobile && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: available ? room.color : forestTheme.textSecondary,
                            fontSize: '0.7rem'
                          }}
                        >
                          {format(setHours(new Date(), hour), 'HH:mm')}
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: forestTheme.paper,
            backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f1f8e9)',
            color: forestTheme.text
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: forestTheme.primary }}>
            Book {selectedSlot?.room.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: forestTheme.textSecondary }}>
            {selectedSlot && format(setHours(selectedDate, selectedSlot.hour), 'h:mm a')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              sx={{
                '& .MuiInputLabel-root': { color: forestTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: forestTheme.border },
                  '&:hover fieldset': { borderColor: forestTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: forestTheme.primary }
                }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              sx={{
                '& .MuiInputLabel-root': { color: forestTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: forestTheme.border },
                  '&:hover fieldset': { borderColor: forestTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: forestTheme.primary }
                }
              }}
            />
            <TextField
              fullWidth
              label="Number of People"
              type="number"
              margin="normal"
              inputProps={{ 
                min: 1, 
                max: selectedSlot?.room.capacity 
              }}
              sx={{
                '& .MuiInputLabel-root': { color: forestTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: forestTheme.border },
                  '&:hover fieldset': { borderColor: forestTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: forestTheme.primary }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ color: forestTheme.textSecondary }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ 
              bgcolor: forestTheme.primary,
              '&:hover': {
                bgcolor: forestTheme.secondary
              }
            }}
          >
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
