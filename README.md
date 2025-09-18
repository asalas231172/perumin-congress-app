# Perumin Congress Contact Manager

A professional contact and meeting management system built for mining industry professionals attending Perumin Congress. This Next.js application provides comprehensive CRM functionality with PostgreSQL database integration.

## Features

- **Contact Management**: Store and organize professional contacts with company affiliations
- **Meeting Scheduling**: Plan and track meetings with participants, topics, and action items
- **Company Profiles**: Maintain detailed company information including projects and key personnel
- **Dashboard Analytics**: Real-time statistics and upcoming meeting overview
- **Professional Mining Theme**: AI-generated mining industry visuals and branding

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: TailwindCSS with professional mining theme
- **UI Components**: Lucide React icons
- **Deployment**: Vercel with Vercel Postgres

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Vercel Postgres for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/asalas231172/perumin-congress-app.git
cd perumin-congress-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your database connection string:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/perumin_db"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Models

- **Contact**: Professional contacts with personal and company information
- **Company**: Mining companies with industry details and project information
- **Meeting**: Scheduled meetings with participants, topics, and action items
- **MeetingParticipant**: Join table linking meetings and contacts
- **Reminder**: Meeting reminders with notification status

### Key Features

- **Relationships**: Contacts belong to companies, meetings have multiple participants
- **Meeting Types**: Breakfast, Lunch, Dinner, Booth Meeting, Internal Meeting, Presentation, Networking
- **Meeting Status**: Scheduled, In Progress, Completed, Cancelled, Rescheduled

## API Endpoints

### Contacts
- `GET /api/contacts` - List all contacts with search and company filtering
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/[id]` - Get specific contact
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

### Meetings
- `GET /api/meetings` - List meetings with date/status/type filtering
- `POST /api/meetings` - Create new meeting with participants
- `DELETE /api/meetings/[id]` - Delete meeting

### Companies
- `GET /api/companies` - List companies with search
- `POST /api/companies` - Create new company
- `GET /api/companies/[id]` - Get specific company
- `PUT /api/companies/[id]` - Update company
- `DELETE /api/companies/[id]` - Delete company

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics and today's meetings

## Professional Mining Theme

The application features a professional mining industry theme with:

- **AI-Generated Images**: Custom mining equipment and industry visuals
- **Mining Color Palette**: Earth tones and professional colors suitable for mining industry
- **Professional Layout**: Clean, business-appropriate interface design
- **Industry-Specific Features**: Meeting locations include Perumin venues and Arequipa restaurants/hotels

## Deployment to Vercel

1. Push your code to GitHub (already done if using this repository)

2. Connect to Vercel:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your Vercel Postgres connection string

3. Set up Vercel Postgres:
   - Add Vercel Postgres to your project
   - Copy the connection string to your environment variables

4. Deploy:
   - Vercel will automatically deploy on every push to main branch
   - Database migrations run automatically via `prisma generate && next build`

## Development

### Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── contacts/     # Contacts page
│   ├── meetings/     # Meetings page
│   ├── companies/    # Companies page
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Dashboard
├── lib/
│   └── prisma.ts     # Prisma client
prisma/
└── schema.prisma     # Database schema
public/
├── cartoon-shovel.png    # AI-generated mining equipment
├── mining-header.png     # Mining industry header
├── company-building.png  # Professional building image
└── card-holder.png       # Business card holder
```

### Key Components

- **Dashboard**: Overview with statistics and quick actions
- **Contact Management**: Full CRUD operations with company relationships
- **Meeting Scheduler**: Advanced meeting creation with participant selection
- **Company Profiles**: Industry-specific company information management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions about this mining industry contact management system, please create an issue in the GitHub repository.