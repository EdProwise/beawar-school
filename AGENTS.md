## Project Summary
A school management system called "Orbit School" with a frontend for the public and an administrative dashboard for managing content, inquiries, admissions, and settings.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Lucide React
- Backend: Express, Node.js
- Database: MongoDB (Mongoose)
- Integration: Custom MongoDB client proxied via Express

## Architecture
- `src/components/admin`: Admin-specific components including layout and sidebar.
- `src/components/sections`: Reusable sections for the public website.
- `src/pages/admin`: Page components for the administrative dashboard.
- `src/integrations/mongodb`: MongoDB client that mimics Supabase syntax.
- `server/`: Express backend providing generic API routes for MongoDB collections.
- `src/hooks`: Custom React hooks (e.g., `use-auth`).

## User Preferences
- Sidebar items arranged in a specific order.
- Grouped certain admin items under a "Settings" main menu.

## Project Guidelines
- Keep responses short and concise.
- Use functional components.

## Common Patterns
- Admin sidebar uses a `navItems` array to define the structure and hierarchy.
- Collapsible menus in the sidebar are controlled by state and logic that checks the current path.
