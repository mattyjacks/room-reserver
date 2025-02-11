'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';

interface TimeSlot {
  hour: number;
  minute: number;
  status: 'available' | 'reserved' | 'selected' | 'closed';
}

interface TimeGridProps {
  date: Date;
  roomName: string;
  onSelectionChange?: (slots: TimeSlot[]) => void;
}

export default function TimeGrid({ date, roomName, onSelectionChange }: TimeGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startSlot, setStartSlot] = useState<{ row: number; col: number } | null>(null);
  const [currentSlot, setCurrentSlot] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 15 }, (_, i) => i + 9); // 9:00 to 23:00
  const quarters = [0, 15, 30, 45];

  const getSlotStatus = (hour: number, minute: number): 'available' | 'reserved' | 'closed' => {
    if (hour >= 21) return 'closed';
    // This is where you would check against your actual reservation data
    // For now, let's simulate some reserved slots
    if (hour === 14 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    if (hour === 15 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    if (hour === 16 && (minute === 0 || minute === 15 || minute === 30 || minute === 45)) return 'reserved';
    return 'available';
  };

  const getSlotStyle = (hour: number, minute: number) => {
    const status = getSlotStatus(hour, minute);
    const isSelected = isSlotSelected(hour, minute);

    return {
      width: '20px',
      height: '20px',
      border: '1px solid #e0e0e0',
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

    const startRow = Math.min(startSlot.row, currentSlot.row);
    const endRow = Math.max(startSlot.row, currentSlot.row);
    const startCol = Math.min(startSlot.col, currentSlot.col);
    const endCol = Math.max(startSlot.col, currentSlot.col);

    const currentRow = hours.indexOf(hour);
    const currentCol = quarters.indexOf(minute);

    return currentRow >= startRow && currentRow <= endRow &&
           currentCol >= startCol && currentCol <= endCol &&
           getSlotStatus(hour, minute) === 'available';
  };

  const handleMouseDown = (hour: number, minute: number) => {
    if (getSlotStatus(hour, minute) !== 'available') return;

    const row = hours.indexOf(hour);
    const col = quarters.indexOf(minute);
    setStartSlot({ row, col });
    setCurrentSlot({ row, col });
    setIsDragging(true);
  };

  const handleMouseMove = (hour: number, minute: number) => {
    if (!isDragging) return;

    const row = hours.indexOf(hour);
    const col = quarters.indexOf(minute);
    setCurrentSlot({ row, col });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Here you would typically call onSelectionChange with the selected slots
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, userSelect: 'none' }}>
      <Box sx={{ 
        width: '200px', 
        pr: 2,
        color: '#1976d2',
        fontWeight: 500,
        fontSize: '0.875rem',
      }}>
        {roomName}
      </Box>
      <Box
        ref={gridRef}
        sx={{
          display: 'flex',
          flex: 1,
          gap: 0.5
        }}
      >
        {hours.map(hour => (
          <Box
            key={hour}
            sx={{
              display: 'flex',
              gap: 0
            }}
          >
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
        ))}
      </Box>
    </Box>
  );
}
