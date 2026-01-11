import { useNoteStore } from './noteStore';
import * as notesApi from '../api/notes';
import { act } from '@testing-library/react-native';

// Mock the supabase client to prevent it from initializing
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(), // Also mock rpc for the new API call
  },
}));

// Mock the notesApi module
jest.mock('../api/notes');
const mockedNotesApi = notesApi as jest.Mocked<typeof notesApi>;

const initialState = useNoteStore.getState();

describe('Zustand Note Store', () => {
  beforeEach(() => {
    useNoteStore.setState(initialState);
    jest.clearAllMocks();
  });

  it('should have a correct initial state', () => {
    const state = useNoteStore.getState();
    expect(state.notes).toEqual([]);
    expect(state.selectedNote).toBeNull();
    expect(state.allUserTags).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('fetchNotes', () => {
    it('should fetch notes with tags and update state on success', async () => {
      const mockNotes = [{ id: 1, title: 'Test Note', content: 'Content', user_id: '1', created_at: '', tags: [{id: 1, name: 'work'}] }];
      mockedNotesApi.getNotes.mockResolvedValue(mockNotes);
      await act(async () => {
        await useNoteStore.getState().fetchNotes();
      });
      const state = useNoteStore.getState();
      expect(state.loading).toBe(false);
      expect(state.notes).toEqual(mockNotes);
    });
  });

  describe('fetchAllUserTags', () => {
    it('should fetch all user tags and update state', async () => {
      const mockTags = [{ id: 1, name: 'personal', user_id: '1' }];
      mockedNotesApi.getTags.mockResolvedValue(mockTags);
      await act(async () => {
        await useNoteStore.getState().fetchAllUserTags();
      });
      const state = useNoteStore.getState();
      expect(state.loading).toBe(false);
      expect(state.allUserTags).toEqual(mockTags);
    });
  });

  describe('upsertNoteWithTags', () => {
    it('should upsert a note and handle its tags', async () => {
      const newNote = { title: 'New Note', user_id: '1' };
      const savedNote = { id: 1, ...newNote, content: '', created_at: '' };
      const tagsToSave = [{ name: 'urgent', user_id: '1' }];
      const savedTags = [{ id: 1, ...tagsToSave[0] }];

      mockedNotesApi.upsertNote.mockResolvedValue(savedNote);
      mockedNotesApi.upsertTag.mockResolvedValue(savedTags[0]);
      mockedNotesApi.setTagsForNote.mockResolvedValue(undefined);
      // Mock the refetches
      mockedNotesApi.getNotes.mockResolvedValue([{ ...savedNote, tags: savedTags }]);
      mockedNotesApi.getTags.mockResolvedValue(savedTags);

      let result;
      await act(async () => {
        result = await useNoteStore.getState().upsertNoteWithTags(newNote, tagsToSave);
      });

      expect(result).toEqual(savedNote);
      expect(mockedNotesApi.upsertNote).toHaveBeenCalledWith(newNote);
      expect(mockedNotesApi.upsertTag).toHaveBeenCalledWith(tagsToSave[0]);
      expect(mockedNotesApi.setTagsForNote).toHaveBeenCalledWith(savedNote.id, [savedTags[0].id]);

      const state = useNoteStore.getState();
      expect(state.loading).toBe(false);
      expect(state.notes[0].tags).toEqual(savedTags);
      expect(state.allUserTags).toEqual(savedTags);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and refresh the list', async () => {
      mockedNotesApi.deleteNote.mockResolvedValue(undefined);
      mockedNotesApi.getNotes.mockResolvedValue([]);

      await act(async () => {
        await useNoteStore.getState().deleteNote(1);
      });

      const state = useNoteStore.getState();
      expect(state.loading).toBe(false);
      expect(state.notes).toEqual([]);
    });
  });
});
