import { YStack, H1, Text } from 'tamagui';
import { ReactNode } from 'react';

export default function AuthLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <H1>{title}</H1>
      <Text>{description}</Text>
      {children}
    </YStack>
  );
}
