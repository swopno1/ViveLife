import { getNotes, createNote, updateNote, deleteNote } from '../notes';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Notes API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotes', () => {
    it('should fetch notes successfully', async () => {
      const mockNotes = [{ id: 1, title: 'Test Note' }];
      (mockSupabase.from('notes').select as jest.Mock).mockResolvedValueOnce({
        data: mockNotes,
        error: null,
      });

      const notes = await getNotes();
      expect(notes).toEqual(mockNotes);
      expect(mockSupabase.from).toHaveBeenCalledWith('notes');
      expect(mockSupabase.from('notes').select).toHaveBeenCalledWith('*');
    });

    it('should throw an error if the fetch fails', async () => {
      const mockError = new Error('Failed to fetch notes');
      (mockSupabase.from('notes').select as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(getNotes()).rejects.toThrow(mockError);
    });
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const newNote = { title: 'New Note', content: 'Content' };
      const createdNote = { ...newNote, id: 2, user_id: '123', created_at: new Date().toISOString() };
      (mockSupabase.from('notes').insert(newNote).single as jest.Mock).mockResolvedValueOnce({
        data: createdNote,
        error: null,
      });

      const result = await createNote(newNote);
      expect(result).toEqual(createdNote);
      expect(mockSupabase.from).toHaveBeenCalledWith('notes');
      expect(mockSupabase.from('notes').insert).toHaveBeenCalledWith(newNote);
    });
  });

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const updatedNoteData = { title: 'Updated Note' };
      const updatedNote = { ...updatedNoteData, id: 1, user_id: '123', created_at: new Date().toISOString() };
      (mockSupabase.from('notes').update(updatedNoteData).eq('id', 1).single as jest.Mock).mockResolvedValueOnce({
        data: updatedNote,
        error: null,
      });

      const result = await updateNote(1, updatedNoteData);
      expect(result).toEqual(updatedNote);
      expect(mockSupabase.from).toHaveBeenCalledWith('notes');
      expect(mockSupabase.from('notes').update).toHaveBeenCalledWith(updatedNoteData);
      expect(mockSupabase.from('notes').update(updatedNoteData).eq).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      // For this test, `eq` should return a promise, not `this` for chaining.
      (mockSupabase.eq as jest.Mock).mockResolvedValueOnce({ error: null });

      await deleteNote(1);

      expect(mockSupabase.from).toHaveBeenCalledWith('notes');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
    });
  });
});
