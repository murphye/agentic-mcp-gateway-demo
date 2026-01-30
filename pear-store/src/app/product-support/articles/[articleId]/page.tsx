"use client";

import { Button, Card, Badge } from "@/components/ui";
import { useArticle, deviceTypeInfo } from "@/lib/hooks/use-product-support";
import {
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ArticlePageProps {
  params: Promise<{ articleId: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { articleId } = use(params);
  const { data: article, isLoading } = useArticle(articleId);
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="h-8 w-32 bg-gray-light rounded animate-pulse mb-8" />
          <div className="h-12 w-3/4 bg-gray-light rounded animate-pulse mb-4" />
          <div className="h-6 w-1/2 bg-gray-light rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-light rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-dark mb-4">
            Article not found
          </h1>
          <p className="text-gray-medium mb-6">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/product-support/articles">Browse Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gray-light py-8">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link
            href="/product-support/articles"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Articles
          </Link>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-4">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg text-gray-medium mb-4">{article.summary}</p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            {((article.deviceTypes && article.deviceTypes.length > 0) || (article.device_types && article.device_types.length > 0)) && (
              <div className="flex gap-2">
                {(article.deviceTypes || article.device_types || []).map((dt) => (
                  <Link
                    key={dt}
                    href={`/product-support/${dt}`}
                    className="inline-flex items-center gap-1 text-sm bg-white px-3 py-1 rounded-full hover:bg-gray-50"
                  >
                    <span>{deviceTypeInfo[dt]?.emoji}</span>
                    <span>{deviceTypeInfo[dt]?.name || dt}</span>
                  </Link>
                ))}
              </div>
            )}

            {article.category && (
              <Badge variant="secondary">{article.category}</Badge>
            )}

            {(article.metadata?.views !== undefined || article.viewCount !== undefined || article.view_count !== undefined) && (
              <span className="text-sm text-gray-medium flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(article.metadata?.views || article.viewCount || article.view_count || 0).toLocaleString()} views
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="prose prose-gray max-w-none prose-headings:text-gray-dark prose-p:text-gray-dark prose-li:text-gray-dark prose-strong:text-gray-dark">
            {article.content ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-dark mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-gray-dark mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-dark mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-dark leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-dark">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-dark">{children}</strong>,
                  a: ({ href, children }) => <a href={href} className="text-pear-dark hover:underline">{children}</a>,
                  code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-medium">
                No content available for this article.
              </p>
            )}
          </div>

          {/* Tags/Topics */}
          {((article.topics && article.topics.length > 0) || (article.tags && article.tags.length > 0)) && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-dark mb-3">
                Related topics:
              </h3>
              <div className="flex flex-wrap gap-2">
                {(article.topics || article.tags || []).map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 text-gray-medium hover:text-gray-dark rounded-lg hover:bg-gray-100"
                title="Print article"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2 text-gray-medium hover:text-gray-dark rounded-lg hover:bg-gray-100"
                title="Share article"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {(article.metadata?.lastUpdated || article.updatedAt || article.updated_at) && (
              <span className="text-sm text-gray-medium">
                Last updated:{" "}
                {new Date(article.metadata?.lastUpdated || article.updatedAt || article.updated_at || "").toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Card className="p-6 text-center">
            {feedback ? (
              <div>
                <p className="text-lg font-medium text-gray-dark">
                  Thank you for your feedback!
                </p>
                <p className="text-gray-medium mt-1">
                  Your input helps us improve our support articles.
                </p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-dark mb-4">
                  Was this article helpful?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setFeedback("helpful")}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFeedback("not_helpful")}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-5 w-5" />
                    No
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </section>

      {/* Related / CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-dark mb-4">
            Still need help?
          </h2>
          <p className="text-gray-medium mb-6">
            Our support team is available to assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/product-support">Browse More Topics</Link>
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
