"use client";

import { Button, Card, Input } from "@/components/ui";
import { useWarrantyCoverage, deviceTypeInfo } from "@/lib/hooks/use-product-support";
import { ChevronLeft, Shield, Check, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WarrantyPage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [submittedSerial, setSubmittedSerial] = useState("");

  const { data: warranty, isLoading, isError } = useWarrantyCoverage(submittedSerial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialNumber.trim()) {
      setSubmittedSerial(serialNumber.trim());
    }
  };

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
            <Shield className="h-16 w-16 text-pear-dark mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark">
              Check Your Warranty
            </h1>
            <p className="text-lg text-gray-medium mt-4 max-w-xl mx-auto">
              Enter your device serial number to check warranty status and coverage
              details.
            </p>
          </div>
        </div>
      </section>

      {/* Lookup Form */}
      <section className="py-16">
        <div className="mx-auto max-w-xl px-4 lg:px-8">
          <Card className="p-8">
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="serial"
                className="block text-sm font-medium text-gray-dark mb-2"
              >
                Serial Number
              </label>
              <div className="flex gap-3">
                <Input
                  id="serial"
                  type="text"
                  placeholder="e.g., PEAR-PPH-123456789"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!serialNumber.trim() || isLoading}>
                  {isLoading ? "Checking..." : "Check"}
                </Button>
              </div>
              <p className="text-xs text-gray-medium mt-2">
                Find your serial number in Settings &gt; General &gt; About on your
                device, or on the original packaging.
              </p>
            </form>
          </Card>

          {/* Results */}
          {submittedSerial && !isLoading && (
            <div className="mt-8">
              {isError ? (
                <Card className="p-6 border-red-200 bg-red-50">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-dark">
                        Unable to check warranty
                      </h3>
                      <p className="text-sm text-gray-medium mt-1">
                        We couldn&apos;t find warranty information for this serial
                        number. Please verify and try again.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : warranty === null ? (
                <Card className="p-6 border-yellow-200 bg-yellow-50">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-dark">
                        Serial number not found
                      </h3>
                      <p className="text-sm text-gray-medium mt-1">
                        We couldn&apos;t find a device with this serial number.
                        Please check and try again.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : warranty ? (
                <Card className="p-6">
                  <div className="space-y-6">
                    {/* Device Info */}
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                      <div className="text-4xl">
                        {deviceTypeInfo[warranty.device_type]?.emoji || "🍐"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-dark text-lg">
                          {warranty.product_name}
                        </h3>
                        <p className="text-sm text-gray-medium">
                          Serial: {warranty.serial_number}
                        </p>
                      </div>
                    </div>

                    {/* Coverage Status */}
                    <div
                      className={`p-4 rounded-xl ${
                        warranty.is_covered
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {warranty.is_covered ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-dark">
                            {warranty.is_covered
                              ? "Covered by Warranty"
                              : "Warranty Expired"}
                          </h4>
                          {warranty.is_covered && warranty.days_remaining && (
                            <p className="text-sm text-gray-medium">
                              {warranty.days_remaining} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div>
                      <h4 className="font-medium text-gray-dark mb-3">
                        Coverage Type:{" "}
                        <span className="text-pear-dark">
                          {warranty.coverage_type === "applecare_plus"
                            ? "PearCare+"
                            : warranty.coverage_type === "extended"
                            ? "Extended Warranty"
                            : "Standard Warranty"}
                        </span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-medium">Purchase Date:</span>
                          <p className="font-medium text-gray-dark">
                            {new Date(warranty.purchase_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-medium">
                            Warranty End Date:
                          </span>
                          <p className="font-medium text-gray-dark">
                            {new Date(
                              warranty.warranty_end_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Features */}
                    {warranty.coverage_details && (
                      <div>
                        <h4 className="font-medium text-gray-dark mb-3">
                          What&apos;s Covered
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(warranty.coverage_details).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-medium">
                                  {key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </span>
                                {value ? (
                                  <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                  <X className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200 flex gap-4">
                      <Button asChild variant="outline" className="flex-1">
                        <Link
                          href={`/product-support/repairs?device=${warranty.device_type}`}
                        >
                          Get Repair
                        </Link>
                      </Button>
                      <Button asChild className="flex-1">
                        <Link href="/support">Contact Support</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
            Warranty Coverage Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-dark mb-2">
                Standard Warranty
              </h3>
              <p className="text-sm text-gray-medium mb-4">
                One year of hardware repair coverage and 90 days of software
                support included with every Pear product.
              </p>
              <ul className="text-sm text-gray-medium space-y-1">
                <li>• Hardware defects coverage</li>
                <li>• Software support</li>
                <li>• No accidental damage</li>
              </ul>
            </Card>

            <Card className="p-6 border-pear">
              <h3 className="font-semibold text-gray-dark mb-2">PearCare+</h3>
              <p className="text-sm text-gray-medium mb-4">
                Extended coverage with accidental damage protection and priority
                support.
              </p>
              <ul className="text-sm text-gray-medium space-y-1">
                <li>• 2-3 years of coverage</li>
                <li>• Accidental damage protection</li>
                <li>• Battery service coverage</li>
                <li>• Priority support access</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-dark mb-2">
                Extended Warranty
              </h3>
              <p className="text-sm text-gray-medium mb-4">
                Additional hardware coverage beyond the standard warranty period.
              </p>
              <ul className="text-sm text-gray-medium space-y-1">
                <li>• Extended hardware coverage</li>
                <li>• Software support</li>
                <li>• No accidental damage</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
