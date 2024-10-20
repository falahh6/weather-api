"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { celsiusToFahrenheit } from "@/lib/utils";

interface WeatherCardProps {
  tempUnit: "C" | "F";
  WeatherData: {
    city: string;
    temp: number;
    minTemp: number;
    maxTemp: number;
    avgTemp: number;
    feelsLike: number;
    weatherCondition: string;
    updateTime: Date; // Treat this as a Date object
  };
}

export default function WeatherCard({
  WeatherData,
  tempUnit,
}: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-12 w-12 text-yellow-300" />;
      case "clouds":
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case "rain":
        return <CloudRain className="h-12 w-12 text-blue-300" />;
      case "drizzle":
        return <CloudDrizzle className="h-12 w-12 text-blue-300" />;
      case "thunderstorm":
        return <CloudLightning className="h-12 w-12 text-yellow-500" />;
      case "snow":
        return <CloudSnow className="h-12 w-12 text-blue-200" />;
      case "mist":
      case "haze":
        return <CloudFog className="h-12 w-12 text-gray-300" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-300" />;
    }
  };

  const getBackgroundColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "bg-gradient-to-br from-blue-400 to-blue-200";
      case "clouds":
        return "bg-gradient-to-br from-gray-400 to-gray-200";
      case "rain":
        return "bg-gradient-to-br from-blue-600 to-blue-400 text-white";
      case "drizzle":
        return "bg-gradient-to-br from-blue-500 to-blue-300";
      case "thunderstorm":
        return "bg-gradient-to-br from-gray-700 to-gray-500";
      case "snow":
        return "bg-gradient-to-br from-blue-100 to-white";
      case "mist":
      case "haze":
        return "bg-gradient-to-br from-gray-300 to-gray-100 text-gray-600";
      default:
        return "bg-gradient-to-br from-blue-300 to-blue-100";
    }
  };

  const getConditionBackgroundStyle = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "bg-yellow-200 text-yellow-700";
      case "clouds":
        return "bg-gray-200 text-gray-700";
      case "rain":
        return "bg-blue-300 text-blue-700";
      case "drizzle":
        return "bg-blue-200 text-blue-500";
      case "thunderstorm":
        return "bg-yellow-300 text-yellow-800";
      case "snow":
        return "bg-blue-100 text-blue-600";
      case "mist":
      case "haze":
        return "bg-gray-300 text-gray-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <Card
      className={`overflow-hidden min-w-[40vw] h-full w-full p-4 border border-gray-200 shadow-lg ${getBackgroundColor(
        WeatherData.weatherCondition
      )}`}
    >
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">{WeatherData.city}</p>
            <p className="text-3xl font-bold">
              {tempUnit == "C" ? (
                <>{WeatherData.temp.toFixed(1)}°C</>
              ) : (
                <>{celsiusToFahrenheit(WeatherData.temp).toFixed(1)}°F</>
              )}
            </p>
            <div
              className={`flex flex-row gap-2 text-xs font-semibold items-center rounded-3xl px-1.5 py-1 w-fit ${getConditionBackgroundStyle(
                WeatherData.weatherCondition
              )}`}
            >
              {" "}
              <span className="">{WeatherData.weatherCondition}</span>
              <span>
                {" "}
                {tempUnit == "C" ? (
                  <>{WeatherData.feelsLike.toFixed(1)}°C</>
                ) : (
                  <>{celsiusToFahrenheit(WeatherData.feelsLike).toFixed(1)}°F</>
                )}
              </span>
            </div>
          </div>
          {getWeatherIcon(WeatherData.weatherCondition)}
        </div>
        <p className="text-sm font-semibold mt-3 mb-0">
          <div>
            <p>
              Average Temp:{" "}
              {tempUnit == "C" ? (
                <>{WeatherData.avgTemp.toFixed(1)}°C</>
              ) : (
                <>{celsiusToFahrenheit(WeatherData.avgTemp).toFixed(1)}°F</>
              )}
            </p>
            <p>
              Max Temp:{" "}
              {tempUnit == "C" ? (
                <>{WeatherData.maxTemp.toFixed(1)}°C</>
              ) : (
                <>{celsiusToFahrenheit(WeatherData.maxTemp).toFixed(1)}°F</>
              )}
            </p>
            <p>
              Min Temp:
              {tempUnit == "C" ? (
                <>{WeatherData.minTemp.toFixed(1)}°C</>
              ) : (
                <>{celsiusToFahrenheit(WeatherData.minTemp).toFixed(1)}°F</>
              )}
            </p>
          </div>
        </p>
      </CardContent>
    </Card>
  );
}
