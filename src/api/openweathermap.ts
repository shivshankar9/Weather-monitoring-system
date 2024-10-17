import axios from 'axios';
require('dotenv').config();

import { config } from '../config';

const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  city: string;
  main: string;
  description: string;
  temperature: number;
  feelsLike: number;
  timestamp: number;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        q: city,
        appid: config.openWeatherMapApiKey,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      city: data.name,
      main: data.weather[0].main,
      description: data.weather[0].description,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      timestamp: data.dt,
    };
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    throw error;
  }
}