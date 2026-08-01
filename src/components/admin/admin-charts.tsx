"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const axisStyle = { fontSize: 12, fill: "hsl(var(--muted-foreground))" };

function ChartTooltip({
  active,
  payload,
  label,
  prefix = "",
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}:{" "}
          <span className="font-semibold text-foreground">
            {prefix}
            {p.value.toLocaleString("en-PK")}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -12, right: 8, top: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                content={<ChartTooltip prefix="Rs. " />}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RegistrationsChart({
  data,
}: {
  data: { day: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Registrations (14d)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -12, right: 8, top: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis
                tick={axisStyle}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Signups"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
