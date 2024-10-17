import cron from 'node-cron';
import { initDatabase } from './data/database';
import { updateWeatherData, generateDailySummaries } from './services/weatherService';
import { checkAlerts } from './services/alertService';
import { fetchWeatherData } from './api/openweathermap';
import { config } from './config';

async function main() {
  await initDatabase();

  // Schedule weather data updates
  cron.schedule('*/5 * * * *', async () => {
    console.log('Updating weather data...');
    await updateWeatherData();
  });

  // Schedule daily summary generation
  cron.schedule('0 1 * * *', async () => {
    console.log('Generating daily summaries...');
    await generateDailySummaries();
  });

  // Check for alerts every minute
  cron.schedule('* * * * *', async () => {
    console.log('Checking for alerts...');
    for (const city of config.cities) {
      try {
        const weatherData = await fetchWeatherData(city);
        checkAlerts(weatherData);
      } catch (error) {
        console.error(`Error checking alerts for ${city}:`, error);
      }
    }
  });

  console.log('Weather monitoring system started.');
}

main().catch(console.error);