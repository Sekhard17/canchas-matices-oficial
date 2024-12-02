import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AreaChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  formatter?: (value: number) => string;
  gradientId: string;
  strokeColor: string;
  fillColor: string;
  xAxisDataKey?: string;
  height?: number | string;
}

const AreaChartComponent = ({
  data,
  formatter = (value) => value.toString(),
  gradientId,
  strokeColor,
  fillColor,
  xAxisDataKey = "name",
  height = "100%"
}: AreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fillColor} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={fillColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey={xAxisDataKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor' }}
          padding={{ left: 0, right: 0 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ 
            fill: 'currentColor',
            fontSize: 12,
            dx: 0
          }}
          tickFormatter={formatter}
          padding={{ top: 10, bottom: 0 }}
          width={60}
        />
        <Tooltip 
          formatter={(value: number) => [formatter(value), 'Valor']}
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem'
          }}
          labelStyle={{ color: 'var(--foreground)' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;