
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-headline tracking-tight mb-4">Terms and Conditions</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-foreground/90">
        <p>Welcome to ELVO. These terms and conditions outline the rules and regulations for the use of ELVO's Website, located at this domain.</p>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ELVO if you do not agree to take all of the terms and conditions stated on this page.</p>

        <Separator />

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. License to Use Website</h2>
            <p>Unless otherwise stated, ELVO and/or its licensors own the intellectual property rights for all material on ELVO. All intellectual property rights are reserved. You may access this from ELVO for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Republish material from ELVO</li>
                <li>Sell, rent or sub-license material from ELVO</li>
                <li>Reproduce, duplicate or copy material from ELVO</li>
                <li>Redistribute content from ELVO</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
            <p>If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Products and Pricing</h2>
            <p>All products listed on the website are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason.</p>
            <p>Prices for all products are subject to change. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            <p>In no event shall ELVO, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website. ELVO shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Governing Law</h2>
            <p>These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
      </div>
    </div>
  );
}
