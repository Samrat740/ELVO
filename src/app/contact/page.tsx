
import { Mail, Phone, ShoppingCart, Truck, PackageCheck, HelpCircle, Lightbulb, Bug, Code, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";


const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        content: "Get in touch via email for any inquiries.",
        value: "nesttrend30@gmail.com",
        href: "mailto:nesttrend30@gmail.com"
    },
    {
        icon: Phone,
        title: "Call Us",
        content: "Speak to our team directly for support.",
        value: "+91 9874850892",
        href: "tel:+919874850892"
    }
]

const devDeskLinks = [
    {
        icon: Lightbulb,
        title: "Suggest a Feature",
        href: "mailto:samratghosh740@gmail.com?subject=Feature Suggestion"
    },
    {
        icon: Bug,
        title: "Report a Bug",
        href: "mailto:samratghosh740@gmail.com?subject=Bug Report"
    }
]

const faqs = [
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also find your tracking information in the 'My Orders' section of your account.",
        icon: Truck
    },
    {
        question: "What are your shipping options?",
        answer: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). All orders are processed within 24 hours.",
        icon: ShoppingCart
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery. The item must be unused and in its original packaging. Please visit our returns portal to initiate a return.",
        icon: PackageCheck
    },
    {
        question: "Do you offer international shipping?",
        answer: "Currently, we only ship within India. We are working on expanding our shipping options to more countries in the near future.",
        icon: HelpCircle
    }
]


export default function ContactPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-headline tracking-tight">Get in Touch</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">We're here to help. Contact us with any questions or feedback.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {contactInfo.map((info, index) => (
                    <Card key={index} className="group hover:bg-muted/50 transition-colors">
                         <Link href={info.href} target="_blank" rel="noopener noreferrer">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <info.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{info.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{info.content}</p>
                                <p className="mt-2 font-semibold text-foreground text-lg">{info.value}</p>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
            
            <div className="max-w-2xl mx-auto text-center border rounded-lg p-6 bg-muted/20 my-12">
                <h2 className="text-lg font-semibold flex items-center justify-center gap-2"><Code className="h-5 w-5" /> From the Developer's Desk</h2>
                <p className="mt-2 text-sm text-muted-foreground mb-4">Help us improve your experience.</p>
                <div className="flex justify-center gap-4">
                    {devDeskLinks.map((link, index) => (
                        <Button asChild variant="outline" size="sm" key={index}>
                           <Link href={link.href} target="_blank" rel="noopener noreferrer">
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.title}
                           </Link>
                        </Button>
                    ))}
                </div>
            </div>


            <div className="max-w-3xl mx-auto">
                 <h2 className="text-3xl font-headline text-center mb-8">Frequently Asked Questions</h2>
                 <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg">
                                <div className="flex items-center gap-3">
                                    <faq.icon className="h-5 w-5 text-primary" />
                                    <span>{faq.question}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                               {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </div>
        </div>
    )
}
