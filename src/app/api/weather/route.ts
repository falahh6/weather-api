import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.OPENWEATHER_API_KEY;
const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

interface WeatherData {
  city: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  feelsLike: number;
  weatherCondition: string;
  updateTime: Date; // Ensure it's a Date object
  lastSevenDays: { date: Date; temp: number }[]; // New property for last seven days' data
}

// Function to fetch weather data for a city
async function fetchWeather(city: string): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const { data } = await axios.get(url);

  const tempCelsius = data.main.temp - 273.15;
  const feelsLikeCelsius = data.main.feels_like - 273.15;
  const weatherCondition = data.weather[0].main;
  const minTempCelsius = data.main.temp_min - 273.15;
  const maxTempCelsius = data.main.temp_max - 273.15;

  // Compute the average temperature
  const avgTempCelsius = (minTempCelsius + maxTempCelsius) / 2;

  // Correctly convert Unix timestamp (data.dt) to Date object
  const updateTime = new Date(data.dt * 1000);

  // Fetch last seven days' weather data from the database
  const lastSevenDays = await getLastSevenDaysWeather(city);

  return {
    city,
    temp: tempCelsius,
    feelsLike: feelsLikeCelsius,
    weatherCondition,
    updateTime,
    minTemp: minTempCelsius,
    maxTemp: maxTempCelsius,
    avgTemp: avgTempCelsius,
    lastSevenDays, // Return last seven days' data
  };
}

// Function to fetch last 7 days of weather data for a city from the database (ensuring unique dates)
async function getLastSevenDaysWeather(city: string) {
  const data = await prisma.dailyWeather.findMany({
    where: {
      city,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  // Create a map to ensure unique dates
  const uniqueDates = new Map<string, { date: Date; temp: number }>();

  for (const record of data) {
    const dateKey = record.date.toISOString().split("T")[0]; // Get the date part only (yyyy-mm-dd)
    if (!uniqueDates.has(dateKey)) {
      uniqueDates.set(dateKey, { date: record.date, temp: record.temp });
    }
  }

  // Convert the map back to an array and limit it to the last 7 days
  const lastSevenDays = Array.from(uniqueDates.values()).slice(0, 7).reverse(); // Reverse to maintain chronological order

  return lastSevenDays;
}

// Function to check if daily weather data exists for the current day
async function findExistingDailyWeather(city: string, updateTime: Date) {
  // Get the current date without time (YYYY-MM-DD format)
  const today = new Date(updateTime).setHours(0, 0, 0, 0);

  return await prisma.dailyWeather.findFirst({
    where: {
      city,
      date: {
        gte: new Date(today), // Today's date
        lt: new Date(today + 24 * 60 * 60 * 1000), // Less than tomorrow
      },
    },
  });
}

// Function to store or update today's weather data in the DailyWeather table
async function storeDailyWeatherData(cityWeather: WeatherData) {
  const {
    city,
    temp,
    feelsLike,
    weatherCondition,
    updateTime,
    maxTemp,
    minTemp,
  } = cityWeather;

  // Check if a record already exists for today
  const existingDailyWeather = await findExistingDailyWeather(city, updateTime);

  if (existingDailyWeather) {
    // If a record exists for today, update it with the new data
    await prisma.dailyWeather.update({
      where: { id: existingDailyWeather.id },
      data: {
        temp,
        feelsLike,
        minTemp,
        maxTemp,
        weatherCondition,
      },
    });
  } else {
    // If no record exists for today, create a new one
    await prisma.dailyWeather.create({
      data: {
        city,
        temp,
        feelsLike,
        minTemp,
        maxTemp,
        weatherCondition,
        date: updateTime, // Store today's date
      },
    });
  }
}

// Function to check if a weather summary already exists for the current day
async function findExistingWeatherSummary(city: string, updateTime: Date) {
  // Get the current date without time (YYYY-MM-DD format)
  const today = new Date(updateTime).setHours(0, 0, 0, 0);

  return await prisma.weatherSummary.findFirst({
    where: {
      city,
      date: {
        gte: new Date(today), // Today's date
        lt: new Date(today + 24 * 60 * 60 * 1000), // Less than tomorrow
      },
    },
  });
}

// Function to store or update today's weather data in the WeatherSummary table
async function storeWeatherData(cityWeather: WeatherData) {
  const {
    city,
    temp,
    feelsLike,
    weatherCondition,
    updateTime,
    maxTemp,
    minTemp,
  } = cityWeather;

  // Check if a record already exists for today
  const existingSummary = await findExistingWeatherSummary(city, updateTime);

  if (existingSummary) {
    // If a record exists for today, update it with the new data
    await prisma.weatherSummary.update({
      where: { id: existingSummary.id },
      data: {
        avgTemp: temp,
        maxTemp,
        minTemp,
        dominantCondition: weatherCondition,
        feelsLike,
      },
    });
  } else {
    // If no record exists for today, create a new one
    await prisma.weatherSummary.create({
      data: {
        city,
        avgTemp: temp,
        maxTemp,
        minTemp,
        dominantCondition: weatherCondition,
        feelsLike,
        date: updateTime, // Store today's timestamp
      },
    });
  }

  // Also store or update today's weather in DailyWeather for historical purposes
  await storeDailyWeatherData(cityWeather);
}

// GET handler to fetch and store weather data for all cities
export async function GET() {
  try {
    // Fetch and store weather data for all cities
    const weatherData = await Promise.all(
      cities.map((city) => fetchWeather(city))
    );

    // Store or update weather data in the database
    await Promise.all(
      weatherData.map((cityWeather) => storeWeatherData(cityWeather))
    );

    // Return success response with fetched data
    return NextResponse.json({
      message: "Weather data saved successfully",
      data: weatherData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch or store weather data" },
      { status: 500 }
    );
  }
}
