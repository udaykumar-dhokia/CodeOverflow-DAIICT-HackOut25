const fs = require('fs');
const { parse } = require('csv-parse');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

const WIND_API = `${BASE_URL}/wind/create`;
const SOLAR_API = `${BASE_URL}/solar/create`;
const AUTH_TOKEN = 'token'; 

const headers = {
  'Content-Type': 'application/json',
};
if (AUTH_TOKEN) {
  headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
}

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const requiredColumns = ['City', 'District', 'Year', 'Month', 'Insolation', 'lat', 'lon', 'speed'];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true })) 
      .on('headers', (headers) => {
        console.log(`Found columns in CSV: ${headers.join(', ')}`);
        if (!requiredColumns.every((col) => headers.includes(col))) {
          reject(
            new Error(
              `CSV file must contain columns: ${requiredColumns.join(', ')}\nFound columns: ${headers.join(', ')}`
            )
          );
        }
      })
      .on('data', (data) => results.push(data))
      .on('error', (error) => reject(new Error(`Error reading CSV file: ${error.message}`)))
      .on('end', () => resolve(results));
  });
}

async function createWindRecord(lat, lon, speed) {
  try {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const windSpeed = parseFloat(speed);
    if (
      isNaN(latitude) || isNaN(longitude) || isNaN(windSpeed) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180 ||
      windSpeed < 0
    ) {
      throw new Error(`Invalid wind data: lat=${lat}, lon=${lon}, speed=${speed}`);
    }

    const payload = {
      latitude,
      longitude,
      speed: windSpeed,
    };
    const response = await axios.post(WIND_API, payload, { headers });
    console.log('Wind record created successfully:', response.data.wind);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(
        `Connection error for wind record (lat: ${lat}, lon: ${lon}, speed: ${speed}): ${error.message}`
      );
      console.error(`Ensure the backend server is running on ${BASE_URL}`);
      console.error(`Try accessing the endpoint in a browser or Postman: ${WIND_API}`);
    } else {
      console.error(
        `Error creating wind record (lat: ${lat}, lon: ${lon}, speed: ${speed}):`,
        error.response ? `${error.response.status} - ${error.response.data.message || 'No message provided'}` : error.message
      );
    }
  }
}

async function createSolarRecord(lat, lon, insolation) {
  try {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const unit = parseFloat(insolation);
    if (
      isNaN(latitude) || isNaN(longitude) || isNaN(unit) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180 ||
      unit < 0
    ) {
      throw new Error(`Invalid solar data: lat=${lat}, lon=${lon}, insolation=${insolation}`);
    }

    const payload = {
      latitude,
      longitude,
      unit,
    };
    const response = await axios.post(SOLAR_API, payload, { headers });
    console.log('Solar record created successfully:', response.data.solar);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(
        `Connection error for solar record (lat: ${lat}, lon: ${lon}, unit: ${insolation}): ${error.message}`
      );
      console.error(`Ensure the backend server is running on ${BASE_URL}`);
      console.error(`Try accessing the endpoint in a browser or Postman: ${SOLAR_API}`);
    } else {
      console.error(
        `Error creating solar record (lat: ${lat}, lon: ${lon}, unit: ${insolation}):`,
        error.response ? `${error.response.status} - ${error.response.data.message || 'No message provided'}` : error.message
      );
    }
  }
}

async function main(filePath) {
  try {
    const rows = await readCSV(filePath);
    if (!rows) {
      console.log('Aborting due to CSV file error.');
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      console.log(`Processing row ${i + 1}: ${row.City}, ${row.District}`);
      await createWindRecord(row.lat, row.lon, row.speed);
      await createSolarRecord(row.lat, row.lon, row.Insolation);
    }
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}
const CSV_FILE_PATH = 'D2.csv';
main(CSV_FILE_PATH);