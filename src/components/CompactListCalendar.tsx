'use client';

import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Divider,
  Paper
} from '@mui/material';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
}

const ROOMS: Room[] = [
  { id: 'r1', name: 'Study Room 1', capacity: 4, equipment: ['Whiteboard', 'TV'] },
  { id: 'r2', name: 'Conference Room', capacity: 8, equipment: ['Projector', 'Video Conf'] },
  { id: 'r3', name: 'Quiet Pod', capacity: 1, equipment: ['Desk Lamp'] },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM

export default function CompactListCalendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ room: Room; time: Date } | null>(null);

  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const handleBookSlot = (room: Room, hour: number) => {
    setSelectedSlot({ room, time: setHours(selectedDate, hour) });
    setBookingDialogOpen(true);
  };

  const isAvailable = (hour: number) => {
    // Mock availability check
    return hour !== 12 && hour !== 13;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button size="small" variant="outlined" onClick={handlePrevDay}>Previous</Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {format(selectedDate, isMobile ? 'MMM d' : 'MMMM d, yyyy')}
        </Typography>
        <Button size="small" variant="outlined" onClick={handleNextDay}>Next</Button>
      </Box>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {ROOMS.map((room) => (
          <Box key={room.id}>
            <ListItem
              sx={{
                py: 2,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
              }}
            >
              <ListItemText
                primary={room.name}
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={`${room.capacity} people`}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                    {room.equipment.map((item) => (
                      <Chip
                        key={item}
                        size="small"
                        variant="outlined"
                        label={item}
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                }
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  flexWrap: 'wrap',
                  mt: isMobile ? 1 : 0,
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                {HOURS.map((hour) => {
                  const available = isAvailable(hour);
                  return (
                    <Chip
                      key={hour}
                      label={format(setHours(new Date(), hour), 'HH:mm')}
                      size="small"
                      color={available ? 'success' : 'error'}
                      variant={available ? 'filled' : 'outlined'}
                      onClick={() => available && handleBookSlot(room, hour)}
                      sx={{
                        minWidth: '60px',
                        cursor: available ? 'pointer' : 'not-allowed',
                        opacity: available ? 1 : 0.6
                      }}
                    />
                  );
                })}
              </Box>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>

      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Book {selectedSlot?.room.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedSlot && format(selectedSlot.time, 'MMMM d, yyyy h:mm a')}
            </Typography>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setBookingDialogOpen(false)}>
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
