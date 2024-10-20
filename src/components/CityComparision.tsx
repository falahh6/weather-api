import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CityComparisonCardProps {
  weatherSummaries: WeatherSummary[];
}

const CityComparison: React.FC<CityComparisonCardProps> = ({
  weatherSummaries,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>City Comparison</CardTitle>
        <CardDescription>Today&apos;s average temperature</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weatherSummaries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgTemp" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CityComparison;
