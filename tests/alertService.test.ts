import { generateDailySummaries } from '../src/services/weatherService';
import * as database from '../src/data/database';
import { WeatherRecord } from '../src/data/models';

jest.mock('../src/data/database');

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate daily summaries', async () => {
    const mockRecords: WeatherRecord[] = [
      { city: 'Delhi', temperature: 25, main: 'Clear', description: 'clear sky', feelsLike: 26, timestamp: 1620000000 },
      { city: 'Delhi', temperature: 27, main: 'Clear', description: 'clear sky', feelsLike: 28, timestamp: 1620003600 },
      { city: 'Delhi', temperature: 26, main: 'Clouds', description: 'few clouds', feelsLike: 27, timestamp: 1620007200 },
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

  it('should handle empty weather records', async () => {
    (database.getWeatherRecords as jest.Mock).mockResolvedValue([]);
    (database.insertDailySummary as jest.Mock).mockResolvedValue(undefined);

    await generateDailySummaries();

    expect(database.insertDailySummary).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
    (database.getWeatherRecords as jest.Mock).mockRejectedValue(mockError);

    console.error = jest.fn();

    await generateDailySummaries();

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error generating daily summary'), mockError);
  });
});