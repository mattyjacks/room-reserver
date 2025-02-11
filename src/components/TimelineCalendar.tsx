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
  Divider
} from '@mui/material';
import { format, addDays, setHours, setMinutes } from 'date-fns';

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

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM

export default function TimelineCalendar() {
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
    // Mock availability check
    return hour !== 12 && hour !== 13;
  };

  const handleSlotClick = (room: Room, hour: number) => {
    if (isAvailable(hour)) {
      setSelectedSlot({ room, hour });
      setBookingDialogOpen(true);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={handlePrevDay}>Previous</Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
        </Typography>
        <Button variant="outlined" onClick={handleNextDay}>Next</Button>
      </Box>

      <Box sx={{ position: 'relative', mt: 4 }}>
        {/* Time indicators */}
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: -25, 
          right: 0, 
          display: 'flex',
          pl: '150px' // Align with grid
        }}>
          {HOURS.map(hour => (
            <Typography
              key={hour}
              variant="caption"
              sx={{
                flex: 1,
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {format(setHours(new Date(), hour), 'HH:mm')}
            </Typography>
          ))}
        </Box>

        {/* Room rows */}
        {ROOMS.map((room, index) => (
          <Box
            key={room.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              '&:not(:last-child)': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2
              }
            }}
          >
            {/* Room info */}
            <Box sx={{ width: '150px', pr: 2 }}>
              <Typography variant="subtitle2" noWrap>
                {room.name}
              </Typography>
              <Chip 
                size="small" 
                label={`${room.capacity} people`}
                sx={{ mt: 0.5 }}
              />
            </Box>

            {/* Time slots */}
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
                        bgcolor: available ? `${room.color}20` : '#f5f5f5',
                        border: '1px solid',
                        borderColor: available ? room.color : '#e0e0e0',
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
                      {isMobile ? null : (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: available ? 'text.primary' : 'text.disabled',
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
      >
        <DialogTitle>
          Book {selectedSlot?.room.name}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedSlot && format(setHours(selectedDate, selectedSlot.hour), 'h:mm a')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ bgcolor: selectedSlot?.room.color }}
          >
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
