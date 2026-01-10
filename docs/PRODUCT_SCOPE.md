# ViveLife MVP Product Scope

## 1. Core Features

### 1.1. Authentication
- Email/password signup and login
- Social login (Google)
- Password reset functionality

### 1.2. Personal Notes
- Create, Read, Update, Delete (CRUD) text-based notes
- Assign tags to notes for organization
- Search notes by title, content, or tags

### 1.3. To-Do & Shopping Lists
- Create shared and private lists
- Add, edit, and mark items as complete
- Invite family members to shared lists

### 1.4. Financial Tracking (Manual)
- Manually log income and expense transactions
- Assign a category to each transaction
- Add a date and a short description

### 1.5. Budgets & Categories
- Create monthly budgets for specific spending categories
- View spending progress against the budget
- Categories are shared within a family

### 1.6. Savings Goals
- Create savings goals with a target amount and date
- Manually log contributions towards a goal
- View progress towards the goal

### 1.7. Family Sharing
- Invite members to a family via email
- Shared access to financial data, lists, and goals based on permissions
- A user can belong to only one family at a time for MVP simplicity

### 1.8. Dashboard
- A simple overview of today's tasks from all lists
- A snapshot of the current month's budget performance

## 2. Technical Stack

- **Frontend:** Expo (React Native) + Tamagui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod for validation
- **Backend:** Supabase (Auth, Postgres, RLS, Storage, Realtime)
- **Serverless:** Supabase Edge Functions (if necessary)

## 3. Explicitly Out of Scope for MVP

- Automated bank synchronization
- OCR for receipt scanning
- Investment tracking or management
- AI-powered financial insights or predictions
- Full offline-first sync (basic caching is acceptable, but no complex conflict resolution)
- Advanced encryption layers beyond standard Supabase security
- Multi-family support for a single user
- Web-specific UI (mobile-first UX with responsive support is the goal)
