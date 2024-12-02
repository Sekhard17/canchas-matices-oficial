import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  formatter?: (value: number) => string;
}

const BarChartComponent = ({
  data,
  bars,
  formatter = (value) => value.toString()
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor' }}
          tickFormatter={formatter}
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
        <Legend 
          formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
        />
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;