// src/index.ts
import cron from 'node-cron';
import { initDatabase } from './data/database';
import { updateWeatherData, generateDailySummaries } from './services/weatherService';
import { checkAlerts } from './services/alertService';
import { fetchWeatherData } from './api/openweathermap';
import { config } from './config';

async function main() {
  try {
    await initDatabase();

    // Schedule weather data updates
    cron.schedule('*/5 * * * *', async () => {
      console.log('Updating weather data...');
      try {
        await updateWeatherData();
      } catch (error) {
        console.error('Error updating weather data:', error);
      }
    });

    // Schedule daily summary generation
    cron.schedule('0 1 * * *', async () => {
      console.log('Generating daily summaries...');
      try {
        await generateDailySummaries();
      } catch (error) {
        console.error('Error generating daily summaries:', error);
      }
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
  } catch (error) {
    console.error('Error starting the weather monitoring system:', error);
  }
}

main().catch(console.error);