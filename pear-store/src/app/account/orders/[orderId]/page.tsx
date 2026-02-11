"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useOrder } from "@/lib/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, Truck } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const statusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  delivered: "success",
  shipped: "default",
  processing: "warning",
  cancelled: "secondary",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 text-center text-gray-medium">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8 text-center">
        <p className="text-gray-medium">Order not found.</p>
        <Link href="/account" className="text-pear-dark hover:underline text-sm mt-2 inline-block">
          Back to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-gray-medium hover:text-gray-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-dark">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-medium mt-1">
            Placed {new Date(order.placedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] ?? "secondary"}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-dark">{item.name}</p>
                    {item.options && (
                      <p className="text-sm text-gray-medium">
                        {Object.values(item.options).join(" / ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-medium">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-dark">
                    {formatPrice(item.totalPrice.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        {order.shipments?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipments.map((shipment: Shipment) => (
                <div key={shipment.id}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-medium">
                      {shipment.carrier} &middot; {shipment.trackingNumber}
                    </p>
                    <Badge variant={statusVariant[shipment.status] ?? "secondary"}>
                      {shipment.status}
                    </Badge>
                  </div>
                  {shipment.events && (
                    <div className="space-y-2">
                      {shipment.events.slice(0, 5).map((event: ShipmentEvent, i: number) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="text-gray-medium whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-gray-dark">{event.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Order Total */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-medium">Subtotal</span>
                <span>{formatPrice(order.pricing.subtotal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Shipping</span>
                <span>{order.pricing.shipping.amount === 0 ? "Free" : formatPrice(order.pricing.shipping.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Tax</span>
                <span>{formatPrice(order.pricing.tax.amount)}</span>
              </div>
              {order.pricing.discount.amount > 0 && (
                <div className="flex justify-between text-pear-dark">
                  <span>Discount</span>
                  <span>-{formatPrice(order.pricing.discount.amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(order.pricing.total.amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Inline types for the order response
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  options?: Record<string, string>;
  totalPrice: { amount: number; currency: string };
}

interface ShipmentEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface Shipment {
  id: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  events?: ShipmentEvent[];
}
