import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsChartProps {
  metrics: Record<string, number>;
}

export function MetricsChart({ metrics }: MetricsChartProps) {
  const percentageMetrics = ['accuracy', 'precision', 'recall', 'f1', 'f1_score'];
  const smallValueMetrics = ['cost', 'cost_per_1k', 'cost_per_1k_requests', 'hallucination_rate'];

  const data = Object.entries(metrics).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value,
    isPercentage: percentageMetrics.some(m => key.toLowerCase().includes(m)),
    isSmall: smallValueMetrics.some(m => key.toLowerCase().includes(m)),
  }));

  const formatValue = (value: number, entry: typeof data[0]) => {
    if (entry.isPercentage) {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (entry.isSmall) {
      return value.toFixed(3);
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="card px-3 py-2">
          <p className="text-xs font-medium text-neutral-600 mb-1">{item.name}</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatValue(item.value, item)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="h-64 card p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              stroke="#d1d5db"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
              stroke="#d1d5db"
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar
              dataKey="value"
              fill="#5570f1"
              radius={[0, 6, 6, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.map((item) => (
          <div
            key={item.name}
            className="metric-card"
          >
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              {item.name}
            </p>
            <p className="text-2xl font-bold text-neutral-900">
              {formatValue(item.value, item)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
