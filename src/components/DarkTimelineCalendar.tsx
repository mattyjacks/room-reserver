'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { format, addDays, setHours, setMinutes, parse } from 'date-fns';

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

// Generate time slots from 9:00 to 18:00 in 30-minute increments
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = (i % 2) * 30;
  return { hour, minute };
});

interface SelectedTimeSlot {
  room: Room;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
}

export default function DarkTimelineCalendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedTimeSlot[]>([]);
  const [selectionStart, setSelectionStart] = useState<{ room: Room; time: { hour: number; minute: number } } | null>(null);

  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const isAvailable = (hour: number, minute: number) => {
    // Mock availability check
    return !(hour === 12 && minute >= 0 && minute < 60);
  };

  const handleSlotClick = (room: Room, time: { hour: number; minute: number }) => {
    if (!isAvailable(time.hour, time.minute)) return;

    if (!selectionStart) {
      setSelectionStart({ room, time });
    } else if (selectionStart.room.id === room.id) {
      // Create a new time slot
      const startTime = selectionStart.time;
      const endTime = time;

      // Ensure start time is before end time
      if (startTime.hour < time.hour || (startTime.hour === time.hour && startTime.minute < time.minute)) {
        setSelectedTimeSlots([...selectedTimeSlots, { room, startTime, endTime }]);
      } else {
        setSelectedTimeSlots([...selectedTimeSlots, { room, startTime: time, endTime: startTime }]);
      }
      setSelectionStart(null);
    }
  };

  const formatTimeSlot = (slot: SelectedTimeSlot) => {
    const startTimeStr = format(
      setMinutes(setHours(new Date(), slot.startTime.hour), slot.startTime.minute),
      'HH:mm'
    );
    const endTimeStr = format(
      setMinutes(setHours(new Date(), slot.endTime.hour), slot.endTime.minute),
      'HH:mm'
    );
    const dateStr = format(selectedDate, 'EEEE, MMMM d');
    return `${slot.room.name} from ${startTimeStr} to ${endTimeStr} on ${dateStr}`;
  };

  const combineAdjacentSlots = (slots: SelectedTimeSlot[]): SelectedTimeSlot[] => {
    const sortedSlots = [...slots].sort((a, b) => {
      if (a.room.id !== b.room.id) return a.room.id.localeCompare(b.room.id);
      const aStart = a.startTime.hour * 60 + a.startTime.minute;
      const bStart = b.startTime.hour * 60 + b.startTime.minute;
      return aStart - bStart;
    });

    const combined: SelectedTimeSlot[] = [];
    let current: SelectedTimeSlot | null = null;

    for (const slot of sortedSlots) {
      if (!current) {
        current = { ...slot };
        continue;
      }

      const currentEndTime = current.endTime.hour * 60 + current.endTime.minute;
      const nextStartTime = slot.startTime.hour * 60 + slot.startTime.minute;

      if (current.room.id === slot.room.id && currentEndTime === nextStartTime) {
        current.endTime = slot.endTime;
      } else {
        combined.push(current);
        current = { ...slot };
      }
    }

    if (current) {
      combined.push(current);
    }

    return combined;
  };

  const isSlotSelected = (room: Room, time: { hour: number; minute: number }) => {
    return selectedTimeSlots.some(slot => {
      const isAfterStart = 
        time.hour > slot.startTime.hour || 
        (time.hour === slot.startTime.hour && time.minute >= slot.startTime.minute);
      const isBeforeEnd = 
        time.hour < slot.endTime.hour || 
        (time.hour === slot.endTime.hour && time.minute <= slot.endTime.minute);
      return slot.room.id === room.id && isAfterStart && isBeforeEnd;
    });
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
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handlePrevDay}
            sx={{ color: darkTheme.text }}
          >
            ⬅️
          </IconButton>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
          </Typography>
          <IconButton 
            onClick={handleNextDay}
            sx={{ color: darkTheme.text }}
          >
            ➡️
          </IconButton>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: darkTheme.textSecondary,
            fontSize: '0.75rem',
            mt: -1 
          }}
        >
          Times shown are the start of 30-minute blocks
        </Typography>
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
          {TIME_SLOTS.map(({ hour, minute }, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                flex: 1,
                textAlign: 'center',
                color: darkTheme.textSecondary,
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {format(setMinutes(setHours(new Date(), hour), minute), 'HH:mm')}
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
              {TIME_SLOTS.map(({ hour, minute }, index) => {
                const available = isAvailable(hour, minute);
                const isSelected = isSlotSelected(room, { hour, minute });
                const isSelectionStart = selectionStart?.room.id === room.id && 
                  selectionStart.time.hour === hour && 
                  selectionStart.time.minute === minute;

                return (
                  <Tooltip
                    key={index}
                    title={available ? 'Click to select time slot' : 'Not available'}
                    arrow
                  >
                    <Box
                      onClick={() => handleSlotClick(room, { hour, minute })}
                      sx={{
                        flex: 1,
                        height: '40px',
                        bgcolor: isSelected ? `${room.color}60` : 
                                isSelectionStart ? `${room.color}80` :
                                available ? `${room.color}20` : 
                                darkTheme.hover,
                        border: '1px solid',
                        borderColor: isSelected || isSelectionStart ? room.color : 
                                   available ? `${room.color}40` : 
                                   darkTheme.border,
                        cursor: available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        '&:hover': available ? {
                          bgcolor: `${room.color}40`,
                          transform: 'scale(1.05)',
                          boxShadow: `0 2px 4px rgba(0,0,0,0.2)`
                        } : {
                          bgcolor: darkTheme.hover,
                          cursor: 'not-allowed'
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {!isMobile && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isSelected ? darkTheme.text :
                                   available ? room.color : 
                                   darkTheme.textSecondary,
                            fontSize: '0.7rem'
                          }}
                        >
                          {format(setMinutes(setHours(new Date(), hour), minute), 'HH:mm')}
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

      {selectedTimeSlots.length > 0 && (
        <Box sx={{ mt: 4, borderTop: '1px solid', borderColor: darkTheme.border, pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Selected Time Slots:</Typography>
          <List>
            {combineAdjacentSlots(selectedTimeSlots).map((slot, index) => (
              <ListItem 
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <IconButton 
                  onClick={() => {
                    // Remove all slots that make up this combined slot
                    const startTime = slot.startTime.hour * 60 + slot.startTime.minute;
                    const endTime = slot.endTime.hour * 60 + slot.endTime.minute;
                    setSelectedTimeSlots(selectedTimeSlots.filter(s => {
                      const sStart = s.startTime.hour * 60 + s.startTime.minute;
                      const sEnd = s.endTime.hour * 60 + s.endTime.minute;
                      return !(s.room.id === slot.room.id && 
                             sStart >= startTime && 
                             sEnd <= endTime);
                    }));
                  }}
                  sx={{ 
                    color: darkTheme.text,
                    p: 0,
                    '&:hover': {
                      color: '#ff4444'
                    }
                  }}
                >
                  ❌
                </IconButton>
                <ListItemText 
                  primary={formatTimeSlot(slot)}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: darkTheme.text 
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              mt: 2,
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#388E3C'
              }
            }}
            onClick={() => setBookingDialogOpen(true)}
          >
            Book Selected Slots
          </Button>
        </Box>
      )}

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
        <DialogTitle>Book Multiple Time Slots</DialogTitle>
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
            onClick={() => {
              setBookingDialogOpen(false);
              setSelectedTimeSlots([]);
            }}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': {
                bgcolor: '#388E3C'
              }
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
