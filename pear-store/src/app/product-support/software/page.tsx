"use client";

import { Button, Card, Badge } from "@/components/ui";
import {
  useSoftwareUpdates,
  deviceTypeInfo,
  type DeviceType,
} from "@/lib/hooks/use-product-support";
import { ChevronLeft, Download, AlertTriangle } from "lucide-react";
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
];

function SoftwareContent() {
  const searchParams = useSearchParams();
  const initialDevice = searchParams.get("device") as DeviceType | null;

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(
    initialDevice && deviceTypes.includes(initialDevice) ? initialDevice : null
  );

  const { data: updatesData, isLoading } = useSoftwareUpdates({
    device_type: selectedDevice || undefined,
    limit: 20,
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
            <Download className="h-16 w-16 text-pear-dark mx-auto mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark">
              Software Updates
            </h1>
            <p className="text-lg text-gray-medium mt-4 max-w-xl mx-auto">
              Keep your Pear devices up to date with the latest features and
              security improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Device Selection */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-dark text-center mb-6">
            Filter by device
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setSelectedDevice(null)}
              className={`px-6 py-4 rounded-xl border-2 transition-all ${
                selectedDevice === null
                  ? "border-pear bg-pear/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">🍐</div>
              <div className="text-sm font-medium text-gray-dark">All</div>
            </button>
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

      {/* Software Updates List */}
      <section className="py-12 bg-gray-light">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark mb-8">
            {selectedDevice
              ? `${deviceTypeInfo[selectedDevice].name} Updates`
              : "Latest Updates"}
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-white animate-pulse" />
              ))}
            </div>
          ) : updatesData?.updates && updatesData.updates.length > 0 ? (
            <div className="space-y-4">
              {updatesData.updates.map((update) => (
                <Card key={update.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-dark text-lg">
                          {update.name}
                        </h3>
                        <Badge variant="secondary">{update.version}</Badge>
                        {update.is_critical && (
                          <Badge variant="error" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Critical
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-medium mb-4">
                        {update.description}
                      </p>

                      {update.features && update.features.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-dark mb-2">
                            What&apos;s new:
                          </h4>
                          <ul className="text-sm text-gray-medium space-y-1">
                            {update.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-pear-dark">•</span>
                                {feature}
                              </li>
                            ))}
                            {update.features.length > 4 && (
                              <li className="text-pear-dark">
                                + {update.features.length - 4} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-medium">
                        <span>
                          Released:{" "}
                          {new Date(update.release_date).toLocaleDateString()}
                        </span>
                        {update.size_mb && <span>{update.size_mb} MB</span>}
                        <div className="flex gap-1">
                          {update.device_types.map((dt) => (
                            <span key={dt} title={deviceTypeInfo[dt]?.name}>
                              {deviceTypeInfo[dt]?.emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {update.download_url && (
                      <Button asChild variant="outline" className="flex-shrink-0">
                        <a href={update.download_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-medium">
                {selectedDevice
                  ? `No software updates available for ${deviceTypeInfo[selectedDevice].name} at this time.`
                  : "No software updates available at this time."}
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Update Instructions */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-dark text-center mb-12">
            How to Update Your Device
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-dark mb-2">
                PearPhone & PearPad
              </h3>
              <ol className="text-sm text-gray-medium space-y-2">
                <li>1. Go to Settings &gt; General &gt; Software Update</li>
                <li>2. Tap Download and Install</li>
                <li>3. Enter your passcode if prompted</li>
                <li>4. Wait for the update to complete</li>
              </ol>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-semibold text-gray-dark mb-2">PearBook</h3>
              <ol className="text-sm text-gray-medium space-y-2">
                <li>1. Click the Pear menu &gt; System Settings</li>
                <li>2. Click General &gt; Software Update</li>
                <li>3. Click Update Now or Upgrade Now</li>
                <li>4. Enter your password if prompted</li>
              </ol>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">⌚</div>
              <h3 className="font-semibold text-gray-dark mb-2">
                PearWatch & PearPods
              </h3>
              <ol className="text-sm text-gray-medium space-y-2">
                <li>1. Open the Pear Watch app on your PearPhone</li>
                <li>2. Tap My Watch &gt; General &gt; Software Update</li>
                <li>3. Download and install the update</li>
                <li>4. Keep devices close during update</li>
              </ol>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SoftwarePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SoftwareContent />
    </Suspense>
  );
}
