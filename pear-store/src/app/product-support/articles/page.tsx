"use client";

import { Card, Input } from "@/components/ui";
import {
  useArticles,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import { ChevronLeft, Search, Book } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const deviceTypes: DeviceType[] = [
  "pphone",
  "pearbook",
  "pearpad",
  "pear_watch",
  "pearpods",
  "peartv",
  "accessories",
];

function ArticlesContent() {
  const searchParams = useSearchParams();
  const initialDevice = searchParams.get("device") as DeviceType | null;
  const initialCategory = searchParams.get("category");

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(
    initialDevice && deviceTypes.includes(initialDevice) ? initialDevice : null
  );
  const [filterQuery, setFilterQuery] = useState("");

  const { data: articlesData, isLoading } = useArticles({
    device_type: selectedDevice || undefined,
    category: initialCategory || undefined,
    limit: 50,
  });

  // Client-side filter for search
  const filteredArticles = articlesData?.articles.filter(
    (article) =>
      !filterQuery ||
      article.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/product-support"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Support
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-dark">
                Support Articles
              </h1>
              <p className="text-gray-medium mt-1">
                Find answers to common questions and learn how to use your Pear
                devices.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-medium" />
              <Input
                type="text"
                placeholder="Filter articles..."
                className="pl-10"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Device Filter */}
      <section className="py-6 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedDevice(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDevice === null
                  ? "bg-pear text-gray-dark"
                  : "bg-gray-100 text-gray-medium hover:bg-gray-200"
              }`}
            >
              All Devices
            </button>
            {deviceTypes.map((device) => {
              const info = deviceTypeInfo[device];
              return (
                <button
                  key={device}
                  type="button"
                  onClick={() => setSelectedDevice(device)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
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
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-light animate-pulse"
                />
              ))}
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <>
              <p className="text-sm text-gray-medium mb-6">
                Showing {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""}
                {selectedDevice
                  ? ` for ${deviceTypeInfo[selectedDevice].name}`
                  : ""}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
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
                            <p className="text-sm text-gray-medium line-clamp-3">
                              {article.summary}
                            </p>
                          )}
                          {article.device_types &&
                            article.device_types.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {article.device_types.slice(0, 3).map((dt) => (
                                  <span
                                    key={dt}
                                    className="text-xs bg-gray-100 text-gray-medium px-2 py-1 rounded"
                                  >
                                    {deviceTypeInfo[dt]?.name || dt}
                                  </span>
                                ))}
                                {article.device_types.length > 3 && (
                                  <span className="text-xs text-gray-medium">
                                    +{article.device_types.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-dark mb-2">
                No articles found
              </h3>
              <p className="text-gray-medium">
                {filterQuery
                  ? `No articles match "${filterQuery}"`
                  : selectedDevice
                  ? `No articles available for ${deviceTypeInfo[selectedDevice].name}`
                  : "No articles available"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
