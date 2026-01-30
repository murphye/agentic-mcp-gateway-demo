"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { CreditCard, MapPin, Package, Settings, User } from "lucide-react";
import Link from "next/link";

const accountSections = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
    href: "/account/profile",
  },
  {
    title: "Orders",
    description: "View your order history",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Addresses",
    description: "Manage your shipping addresses",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    title: "Payment Methods",
    description: "Manage your saved payment methods",
    icon: CreditCard,
    href: "/account/payment",
  },
  {
    title: "Settings",
    description: "Account preferences and notifications",
    icon: Settings,
    href: "/account/settings",
  },
];

export default function AccountPage() {
  // Placeholder - in real app, would check auth state
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-24">
        <div className="mx-auto max-w-md px-4 lg:px-8 text-center">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-bold text-gray-dark mb-4">
            Sign in to your account
          </h1>
          <p className="text-gray-medium mb-8">
            Sign in to view your orders, manage your account, and more.
          </p>
          <div className="space-y-4">
            <Button size="lg" className="w-full">
              Sign In
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Create Account
            </Button>
          </div>
          <p className="text-xs text-gray-medium mt-8">
            Authentication will be available when Keycloak is configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-dark mb-8">My Account</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-pear/20 flex items-center justify-center mb-4">
                    <section.icon className="h-6 w-6 text-pear-dark" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-medium">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
