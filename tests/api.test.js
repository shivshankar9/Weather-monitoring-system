"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// tests/api.test.ts
const openweathermap_1 = require("../src/api/openweathermap");
describe('OpenWeatherMap API', () => {
    it('should fetch weather data for a city', () => __awaiter(void 0, void 0, void 0, function* () {
        const weatherData = yield (0, openweathermap_1.fetchWeatherData)('Delhi');
        expect(weatherData).toHaveProperty('city', 'Delhi');
        expect(weatherData).toHaveProperty('temperature');
        expect(weatherData).toHaveProperty('feelsLike');
        expect(weatherData).toHaveProperty('main');
        expect(weatherData).toHaveProperty('description');
        expect(weatherData).toHaveProperty('timestamp');
    }));
});
// tests/weatherService.test.ts
const weatherService_1 = require("../src/services/weatherService");
const database = __importStar(require("../src/data/database"));
jest.mock('../src/data/database');
describe('Weather Service', () => {
    it('should generate daily summaries', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRecords = [
            { city: 'Delhi', temperature: 25, main: 'Clear' },
            { city: 'Delhi', temperature: 27, main: 'Clear' },
            { city: 'Delhi', temperature: 26, main: 'Clouds' },
        ];
        database.getWeatherRecords.mockResolvedValue(mockRecords);
        database.insertDailySummary.mockResolvedValue(undefined);
        yield (0, weatherService_1.generateDailySummaries)();
        expect(database.insertDailySummary).toHaveBeenCalledWith(expect.objectContaining({
            city: 'Delhi',
            avgTemp: 26,
            maxTemp: 27,
            minTemp: 25,
            dominantCondition: 'Clear',
        }));
    }));
});
// tests/alertService.test.ts
const alertService_1 = require("../src/services/alertService");
const nodemailer_1 = __importDefault(require("nodemailer"));
jest.mock('nodemailer');
describe('Alert Service', () => {
    it('should send an alert when temperature exceeds threshold', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'mock-id' });
        nodemailer_1.default.createTransport.mockReturnValue({ sendMail: mockSendMail });
        const weatherData = {
            city: 'Delhi',
            temperature: 46,
            feelsLike: 48,
            main: 'Extreme',
            description: 'Very hot',
            timestamp: Date.now(),
        };
        (0, alertService_1.checkAlerts)(weatherData);
        expect(mockSendMail).toHaveBeenCalled();
        expect(mockSendMail.mock.calls[0][0].text).toContain('Temperature (46°C) is above the maximum threshold (45°C)');
        expect(mockSendMail.mock.calls[0][0].text).toContain('Severe weather condition detected: Extreme');
    }));
});
