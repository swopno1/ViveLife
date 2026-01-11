import { create } from 'zustand';
import * as notesApi from '../api/notes';
import { Note, NoteWithTags, Tag } from '../types/db';

interface NoteStoreState {
  notes: NoteWithTags[];
  selectedNote: NoteWithTags | null;
  allUserTags: Tag[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchNoteById: (id: number) => Promise<void>;
  fetchAllUserTags: () => Promise<void>;
  upsertNoteWithTags: (
    note: Partial<Note>,
    tags: Partial<Tag>[] // Allow passing new tags (without id)
  ) => Promise<Note | null>;
  deleteNote: (id: number) => Promise<void>;
}

export const useNoteStore = create<NoteStoreState>((set, get) => ({
  notes: [],
  selectedNote: null,
  allUserTags: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      // This now fetches notes with tags included
      const notes = await notesApi.getNotes();
      set({ notes, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchNoteById: async (id: number) => {
    try {
      set({ loading: true, error: null, selectedNote: null });
      const note = await notesApi.getNoteById(id);
      if (note) {
        const tags = await notesApi.getTagsForNote(id);
        set({ selectedNote: { ...note, tags }, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAllUserTags: async () => {
    try {
      set({ loading: true, error: null });
      const tags = await notesApi.getTags();
      set({ allUserTags: tags, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  upsertNoteWithTags: async (note, tags) => {
    try {
      set({ loading: true, error: null });
      const savedNote = await notesApi.upsertNote(note);

      if (savedNote) {
        // Handle tags: upsert them and get their IDs
        const tagPromises = tags.map((tag) =>
          notesApi.upsertTag({ ...tag, user_id: savedNote.user_id })
        );
        const savedTags = await Promise.all(tagPromises);
        const tagIds = savedTags.map((t) => t!.id);

        // Set the associations in the join table
        await notesApi.setTagsForNote(savedNote.id, tagIds);

        await get().fetchNotes(); // Refresh the list with updated notes and tags
        await get().fetchAllUserTags(); // Refresh the list of all tags
        set({ loading: false });
        return savedNote;
      }
      set({ loading: false });
      return null;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  deleteNote: async (id: number) => {
    try {
      set({ loading: true, error: null });
      await notesApi.deleteNote(id);
      await get().fetchNotes(); // Refresh the list
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
