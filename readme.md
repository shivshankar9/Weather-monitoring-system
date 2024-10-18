# Real-Time Weather Monitoring System

This project is a real-time weather monitoring system that processes data from the OpenWeatherMap API, providing summarized insights for major Indian metros.

## Features

- Fetches weather data
- Processes and stores weather data every 5 minutes.
- Generates daily weather summaries.
- Implements an alerting system for user-configurable thresholds.
- Visualizations for daily summaries and historical trends (TODO).

## Prerequisites

- **Node.js** (v14 or later)
- **npm** (Node Package Manager)
- **SQLite** (Database)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shivshankar9/weather-monitoring-system.git
   cd weather-monitoring-system

## Install dependencies:
Run the following command to install all the required dependencies:
```bash
npm install

## Set up environment variables:

Create a .env file in the root directory and add the following content:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
ALERT_EMAIL=your_email@example.com
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
Replace the placeholders (your_openweather_api_key, your_email@example.com, etc.) with your actual API key, email credentials, and SMTP server information.

Set up the database:

No additional setup is required for SQLite as the system will create and manage the database files automatically. By default, it will store the database in weather.db.

Running the Application
To start the application, run the following command:

npm start

This command will initiate the weather monitoring system, fetching data from OpenWeatherMap every 5 minutes, generating daily summaries, and checking for alerts based on the thresholds you've set.

Running Tests
To run the tests in the tests/ directory, execute the following command:

npm test
This will run all the unit tests and provide feedback on the functionality of your system.

Design Choices and Rationale
TypeScript: Chosen for its static typing, which helps in catching bugs early and improving code maintainability.
SQLite: Used as the database due to its simplicity and ease of setup. For production, consider using a more scalable option like PostgreSQL.
axios: Used for making HTTP requests to the OpenWeatherMap API.
node-cron: A task scheduler that handles periodic data fetching and summary generation.
nodemailer: Chosen to handle email notifications for weather alerts. For production, consider using a dedicated email service like SendGrid or Mailgun.
Future Improvements
Add data visualization using libraries like Chart.js or D3.js to display weather summaries and historical trends.
Implement user authentication and let users configure their own alert thresholds.
Develop a web interface for viewing weather data and summaries.
Improve error handling and logging mechanisms.
Implement caching to reduce API calls and improve performance.
****License**
'''This project is licensed under the MIT License.
