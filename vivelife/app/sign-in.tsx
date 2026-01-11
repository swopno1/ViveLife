import { Anchor, Button, Form, H1, Input, Paragraph, Separator, YStack, Text } from 'tamagui';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../src/lib/supabase';
import { Alert } from 'react-native';

const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInForm = z.infer<typeof SignInSchema>;

const SignInScreen = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <H1>Welcome Back</H1>
      <Paragraph>Sign in to continue</Paragraph>

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                disabled={loading}
              />
            )}
          />
          {errors.password && <Text color="red">{errors.password.message}</Text>}
        </YStack>

        <Form.Trigger asChild>
          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form.Trigger>
      </Form>

      <Link href="/forgot-password" asChild>
        <Anchor>Forgot Password?</Anchor>
      </Link>

      <Separator />

      <Link href="/sign-up" asChild>
        <Anchor>Don't have an account? Sign Up</Anchor>
      </Link>
    </YStack>
  );
};

export default SignInScreen;
