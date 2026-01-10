# ViveLife Supabase Schema & RLS Policies

This document contains the SQL schema for the ViveLife MVP.

---

## 1. Helper Functions

First, a helper function to get the family ID of the currently authenticated user.

```sql
CREATE OR REPLACE FUNCTION get_my_family_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT family_id FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_my_role_in_family(p_family_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role::TEXT FROM public.family_members
    WHERE user_id = auth.uid() AND family_id = p_family_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Tables

### 2.1. `users`
- Managed by Supabase Auth, but we have a public `users` table for profile data.
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  family_id UUID REFERENCES public.families(id) ON DELETE SET NULL
);
```

### 2.2. `families`
```sql
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT
);
```

### 2.3. `family_members`
```sql
CREATE TYPE public.family_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role family_role NOT NULL DEFAULT 'viewer',
  UNIQUE(family_id, user_id)
);
```

### 2.4. `transactions`, `categories`, `goals`
- Core financial tables.
```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_amount NUMERIC NOT NULL DEFAULT 0
);

CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type transaction_type NOT NULL
);

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  target_date DATE
);
```

### 2.5. `lists`, `list_items`
- To-do and shopping lists.
```sql
CREATE TYPE public.list_type AS ENUM ('todo', 'shopping');

CREATE TABLE public.lists (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type list_type NOT NULL,
  is_shared BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE public.list_items (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE
);
```

### 2.6. `notes`, `tags`, `note_tags`
- Personal notes system.
```sql
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT
);

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(user_id, name)
);

CREATE TABLE public.note_tags (
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
```

---

## 3. Row-Level Security (RLS) Policies

### 3.1. `users`
- Users can see their own profile.
- Users can see the profiles of their family members.
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view their family members" ON public.users FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);
```

### 3.2. `families` and `family_members`
- Users can only see their own family data.
```sql
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family data is visible to its members" ON public.families FOR SELECT USING (id = get_my_family_id());

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members are visible to their family" ON public.family_members FOR SELECT USING (family_id = get_my_family_id());
```

### 3.3. Financial Tables (`transactions`, `categories`, `goals`)
- All members can view. Only owners/editors can modify.
```sql
-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can view transactions" ON public.transactions FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Owners/Editors can manage transactions" ON public.transactions FOR ALL USING (
  family_id = get_my_family_id() AND
  (SELECT role FROM public.family_members WHERE user_id = auth.uid() AND family_id = get_my_family_id()) IN ('owner', 'editor')
);

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can view categories" ON public.categories FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Owners/Editors can manage categories" ON public.categories FOR ALL USING (
  family_id = get_my_family_id() AND
  (SELECT role FROM public.family_members WHERE user_id = auth.uid() AND family_id = get_my_family_id()) IN ('owner', 'editor')
);

-- Goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can view goals" ON public.goals FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Owners/Editors can manage goals" ON public.goals FOR ALL USING (
  family_id = get_my_family_id() AND
  (SELECT role FROM public.family_members WHERE user_id = auth.uid() AND family_id = get_my_family_id()) IN ('owner', 'editor')
);
```

### 3.4. Lists (`lists`, `list_items`)
- Private lists are user-only. Shared lists are for the family.
```sql
-- Lists
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their private lists" ON public.lists FOR ALL USING (user_id = auth.uid() AND is_shared = false);
CREATE POLICY "Family members can view shared lists" ON public.lists FOR SELECT USING (family_id = get_my_family_id() AND is_shared = true);
CREATE POLICY "Owners/Editors can manage shared lists" ON public.lists FOR ALL USING (
  family_id = get_my_family_id() AND is_shared = true AND
  (SELECT role FROM public.family_members WHERE user_id = auth.uid() AND family_id = get_my_family_id()) IN ('owner', 'editor')
);

-- List Items
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view items in shared lists" ON public.list_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.lists l
    WHERE l.id = list_id AND l.is_shared = true AND l.family_id = get_my_family_id()
  )
);

CREATE POLICY "Family members can update items in shared lists" ON public.list_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.lists l
    WHERE l.id = list_id AND l.is_shared = true AND l.family_id = get_my_family_id()
  )
);

CREATE POLICY "Owners/Editors can add/delete items in shared lists" ON public.list_items FOR INSERT, DELETE USING (
  EXISTS (
    SELECT 1 FROM public.lists l
    WHERE l.id = list_id AND l.is_shared = true AND l.family_id = get_my_family_id()
      AND get_my_role_in_family(l.family_id) IN ('owner', 'editor')
  )
);

CREATE POLICY "Users can manage items in their private lists" ON public.list_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.lists l
    WHERE l.id = list_id AND l.is_shared = false AND l.user_id = auth.uid()
  )
);
```

### 3.5. Notes (`notes`, `tags`, `note_tags`)
- Strictly private.
```sql
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON public.notes FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tags" ON public.tags FOR ALL USING (user_id = auth.uid());

ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own note_tags" ON public.note_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.notes WHERE id = note_id AND user_id = auth.uid())
);
```
