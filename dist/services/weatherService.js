"use strict";
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
exports.updateWeatherData = updateWeatherData;
exports.generateDailySummaries = generateDailySummaries;
const openweathermap_1 = require("../api/openweathermap");
const database_1 = require("../data/database");
const config_1 = require("../config");
function updateWeatherData() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const city of config_1.config.cities) {
            try {
                const weatherData = yield (0, openweathermap_1.fetchWeatherData)(city);
                yield (0, database_1.insertWeatherRecord)(weatherData);
            }
            catch (error) {
                console.error(`Error updating weather data for ${city}:`, error);
            }
        }
    });
}
function generateDailySummaries() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime() / 1000;
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000 - 1;
        for (const city of config_1.config.cities) {
            try {
                const records = yield (0, database_1.getWeatherRecords)(city, startOfDay, endOfDay);
                if (records.length === 0)
                    continue;
                const temperatures = records.map(r => r.temperature);
                const avgTemp = temperatures.reduce((a, b) => a + b) / temperatures.length;
                const maxTemp = Math.max(...temperatures);
                const minTemp = Math.min(...temperatures);
                const conditions = records.map(r => r.main);
                const dominantCondition = conditions.sort((a, b) => conditions.filter(v => v === a).length - conditions.filter(v => v === b).length).pop() || '';
                yield (0, database_1.insertDailySummary)({
                    city,
                    date: yesterday.toISOString().split('T')[0],
                    avgTemp,
                    maxTemp,
                    minTemp,
                    dominantCondition,
                });
            }
            catch (error) {
                console.error(`Error generating daily summary for ${city}:`, error);
            }
        }
    });
}
