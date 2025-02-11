import CalendarComparison from '@/components/CalendarComparison';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CalendarComparison />
    </Box>
  );
}
