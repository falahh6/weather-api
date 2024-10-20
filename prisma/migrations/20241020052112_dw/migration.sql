/*
  Warnings:

  - You are about to drop the `LastSevenDaysWeather` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LastSevenDaysWeather" DROP CONSTRAINT "LastSevenDaysWeather_weatherSummaryId_fkey";

-- DropTable
DROP TABLE "LastSevenDaysWeather";

-- CreateTable
CREATE TABLE "DailyWeather" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "feelsLike" DOUBLE PRECISION NOT NULL,
    "minTemp" DOUBLE PRECISION NOT NULL,
    "maxTemp" DOUBLE PRECISION NOT NULL,
    "weatherCondition" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWeather_pkey" PRIMARY KEY ("id")
);
