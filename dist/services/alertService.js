"use strict";
// src/services/alertService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlerts = checkAlerts;
const config_1 = require("../config");
const database_1 = require("../data/database");
const alertThresholds = {
    Delhi: { minTemp: 5, maxTemp: 45, conditions: ['Thunderstorm', 'Extreme'] },
    Mumbai: { minTemp: 15, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Chennai: { minTemp: 20, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Bangalore: { minTemp: 10, maxTemp: 35, conditions: ['Heavy Rain'] },
    Kolkata: { minTemp: 10, maxTemp: 40, conditions: ['Heavy Rain', 'Cyclone'] },
    Hyderabad: { minTemp: 15, maxTemp: 45, conditions: ['Extreme'] },
};
function checkAlerts(weatherData) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield sendAlertEmail(weatherData.city, alerts);
            yield storeAlert(weatherData, alerts);
        }
    });
}
function sendAlertEmail(city, alerts) {
    return __awaiter(this, void 0, void 0, function* () {
        const alertMessage = `
    To: ${config_1.config.alertEmail}
    Subject: Weather Alert for ${city}

    The following weather alerts have been triggered for ${city}:

    ${alerts.join('\n')}

    This is a simulated email alert. In a real application, this would be sent via email.
  `;
        console.log('ALERT EMAIL:');
        console.log(alertMessage);
    });
}
function storeAlert(weatherData, alerts) {
    return __awaiter(this, void 0, void 0, function* () {
        const alertSummary = {
            city: weatherData.city,
            alert: alerts.join('; '),
            date: new Date(weatherData.timestamp * 1000).toISOString().split('T')[0],
            temperature: weatherData.temperature,
            description: weatherData.description,
            timestamp: weatherData.timestamp
        };
        try {
            yield (0, database_1.insertAlertSummary)(alertSummary);
            console.log(`Alert stored in database for ${weatherData.city}`);
        }
        catch (error) {
            console.error('Error storing alert in database:', error);
        }
    });
}
