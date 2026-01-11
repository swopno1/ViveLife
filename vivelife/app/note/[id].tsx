import {
  Button,
  Form,
  Input,
  Spinner,
  Text,
  TextArea,
  YStack,
  XStack,
} from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useNoteStore } from '../../../src/stores/noteStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../../src/stores/auth';
import { Tag } from '../../../src/types/db';
import { X } from '@tamagui/lucide-icons';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();
  const [tagInput, setTagInput] = useState('');
  const [currentTags, setCurrentTags] = useState<Partial<Tag>[]>([]);

  const {
    selectedNote,
    loading,
    error,
    allUserTags,
    fetchNoteById,
    fetchAllUserTags,
    upsertNoteWithTags,
    deleteNote,
  } = useNoteStore();

  const isNew = id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    fetchAllUserTags();
    if (!isNew) {
      fetchNoteById(Number(id));
    }
  }, [id, isNew, fetchNoteById, fetchAllUserTags]);

  useEffect(() => {
    if (selectedNote && !isNew) {
      reset({
        title: selectedNote.title || '',
        content: selectedNote.content || '',
      });
      setCurrentTags(selectedNote.tags);
    }
  }, [selectedNote, isNew, reset]);

  const handleAddTag = () => {
    const tagName = tagInput.trim();
    if (tagName && !currentTags.some((t) => t.name === tagName)) {
      // Check if tag exists in allUserTags to reuse its ID
      const existingTag = allUserTags.find((t) => t.name === tagName);
      setCurrentTags([...currentTags, existingTag || { name: tagName }]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagName: string) => {
    setCurrentTags(currentTags.filter((t) => t.name !== tagName));
  };

  const onSubmit = async (data: NoteFormData) => {
    if (!session?.user) return;

    const noteToSave = {
      id: isNew ? undefined : Number(id),
      user_id: session.user.id,
      ...data,
    };

    const savedNote = await upsertNoteWithTags(noteToSave, currentTags);
    if (savedNote) {
      router.back();
    }
  };

  const handleDelete = async () => {
    if (!isNew) {
      await deleteNote(Number(id));
      router.back();
    }
  };

  if (loading && !isNew) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner />
      </YStack>
    );
  }
  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Text color="$red10">{error}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding="$4" gap="$3">
      <Form onSubmit={handleSubmit(onSubmit)} flex={1} gap="$3">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <YStack>
              <Input
                placeholder="Note Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                size="$4"
              />
              {errors.title && <Text color="$red10">{errors.title.message}</Text>}
            </YStack>
          )}
        />

        <YStack gap="$2">
          <Text>Tags</Text>
          <XStack gap="$2" flexWrap="wrap" alignItems="center">
            {currentTags.map((tag) => (
              <XStack
                key={tag.name}
                alignItems="center"
                gap="$1.5"
                backgroundColor="$blue5"
                paddingHorizontal="$2.5"
                paddingVertical="$1.5"
                borderRadius="$10"
              >
                <Text color="$blue10" fontSize="$2">
                  {tag.name}
                </Text>
                <Button
                  icon={<X size={12} />}
                  onPress={() => handleRemoveTag(tag.name!)}
                  size="$1"
                  circular
                  chromeless
                />
              </XStack>
            ))}
          </XStack>
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
            onBlur={handleAddTag} // Add tag when input loses focus
          />
        </YStack>

        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              placeholder="Note Content"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              flex={1}
            />
          )}
        />
        <Form.Trigger asChild>
          <Button theme="blue">{isNew ? 'Create Note' : 'Save Changes'}</Button>
        </Form.Trigger>
      </Form>
      {!isNew && (
        <Button theme="red" onPress={handleDelete}>
          Delete Note
        </Button>
      )}
    </YStack>
  );
}
