"use client";

import { Button, Input } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Check, ChevronLeft, CreditCard, Lock, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type CheckoutStep = "shipping" | "payment" | "review";

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const shippingForm = useForm<ShippingFormData>({
    defaultValues: {
      country: "United States",
    },
  });

  const paymentForm = useForm<PaymentFormData>();

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-dark mb-4">
            Your bag is empty
          </h1>
          <p className="text-gray-medium mb-8">
            Add some items to your bag before checking out.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen py-24">
        <div className="mx-auto max-w-2xl px-4 lg:px-8 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-dark mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-medium mb-2">
            Thank you for your order. We&apos;ve sent a confirmation email to{" "}
            <span className="font-medium text-gray-dark">{shippingData?.email}</span>
          </p>
          <p className="text-gray-medium mb-8">
            Order number: <span className="font-medium text-gray-dark">PO-{Date.now()}</span>
          </p>
          <div className="bg-gray-light rounded-2xl p-6 text-left mb-8">
            <h2 className="font-semibold text-gray-dark mb-4">Shipping to:</h2>
            <p className="text-gray-medium">
              {shippingData?.firstName} {shippingData?.lastName}<br />
              {shippingData?.address}<br />
              {shippingData?.apartment && <>{shippingData.apartment}<br /></>}
              {shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}<br />
              {shippingData?.country}
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setStep("payment");
  };

  const handlePaymentSubmit = () => {
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setOrderComplete(true);
    setIsProcessing(false);
  };

  const steps = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Bag
          </Link>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    step === s.id
                      ? "bg-pear text-gray-dark"
                      : steps.findIndex((st) => st.id === step) > index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-medium"
                  }`}
                >
                  {steps.findIndex((st) => st.id === step) > index ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    step === s.id ? "text-gray-dark" : "text-gray-medium"
                  }`}
                >
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-24 lg:w-32 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              {/* Shipping Form */}
              {step === "shipping" && (
                <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}>
                  <h2 className="text-xl font-semibold text-gray-dark mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        First Name *
                      </label>
                      <Input
                        {...shippingForm.register("firstName", { required: true })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Last Name *
                      </label>
                      <Input
                        {...shippingForm.register("lastName", { required: true })}
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        {...shippingForm.register("email", { required: true })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        {...shippingForm.register("phone")}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Address *
                      </label>
                      <Input
                        {...shippingForm.register("address", { required: true })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Apartment, suite, etc.
                      </label>
                      <Input
                        {...shippingForm.register("apartment")}
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        City *
                      </label>
                      <Input
                        {...shippingForm.register("city", { required: true })}
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        State *
                      </label>
                      <Input
                        {...shippingForm.register("state", { required: true })}
                        placeholder="CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        {...shippingForm.register("zipCode", { required: true })}
                        placeholder="94102"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Country *
                      </label>
                      <Input
                        {...shippingForm.register("country", { required: true })}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button type="submit" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}

              {/* Payment Form */}
              {step === "payment" && (
                <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}>
                  <h2 className="text-xl font-semibold text-gray-dark mb-6">
                    Payment Information
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-medium mb-6">
                    <Lock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Card Number *
                      </label>
                      <Input
                        {...paymentForm.register("cardNumber", { required: true })}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-dark mb-2">
                        Name on Card *
                      </label>
                      <Input
                        {...paymentForm.register("cardName", { required: true })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-dark mb-2">
                          Expiry Date *
                        </label>
                        <Input
                          {...paymentForm.register("expiry", { required: true })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-dark mb-2">
                          CVV *
                        </label>
                        <Input
                          {...paymentForm.register("cvv", { required: true })}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button type="submit" size="lg">
                      Review Order
                    </Button>
                  </div>
                </form>
              )}

              {/* Review */}
              {step === "review" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-dark mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-gray-medium" />
                        <span className="font-medium text-gray-dark">Shipping</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="text-sm text-pear-dark hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-medium">
                      {shippingData?.firstName} {shippingData?.lastName}<br />
                      {shippingData?.address}
                      {shippingData?.apartment && `, ${shippingData.apartment}`}<br />
                      {shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-medium" />
                        <span className="font-medium text-gray-dark">Payment</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("payment")}
                        className="text-sm text-pear-dark hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-medium">
                      Card ending in ••••
                    </p>
                  </div>

                  {/* Items */}
                  <h3 className="font-medium text-gray-dark mb-4">
                    Items ({items.length})
                  </h3>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId || ""}`}
                        className="flex gap-4"
                      >
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-light flex items-center justify-center">
                          <span className="text-2xl">🍐</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-dark">{item.name}</p>
                          <p className="text-sm text-gray-medium">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-dark">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("payment")}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-dark mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || ""}`}
                    className="flex gap-3"
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-light flex items-center justify-center">
                      <span className="text-xl">🍐</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-dark truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-medium">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-medium">Subtotal</span>
                  <span className="text-gray-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-medium">Shipping</span>
                  <span className="text-gray-dark">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-medium">Tax</span>
                  <span className="text-gray-dark">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-dark">Total</span>
                  <span className="text-gray-dark">{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < 50 && (
                <p className="text-xs text-gray-medium mt-4">
                  Add {formatPrice(50 - subtotal)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
