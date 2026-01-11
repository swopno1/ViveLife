import {
  YStack,
  Text,
  Spinner,
  Button,
  ScrollView,
  Paragraph,
  Card,
  XStack,
} from 'tamagui';
import { useNoteStore } from '../../../src/stores/noteStore';
import { useEffect } from 'react';
import { Link } from 'expo-router';
import { Plus } from '@tamagui/lucide-icons';

export default function NotesScreen() {
  const { notes, loading, error, fetchNotes } = useNoteStore();

  useEffect(() => {
    // Fetch notes when the component mounts or when navigating back to it
    fetchNotes();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner size="large" />;
    }

    if (error) {
      return <Text color="$red10">Error: {error}</Text>;
    }

    if (notes.length === 0) {
      return <Text>No notes yet. Create one!</Text>;
    }

    return (
      <ScrollView width="100%">
        <YStack gap="$3" padding="$3">
          {notes.map((note) => (
            <Link key={note.id} href={`/note/${note.id}`} asChild>
              <Card elevate size="$4" bordered pressTheme>
                <Card.Header>
                  <YStack gap="$2">
                    <Text fontSize="$6" fontWeight="bold">
                      {note.title || 'Untitled Note'}
                    </Text>
                    <Paragraph theme="alt2" numberOfLines={2}>
                      {note.content || 'No content'}
                    </Paragraph>
                    {note.tags && note.tags.length > 0 && (
                      <XStack gap="$2" flexWrap="wrap">
                        {note.tags.map((tag) => (
                          <Text
                            key={tag.id}
                            fontSize="$2"
                            backgroundColor="$blue5"
                            color="$blue10"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            borderRadius="$3"
                          >
                            {tag.name}
                          </Text>
                        ))}
                      </XStack>
                    )}
                  </YStack>
                </Card.Header>
              </Card>
            </Link>
          ))}
        </YStack>
      </ScrollView>
    );
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$3">
      <Link href="/note/new" asChild>
        <Button
          icon={Plus}
          theme="blue"
          circular
          position="absolute"
          bottom="$4"
          right="$4"
          size="$6"
        />
      </Link>
      {renderContent()}
    </YStack>
  );
}
