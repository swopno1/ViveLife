import { Button, Form, H1, Input, Paragraph, YStack, Text } from 'tamagui';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../src/lib/supabase';
import { Alert } from 'react-native';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Please check your email for a password reset link.');
    }
    setLoading(false);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <H1>Forgot Password</H1>
      <Paragraph>Enter your email to receive a reset link</Paragraph>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <YStack space="$2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                disabled={loading}
              />
            )}
          />
          {errors.email && <Text color="red">{errors.email.message}</Text>}
        </YStack>

        <Form.Trigger asChild>
          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Form.Trigger>
      </Form>
    </YStack>
  );
};

export default ForgotPasswordScreen;
