"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Bot, HelpCircle, MessageCircle, Phone, Search, Wrench } from "lucide-react";
import Link from "next/link";

const supportOptions = [
  {
    title: "Pear Genius",
    description: "Chat with our AI support assistant",
    icon: Bot,
    href: "/support/pear-genius",
  },
  {
    title: "Product Support",
    description: "Get help with your Pear products",
    icon: Wrench,
    href: "/product-support",
  },
  {
    title: "Contact Us",
    description: "Chat, call, or email our support team",
    icon: MessageCircle,
    href: "/support/contact",
  },
  {
    title: "FAQs",
    description: "Find answers to common questions",
    icon: HelpCircle,
    href: "/support/faq",
  },
  {
    title: "Call Support",
    description: "Talk to a specialist: 1-800-PEAR",
    icon: Phone,
    href: "tel:1-800-7327",
  },
];

const popularTopics = [
  "Set up your new PearPhone",
  "Reset your Pear ID password",
  "Check your order status",
  "Return or exchange a product",
  "Find your device warranty",
  "Schedule a repair",
];

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark mb-4">
            Pear Support
          </h1>
          <p className="text-lg text-gray-medium mb-8">
            We&apos;re here to help. Get support for all your Pear products.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-medium" />
            <Input
              placeholder="Search for topics, products, or issues..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark mb-8 text-center">
            How can we help?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option) => (
              <Link key={option.href} href={option.href}>
                <Card className="h-full hover:shadow-lg transition-shadow text-center">
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-pear/20 flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-8 w-8 text-pear-dark" />
                    </div>
                    <CardTitle>{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-medium">{option.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark mb-8 text-center">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {popularTopics.map((topic) => (
              <Link
                key={topic}
                href={`/support/search?q=${encodeURIComponent(topic)}`}
                className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-gray-dark hover:text-pear-dark"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Support CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="bg-pear rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-4">
              Get support for your specific product
            </h2>
            <p className="text-gray-dark/80 mb-8 max-w-xl mx-auto">
              Select your product to find manuals, specs, warranty information,
              and troubleshooting guides.
            </p>
            <Button variant="dark" size="lg" asChild>
              <Link href="/product-support">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
