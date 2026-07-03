import { InvestmentHero } from "./components/InvestmentHero";
import { MarketGrowthBento } from "./components/MarketGrowthBento";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { InvestmentCTA } from "./components/InvestmentCTA";

export function InvestmentPage() {
  return (
    <div className="w-full">
      <InvestmentHero />
      <MarketGrowthBento />
      <RoiAnalysis />
      <InvestmentCTA />
    </div>
  );
}
