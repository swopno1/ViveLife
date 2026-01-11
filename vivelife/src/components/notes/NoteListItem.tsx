import React from 'react';
import { YStack, Text } from 'tamagui';
import { Note } from '../../api/notes';

interface NoteListItemProps {
  note: Note;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ note }) => {
  return (
    <YStack p="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
      <Text fontSize="$6" fontWeight="bold">{note.title}</Text>
      <Text numberOfLines={2}>{note.content}</Text>
    </YStack>
  );
};

export default NoteListItem;
