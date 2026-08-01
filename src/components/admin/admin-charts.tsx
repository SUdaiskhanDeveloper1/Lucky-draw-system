"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const axisStyle = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };

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
    <div className="rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-xs shadow-lift">
      <p className="mb-1.5 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: "hsl(var(--chart-1))" }}
          />
          {p.name}:{" "}
          <span className="font-semibold tabular-nums text-foreground">
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
        <p className="text-xs text-muted-foreground">
          Approved payments over the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.65}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={axisStyle}
                tickLine={false}
                axisLine={false}
                dy={4}
              />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={56} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.5)", radius: 8 }}
                content={<ChartTooltip prefix="Rs. " />}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="url(#revenueBar)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
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
        <p className="text-xs text-muted-foreground">
          New sign-ups per day
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="signupsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={axisStyle}
                tickLine={false}
                axisLine={false}
                dy={4}
                minTickGap={16}
              />
              <YAxis
                tick={axisStyle}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={40}
              />
              <Tooltip
                cursor={{
                  stroke: "hsl(var(--chart-1))",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={<ChartTooltip />}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Signups"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#signupsArea)"
                dot={{ r: 0 }}
                activeDot={{
                  r: 5,
                  fill: "hsl(var(--chart-1))",
                  stroke: "hsl(var(--card))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
