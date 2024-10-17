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
exports.fetchWeatherData = fetchWeatherData;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
function fetchWeatherData(city) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(API_BASE_URL, {
                params: {
                    q: city,
                    appid: config_1.config.openWeatherMapApiKey,
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
        }
        catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
            throw error;
        }
    });
}
