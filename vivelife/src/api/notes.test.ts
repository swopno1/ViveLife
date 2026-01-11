import { getNotes, getNoteById, upsertNote, deleteNote } from './notes';
import { supabase } from '../lib/supabase';

// Mock the supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

describe('Notes API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for getNotes (now using RPC)
  it('should fetch all notes with tags using RPC', async () => {
    const mockNotes = [{ id: 1, title: 'Test Note', tags: [] }];
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockNotes, error: null });

    const notes = await getNotes();
    expect(notes).toEqual(mockNotes);
    expect(supabase.rpc).toHaveBeenCalledWith('get_notes_with_tags');
  });

  // Test for getNoteById
  it('should fetch a single note by id', async () => {
    const mockNote = { id: 1, title: 'Test Note' };
    const mockFrom = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockNote, error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockFrom);

    const note = await getNoteById(1);
    expect(note).toEqual(mockNote);
    expect(supabase.from).toHaveBeenCalledWith('notes');
    expect(mockFrom.select).toHaveBeenCalledWith('*');
    expect(mockFrom.eq).toHaveBeenCalledWith('id', 1);
    expect(mockFrom.single).toHaveBeenCalled();
  });

  // Test for upsertNote (insert)
  it('should insert a new note', async () => {
    const newNote = { title: 'New Note' };
    const mockSavedNote = { id: 2, ...newNote };
    const mockFrom = {
      upsert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockSavedNote, error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockFrom);

    const savedNote = await upsertNote(newNote);
    expect(savedNote).toEqual(mockSavedNote);
    expect(supabase.from).toHaveBeenCalledWith('notes');
    expect(mockFrom.upsert).toHaveBeenCalledWith(newNote);
  });

  // Test for deleteNote
  it('should delete a note', async () => {
    const mockFrom = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockFrom);

    await deleteNote(1);
    expect(supabase.from).toHaveBeenCalledWith('notes');
    expect(mockFrom.delete).toHaveBeenCalled();
    expect(mockFrom.eq).toHaveBeenCalledWith('id', 1);
  });

  // Test for error handling in getNotes RPC
  it('should throw an error when getNotes RPC call fails', async () => {
    const mockError = new Error('Supabase RPC error');
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: mockError });

    await expect(getNotes()).rejects.toThrow('Supabase RPC error');
  });
});
