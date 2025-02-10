'use client';

import { useState } from 'react';
import { Box, Paper, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';

const ROOMS = ['Room A', 'Room B', 'Room C'];
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
};

interface TimeSlot {
  time: Date;
  isAvailable: boolean;
}

export default function RoomCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>(ROOMS[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDuration, setBookingDuration] = useState(15);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let currentTime = setMinutes(setHours(date, BUSINESS_HOURS.start), 0);
    const endTime = setMinutes(setHours(date, BUSINESS_HOURS.end), 0);

    while (currentTime < endTime) {
      slots.push({
        time: currentTime,
        isAvailable: true, // In a real app, this would be determined by checking against a database
      });
      currentTime = addMinutes(currentTime, 15);
    }
    return slots;
  };

  const handleTimeSlotClick = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleBooking = () => {
    // In a real app, this would make an API call to save the booking
    console.log('Booking:', {
      date: selectedDate,
      room: selectedRoom,
      timeSlot: selectedTimeSlot?.time,
      duration: bookingDuration,
      name,
      email,
    });
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
    setName('');
    setEmail('');
  };

  const timeSlots = generateTimeSlots(selectedDate);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Room Reservation System
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Date: {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  fullWidth
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Select Room"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  {ROOMS.map((room) => (
                    <MenuItem key={room} value={room}>
                      {room}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Time Slots
            </Typography>
            <Grid container spacing={1}>
              {timeSlots.map((slot) => (
                <Grid item xs={6} sm={4} md={2} key={slot.time.toISOString()}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={!slot.isAvailable}
                    sx={{
                      height: '48px',
                      textTransform: 'none',
                      '&.Mui-disabled': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    {format(slot.time, 'HH:mm')}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Book {selectedRoom} - {selectedTimeSlot && format(selectedTimeSlot.time, 'MMMM d, yyyy HH:mm')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Duration (minutes)"
              value={bookingDuration}
              onChange={(e) => setBookingDuration(Number(e.target.value))}
            >
              {[15, 30, 45, 60, 75, 90, 105, 120].map((duration) => (
                <MenuItem key={duration} value={duration}>
                  {duration} minutes
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBooking} 
            variant="contained" 
            disabled={!name || !email}
          >
            Book Room
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
