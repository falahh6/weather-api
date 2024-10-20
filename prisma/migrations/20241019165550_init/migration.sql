/*
  Warnings:

  - Added the required column `updatedAt` to the `WeatherSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeatherSummary" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- CreateTable
CREATE TABLE "LastSevenDaysWeather" (
    "id" SERIAL NOT NULL,
    "weatherSummaryId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LastSevenDaysWeather_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LastSevenDaysWeather" ADD CONSTRAINT "LastSevenDaysWeather_weatherSummaryId_fkey" FOREIGN KEY ("weatherSummaryId") REFERENCES "WeatherSummary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
