import { supabase } from '../lib/supabase';

export interface Note {
  id: number;
  user_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
}

export type NoteInput = Omit<Note, 'id' | 'user_id' | 'created_at'>;

export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) throw error;
  return data;
};

export const getNoteById = async (id: number): Promise<Note> => {
  const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const { data, error } = await supabase.from('notes').insert(note).single();
  if (error) throw error;
  return data;
};

export const updateNote = async (id: number, note: NoteInput): Promise<Note> => {
  const { data, error } = await supabase.from('notes').update(note).eq('id', id).single();
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: number): Promise<void> => {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
};
