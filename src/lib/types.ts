/* eslint-disable @typescript-eslint/no-unused-vars */

interface HistoricalData {
  date: string;
  [city: string]: number | string;
}

interface WeatherSummary {
  city: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  feelsLike: number;
  weatherCondition: string;
  updateTime: Date; // Treat this as a Date object
}

type City =
  | "Delhi"
  | "Mumbai"
  | "Chennai"
  | "Bangalore"
  | "Kolkata"
  | "Hyderabad";

interface DailyData {
  city: City;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  dominantCondition: string;
}

interface WeatherAlert {
  city: City;
  message: string;
  severity: "high" | "medium" | "low";
}

interface AlertType {
  city: string;
  alertType: string;
  message: string;
  severity: string;
}

interface WeatherApiResponse {
  city: string;
  temp: number;
  feelsLike: number;
  weatherCondition: string;
  updateTime: string; // in ISO 8601 format
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  lastSevenDays: { date: string; temp: number }[]; // assuming dates are in ISO 8601 format
}
