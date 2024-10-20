import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const consecutiveUpdateCount = 2; // Define how many consecutive updates should trigger an alert

// Mock user-configurable thresholds
const userConfigurableThresholds = {
  temperature: 35,
  highTempThreshold: 40, // Define an additional threshold for high severity
  weatherCondition: ["Stormy", "Extreme Heat"], // Weather conditions that should trigger alerts
};

// Helper function to check for consecutive breaches
async function checkConsecutiveBreaches(
  city: string,
  tempThreshold: number,
  consecutiveUpdates: number
) {
  // Fetch the last few records for the city from the weather summary table
  const weatherSummaries = await prisma.weatherSummary.findMany({
    where: { city },
    orderBy: { createdAt: "desc" },
    take: consecutiveUpdates, // Fetch the last consecutiveUpdates number of records
  });

  // Check if the temperature exceeded the threshold for consecutive records
  const breaches = weatherSummaries.every(
    (summary) => summary.avgTemp > tempThreshold
  );

  return breaches;
}

// Function to determine severity based on the conditions
function determineSeverity(
  tempBreachedConsecutively: boolean,
  avgTemp: number,
  weatherConditionAlert: boolean,
  dominantCondition: string
) {
  if (
    tempBreachedConsecutively &&
    avgTemp > userConfigurableThresholds.highTempThreshold
  ) {
    return "High"; // High severity for extreme heat (e.g., > 40°C)
  }

  if (tempBreachedConsecutively || weatherConditionAlert) {
    return "Medium"; // Medium severity for moderate temperature breaches or weather conditions
  }

  if (
    dominantCondition === "Cloudy" ||
    avgTemp > userConfigurableThresholds.temperature
  ) {
    return "Low"; // Low severity for mild conditions
  }

  return "Low"; // Default to low if no other criteria are met
}

export async function GET() {
  try {
    const weatherSummaries = await prisma.weatherSummary.findMany();
    const alerts = [];

    for (const summary of weatherSummaries) {
      const { city, avgTemp, dominantCondition } = summary;

      // Check if temperature exceeds threshold for 2 consecutive updates
      const tempBreachedConsecutively = await checkConsecutiveBreaches(
        city,
        userConfigurableThresholds.temperature,
        consecutiveUpdateCount
      );

      // Check if the current weather condition matches any of the alert conditions
      const weatherConditionAlert =
        userConfigurableThresholds.weatherCondition.includes(dominantCondition);

      // Determine the severity of the alert
      const severity = determineSeverity(
        tempBreachedConsecutively,
        avgTemp,
        weatherConditionAlert,
        dominantCondition
      );

      // Create an alert if any condition is met
      if (tempBreachedConsecutively || weatherConditionAlert) {
        let message = `Alert: ${city} has triggered a warning.`;

        if (tempBreachedConsecutively) {
          message += ` Temperature exceeded ${userConfigurableThresholds.temperature}°C!`;
        }

        if (weatherConditionAlert) {
          message += ` Current weather condition is ${dominantCondition}.`;
        }

        alerts.push({
          city: summary.city,
          alertType: "Weather Alert",
          severity, // Add severity to the alert
          message,
        });
      }
    }

    // Save alerts to the database
    if (alerts.length > 0) {
      await prisma.alert.createMany({ data: alerts });
    }

    return NextResponse.json({
      message: "Alerts generated successfully",
      alerts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate alerts" },
      { status: 500 }
    );
  }
}
