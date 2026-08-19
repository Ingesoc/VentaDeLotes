/**
 * AnalyticsPage — dashboard de métricas comerciales.
 *
 * Pestañas:
 *   1. Embudo — funnel de conversión + trends temporales
 *   2. Canales — rendimiento por canal de adquisición
 *   3. Lotes — ranking de métricas por lote
 */

import { useState, lazy, Suspense } from "react";
import {
  BarChart3,
  Users,
  MapPin,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  DateRangeFilter,
  type DateRangePreset,
} from "./components/analytics/DateRangeFilter";

// Lazy load de los tab contents (cada uno carga recharts de forma independiente)
const FunnelTab = lazy(() =>
  import("./components/analytics/FunnelChart").then((m) => ({
    default: m.FunnelChart,
  })),
);
const TrendsTab = lazy(() =>
  import("./components/analytics/TrendsChart").then((m) => ({
    default: m.TrendsChart,
  })),
);
const ChannelsTab = lazy(() =>
  import("./components/analytics/ChannelPerformance").then((m) => ({
    default: m.ChannelPerformance,
  })),
);
const LotsTab = lazy(() =>
  import("./components/analytics/LotsRanking").then((m) => ({
    default: m.LotsRanking,
  })),
);

export function Component() {
  return <AnalyticsPage />;
}

type Tab = "funnel" | "channels" | "lots" | "trends";

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "funnel", label: "Embudo", icon: BarChart3 },
  { id: "channels", label: "Canales", icon: Users },
  { id: "lots", label: "Lotes", icon: MapPin },
  { id: "trends", label: "Tendencias", icon: TrendingUp },
];

const TabFallback = (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
  </div>
);

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("funnel");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">
            Analítica Comercial
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Embudo de conversión, rendimiento por canal y métricas de lotes
          </p>
        </div>
        <DateRangeFilter
          preset={datePreset}
          onPresetChange={setDatePreset}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant/20">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-body-md font-body-md border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-heritage-gold text-primary font-semibold"
                    : "border-transparent text-on-surface-variant hover:text-primary hover:border-outline-variant/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <Suspense fallback={TabFallback}>
        {activeTab === "funnel" && (
          <div className="space-y-6">
            <FunnelTab datePreset={datePreset} />
            <TrendsTab datePreset={datePreset} />
          </div>
        )}
        {activeTab === "channels" && <ChannelsTab />}
        {activeTab === "lots" && <LotsTab />}
        {activeTab === "trends" && <TrendsTab datePreset={datePreset} />}
      </Suspense>
    </div>
  );
}
