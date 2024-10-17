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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("./data/database");
const weatherService_1 = require("./services/weatherService");
const alertService_1 = require("./services/alertService");
const openweathermap_1 = require("./api/openweathermap");
const config_1 = require("./config");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.initDatabase)();
        // Schedule weather data updates
        node_cron_1.default.schedule('*/5 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Updating weather data...');
            yield (0, weatherService_1.updateWeatherData)();
        }));
        // Schedule daily summary generation
        node_cron_1.default.schedule('0 1 * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Generating daily summaries...');
            yield (0, weatherService_1.generateDailySummaries)();
        }));
        // Check for alerts every minute
        node_cron_1.default.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Checking for alerts...');
            for (const city of config_1.config.cities) {
                try {
                    const weatherData = yield (0, openweathermap_1.fetchWeatherData)(city);
                    (0, alertService_1.checkAlerts)(weatherData);
                }
                catch (error) {
                    console.error(`Error checking alerts for ${city}:`, error);
                }
            }
        }));
        console.log('Weather monitoring system started.');
    });
}
main().catch(console.error);
