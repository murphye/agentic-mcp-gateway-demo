"use client";

import { Button, Card } from "@/components/ui";
import {
  useRepairOptions,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import {
  ChevronLeft,
  Wrench,
  Mail,
  MapPin,
  Home,
  Package,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { formatPrice } from "@/lib/utils";

const deviceTypes: DeviceType[] = [
  "pphone",
  "pearbook",
  "pearpad",
  "pear_watch",
  "pearpods",
  "peartv",
];

const repairTypeIcons: Record<string, React.ElementType> = {
  mail_in: Mail,
  carry_in: MapPin,
  onsite: Home,
  self_service: Package,
};

const repairTypeLabels: Record<string, string> = {
  mail_in: "Mail-In Repair",
  carry_in: "Visit a Store",
  onsite: "Onsite Repair",
  self_service: "Self Service",
};

function RepairsContent() {
  const searchParams = useSearchParams();
  const initialDevice = searchParams.get("device") as DeviceType | null;

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(
    initialDevice && deviceTypes.includes(initialDevice) ? initialDevice : null
  );

  const { data: repairData, isLoading } = useRepairOptions({
    device_type: selectedDevice || undefined,
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/product-support"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark mb-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Support
          </Link>
          <div className="text-center">
            <Wrench className="h-16 w-16 text-pear-dark mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark">
              Repair Options
            </h1>
            <p className="text-lg text-gray-medium mt-4 max-w-xl mx-auto">
              Find the best way to get your Pear device repaired.
            </p>
          </div>
        </div>
      </section>

      {/* Device Selection */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-dark text-center mb-6">
            Select your device
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {deviceTypes.map((device) => {
              const info = deviceTypeInfo[device];
              return (
                <button
                  key={device}
                  type="button"
                  onClick={() => setSelectedDevice(device)}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    selectedDevice === device
                      ? "border-pear bg-pear/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{info.emoji}</div>
                  <div className="text-sm font-medium text-gray-dark">
                    {info.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Repair Options */}
      {selectedDevice && (
        <section className="py-12 bg-gray-light">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
              Repair Options for {deviceTypeInfo[selectedDevice].name}
            </h2>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-xl bg-white animate-pulse"
                  />
                ))}
              </div>
            ) : repairData?.options && repairData.options.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {repairData.options.map((option) => {
                  const Icon = repairTypeIcons[option.type] || Wrench;
                  return (
                    <Card
                      key={option.id}
                      className={`p-6 ${
                        !option.available ? "opacity-60" : ""
                      }`}
                    >
                      <Icon className="h-10 w-10 text-pear-dark mb-4" />
                      <h3 className="font-semibold text-gray-dark mb-2">
                        {option.name || repairTypeLabels[option.type]}
                      </h3>
                      <p className="text-sm text-gray-medium mb-4">
                        {option.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-medium">Duration:</span>
                          <span className="font-medium text-gray-dark">
                            {option.estimated_duration}
                          </span>
                        </div>
                        {option.estimated_cost && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-medium">Cost:</span>
                            <span className="font-medium text-gray-dark">
                              {formatPrice(option.estimated_cost.min)} -{" "}
                              {formatPrice(option.estimated_cost.max)}
                            </span>
                          </div>
                        )}
                      </div>

                      {option.available ? (
                        <Button className="w-full" size="sm">
                          Select
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          size="sm"
                          variant="secondary"
                          disabled
                        >
                          Not Available
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center max-w-md mx-auto">
                <p className="text-gray-medium">
                  No repair options available for{" "}
                  {deviceTypeInfo[selectedDevice].name} at this time.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Repair Process */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-12">
            How Repair Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pear flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-dark">1</span>
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">
                Check Warranty
              </h3>
              <p className="text-sm text-gray-medium">
                See if your device is covered under warranty or PearCare+
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pear flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-dark">2</span>
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">
                Choose Option
              </h3>
              <p className="text-sm text-gray-medium">
                Select the repair option that works best for you
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pear flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-gray-dark">3</span>
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">
                Get Repaired
              </h3>
              <p className="text-sm text-gray-medium">
                Our certified technicians will fix your device
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-pear flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-gray-dark" />
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">All Done</h3>
              <p className="text-sm text-gray-medium">
                Enjoy your fully functional Pear device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-dark mb-4">
            Need help deciding?
          </h2>
          <p className="text-gray-medium mb-6">
            Our support team can help you find the best repair option.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/product-support/warranty">Check Warranty First</Link>
            </Button>
            <Button asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function RepairsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RepairsContent />
    </Suspense>
  );
}
