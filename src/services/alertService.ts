import { config } from '../config';
import { WeatherData } from '../api/openweathermap';

interface AlertThresholds {
  minTemp: number;
  maxTemp: number;
  conditions: string[];
}

const alertThresholds: Record<string, AlertThresholds> = {
  Delhi: { minTemp: 5, maxTemp: 45, conditions: ['Thunderstorm', 'Extreme'] },
  Mumbai: { minTemp: 15, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
  Chennai: { minTemp: 20, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
  Bangalore: { minTemp: 10, maxTemp: 35, conditions: ['Heavy Rain'] },
  Kolkata: { minTemp: 10, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
  Hyderabad: { minTemp: 15, maxTemp: 45, conditions: ['Extreme'] },
};

export function checkAlerts(weatherData: WeatherData): void {
  const thresholds = alertThresholds[weatherData.city];
  if (!thresholds) return;

  const alerts: string[] = [];

  if (weatherData.temperature < thresholds.minTemp) {
    alerts.push(`Temperature (${weatherData.temperature}°C) is below the minimum threshold (${thresholds.minTemp}°C)`);
  }

  if (weatherData.temperature > thresholds.maxTemp) {
    alerts.push(`Temperature (${weatherData.temperature}°C) is above the maximum threshold (${thresholds.maxTemp}°C)`);
  }

  if (thresholds.conditions.includes(weatherData.main)) {
    alerts.push(`Severe weather condition detected: ${weatherData.main}`);
  }

  if (alerts.length > 0) {
    sendAlertEmail(weatherData.city, alerts);
  }
}

function sendAlertEmail(city: string, alerts: string[]): void {
  const alertMessage = `
    To: ${config.alertEmail}
    Subject: Weather Alert for ${city}

    The following weather alerts have been triggered for ${city}:

    ${alerts.join('\n')}

    This is a simulated email alert. In a real application, this would be sent via email.
  `;

  console.log('ALERT EMAIL:');
  console.log(alertMessage);
}