"use client";

import { Button, Card } from "@/components/ui";
import {
  useArticles,
  useFAQs,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Book,
  Wrench,
  Shield,
  Download,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use, useState } from "react";

const validDevices: DeviceType[] = [
  "pphone",
  "pearbook",
  "pearpad",
  "pear_watch",
  "pearpods",
  "peartv",
  "accessories",
];

interface DeviceSupportPageProps {
  params: Promise<{ device: string }>;
}

export default function DeviceSupportPage({ params }: DeviceSupportPageProps) {
  const { device } = use(params);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Validate device type
  if (!validDevices.includes(device as DeviceType)) {
    redirect("/product-support");
  }

  const deviceType = device as DeviceType;
  const info = deviceTypeInfo[deviceType];

  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    device_type: deviceType,
    limit: 9,
  });
  const { data: faqsData, isLoading: faqsLoading } = useFAQs({
    device_type: deviceType,
    limit: 10,
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
            <div className="text-6xl mb-4">{info.emoji}</div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark">
              {info.name} Support
            </h1>
            <p className="text-lg text-gray-medium mt-4 max-w-xl mx-auto">
              {info.description}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href={`/product-support/warranty?device=${deviceType}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full text-center">
                <Shield className="h-8 w-8 text-pear-dark mx-auto mb-4" />
                <h3 className="font-semibold text-gray-dark">Check Warranty</h3>
              </Card>
            </Link>

            <Link href={`/product-support/repairs?device=${deviceType}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full text-center">
                <Wrench className="h-8 w-8 text-pear-dark mx-auto mb-4" />
                <h3 className="font-semibold text-gray-dark">Get Repair</h3>
              </Card>
            </Link>

            <Link href={`/product-support/software?device=${deviceType}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full text-center">
                <Download className="h-8 w-8 text-pear-dark mx-auto mb-4" />
                <h3 className="font-semibold text-gray-dark">Software Updates</h3>
              </Card>
            </Link>

            <Link href={`/product-support/articles?device=${deviceType}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full text-center">
                <Book className="h-8 w-8 text-pear-dark mx-auto mb-4" />
                <h3 className="font-semibold text-gray-dark">Browse Articles</h3>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-dark">
              {info.name} Articles
            </h2>
            <Link
              href={`/product-support/articles?device=${deviceType}`}
              className="text-pear-dark hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-white animate-pulse"
                />
              ))}
            </div>
          ) : articlesData?.articles && articlesData.articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesData.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/product-support/articles/${article.id}`}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full bg-white">
                    <h3 className="font-medium text-gray-dark line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-gray-medium line-clamp-3">
                        {article.summary}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-white">
              <p className="text-gray-medium">
                No articles found for {info.name}
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
            {info.name} FAQs
          </h2>

          {faqsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-light animate-pulse"
                />
              ))}
            </div>
          ) : faqsData?.faqs && faqsData.faqs.length > 0 ? (
            <div className="space-y-3">
              {faqsData.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-gray-light rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full p-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-gray-dark">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-medium flex-shrink-0 transition-transform ${
                        expandedFAQ === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-medium">{faq.answer || faq.shortAnswer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-medium">No FAQs found for {info.name}</p>
            </Card>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-dark mb-4">
              Need more help with your {info.name}?
            </h2>
            <Button asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
