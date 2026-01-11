// These types should ideally be generated from your Supabase schema.
// For now, we'll define them manually based on the migration script.

export interface Note {
  id: number;
  user_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  user_id: string;
}

export interface NoteWithTags extends Note {
  tags: Tag[];
}
