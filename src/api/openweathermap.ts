// src/api/openweathermap.ts
import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  city: string;
  main: string;
  description: string;
  temperature: number;
  feelsLike: number;
  timestamp: number;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  if (!config.openWeatherMapApiKey) {
    throw new Error('OpenWeatherMap API key is not set in the configuration');
  }

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (error.response?.status === 404) {
        throw new Error(`City "${city}" not found.`);
      } else {
        throw new Error(`Error fetching weather data for ${city}: ${error.message}`);
      }
    } else {
      throw new Error(`Unexpected error fetching weather data for ${city}`);
    }
  }
}