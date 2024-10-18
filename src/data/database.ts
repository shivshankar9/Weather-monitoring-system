import sqlite3 from 'sqlite3';
import { WeatherRecord, DailySummary, AlertSummary } from './models';

const db = new sqlite3.Database('./weather.db');

export function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS weather_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        main TEXT,
        description TEXT,
        temperature REAL,
        feelsLike REAL,
        timestamp INTEGER
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS daily_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        date TEXT,
        avgTemp REAL,
        maxTemp REAL,
        minTemp REAL,
        dominantCondition TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS alert_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT,
        alert TEXT,
        date TEXT,
        temperature REAL,
        description TEXT,
        timestamp INTEGER
      )`);

      resolve();
    });
  });
}

export function insertWeatherRecord(record: WeatherRecord): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO weather_records (city, main, description, temperature, feelsLike, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [record.city, record.main, record.description, record.temperature, record.feelsLike, record.timestamp],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function insertDailySummary(summary: DailySummary): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO daily_summaries (city, date, avgTemp, maxTemp, minTemp, dominantCondition) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [summary.city, summary.date, summary.avgTemp, summary.maxTemp, summary.minTemp, summary.dominantCondition],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// export function insertAlertSummary(alert: AlertSummary): Promise<void> {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO alert_summaries (city, alert, date, temperature, description, timestamp) 
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [alert.city, alert.alert, alert.date, alert.temperature, alert.description, alert.timestamp],
//       (err) => {
//         if (err) reject(err);
//         else resolve();
//       }
//     );
//   });
// }

export function getWeatherRecords(city: string, startTimestamp: number, endTimestamp: number): Promise<WeatherRecord[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM weather_records 
       WHERE city = ? AND timestamp >= ? AND timestamp <= ?`,
      [city, startTimestamp, endTimestamp],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as WeatherRecord[]);
      }
    );
  });
}

export function getDailySummaries(city: string, startDate: string, endDate: string): Promise<DailySummary[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM daily_summaries 
       WHERE city = ? AND date >= ? AND date <= ?`,
      [city, startDate, endDate],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as DailySummary[]);
      }
    );
  });
}

// export function getAlertSummaries(city: string, startDate: string, endDate: string): Promise<AlertSummary[]> {
//   return new Promise((resolve, reject) => {
//     db.all(
//       `SELECT * FROM alert_summaries 
//        WHERE city = ? AND date >= ? AND date <= ?`,
//       [city, startDate, endDate],
//       (err, rows) => {
//         if (err) reject(err);
//         else resolve(rows as AlertSummary[]);
//       }
//     );
//   });
// }