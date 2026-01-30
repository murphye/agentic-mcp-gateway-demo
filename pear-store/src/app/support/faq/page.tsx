"use client";

import { Button, Card, Input } from "@/components/ui";
import {
  useFAQs,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import { ChevronLeft, ChevronDown, Search, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const deviceTypes: DeviceType[] = [
  "pphone",
  "pearbook",
  "pearpad",
  "pear_watch",
  "pearpods",
  "peartv",
  "accessories",
];

const categories = [
  { id: "setup", label: "Setup" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "data_management", label: "Data & Backup" },
  { id: "device_care", label: "Device Care" },
  { id: "warranty", label: "Warranty" },
  { id: "repairs", label: "Repairs" },
  { id: "software", label: "Software" },
  { id: "purchasing", label: "Purchasing" },
  { id: "services", label: "Services" },
  { id: "security", label: "Security" },
];

export default function FAQPage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: faqsData, isLoading } = useFAQs({
    device_type: selectedDevice || undefined,
    limit: 100, // Fetch more so we can filter client-side
  });

  // Client-side filter for search and category
  const filteredFAQs = faqsData?.faqs?.filter((faq) => {
    // Category filter
    if (selectedCategory && faq.category !== selectedCategory) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        faq.question?.toLowerCase().includes(query) ||
        faq.answer?.toLowerCase().includes(query) ||
        faq.shortAnswer?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/support"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Support
          </Link>
          <div className="text-center">
            <HelpCircle className="h-16 w-16 text-pear-dark mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-medium max-w-2xl mx-auto mb-8">
              Find answers to common questions about Pear products, orders,
              accounts, and more.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-medium" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-12 pr-4 py-3 text-lg rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Device Filter */}
            <div>
              <span className="text-sm font-medium text-gray-dark mr-3">
                Product:
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setSelectedDevice(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedDevice === null
                      ? "bg-pear text-gray-dark"
                      : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {deviceTypes.map((device) => {
                  const info = deviceTypeInfo[device];
                  return (
                    <button
                      key={device}
                      type="button"
                      onClick={() => setSelectedDevice(device)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                        selectedDevice === device
                          ? "bg-pear text-gray-dark"
                          : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                      }`}
                    >
                      <span>{info.emoji}</span>
                      <span className="hidden sm:inline">{info.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <span className="text-sm font-medium text-gray-dark mr-3">
                Category:
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? "bg-pear text-gray-dark"
                      : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-pear text-gray-dark"
                        : "bg-gray-100 text-gray-medium hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-light animate-pulse"
                />
              ))}
            </div>
          ) : filteredFAQs && filteredFAQs.length > 0 ? (
            <>
              <p className="text-sm text-gray-medium mb-6">
                Showing {filteredFAQs.length} question
                {filteredFAQs.length !== 1 ? "s" : ""}
                {selectedDevice
                  ? ` for ${deviceTypeInfo[selectedDevice].name}`
                  : ""}
                {selectedCategory
                  ? ` in ${categories.find((c) => c.id === selectedCategory)?.label}`
                  : ""}
              </p>
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gray-light rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                      className="w-full p-4 text-left flex items-start justify-between gap-4"
                    >
                      <span className="font-medium text-gray-dark">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-medium flex-shrink-0 mt-0.5 transition-transform ${
                          expandedFAQ === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-medium whitespace-pre-line">
                          {faq.answer || faq.shortAnswer}
                        </p>
                        {((faq.deviceTypes && faq.deviceTypes.length > 0) || (faq.device_types && faq.device_types.length > 0)) && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-medium">
                              Applies to:
                            </span>
                            {(faq.deviceTypes || faq.device_types || []).map((dt) => (
                              <span
                                key={dt}
                                className="text-sm"
                                title={deviceTypeInfo[dt]?.name}
                              >
                                {deviceTypeInfo[dt]?.emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-dark mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-medium mb-6">
                {searchQuery
                  ? `No FAQs match "${searchQuery}"`
                  : "No FAQs available for the selected filters"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDevice(null);
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-dark mb-2">
              Didn&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-gray-medium mb-6">
              Our support team is ready to help you with any questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/product-support">Browse Product Support</Link>
              </Button>
              <Button asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
