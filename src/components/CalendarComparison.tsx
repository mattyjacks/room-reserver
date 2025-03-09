'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';

import RoomCalendar from './RoomCalendar';
import LibraryRoomCalendar from './LibraryRoomCalendar';
import CompactListCalendar from './CompactListCalendar';
import ModernCardCalendar from './ModernCardCalendar';
import TimelineCalendar from './TimelineCalendar';
import DarkTimelineCalendar from './DarkTimelineCalendar';
import ForestTimelineCalendar from './ForestTimelineCalendar';
import OceanTimelineCalendar from './OceanTimelineCalendar';
import SunsetTimelineCalendar from './SunsetTimelineCalendar';

const CALENDARS = [
  {
    id: 'dark-timeline',
    name: 'Dark Timeline ⭐',
    component: DarkTimelineCalendar,
    description: 'Sleek dark-themed timeline perfect for low-light environments and modern aesthetics.'
  },
  {
    id: 'grid',
    name: 'Classic Grid',
    component: RoomCalendar,
    description: 'Traditional grid layout with clear time slots and room divisions. Best for users who prefer a structured, spreadsheet-like view.'
  },
  {
    id: 'library',
    name: 'Library Style',
    component: LibraryRoomCalendar,
    description: 'Accordion-based layout with detailed room information and features. Perfect for spaces with various amenities and equipment.'
  },
  {
    id: 'compact',
    name: 'Compact List',
    component: CompactListCalendar,
    description: 'Space-efficient list view with quick booking chips. Ideal for mobile users and simple room setups.'
  },
  {
    id: 'modern',
    name: 'Modern Cards',
    component: ModernCardCalendar,
    description: 'Visual card-based layout with time blocks. Great for showcasing room features and amenities with style.'
  },
  {
    id: 'timeline',
    name: 'Timeline View',
    component: TimelineCalendar,
    description: 'Horizontal timeline with color-coded rooms. Perfect for visualizing availability across multiple rooms.'
  },
  {
    id: 'forest-timeline',
    name: 'Forest Timeline',
    component: ForestTimelineCalendar,
    description: 'Nature-inspired green theme with a fresh and calming appearance.'
  },
  {
    id: 'ocean-timeline',
    name: 'Ocean Timeline',
    component: OceanTimelineCalendar,
    description: 'Coastal-themed timeline with refreshing blue tones and wave-like elements.'
  },
  {
    id: 'sunset-timeline',
    name: 'Sunset Timeline',
    component: SunsetTimelineCalendar,
    description: 'Warm and inviting timeline with sunset-inspired orange and amber hues.'
  }
];

export default function CalendarComparison() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedCalendar, setSelectedCalendar] = useState(CALENDARS[0].id);
  const [showAllCalendars, setShowAllCalendars] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedForFeedback, setSelectedForFeedback] = useState('');

  const handleCalendarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCalendar(event.target.value);
  };

  const handleFeedbackSubmit = () => {
    setFeedbackDialogOpen(false);
    // In a real app, you would send this feedback to your backend
    console.log('Selected calendar:', selectedForFeedback);
  };

  const SelectedCalendarComponent = CALENDARS.find(c => c.id === selectedCalendar)?.component || CALENDARS[0].component;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Room Reservation Calendar Styles
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Compare different calendar layouts and choose the one that works best for you.
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => setShowAllCalendars(!showAllCalendars)}
          >
            {showAllCalendars ? 'Show One Calendar' : 'Compare All Calendars'}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedForFeedback(selectedCalendar);
              setFeedbackDialogOpen(true);
            }}
          >
            Select This Style
          </Button>
        </Box>
      </Box>

      {!showAllCalendars ? (
        <Box>
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
            <RadioGroup
              row={!isMobile}
              value={selectedCalendar}
              onChange={handleCalendarChange}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              {CALENDARS.map((calendar) => (
                <FormControlLabel
                  key={calendar.id}
                  value={calendar.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">{calendar.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {calendar.description}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                    flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 16px)',
                    m: 0
                  }}
                />
              ))}
            </RadioGroup>
          </Paper>
          
          <Box sx={{ mb: 4 }}>
            <SelectedCalendarComponent />
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {CALENDARS.map((calendar) => (
            <Box key={calendar.id}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: '#f5f5f5',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Typography variant="h6">{calendar.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {calendar.description}
                </Typography>
              </Paper>
              <calendar.component />
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Calendar Style Selection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You've selected the {CALENDARS.find(c => c.id === selectedForFeedback)?.name}. 
            This will be saved as your preferred calendar style.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFeedbackSubmit}>
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
