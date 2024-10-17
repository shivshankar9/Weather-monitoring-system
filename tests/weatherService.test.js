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
Object.defineProperty(exports, "__esModule", { value: true });
const weatherService_1 = require("../src/services/weatherService");
const database = __importStar(require("../src/data/database"));
jest.mock('../src/data/database');
describe('Weather Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should generate daily summaries', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRecords = [
            { city: 'Delhi', temperature: 25, main: 'Clear', description: 'clear sky', feelsLike: 26, timestamp: 1620000000 },
            { city: 'Delhi', temperature: 27, main: 'Clear', description: 'clear sky', feelsLike: 28, timestamp: 1620003600 },
            { city: 'Delhi', temperature: 26, main: 'Clouds', description: 'few clouds', feelsLike: 27, timestamp: 1620007200 },
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
    it('should handle empty weather records', () => __awaiter(void 0, void 0, void 0, function* () {
        database.getWeatherRecords.mockResolvedValue([]);
        database.insertDailySummary.mockResolvedValue(undefined);
        yield (0, weatherService_1.generateDailySummaries)();
        expect(database.insertDailySummary).not.toHaveBeenCalled();
    }));
    it('should handle database errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('Database error');
        database.getWeatherRecords.mockRejectedValue(mockError);
        console.error = jest.fn();
        yield (0, weatherService_1.generateDailySummaries)();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error generating daily summary'), mockError);
    }));
});
