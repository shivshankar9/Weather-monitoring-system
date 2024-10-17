import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openWeatherMapApiKey: process.env.OPENWEATHER_API_KEY,
  cities: ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'],
  updateInterval: 5 * 60 * 1000, // 5 minutes
  alertEmail: 'shivshankarkumar281@gmail.com',
};