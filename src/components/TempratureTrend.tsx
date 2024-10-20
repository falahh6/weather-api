"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TrendsChart({
  historicalData,
  city,
}: {
  historicalData: HistoricalData[];
  city: string;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
        <CardDescription>
          Last {historicalData.length}{" "}
          {historicalData.length > 1 ? "days" : "day"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={city} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
