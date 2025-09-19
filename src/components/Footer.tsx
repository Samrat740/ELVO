
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
          © {new Date().getFullYear() + 1} ELVO. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
          <Link href="/return-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Return & Refund Policy</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact / Support</Link>
        </nav>
      </div>
    </footer>
  );
}
