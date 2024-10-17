"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    openWeatherMapApiKey: process.env.OPENWEATHER_API_KEY,
    cities: ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'],
    updateInterval: 5 * 60 * 1000, // 5 minutes
    alertEmail: 'shivshankarkumar281@gmail.com',
};
