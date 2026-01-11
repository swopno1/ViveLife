import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotesStore } from '../../src/stores/useNotesStore';
import NoteEditor from '../../src/components/notes/NoteEditor';
import { Note, NoteInput, getNoteById } from '../../src/api/notes';
import { YStack, Button, Text, ActivityIndicator } from 'tamagui';

export default function EditNoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { notes, editNote, removeNote } = useNotesStore();

  const [note, setNote] = useState<Note | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const noteId = Number(id);
    const noteFromStore = notes.find((n) => n.id === noteId);

    if (noteFromStore) {
      setNote(noteFromStore);
      setLoading(false);
    } else {
      getNoteById(noteId)
        .then(setNote)
        .catch(() => setNote(undefined))
        .finally(() => setLoading(false));
    }
  }, [id, notes]);

  const handleSave = async (data: NoteInput) => {
    if (note) {
      await editNote(note.id, data);
      router.back();
    }
  };

  const handleDelete = async () => {
    if (note) {
      await removeNote(note.id);
      router.back();
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!note) {
    return <YStack flex={1} justifyContent="center" alignItems="center"><Text>Note not found.</Text></YStack>;
  }

  return (
    <YStack flex={1}>
      <NoteEditor onSubmit={handleSave} defaultValues={note} />
      <Button onPress={handleDelete} theme="red">Delete</Button>
    </YStack>
  );
}
