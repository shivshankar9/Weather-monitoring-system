// tests/api.test.ts
import { fetchWeatherData } from '../src/api/openweathermap';

describe('OpenWeatherMap API', () => {
  it('should fetch weather data for a city', async () => {
    const weatherData = await fetchWeatherData('Delhi');
    expect(weatherData).toHaveProperty('city', 'Delhi');
    expect(weatherData).toHaveProperty('temperature');
    expect(weatherData).toHaveProperty('feelsLike');
    expect(weatherData).toHaveProperty('main');
    expect(weatherData).toHaveProperty('description');
    expect(weatherData).toHaveProperty('timestamp');
  });
});

// tests/weatherService.test.ts
import { generateDailySummaries } from '../src/services/weatherService';
import * as database from '../src/data/database';

jest.mock('../src/data/database');

describe('Weather Service', () => {
  it('should generate daily summaries', async () => {
    const mockRecords = [
      { city: 'Delhi', temperature: 25, main: 'Clear' },
      { city: 'Delhi', temperature: 27, main: 'Clear' },
      { city: 'Delhi', temperature: 26, main: 'Clouds' },
    ];

    (database.getWeatherRecords as jest.Mock).mockResolvedValue(mockRecords);
    (database.insertDailySummary as jest.Mock).mockResolvedValue(undefined);

    await generateDailySummaries();

    expect(database.insertDailySummary).toHaveBeenCalledWith(expect.objectContaining({
      city: 'Delhi',
      avgTemp: 26,
      maxTemp: 27,
      minTemp: 25,
      dominantCondition: 'Clear',
    }));
  });
});

// tests/alertService.test.ts
import { checkAlerts } from '../src/services/alertService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('Alert Service', () => {
  it('should send an alert when temperature exceeds threshold', async () => {
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'mock-id' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: mockSendMail });

    const weatherData = {
      city: 'Delhi',
      temperature: 46,
      feelsLike: 48,
      main: 'Extreme',
      description: 'Very hot',
      timestamp: Date.now(),
    };

    checkAlerts(weatherData);

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockSendMail.mock.calls[0][0].text).toContain('Temperature (46°C) is above the maximum threshold (45°C)');
    expect(mockSendMail.mock.calls[0][0].text).toContain('Severe weather condition detected: Extreme');
  
  });
});