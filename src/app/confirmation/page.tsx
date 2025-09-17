import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
