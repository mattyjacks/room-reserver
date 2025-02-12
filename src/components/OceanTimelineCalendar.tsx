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

const oceanTheme = {
  background: '#e3f2fd',
  paper: '#ffffff',
  primary: '#0277bd',
  secondary: '#01579b',
  accent: '#4fc3f7',
  text: '#01579b',
  textSecondary: '#0288d1',
  border: '#b3e5fc',
  hover: '#e1f5fe'
};

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
  view: string;
}

const ROOMS: Room[] = [
  { id: 'r1', name: 'Ocean View', color: '#01579b', capacity: 1, view: 'Sea' },
  { id: 'r2', name: 'Bay Room', color: '#0288d1', capacity: 6, view: 'Harbor' },
  { id: 'r3', name: 'Marina Hall', color: '#039be5', capacity: 12, view: 'Marina' },
  { id: 'r4', name: 'Wave Studio', color: '#03a9f4', capacity: 4, view: 'Beach' },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9);

export default function OceanTimelineCalendar() {
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
        bgcolor: oceanTheme.paper,
        borderRadius: 2,
        color: oceanTheme.text,
        backgroundImage: 'linear-gradient(to bottom right, #ffffff, #e3f2fd)'
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handlePrevDay}
          sx={{ 
            borderColor: oceanTheme.primary,
            color: oceanTheme.primary,
            '&:hover': {
              borderColor: oceanTheme.secondary,
              bgcolor: oceanTheme.hover
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
            color: oceanTheme.primary,
            fontWeight: 500
          }}
        >
          {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleNextDay}
          sx={{ 
            borderColor: oceanTheme.primary,
            color: oceanTheme.primary,
            '&:hover': {
              borderColor: oceanTheme.secondary,
              bgcolor: oceanTheme.hover
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
                color: oceanTheme.textSecondary,
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
                borderColor: oceanTheme.border,
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
                    borderRadius: '12px',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
                <Chip 
                  size="small" 
                  label={room.view}
                  sx={{ 
                    bgcolor: oceanTheme.hover,
                    color: oceanTheme.secondary,
                    borderRadius: '12px',
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
                        borderColor: available ? `${room.color}30` : oceanTheme.border,
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
                        borderRadius: '8px'
                      }}
                    >
                      {!isMobile && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: available ? room.color : oceanTheme.textSecondary,
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
            bgcolor: oceanTheme.paper,
            backgroundImage: 'linear-gradient(to bottom right, #ffffff, #e3f2fd)',
            color: oceanTheme.text
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: oceanTheme.primary }}>
            Book {selectedSlot?.room.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: oceanTheme.textSecondary }}>
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
                '& .MuiInputLabel-root': { color: oceanTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: oceanTheme.border },
                  '&:hover fieldset': { borderColor: oceanTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: oceanTheme.primary }
                }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              sx={{
                '& .MuiInputLabel-root': { color: oceanTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: oceanTheme.border },
                  '&:hover fieldset': { borderColor: oceanTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: oceanTheme.primary }
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
                '& .MuiInputLabel-root': { color: oceanTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: oceanTheme.border },
                  '&:hover fieldset': { borderColor: oceanTheme.primary },
                  '&.Mui-focused fieldset': { borderColor: oceanTheme.primary }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ color: oceanTheme.textSecondary }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ 
              bgcolor: oceanTheme.primary,
              '&:hover': {
                bgcolor: oceanTheme.secondary
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
