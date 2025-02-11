'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';

// Icons would need to be imported from @mui/icons-material
// import { Computer, Wifi, Tv, Group, VolumeUp, AccessTime, ExpandMore } from '@mui/icons-material';

interface RoomFeatures {
  id: string;
  name: string;
  capacity: number;
  features: {
    hasComputer: boolean;
    hasTV: boolean;
    hasProjector: boolean;
    isQuiet: boolean;
    hasWhiteboard: boolean;
    isGroupFriendly: boolean;
  };
  description: string;
  floor: number;
  maxBookingHours: number;
}

const ROOMS: RoomFeatures[] = [
  {
    id: 'study-pod-1',
    name: 'Study Pod 1',
    capacity: 1,
    features: {
      hasComputer: true,
      hasTV: false,
      hasProjector: false,
      isQuiet: true,
      hasWhiteboard: false,
      isGroupFriendly: false
    },
    description: 'Individual study pod with computer workstation',
    floor: 2,
    maxBookingHours: 4
  },
  {
    id: 'collab-1',
    name: 'Collaboration Room 1',
    capacity: 6,
    features: {
      hasComputer: true,
      hasTV: true,
      hasProjector: true,
      isQuiet: false,
      hasWhiteboard: true,
      isGroupFriendly: true
    },
    description: 'Group study room with presentation equipment',
    floor: 2,
    maxBookingHours: 2
  },
  {
    id: 'quiet-1',
    name: 'Quiet Study Room',
    capacity: 4,
    features: {
      hasComputer: false,
      hasTV: false,
      hasProjector: false,
      isQuiet: true,
      hasWhiteboard: true,
      isGroupFriendly: false
    },
    description: 'Silent study room for focused work',
    floor: 3,
    maxBookingHours: 3
  }
];

const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = (i % 2) * 30;
  return { hour, minute };
});

export default function LibraryRoomCalendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<RoomFeatures | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [bookingDuration, setBookingDuration] = useState(1);
  const [expandedRoom, setExpandedRoom] = useState<string | false>(false);
  
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const isTimeSlotAvailable = (time: Date) => {
    // This would check against actual bookings in a real implementation
    const hour = time.getHours();
    return hour !== 12 && hour !== 13; // Example: lunch hours are booked
  };

  const handleTimeSlotClick = (room: RoomFeatures, time: Date) => {
    setSelectedRoom(room);
    setSelectedTimeSlot(time);
    setIsBookingModalOpen(true);
  };

  const getAvailableSlotCount = (room: RoomFeatures) => {
    return timeSlots.filter(slot => 
      isTimeSlotAvailable(setMinutes(setHours(selectedDate, slot.hour), slot.minute))
    ).length;
  };

  const renderTimeSlot = (room: RoomFeatures, slot: { hour: number, minute: number }) => {
    const time = setMinutes(setHours(selectedDate, slot.hour), slot.minute);
    const isAvailable = isTimeSlotAvailable(time);
    
    return (
      <Box
        key={`${room.id}-${slot.hour}-${slot.minute}`}
        onClick={() => isAvailable && handleTimeSlotClick(room, time)}
        sx={{
          width: isMobile ? '45px' : '60px',
          height: isMobile ? '35px' : '40px',
          bgcolor: isAvailable ? '#e8f5e9' : '#ffebee',
          border: '1px solid',
          borderColor: isAvailable ? '#81c784' : '#ef9a9a',
          cursor: isAvailable ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          '&:hover': isAvailable ? {
            bgcolor: '#c8e6c9',
            transform: 'scale(1.05)'
          } : {},
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}
      >
        {format(time, isMobile ? 'HH:mm' : 'HH:mm')}
      </Box>
    );
  };

  const renderRoomFeatures = (room: RoomFeatures) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
      {room.features.hasComputer && (
        <Tooltip title="Computer Available">
          <Chip label="PC" size="small" color="primary" />
        </Tooltip>
      )}
      {room.features.hasTV && (
        <Tooltip title="TV Display">
          <Chip label="TV" size="small" color="primary" />
        </Tooltip>
      )}
      {room.features.hasProjector && (
        <Tooltip title="Projector">
          <Chip label="Projector" size="small" color="primary" />
        </Tooltip>
      )}
      {room.features.isQuiet && (
        <Tooltip title="Quiet Zone">
          <Chip label="Quiet" size="small" color="secondary" />
        </Tooltip>
      )}
      {room.features.hasWhiteboard && (
        <Tooltip title="Whiteboard Available">
          <Chip label="Whiteboard" size="small" color="default" />
        </Tooltip>
      )}
    </Box>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3, 
      maxWidth: 1200, 
      margin: '0 auto',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: '#f5f5f5',
        pt: 2,
        pb: 2,
        zIndex: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2, 
          gap: isMobile ? 1 : 2,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <Button 
            onClick={handlePrevDay} 
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          >
            Previous
          </Button>
          <Typography 
            variant={isMobile ? 'subtitle1' : 'h5'} 
            sx={{ 
              flex: 1, 
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.5rem'
            }}
          >
            {format(selectedDate, isMobile ? 'MMM d, yyyy' : 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Button 
            onClick={handleNextDay} 
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ROOMS.map(room => (
          <Accordion 
            key={room.id}
            expanded={expandedRoom === room.id}
            onChange={() => setExpandedRoom(expandedRoom === room.id ? false : room.id)}
            sx={{ 
              bgcolor: 'white',
              '&:before': {
                display: 'none',
              }
            }}
          >
            <AccordionSummary
              // expandIcon={<ExpandMore />}
              sx={{ 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 1
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
                  {room.name}
                </Typography>
                <Badge 
                  badgeContent={getAvailableSlotCount(room)} 
                  color="success"
                  sx={{ mr: 3 }}
                >
                  <Chip 
                    label={`${room.capacity} ${room.capacity === 1 ? 'person' : 'people'}`}
                    size="small"
                  />
                </Badge>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {room.description}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label={`Floor ${room.floor}`}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
                <Chip 
                  label={`Max ${room.maxBookingHours}h`}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              </Box>
              {renderRoomFeatures(room)}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                overflowX: 'auto', 
                pb: 1,
                mt: 2,
                '::-webkit-scrollbar': {
                  height: '8px',
                },
                '::-webkit-scrollbar-track': {
                  bgcolor: '#f1f1f1',
                  borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb': {
                  bgcolor: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    bgcolor: '#666',
                  },
                },
              }}>
                {timeSlots.map(slot => renderTimeSlot(room, slot))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Dialog 
        open={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant={isMobile ? 'h6' : 'h5'}>
            Book {selectedRoom?.name}
          </Typography>
          {selectedTimeSlot && (
            <Typography variant="subtitle2" color="text.secondary">
              {format(selectedTimeSlot, 'EEEE, MMMM d, yyyy h:mm a')}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={bookingDuration}
                label="Duration"
                onChange={(e) => setBookingDuration(Number(e.target.value))}
              >
                {Array.from(
                  { length: selectedRoom?.maxBookingHours || 1 }, 
                  (_, i) => i + 1
                ).map(hours => (
                  <MenuItem key={hours} value={hours}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1.5 }}>
          <Button onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setIsBookingModalOpen(false)}>
            Book Room
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
