"use client";

import { Button, Card, Input } from "@/components/ui";
import {
  useArticles,
  useFAQs,
  useSupportSearch,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Book,
  Wrench,
  Shield,
  Download,
  MessageCircle,
} from "lucide-react";
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

export default function ProductSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const { data: articlesData, isLoading: articlesLoading } = useArticles({ limit: 6 });
  const { data: faqsData, isLoading: faqsLoading } = useFAQs({ limit: 8 });
  const { data: searchResults, isLoading: searchLoading } = useSupportSearch(searchQuery);

  const showSearchResults = searchQuery.length >= 2;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-dark mb-4">
              Pear Support
            </h1>
            <p className="text-lg text-gray-medium max-w-2xl mx-auto mb-8">
              Get help with your Pear products. Find articles, check warranty status,
              and contact our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-medium" />
                <Input
                  type="text"
                  placeholder="Search for topics, articles, or FAQs..."
                  className="pl-12 pr-4 py-4 text-lg rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-10">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-medium">
                      Searching...
                    </div>
                  ) : searchResults?.results && searchResults.results.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.results.slice(0, 5).map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={
                            result.type === "article"
                              ? `/product-support/articles/${result.id}`
                              : result.type === "faq"
                              ? `/product-support#faqs`
                              : `/product-support/software`
                          }
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs uppercase text-gray-medium bg-gray-100 px-2 py-1 rounded">
                              {result.type}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-dark">
                                {result.title}
                              </h4>
                              {result.summary && (
                                <p className="text-sm text-gray-medium mt-1 line-clamp-2">
                                  {result.summary}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-medium">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Product */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
            Browse by Product
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {deviceTypes.map((deviceType) => {
              const info = deviceTypeInfo[deviceType];
              return (
                <Link
                  key={deviceType}
                  href={`/product-support/${deviceType}`}
                  className="group"
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {info.emoji}
                    </div>
                    <h3 className="font-medium text-gray-dark text-sm">
                      {info.name}
                    </h3>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/product-support/warranty">
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <Shield className="h-8 w-8 text-pear-dark mb-4" />
                <h3 className="font-semibold text-gray-dark mb-2">
                  Check Warranty
                </h3>
                <p className="text-sm text-gray-medium">
                  Look up your warranty status and coverage details
                </p>
              </Card>
            </Link>

            <Link href="/product-support/repairs">
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <Wrench className="h-8 w-8 text-pear-dark mb-4" />
                <h3 className="font-semibold text-gray-dark mb-2">
                  Repair Options
                </h3>
                <p className="text-sm text-gray-medium">
                  Find out how to get your device repaired
                </p>
              </Card>
            </Link>

            <Link href="/product-support/software">
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <Download className="h-8 w-8 text-pear-dark mb-4" />
                <h3 className="font-semibold text-gray-dark mb-2">
                  Software Updates
                </h3>
                <p className="text-sm text-gray-medium">
                  Download the latest software for your devices
                </p>
              </Card>
            </Link>

            <Link href="/support">
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <MessageCircle className="h-8 w-8 text-pear-dark mb-4" />
                <h3 className="font-semibold text-gray-dark mb-2">
                  Contact Support
                </h3>
                <p className="text-sm text-gray-medium">
                  Chat with us or create a support ticket
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-dark">
              Popular Articles
            </h2>
            <Link
              href="/product-support/articles"
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
                  className="h-32 rounded-xl bg-gray-light animate-pulse"
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
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                    <div className="flex items-start gap-4">
                      <Book className="h-6 w-6 text-pear-dark flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-dark line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-sm text-gray-medium line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        {((article.deviceTypes && article.deviceTypes.length > 0) || (article.device_types && article.device_types.length > 0)) && (
                          <div className="flex gap-1 mt-3">
                            {(article.deviceTypes || article.device_types || []).slice(0, 3).map((dt) => (
                              <span
                                key={dt}
                                className="text-xs bg-gray-100 text-gray-medium px-2 py-1 rounded"
                              >
                                {deviceTypeInfo[dt]?.name || dt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-medium">No articles available at this time.</p>
            </Card>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 bg-gray-light">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-8">
            Frequently Asked Questions
          </h2>

          {faqsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white animate-pulse"
                />
              ))}
            </div>
          ) : faqsData?.faqs && faqsData.faqs.length > 0 ? (
            <div className="space-y-3">
              {faqsData.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl overflow-hidden"
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
              <p className="text-gray-medium">No FAQs available at this time.</p>
            </Card>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="bg-pear rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-4">
              Still need help?
            </h2>
            <p className="text-gray-dark/80 mb-6 max-w-xl mx-auto">
              Our support team is available 24/7 to assist you with any questions
              or issues.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white">
                <Link href="/support/chat">Start Live Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
