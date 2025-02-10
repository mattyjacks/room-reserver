# Library Room Reservation System

A modern, embeddable room reservation system for libraries built with Next.js and Material-UI. Users can easily reserve rooms during business hours in 15-minute increments, with booking durations ranging from 15 minutes to 2 hours.

## Features

- Three bookable rooms (Room A, Room B, Room C)
- Visual calendar interface
- 15-minute time slot increments
- Booking duration: 15 minutes to 2 hours
- Business hours operation
- Embeddable via iframe
- Responsive design
- Modern UI with Material-UI components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

## Embedding

To embed the calendar in another website, use the following iframe code:

```html
<iframe 
    src="YOUR_DEPLOYED_URL" 
    width="100%" 
    height="800" 
    frameborder="0"
    title="Room Reservation Calendar"
    allow="fullscreen">
</iframe>
```

## Technology Stack

- Next.js 14
- React 18
- Material-UI
- TypeScript
- date-fns
- Vercel (deployment)