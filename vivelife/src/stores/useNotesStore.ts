import { create } from 'zustand';
import { Note, NoteInput, getNotes, createNote, updateNote, deleteNote } from '../api/notes';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: Error | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: NoteInput) => Promise<void>;
  editNote: (id: number, note: NoteInput) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  loading: false,
  error: null,
  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      const notes = await getNotes();
      set({ notes, loading: false });
    } catch (error) {
      set({ loading: false, error: error as Error });
    }
  },
  addNote: async (note) => {
    try {
      set({ loading: true, error: null });
      const newNote = await createNote(note);
      set((state) => ({
        notes: [...state.notes, newNote],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error as Error });
    }
  },
  editNote: async (id, note) => {
    try {
      set({ loading: true, error: null });
      const updatedNote = await updateNote(id, note);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? updatedNote : n)),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error as Error });
    }
  },
  removeNote: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error as Error });
    }
  },
}));
