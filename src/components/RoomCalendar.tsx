'use client';

import { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns';
import TimeGrid from './TimeGrid';

const ROOMS = [
  { id: 'anna', name: 'Anna (7)', capacity: 7 },
  { id: 'haademeeste', name: 'Häädemeeste (6)', capacity: 6 },
  { id: 'johvi', name: 'Jõhvi (6)', capacity: 6 },
  { id: 'kanepi', name: 'Kanepi (4)', capacity: 4 },
  { id: 'karja', name: 'Karja (4)', capacity: 4 },
  { id: 'karuse', name: 'Karuse (4)', capacity: 4 },
  { id: 'kose', name: 'Kose (4)', capacity: 4 },
  { id: 'kullamaa', name: 'Kullamaa (10)', capacity: 10 },
  { id: 'laiuse', name: 'Laiuse (4)', capacity: 4 },
  { id: 'muhu', name: 'Muhu (4)', capacity: 4 },
  { id: 'noo', name: 'Nõo (4)', capacity: 4 }
];

export default function RoomCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const renderCalendar = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Button onClick={handlePrevMonth} sx={{ minWidth: '30px', px: 0.5, color: '#1976d2' }}>←</Button>
          <Typography variant="h6" sx={{ mx: 1, textTransform: 'uppercase', fontWeight: 500, color: '#1976d2' }}>
            {format(selectedDate, 'MMMM yyyy')}
          </Typography>
          <Button onClick={handleNextMonth} sx={{ minWidth: '30px', px: 0.5, color: '#1976d2' }}>→</Button>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: 0.5, 
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {weekDays.map(day => (
            <Box key={day} sx={{ 
              textAlign: 'center', 
              py: 0.5,
              color: day === 'Sat' || day === 'Sun' ? '#f44336' : '#1976d2',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {day}
            </Box>
          ))}
          
          {Array.from({ length: new Date(start).getDay() - 1 }, (_, i) => (
            <Box key={`empty-${i}`} />
          ))}
          
          {days.map(day => (
            <Box
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              sx={{
                textAlign: 'center',
                py: 0.5,
                cursor: 'pointer',
                borderRadius: 1,
                backgroundColor: isSameDay(day, selectedDate) ? '#1976d2' : 'transparent',
                color: isWeekend(day) ? '#f44336' : 
                       isSameDay(day, selectedDate) ? '#fff' : '#1976d2',
                '&:hover': {
                  backgroundColor: isSameDay(day, selectedDate) ? '#1976d2' : '#e3f2fd',
                },
                fontSize: '0.875rem',
                fontWeight: isSameDay(day, selectedDate) ? 600 : 400
              }}
            >
              {format(day, 'd')}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const handleBooking = () => {
    console.log('Booking:', {
      date: selectedDate,
      name,
      email,
    });
    setIsBookingModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto', p: 3 }}>
      {renderCalendar()}

      <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#c8e6c9', border: '1px solid #e0e0e0' }} />
        <Typography variant="body2" sx={{ mr: 2, fontSize: '0.75rem' }}>available</Typography>
        
        <Box sx={{ width: 16, height: 16, bgcolor: '#81c784' }} />
        <Typography variant="body2" sx={{ mr: 2, fontSize: '0.75rem' }}>selected</Typography>
        
        <Box sx={{ width: 16, height: 16, bgcolor: '#ffcdd2' }} />
        <Typography variant="body2" sx={{ mr: 2, fontSize: '0.75rem' }}>reserved</Typography>
        
        <Box sx={{ width: 16, height: 16, bgcolor: '#f5f5f5' }} />
        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>closed</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', px: 2 }}>
        <TimeGrid
          key="time-labels"
          date={selectedDate}
          roomName=""
          showTimeLabels={true}
        />
        {ROOMS.map(room => (
          <TimeGrid
            key={room.id}
            date={selectedDate}
            roomName={room.name}
            onRoomClick={() => {
              console.log('Room clicked:', room.name);
            }}
            onSelectionChange={(slots) => {
              console.log('Selected slots for', room.name, slots);
            }}
          />
        ))}
      </Box>

      <Dialog open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)}>
        <DialogTitle>Book Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained">Book</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
