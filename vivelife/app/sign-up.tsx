import { Anchor, Button, Form, H1, Input, Paragraph, Separator, YStack, Text } from 'tamagui';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../src/lib/supabase';
import { Alert } from 'react-native';

const SignUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof SignUpSchema>;

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Please check your email to confirm your account.');
    }
    setLoading(false);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space>
      <H1>Create Account</H1>
      <Paragraph>Join us to start your journey</Paragraph>

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Confirm Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                disabled={loading}
              />
            )}
          />
          {errors.confirmPassword && <Text color="red">{errors.confirmPassword.message}</Text>}
        </YStack>

        <Form.Trigger asChild>
          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form.Trigger>
      </Form>

      <Separator />

      <Link href="/sign-in" asChild>
        <Anchor>Already have an account? Sign In</Anchor>
      </Link>
    </YStack>
  );
};

export default SignUpScreen;
