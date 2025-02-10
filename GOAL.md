# Library Room Reservation System - Mission and Technical Documentation

## Mission Statement
The Library Room Reservation System aims to democratize access to public library spaces, enabling community members to easily reserve rooms for study, meetings, and collaborative activities. By providing a streamlined, user-friendly platform, we facilitate the efficient use of public resources for the betterment of the community.

## Technical Implementation

### Architecture Overview
The application is built using a modern web stack:
- **Frontend**: Next.js 14 (React 18) with TypeScript
- **UI Framework**: Material-UI v5 with Emotion for styling
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: PostgreSQL (via Prisma ORM)
- **Email Service**: SendGrid API
- **Deployment**: Vercel Platform
- **Authentication**: JSON Web Tokens (JWT)

### Core Components

#### 1. Room Calendar System
```typescript
interface TimeSlot {
  time: Date;
  isAvailable: boolean;
  roomId: string;
}

interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  startTime: Date;
  duration: number;
  status: 'confirmed' | 'cancelled';
  cancellationToken: string;
}
```

The calendar system implements:
- 15-minute time slot increments
- Business hours validation (9 AM - 5 PM)
- Real-time availability checking
- Conflict prevention using database transactions

#### 2. Database Schema
```sql
-- Room definitions
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  capacity INT,
  features TEXT[]
);

-- Reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  user_id UUID,
  start_time TIMESTAMP WITH TIME ZONE,
  duration INT,
  status VARCHAR(50),
  cancellation_token UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255)
);
```

#### 3. Email System
The email system utilizes SendGrid's API for transactional emails:
```typescript
interface EmailTemplate {
  type: 'confirmation' | 'cancellation';
  reservation: Reservation;
  cancellationUrl: string;
}

async function sendConfirmationEmail(reservation: Reservation) {
  const cancellationToken = generateSecureToken();
  const cancellationUrl = `${process.env.BASE_URL}/cancel/${reservation.id}/${cancellationToken}`;
  
  await sendGrid.send({
    to: reservation.userEmail,
    template_id: CONFIRMATION_TEMPLATE_ID,
    dynamic_template_data: {
      reservationDetails: {
        room: reservation.roomName,
        date: format(reservation.startTime, 'MMMM d, yyyy'),
        time: format(reservation.startTime, 'h:mm a'),
        duration: `${reservation.duration} minutes`,
      },
      cancellationUrl
    }
  });
}
```

#### 4. Reservation Cancellation Flow
1. User receives confirmation email with unique cancellation URL
2. URL contains encrypted reservation ID and cancellation token
3. Clicking URL redirects to confirmation page
4. Server validates token and reservation status
5. User confirms cancellation via UI
6. System updates reservation status and sends cancellation confirmation

```typescript
async function cancelReservation(id: string, token: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id, cancellationToken: token }
  });

  if (!reservation || reservation.status === 'cancelled') {
    throw new Error('Invalid or expired cancellation link');
  }

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id },
      data: { status: 'cancelled' }
    }),
    // Send cancellation confirmation email
    sendCancellationEmail(reservation)
  ]);
}
```

#### 5. Security Measures
- **CSRF Protection**: Next.js built-in CSRF tokens
- **Rate Limiting**: API route protection against abuse
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Prevention**: React's built-in HTML escaping + CSP headers

#### 6. Embedding Implementation
The system supports iframe embedding with proper security headers:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${process.env.ALLOWED_DOMAINS};`
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM ${process.env.ALLOWED_DOMAINS}'
          }
        ]
      }
    ];
  }
};
```

### Performance Optimizations
1. **Server-Side Rendering**: Critical paths rendered on server
2. **Static Generation**: Calendar view pre-rendered at build time
3. **Incremental Static Regeneration**: Data revalidated every minute
4. **Connection Pooling**: Database connection optimization
5. **Edge Caching**: Vercel's Edge Network for static assets
6. **Image Optimization**: Next.js Image component with automatic optimization

### Monitoring and Maintenance
- Error tracking via Sentry
- Performance monitoring via Vercel Analytics
- Automated database backups
- Daily error report aggregation
- Usage analytics and room utilization metrics

This technical implementation ensures a robust, scalable, and maintainable system that serves the community's needs while maintaining high security and performance standards.
