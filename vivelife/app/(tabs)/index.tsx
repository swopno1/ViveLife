import React, { useEffect } from 'react';
import { FlatList, ActivityIndicator, Text } from 'react-native';
import { YStack, Button } from 'tamagui';
import { useNotesStore } from '../../src/stores/useNotesStore';
import NoteListItem from '../../src/components/notes/NoteListItem';
import { useRouter } from 'expo-router';

export default function NotesScreen() {
  const { notes, loading, error, fetchNotes } = useNotesStore();
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <YStack flex={1}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Button onPress={() => router.push(`/note/${item.id}`)}>
            <NoteListItem note={item} />
          </Button>
        )}
      />
      <Button onPress={() => router.push('/note/new')}>Add Note</Button>
    </YStack>
  );
}
