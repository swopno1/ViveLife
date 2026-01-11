import { supabase } from '../lib/supabase';
import { Note, NoteWithTags, Tag } from '../types/db';

// ====== Notes ======

// Updated to use the RPC function
export const getNotes = async (): Promise<NoteWithTags[]> => {
  const { data, error } = await supabase.rpc('get_notes_with_tags');
  if (error) throw error;
  // The RPC function returns tags as a JSON string, so we parse it here if needed
  // Note: Supabase client might auto-parse JSON, but explicit parsing is safer.
  return data.map((note: any) => ({
    ...note,
    tags: typeof note.tags === 'string' ? JSON.parse(note.tags) : note.tags,
  }));
};

export const getNoteById = async (id: number): Promise<Note | null> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const upsertNote = async (
  note: Partial<Note>
): Promise<Note | null> => {
  const { data, error } = await supabase.from('notes').upsert(note).select().single();
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: number): Promise<void> => {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
};

// ====== Tags ======

export const getTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase.from('tags').select('*');
  if (error) throw error;
  return data;
};

// Upserts a tag and returns it. Using ON CONFLICT to avoid duplicates per user.
export const upsertTag = async (tag: Partial<Tag>): Promise<Tag | null> => {
  if (!tag.name || !tag.user_id) {
    throw new Error('Tag name and user_id are required.');
  }
  const { data, error } = await supabase
    .from('tags')
    .upsert(tag, { onConflict: 'user_id, name' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ====== Note_Tags ======

export const getTagsForNote = async (noteId: number): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('note_tags')
    .select('tags(*)')
    .eq('note_id', noteId);

  if (error) throw error;
  return data.map((item: any) => item.tags);
};

export const setTagsForNote = async (
  noteId: number,
  tagIds: number[]
): Promise<void> => {
  // Remove existing tags for the note
  const { error: deleteError } = await supabase
    .from('note_tags')
    .delete()
    .eq('note_id', noteId);
  if (deleteError) throw deleteError;

  // Add new tags
  if (tagIds.length > 0) {
    const newNoteTags = tagIds.map((tagId) => ({
      note_id: noteId,
      tag_id: tagId,
    }));
    const { error: insertError } = await supabase
      .from('note_tags')
      .insert(newNoteTags);
    if (insertError) throw insertError;
  }
};
