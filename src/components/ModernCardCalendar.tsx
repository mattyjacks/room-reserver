'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface Room {
  id: string;
  name: string;
  type: 'quiet' | 'group' | 'conference';
  capacity: number;
  image: string;
  amenities: string[];
}

const ROOMS: Room[] = [
  {
    id: 'quiet1',
    name: 'Focus Pod A',
    type: 'quiet',
    capacity: 1,
    image: '🎧',
    amenities: ['Desk Lamp', 'Power Outlets', 'Ergonomic Chair']
  },
  {
    id: 'group1',
    name: 'Team Space 1',
    type: 'group',
    capacity: 6,
    image: '👥',
    amenities: ['Whiteboard', 'TV Screen', 'Conference Phone']
  },
  {
    id: 'conf1',
    name: 'Board Room',
    type: 'conference',
    capacity: 12,
    image: '🏢',
    amenities: ['Projector', 'Video Conference', 'Catering Available']
  }
];

const TIME_SLOTS = [
  { start: 9, end: 11, label: 'Morning' },
  { start: 11, end: 13, label: 'Noon' },
  { start: 13, end: 15, label: 'Afternoon' },
  { start: 15, end: 17, label: 'Late Afternoon' },
  { start: 17, end: 21, label: 'Evening' }
];

export default function ModernCardCalendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    room: Room;
    timeSlot: typeof TIME_SLOTS[0];
  } | null>(null);

  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const handleBooking = (room: Room, timeSlot: typeof TIME_SLOTS[0]) => {
    setSelectedBooking({ room, timeSlot });
    setBookingDialogOpen(true);
  };

  const isAvailable = (start: number) => {
    // Mock availability check
    return start !== 11 && start !== 13;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={handlePrevDay}>Previous</Button>
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
          {format(selectedDate, isMobile ? 'MMM d' : 'EEEE, MMMM d')}
        </Typography>
        <Button variant="outlined" onClick={handleNextDay}>Next</Button>
      </Box>

      <Grid container spacing={3}>
        {ROOMS.map((room) => (
          <Grid item xs={12} md={4} key={room.id}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, fontSize: '1.5rem' }}>{room.image}</Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {room.name}
                    </Typography>
                    <Chip 
                      size="small"
                      label={`${room.capacity} people`}
                      color="primary"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {room.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {TIME_SLOTS.map((slot) => {
                    const available = isAvailable(slot.start);
                    return (
                      <Button
                        key={slot.label}
                        variant={available ? "outlined" : "text"}
                        color={available ? "primary" : "error"}
                        onClick={() => available && handleBooking(room, slot)}
                        sx={{
                          justifyContent: 'space-between',
                          opacity: available ? 1 : 0.6,
                          cursor: available ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Typography variant="body2">
                          {slot.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(setHours(new Date(), slot.start), 'HH:mm')} - 
                          {format(setHours(new Date(), slot.end), 'HH:mm')}
                        </Typography>
                      </Button>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Book {selectedBooking?.room.name}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedBooking?.timeSlot.label} slot
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
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
              inputProps={{ min: 1, max: selectedBooking?.room.capacity }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setBookingDialogOpen(false)}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
