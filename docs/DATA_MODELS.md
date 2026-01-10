# ViveLife Data Models

This document outlines the core data models for the ViveLife MVP.

## 1. User (`users`)

Represents an individual user account. Linked to Supabase Auth.

- `id`: `uuid` (Primary Key, Foreign Key to `auth.users.id`)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `email`: `text` (unique)
- `full_name`: `text`
- `avatar_url`: `text` (URL to user's profile picture)
- `family_id`: `uuid` (Foreign Key to `families.id`, nullable)

## 2. Family (`families`)

Represents a family unit that shares data.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `name`: `text` (e.g., "The Doe Family")
- `owner_id`: `uuid` (Foreign Key to `users.id`)

## 3. Family Member (`family_members`)

A join table to manage user roles within a family.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `family_id`: `uuid` (Foreign Key to `families.id`)
- `user_id`: `uuid` (Foreign Key to `users.id`)
- `role`: `text` (Enum: `owner`, `editor`, `viewer`)

## 4. Transaction (`transactions`)

Represents a single financial transaction.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `family_id`: `uuid` (Foreign Key to `families.id`)
- `user_id`: `uuid` (Foreign Key to `users.id`, the user who logged the transaction)
- `date`: `date`
- `description`: `text`
- `amount`: `numeric` (Always positive)
- `category_id`: `uuid` (Foreign Key to `categories.id`)
- `type`: `text` (Enum: `income`, `expense`)

## 5. Category (`categories`)

Represents a spending or income category.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `family_id`: `uuid` (Foreign Key to `families.id`)
- `name`: `text`
- `budget_amount`: `numeric` (Monthly budget for this category)

## 6. Savings Goal (`goals`)

Represents a savings goal.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `family_id`: `uuid` (Foreign Key to `families.id`)
- `name`: `text`
- `target_amount`: `numeric`
- `current_amount`: `numeric` (Default: 0)
- `target_date`: `date`

## 7. List (`lists`)

Represents a to-do or shopping list.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `family_id`: `uuid` (Foreign Key to `families.id`, nullable for private lists)
- `user_id`: `uuid` (Foreign Key to `users.id`, owner of the list)
- `name`: `text`
- `type`: `text` (Enum: `todo`, `shopping`)
- `is_shared`: `boolean` (True if it's a family list)

## 8. List Item (`list_items`)

Represents an item within a list.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `list_id`: `uuid` (Foreign Key to `lists.id`)
- `description`: `text`
- `is_completed`: `boolean` (Default: false)

## 9. Note (`notes`)

Represents a personal text note.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `updated_at`: `timestamp with time zone`
- `user_id`: `uuid` (Foreign Key to `users.id`)
- `title`: `text`
- `content`: `text`

## 10. Tag (`tags`)

Represents a tag for organizing notes.

- `id`: `uuid` (Primary Key, generated)
- `created_at`: `timestamp with time zone`
- `user_id`: `uuid` (Foreign Key to `users.id`)
- `name`: `text` (unique per user)

## 11. Note Tag (`note_tags`)

A join table for the many-to-many relationship between notes and tags.

- `note_id`: `uuid` (Foreign Key to `notes.id`)
- `tag_id`: `uuid` (Foreign Key to `tags.id`)
