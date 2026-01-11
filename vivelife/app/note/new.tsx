import React from 'react';
import { useRouter } from 'expo-router';
import { useNotesStore } from '../../src/stores/useNotesStore';
import NoteEditor from '../../src/components/notes/NoteEditor';
import { NoteInput } from '../../src/api/notes';
import { YStack } from 'tamagui';

export default function NewNoteScreen() {
  const router = useRouter();
  const { addNote } = useNotesStore();

  const handleSave = async (data: NoteInput) => {
    await addNote(data);
    router.back();
  };

  return (
    <YStack flex={1}>
      <NoteEditor onSubmit={handleSave} />
    </YStack>
  );
}
