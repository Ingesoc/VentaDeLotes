import {
  Landmark,
  FileText,
  TrendingUp,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import { trustIndicators } from "@/constants/marketStats";

const iconMap: Record<string, LucideIcon> = {
  Landmark,
  FileText,
  TrendingUp,
  Droplet,
};

export function TrustIndicators() {
  return (
    <section className="py-16 bg-surface border-b border-surface-container-highest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustIndicators.map((indicator) => {
            const Icon = iconMap[indicator.icon];
            return (
              <div
                key={indicator.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-on-primary transition-colors duration-300" />
                </div>
                <h3 className="text-label-bold font-label-bold text-primary">
                  {indicator.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
