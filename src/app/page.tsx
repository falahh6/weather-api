"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeatherCard from "@/components/WeatherCard";
import { TrendsChart } from "@/components/TempratureTrend";
import WeatherAlerts from "@/components/WeatherAlerts";
import CityComparison from "@/components/CityComparision";
import { Skeleton } from "antd";
import { Card } from "@/components/ui/card";
import PreferencesModal from "@/components/preferences";

const API_INTERVAL = 300000; // 5 minutes (in milliseconds)

const cities: City[] = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

function convertWeatherApiResponse(
  response: WeatherApiResponse[]
): HistoricalData[] {
  const consolidatedHistoricalData: HistoricalData[] = [];

  response.forEach((weather) => {
    weather.lastSevenDays.forEach((day) => {
      const dateKey = day.date.split("T")[0]; // Get the date part (YYYY-MM-DD)

      // Check if the date entry already exists
      const existingEntry = consolidatedHistoricalData.find(
        (entry) => entry.date === dateKey
      );
      if (existingEntry) {
        existingEntry[weather.city] = day.temp; // Add temperature for this city
      } else {
        // Create a new entry for this date
        consolidatedHistoricalData.push({
          date: dateKey,
          [weather.city]: day.temp,
        });
      }
    });
  });

  return consolidatedHistoricalData;
}
const WeatherDashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  let init = false;
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const [weatherSummaries, setWeatherSummaries] = useState<WeatherSummary[]>(
    []
  );
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch("/api/weather");
      const data = await response.json();
      console.log("/api/weather", data);
      setHistoricalData(convertWeatherApiResponse(data.data));

      setWeatherSummaries(data.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchAlertsData = async () => {
    try {
      const response = await fetch("/api/alerts");
      const data = await response.json();
      console.log("/api/alerts", data);
      setAlerts(data.alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
  const loadData = async () => {
    fetchWeatherData().then(
      async () =>
        await fetchAlertsData().finally(() => {
          setLoading(false);
        })
    );
  };

  useEffect(() => {
    if (!init) {
      loadData(); // Initial data load

      // Set interval to fetch data every 5 minutes
      const intervalId = setInterval(() => {
        loadData();
      }, API_INTERVAL);

      // Clear the interval when the component is unmounted
      init = true;
      return () => clearInterval(intervalId);
    }
  }, []);

  const CardSkeleton = () => (
    <Card className="w-full h-[300px] p-4">
      <Skeleton className="w-1/2 h-6 mb-4" />
    </Card>
  );

  return (
    <main className="p-14 max-sm:p-4 max-sm:text-xs">
      <h1 className="text-2xl font-bold mb-4">Weather Monitoring Dashboard</h1>{" "}
      <Tabs
        defaultValue={selectedCity}
        onValueChange={(value) => setSelectedCity(value as City)}
      >
        <div className="flex flex-row gap-2 items-center w-full justify-between">
          <TabsList className="">
            {cities.map((city) => (
              <TabsTrigger className="max-sm:text-xs" key={city} value={city}>
                {city}
              </TabsTrigger>
            ))}
          </TabsList>
          <div>
            <PreferencesModal setTempUnit={setTempUnit} tempUnit={tempUnit} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-3">
          <div className="min-w-full flex flex-row max-sm:flex-col gap-2">
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                {" "}
                {cities.map((city) => (
                  <TabsContent className="mt-0" key={city} value={city}>
                    {weatherSummaries.length > 0 && (
                      <WeatherCard
                        tempUnit={tempUnit}
                        WeatherData={
                          weatherSummaries.find((w) => w.city === city)!
                        }
                      />
                    )}
                  </TabsContent>
                ))}{" "}
              </>
            )}
            {loading ? (
              <CardSkeleton />
            ) : (
              <TrendsChart
                historicalData={historicalData}
                city={selectedCity}
              />
            )}
          </div>

          <div className="w-full flex flex-row max-sm:flex-col gap-2">
            {loading ? (
              <CardSkeleton />
            ) : (
              <CityComparison weatherSummaries={weatherSummaries} />
            )}
            {loading ? <CardSkeleton /> : <WeatherAlerts alerts={alerts} />}
          </div>
        </div>
      </Tabs>
    </main>
  );
};

export default WeatherDashboard;
