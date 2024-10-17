// src/data/models.ts
import { fetchWeatherData, WeatherData } from '../api/openweathermap';

export interface WeatherRecord {
    id?: number;
    city: string;
    main: string;
    description: string;
    temperature: number;
    feelsLike: number;
    timestamp: number;
  }
  
  export interface DailySummary {
    id?: number;
    city: string;
    date: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    dominantCondition: string;
  }
  