-- Families Table
CREATE TABLE families (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  family_id BIGINT REFERENCES families(id),
  updated_at TIMESTAMPTZ
);

-- Notes Table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tags Table
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  UNIQUE (user_id, name)
);

-- Note_Tags Join Table
CREATE TABLE note_tags (
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Lists Table
CREATE TABLE lists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  family_id BIGINT REFERENCES families(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- List Items Table
CREATE TABLE list_items (
  id BIGSERIAL PRIMARY KEY,
  list_id BIGINT REFERENCES lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories Table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  family_id BIGINT REFERENCES families(id)
);

-- Transactions Table
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  family_id BIGINT REFERENCES families(id),
  category_id BIGINT REFERENCES categories(id),
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Budgets Table
CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  family_id BIGINT REFERENCES families(id),
  category_id BIGINT REFERENCES categories(id),
  amount NUMERIC NOT NULL,
  month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Savings Goals Table
CREATE TABLE savings_goals (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  goal_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow read access to family members" ON families FOR SELECT USING (id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own profile" ON profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Allow read access to family members' profiles" ON profiles FOR SELECT USING (family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own notes" ON notes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Allow full access to own tags" ON tags FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Allow full access to own note_tags" ON note_tags FOR ALL USING ((SELECT user_id FROM notes WHERE id = note_id) = auth.uid());
CREATE POLICY "Allow full access to own and shared lists" ON lists FOR ALL USING (user_id = auth.uid() OR family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own and shared list items" ON list_items FOR ALL USING ((SELECT family_id FROM lists WHERE id = list_id) = (SELECT family_id FROM profiles WHERE id = auth.uid()) OR (SELECT user_id FROM lists WHERE id = list_id) = auth.uid());
CREATE POLICY "Allow full access to own and shared categories" ON categories FOR ALL USING (user_id = auth.uid() OR family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own and shared transactions" ON transactions FOR ALL USING (user_id = auth.uid() OR family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own and shared budgets" ON budgets FOR ALL USING (user_id = auth.uid() OR family_id = (SELECT family_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow full access to own savings goals" ON savings_goals FOR ALL USING (user_id = auth.uid());
