import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { YStack, Input, Button, Text } from 'tamagui';
import { NoteInput } from '../../api/notes';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

interface NoteEditorProps {
  onSubmit: (data: NoteInput) => void;
  defaultValues?: NoteInput;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ onSubmit, defaultValues }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  return (
    <YStack p="$4" space="$3">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ''}
          />
        )}
      />
      {errors.title && <Text color="red">{errors.title.message}</Text>}
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Content"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ''}
            multiline
            numberOfLines={4}
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)}>Save</Button>
    </YStack>
  );
};

export default NoteEditor;
