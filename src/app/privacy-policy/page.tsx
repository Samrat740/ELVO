
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-headline tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-foreground/90">
        <p>ELVO ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

        <Separator />

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p>We may collect personal information from you in a variety of ways, including when you visit our site, register on the site, place an order, subscribe to our newsletter, or fill out a form. The information we may collect includes:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Personal Identification Information:</strong> Name, email address, mailing address, phone number.</li>
                <li><strong>Payment Information:</strong> Credit/debit card numbers and other payment details, which are processed securely by our payment gateway and not stored on our servers.</li>
                <li><strong>Non-personal Identification Information:</strong> Browser name, type of computer, and technical information about your means of connection to our site, such as the operating system and the Internet service providers utilized.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>We may use the information we collect from you for purposes including:</p>
             <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To process and fulfill your orders, including to send you emails to confirm your order status and shipment.</li>
                <li>To improve our website and customer service.</li>
                <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                <li>To administer a contest, promotion, survey or other site feature.</li>
                <li>To send periodic emails regarding your order or other products and services.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. How We Protect Your Information</h2>
            <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our site.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Sharing Your Personal Information</h2>
            <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Your Consent</h2>
            <p>By using this site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our site. Your continued use of the site following the posting of changes to this policy will be deemed your acceptance of those changes.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Contacting Us</h2>
            <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us through our <a href="/contact" className="underline hover:text-primary">Contact Page</a>.</p>
        </section>
      </div>
    </div>
  );
}
