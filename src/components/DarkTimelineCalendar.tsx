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

const darkTheme = {
  background: '#1a1a1a',
  paper: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#404040',
  hover: '#404040'
};

interface Room {
  id: string;
  name: string;
  color: string;
  capacity: number;
}

const ROOMS: Room[] = [
  { id: 'r1', name: 'Quiet Study', color: '#4CAF50', capacity: 1 },
  { id: 'r2', name: 'Group Room', color: '#2196F3', capacity: 6 },
  { id: 'r3', name: 'Conference', color: '#9C27B0', capacity: 12 },
  { id: 'r4', name: 'Media Lab', color: '#FF9800', capacity: 4 },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9);

export default function DarkTimelineCalendar() {
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
        bgcolor: darkTheme.paper,
        borderRadius: 2,
        color: darkTheme.text
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handlePrevDay}
          sx={{ 
            borderColor: darkTheme.border,
            color: darkTheme.text,
            '&:hover': {
              borderColor: darkTheme.text,
              bgcolor: darkTheme.hover
            }
          }}
        >
          Previous
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleNextDay}
          sx={{ 
            borderColor: darkTheme.border,
            color: darkTheme.text,
            '&:hover': {
              borderColor: darkTheme.text,
              bgcolor: darkTheme.hover
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
                color: darkTheme.textSecondary,
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
                borderColor: darkTheme.border,
                pb: 2
              }
            }}
          >
            <Box sx={{ width: '150px', pr: 2 }}>
              <Typography variant="subtitle2" sx={{ color: darkTheme.text }} noWrap>
                {room.name}
              </Typography>
              <Chip 
                size="small" 
                label={`${room.capacity} people`}
                sx={{ 
                  mt: 0.5,
                  bgcolor: `${room.color}20`,
                  color: room.color,
                  borderColor: room.color
                }}
              />
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
                        bgcolor: available ? `${room.color}20` : darkTheme.hover,
                        border: '1px solid',
                        borderColor: available ? `${room.color}40` : darkTheme.border,
                        cursor: available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        '&:hover': available ? {
                          bgcolor: `${room.color}40`,
                          transform: 'scale(1.05)'
                        } : {},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {!isMobile && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: available ? room.color : darkTheme.textSecondary,
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
            bgcolor: darkTheme.paper,
            color: darkTheme.text
          }
        }}
      >
        <DialogTitle>
          Book {selectedSlot?.room.name}
          <Typography variant="subtitle2" sx={{ color: darkTheme.textSecondary }}>
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
                '& .MuiInputLabel-root': { color: darkTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  color: darkTheme.text,
                  '& fieldset': { borderColor: darkTheme.border },
                  '&:hover fieldset': { borderColor: darkTheme.text },
                }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              sx={{
                '& .MuiInputLabel-root': { color: darkTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  color: darkTheme.text,
                  '& fieldset': { borderColor: darkTheme.border },
                  '&:hover fieldset': { borderColor: darkTheme.text },
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
                '& .MuiInputLabel-root': { color: darkTheme.textSecondary },
                '& .MuiOutlinedInput-root': {
                  color: darkTheme.text,
                  '& fieldset': { borderColor: darkTheme.border },
                  '&:hover fieldset': { borderColor: darkTheme.text },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ color: darkTheme.textSecondary }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ 
              bgcolor: selectedSlot?.room.color,
              '&:hover': {
                bgcolor: `${selectedSlot?.room.color}CC`
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
