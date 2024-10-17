import { fetchWeatherData, WeatherData } from '../api/openweathermap';
import { insertWeatherRecord, insertDailySummary, getWeatherRecords } from '../data/database';
import { config } from '../config';

export async function updateWeatherData(): Promise<void> {
  for (const city of config.cities) {
    try {
      const weatherData = await fetchWeatherData(city);
      await insertWeatherRecord(weatherData);
    } catch (error) {
      console.error(`Error updating weather data for ${city}:`, error);
    }
  }
}

export async function generateDailySummaries(): Promise<void> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime() / 1000;
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000 - 1;

  for (const city of config.cities) {
    try {
      const records = await getWeatherRecords(city, startOfDay, endOfDay);
      if (records.length === 0) continue;

      const temperatures = records.map(r => r.temperature);
      const avgTemp = temperatures.reduce((a, b) => a + b) / temperatures.length;
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);

      const conditions = records.map(r => r.main);
      const dominantCondition = conditions.sort((a, b) =>
        conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
      ).pop() || '';

      await insertDailySummary({
        city,
        date: yesterday.toISOString().split('T')[0],
        avgTemp,
        maxTemp,
        minTemp,
        dominantCondition,
      });
    } catch (error) {
      console.error(`Error generating daily summary for ${city}:`, error);
    }
  }
}