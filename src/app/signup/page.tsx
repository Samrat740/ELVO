
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ADMIN_EMAIL = 'nesttrend30@gmail.com';

type SignupFormValues = z.infer<typeof signupSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.28-7.962l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    try {
      await signUpWithEmail(data.email, data.password);
      toast({
        title: 'Sign Up Successful!',
        description: 'Welcome to ELVO! You have been logged in.',
      });

      if (data.email === ADMIN_EMAIL) {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      toast({
        title: 'Sign Up Successful!',
        description: 'Welcome to ELVO!',
      });
      if (result.user.email === ADMIN_EMAIL) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google. Please try again.');
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join our community to get the latest trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

           <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>

           <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-primary">
                Log in
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

