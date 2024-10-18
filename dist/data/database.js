"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.insertWeatherRecord = insertWeatherRecord;
exports.insertDailySummary = insertDailySummary;
exports.insertAlertSummary = insertAlertSummary;
exports.getWeatherRecords = getWeatherRecords;
exports.getDailySummaries = getDailySummaries;
exports.getAlertSummaries = getAlertSummaries;
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database('./weather.db');
function initDatabase() {
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
function insertWeatherRecord(record) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO weather_records (city, main, description, temperature, feelsLike, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?)`, [record.city, record.main, record.description, record.temperature, record.feelsLike, record.timestamp], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
function insertDailySummary(summary) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO daily_summaries (city, date, avgTemp, maxTemp, minTemp, dominantCondition) 
       VALUES (?, ?, ?, ?, ?, ?)`, [summary.city, summary.date, summary.avgTemp, summary.maxTemp, summary.minTemp, summary.dominantCondition], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
function insertAlertSummary(alert) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO alert_summaries (city, alert, date, temperature, description, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?)`, [alert.city, alert.alert, alert.date, alert.temperature, alert.description, alert.timestamp], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
function getWeatherRecords(city, startTimestamp, endTimestamp) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM weather_records 
       WHERE city = ? AND timestamp >= ? AND timestamp <= ?`, [city, startTimestamp, endTimestamp], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
function getDailySummaries(city, startDate, endDate) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM daily_summaries 
       WHERE city = ? AND date >= ? AND date <= ?`, [city, startDate, endDate], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
function getAlertSummaries(city, startDate, endDate) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM alert_summaries 
       WHERE city = ? AND date >= ? AND date <= ?`, [city, startDate, endDate], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
