# ViveLife App Navigation Map

This document outlines the navigation structure for the ViveLife MVP.

## 1. Public (Unauthenticated) Routes

- **Welcome / Landing Screen**
  - Path: `/`
  - Content: App introduction, features overview.
  - Actions:
    - Navigate to Sign In
    - Navigate to Sign Up

- **Sign In Screen**
  - Path: `/auth/signin`
  - Content: Email/password form, Google Sign-In button.
  - Actions:
    - Sign in the user.
    - Navigate to Sign Up.
    - Navigate to Forgot Password.

- **Sign Up Screen**
  - Path: `/auth/signup`
  - Content: Name, email, password form, Google Sign-Up button.
  - Actions:
    - Create a new user account.
    - Navigate to Sign In.

- **Forgot Password Screen**
  - Path: `/auth/forgot-password`
  - Content: Email form to send a password reset link.
  - Actions:
    - Send reset link.

## 2. Onboarding Routes

- **Create Family Screen**
  - Path: `/onboarding/create-family`
  - Content: Form to create a new family.
  - Triggered if the new user has no `family_id`.
  - Actions:
    - Create the family, making the user the owner.
    - Navigate to the main app (Dashboard).

## 3. Main (Authenticated) Routes (Tab Navigator)

### 3.1. Dashboard Tab
- Path: `/dashboard`
- Content:
  - Today's tasks snapshot.
  - Monthly budget overview.
  - Quick-add buttons for new transaction or task.

### 3.2. Transactions Tab
- Path: `/transactions`
- Content:
  - List of recent transactions.
  - Filter and search options.
- Actions:
  - Navigate to Transaction Detail screen.
  - Navigate to Add/Edit Transaction screen.

### 3.3. Budgets Tab
- Path: `/budgets`
- Content:
  - List of monthly budgets by category.
  - Progress bars for each budget.
- Actions:
  - Navigate to Add/Edit Category screen.

### 3.4. Lists Tab
- Path: `/lists`
- Content:
  - A list of all personal and shared to-do/shopping lists.
- Actions:
  - Navigate to List Detail screen.
  - Navigate to Create List screen.

### 3.5. Goals Tab
- Path: `/goals`
- Content:
  - List of savings goals with progress indicators.
- Actions:
  - Navigate to Goal Detail screen.
  - Navigate to Add/Edit Goal screen.

## 4. Modal/Stack Routes (Accessed from other screens)

- **Settings Screen**
  - Accessed from a gear icon in the tab bar or dashboard header.
  - Content:
    - Profile settings (name, avatar).
    - Family management (invite, remove, change roles).
    - Logout button.

- **Transaction Detail/Edit Screen**
  - Path: `/transactions/:id`
  - Content: Form to add or edit a transaction.

- **Category Add/Edit Screen**
  - Path: `/categories/:id`
  - Content: Form to add or edit a budget category.

- **List Detail Screen**
  - Path: `/lists/:id`
  - Content:
    - List of items.
    - Add new item form.

- **Goal Detail/Edit Screen**
  - Path: `/goals/:id`
  - Content: Form to add or edit a savings goal.
  - View contributions.

- **Personal Notes Screen**
  - Path: `/notes`
  - Accessed from Settings or a dedicated button.
  - Content: CRUD interface for personal notes and tags.
