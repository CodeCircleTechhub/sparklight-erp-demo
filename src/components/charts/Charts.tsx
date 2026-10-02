interface Datum {
  label: string;
  value: number;
}

export interface SeriesDatum {
  label: string;
  values: number[];
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export function formatNaira(value: number): string {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export function formatNairaCompact(value: number): string {
  return `₦${formatCompact(value)}`;
}

const W = 640;
const H = 240;
const PAD = { top: 24, right: 16, bottom: 34, left: 56 };

function niceMax(max: number): number {
  if (max <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const scaled = max / magnitude;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * magnitude;
}

function axisTicks(max: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}

function Frame({
  max,
  formatValue,
  children,
}: {
  max: number;
  formatValue: (v: number) => string;
  children: React.ReactNode;
}) {
  const plotH = H - PAD.top - PAD.bottom;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
      {axisTicks(max).map((tick) => {
        const y = PAD.top + plotH - (tick / max) * plotH;
        return (
          <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#eef2f7" strokeWidth="1" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {formatValue(tick)}
            </text>
          </g>
        );
      })}
      <line
        x1={PAD.left}
        y1={PAD.top + plotH}
        x2={W - PAD.right}
        y2={PAD.top + plotH}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      {children}
    </svg>
  );
}

export function BarChart({
  data,
  color = '#3b82f6',
  formatValue = formatCompact,
  formatLabel = (l: string) => l,
}: {
  data: Datum[];
  color?: string;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
}) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const plotH = H - PAD.top - PAD.bottom;
  const plotW = W - PAD.left - PAD.right;
  const slot = plotW / Math.max(data.length, 1);
  const barW = Math.min(slot * 0.55, 48);

  return (
    <Frame max={max} formatValue={formatValue}>
      {data.map((d, i) => {
        const h = (d.value / max) * plotH;
        const x = PAD.left + slot * i + (slot - barW) / 2;
        const y = PAD.top + plotH - h;
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx="4" fill={color}>
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </rect>
            {h > 18 && (
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {formatValue(d.value)}
              </text>
            )}
            <text x={x + barW / 2} y={H - 12} textAnchor="middle" fontSize="11" fill="#6b7280">
              {formatLabel(d.label)}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

export function GroupedBarChart({
  data,
  series,
  formatValue = formatCompact,
  formatLabel = (l: string) => l,
}: {
  data: SeriesDatum[];
  series: { name: string; color: string }[];
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
}) {
  const max = niceMax(Math.max(...data.flatMap((d) => d.values), 0));
  const plotH = H - PAD.top - PAD.bottom;
  const plotW = W - PAD.left - PAD.right;
  const slot = plotW / Math.max(data.length, 1);
  const groupW = Math.min(slot * 0.7, 52);
  const barW = groupW / Math.max(series.length, 1);

  return (
    <Frame max={max} formatValue={formatValue}>
      {data.map((d, i) => {
        const groupX = PAD.left + slot * i + (slot - groupW) / 2;
        return (
          <g key={`${d.label}-${i}`}>
            {d.values.map((v, s) => {
              const h = (v / max) * plotH;
              const x = groupX + barW * s;
              const y = PAD.top + plotH - h;
              return (
                <rect
                  key={s}
                  x={x}
                  y={y}
                  width={Math.max(barW - 3, 4)}
                  height={Math.max(h, 2)}
                  rx="3"
                  fill={series[s]?.color ?? '#3b82f6'}
                >
                  <title>{`${d.label} — ${series[s]?.name}: ${formatValue(v)}`}</title>
                </rect>
              );
            })}
            <text
              x={groupX + groupW / 2}
              y={H - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {formatLabel(d.label)}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

export function DonutChart({
  segments,
  totalLabel = 'Total',
  formatValue = formatCompact,
}: {
  segments: { label: string; value: number; color: string }[];
  totalLabel?: string;
  formatValue?: (v: number) => string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0" role="img">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="24" />
        {total > 0 &&
          segments.map((seg) => {
            const fraction = seg.value / total;
            const dash = fraction * circumference;
            const element = (
              <circle
                key={seg.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="24"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
              >
                <title>{`${seg.label}: ${formatValue(seg.value)}`}</title>
              </circle>
            );
            offset += dash;
            return element;
          })}
        <text x="90" y="86" textAnchor="middle" fontSize="12" fill="#9ca3af">
          {totalLabel}
        </text>
        <text x="90" y="106" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">
          {formatValue(total)}
        </text>
      </svg>
      <ul className="space-y-2.5 min-w-0">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-gray-600 truncate">{seg.label}</span>
            <span className="ml-auto font-semibold text-gray-900">{formatValue(seg.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
