'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { format } from 'date-fns';

interface TimeSlot {
  hour: number;
  minute: number;
  status: 'available' | 'reserved' | 'selected' | 'closed';
}

interface TimeGridProps {
  date: Date;
  roomName: string;
  showTimeLabels?: boolean;
  onSelectionChange?: (slots: TimeSlot[]) => void;
  onRoomClick?: () => void;
}

export default function TimeGrid({ date, roomName, showTimeLabels = false, onSelectionChange, onRoomClick }: TimeGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startSlot, setStartSlot] = useState<{ hour: number; minute: number } | null>(null);
  const [currentSlot, setCurrentSlot] = useState<{ hour: number; minute: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 15 }, (_, i) => i + 9); // 9:00 to 23:00
  const quarters = [0, 15, 30, 45];

  const getSlotStatus = (hour: number, minute: number): 'available' | 'reserved' | 'closed' => {
    if (hour >= 21) return 'closed';
    if (hour === 14 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    if (hour === 15 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    if (hour === 16 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    return 'available';
  };

  const getSlotStyle = (hour: number, minute: number) => {
    const status = getSlotStatus(hour, minute);
    const isSelected = isSlotSelected(hour, minute);

    return {
      width: '10px',
      height: '20px',
      border: '2px solid black',
      borderRight: minute === 45 ? '2px solid black' : '1px solid black',
      borderLeft: minute === 0 ? '2px solid black' : '1px solid black',
      backgroundColor: status === 'reserved' ? '#ffcdd2' :
                      status === 'closed' ? '#f5f5f5' :
                      isSelected ? '#81c784' : '#c8e6c9',
      cursor: status === 'available' ? 'pointer' : 'default',
      transition: 'background-color 0.2s',
      '&:hover': status === 'available' ? {
        backgroundColor: '#a5d6a7'
      } : {}
    };
  };

  const isSlotSelected = (hour: number, minute: number) => {
    if (!startSlot || !currentSlot) return false;
    if (getSlotStatus(hour, minute) !== 'available') return false;

    const startHour = Math.min(startSlot.hour, currentSlot.hour);
    const endHour = Math.max(startSlot.hour, currentSlot.hour);
    const startMinute = startHour === endHour ? 
                       Math.min(startSlot.minute, currentSlot.minute) :
                       (startHour === hour ? Math.min(startSlot.minute, 45) : 0);
    const endMinute = startHour === endHour ? 
                     Math.max(startSlot.minute, currentSlot.minute) :
                     (endHour === hour ? Math.max(currentSlot.minute, 0) : 45);

    return hour >= startHour && hour <= endHour &&
           (hour === startHour ? minute >= startMinute : true) &&
           (hour === endHour ? minute <= endMinute : true);
  };

  const handleMouseDown = (hour: number, minute: number) => {
    if (getSlotStatus(hour, minute) !== 'available') return;
    setStartSlot({ hour, minute });
    setCurrentSlot({ hour, minute });
    setIsDragging(true);
  };

  const handleMouseMove = (hour: number, minute: number) => {
    if (!isDragging) return;
    setCurrentSlot({ hour, minute });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (startSlot && currentSlot) {
      const selectedSlots: TimeSlot[] = [];
      const startHour = Math.min(startSlot.hour, currentSlot.hour);
      const endHour = Math.max(startSlot.hour, currentSlot.hour);
      
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of quarters) {
          if (isSlotSelected(hour, minute)) {
            selectedSlots.push({ hour, minute, status: 'selected' });
          }
        }
      }
      
      onSelectionChange?.(selectedSlots);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, userSelect: 'none' }}>
      <Box sx={{ 
        width: '150px', 
        pr: 2,
        pt: showTimeLabels ? '20px' : 0,
        color: '#1976d2',
        fontWeight: 500,
        fontSize: '0.875rem',
      }}>
        {roomName && (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRoomClick?.();
            }}
            sx={{ 
              color: '#1976d2',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {roomName}
          </Link>
        )}
      </Box>
      <Box
        ref={gridRef}
        sx={{
          display: 'flex',
          flex: 1,
          gap: 0
        }}
      >
        {hours.map(hour => (
          <Box
            key={hour}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 0
            }}
          >
            {showTimeLabels && (
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: '#1976d2',
                  mb: 0.5,
                  width: '40px',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                {format(new Date().setHours(hour, 0), 'HH:mm')}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 0 }}>
              {quarters.map(minute => (
                <Box
                  key={`${hour}:${minute}`}
                  sx={getSlotStyle(hour, minute)}
                  onMouseDown={() => handleMouseDown(hour, minute)}
                  onMouseMove={() => handleMouseMove(hour, minute)}
                  onMouseUp={handleMouseUp}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
