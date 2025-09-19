
import { Separator } from "@/components/ui/separator";

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-headline tracking-tight mb-4">Return & Refund Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-foreground/90">
        <p>Thank you for shopping at ELVO. We want you to be completely satisfied with your purchase. If you are not entirely satisfied, we're here to help.</p>

        <Separator />

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Returns</h2>
            <p>You have 30 calendar days to return an item from the date you received it.</p>
            <p>To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging and needs to have the receipt or proof of purchase.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Refunds</h2>
            <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
            <p>If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Shipping</h2>
            <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
        </section>
        
        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Damaged Items</h2>
            <p>If you received a damaged product, please notify us immediately for assistance. We will work with you to resolve the issue as quickly as possible, which may include providing a replacement or a full refund.</p>
        </section>

        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Exchanges</h2>
            <p>We do not offer direct exchanges. If you wish to exchange a product, you will need to return the unwanted item for a refund and place a new order for the desired item.</p>
        </section>
        
        <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Contact Us</h2>
            <p>If you have any questions on how to return your item to us, please contact us via our <a href="/contact" className="underline hover:text-primary">Contact Page</a>.</p>
        </section>
      </div>
    </div>
  );
}
