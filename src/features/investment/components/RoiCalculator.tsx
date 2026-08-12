import { useMemo, useState } from "react";
// Este componente ya se carga de forma diferida (lazy) desde InvestmentPage,
// que a su vez es lazy por ruta: recharts solo entra en el bundle de inversión.
// react-doctor-disable-next-line prefer-dynamic-import
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DEFAULT_INVESTMENT = 200_000_000;
const DEFAULT_YEARS = 5;
const DEFAULT_RATE = 12;

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const TOOLTIP_STYLE = {
  backgroundColor: "#FAFAF8",
  border: "1px solid rgba(27,67,50,0.2)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1B4332",
};

interface YearPoint {
  year: number;
  value: number;
  gain: number;
}

/**
 * Calculadora interactiva de proyección de valor: cuánto valdría hoy una
 * inversión en un lote si se aprecia a una tasa anual determinada.
 */
export function RoiCalculator() {
  const [investment, setInvestment] = useState(DEFAULT_INVESTMENT);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [rate, setRate] = useState(DEFAULT_RATE);

  const series = useMemo<YearPoint[]>(() => {
    const points: YearPoint[] = [];
    for (let year = 0; year <= years; year++) {
      const value = investment * Math.pow(1 + rate / 100, year);
      points.push({ year, value, gain: value - investment });
    }
    return points;
  }, [investment, years, rate]);

  const final = series[series.length - 1];
  const totalGainPct =
    investment > 0 ? ((final.value - investment) / investment) * 100 : 0;

  return (
    <section className="py-section-gap bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-12">
          <h2 className="text-headline-lg font-headline-lg text-primary mb-4">
            Calcula tu proyección
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Ajusta la inversión, el horizonte y la tasa de valorización para ver
            cuánto podría crecer tu capital en un lote en el Quindío.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controles */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 space-y-8">
            <div>
              <label
                htmlFor="roi-investment"
                className="block text-label-bold font-label-bold text-primary mb-2"
              >
                Inversión inicial (COP)
              </label>
              <input
                id="roi-investment"
                type="number"
                min={0}
                step={1_000_000}
                value={investment}
                onChange={(e) =>
                  setInvestment(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-background focus:ring-2 focus:ring-heritage-gold focus:border-transparent transition-colors"
              />
              <p className="mt-2 text-caption font-caption text-on-surface-variant">
                {cop.format(investment)}
              </p>
            </div>

            <div>
              <label
                htmlFor="roi-years"
                className="block text-label-bold font-label-bold text-primary mb-2"
              >
                Horizonte: {years} año{years === 1 ? "" : "s"}
              </label>
              <input
                id="roi-years"
                type="range"
                min={1}
                max={15}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
              <div className="flex justify-between text-caption font-caption text-on-surface-variant mt-1">
                <span>1 año</span>
                <span>15 años</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="roi-rate"
                className="block text-label-bold font-label-bold text-primary mb-2"
              >
                Valorización anual: {rate}%
              </label>
              <input
                id="roi-rate"
                type="range"
                min={2}
                max={30}
                step={1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
              <div className="flex justify-between text-caption font-caption text-on-surface-variant mt-1">
                <span>2%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="bg-deep-forest rounded-xl p-6 text-warm-white">
              <p className="text-caption font-caption text-warm-white/70 uppercase tracking-wider mb-2">
                Valor proyectado
              </p>
              <p className="text-2xl font-bold text-soft-gold">
                {cop.format(final.value)}
              </p>
              <p className="mt-2 text-body-md font-body-md text-warm-white/80">
                Ganancia estimada:{" "}
                <span className="text-soft-gold font-semibold">
                  {cop.format(final.gain)}
                </span>{" "}
                ({totalGainPct.toFixed(1)}%)
              </p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8">
            <h3 className="text-headline-md font-headline-md text-primary mb-6">
              Crecimiento año a año
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A373" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#D4A373" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,67,50,0.1)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    label={{
                      value: "Año",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 12,
                      fill: "#6B7280",
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    width={80}
                    tickFormatter={(value: number) =>
                      value >= 1_000_000 ? `${Math.round(value / 1_000_000)}M` : `${value}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => cop.format(Number(value))}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Valor estimado"
                    stroke="#1B4332"
                    strokeWidth={2}
                    fill="url(#roiGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-6 text-caption font-caption text-on-surface-variant">
              Proyección estimada con interés compuesto anual. No es una
              promesa de rentabilidad: los resultados reales dependen del
              mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
