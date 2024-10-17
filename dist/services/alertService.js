"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlerts = checkAlerts;
const config_1 = require("../config");
const alertThresholds = {
    Delhi: { minTemp: 5, maxTemp: 45, conditions: ['Thunderstorm', 'Extreme'] },
    Mumbai: { minTemp: 15, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Chennai: { minTemp: 20, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Bangalore: { minTemp: 10, maxTemp: 35, conditions: ['Heavy Rain'] },
    Kolkata: { minTemp: 10, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Hyderabad: { minTemp: 15, maxTemp: 45, conditions: ['Extreme'] },
};
function checkAlerts(weatherData) {
    const thresholds = alertThresholds[weatherData.city];
    if (!thresholds)
        return;
    const alerts = [];
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
function sendAlertEmail(city, alerts) {
    const alertMessage = `
    To: ${config_1.config.alertEmail}
    Subject: Weather Alert for ${city}

    The following weather alerts have been triggered for ${city}:

    ${alerts.join('\n')}

    This is a simulated email alert. In a real application, this would be sent via email.
  `;
    console.log('ALERT EMAIL:');
    console.log(alertMessage);
}
