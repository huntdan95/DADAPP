import type { Location, PressureTrend, WeatherReading } from '../types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function openMeteoFetchWeather(
  location: Location
): Promise<WeatherReading> {
  const params = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lng),
    current:
      'temperature_2m,relative_humidity_2m,pressure_msl,weather_code,wind_speed_10m,cloud_cover',
    hourly:
      'temperature_2m,pressure_msl,precipitation_probability,cloud_cover',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    past_hours: '12',
    forecast_hours: '24',
    timezone: location.timezone,
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP ${res.status}`);
  }
  const json = (await res.json()) as OpenMeteoResponse;

  const { current, hourly, daily } = json;

  // Pressure-trend logic: compare current to value 6h ago in the hourly array.
  const nowIdx = hourly.time.indexOf(current.time);
  const sixAgo = nowIdx > 0 ? Math.max(0, nowIdx - 6) : null;
  const pressureNow = current.pressure_msl;
  const pressureThen = sixAgo != null ? hourly.pressure_msl[sixAgo] : null;
  const pressureDelta =
    pressureThen != null && pressureNow != null
      ? Math.round((pressureNow - pressureThen) * 10) / 10
      : null;
  const trend: PressureTrend = classifyTrend(pressureDelta);

  // Forecast slice: from now forward 24 hours.
  const forecastHourly =
    nowIdx >= 0
      ? hourly.time.slice(nowIdx, nowIdx + 24).map((time, i) => ({
          time,
          tempF: hourly.temperature_2m[nowIdx + i],
          precipProbPct: hourly.precipitation_probability[nowIdx + i] ?? null,
          cloudCoverPct: hourly.cloud_cover[nowIdx + i] ?? null,
        }))
      : [];

  return {
    observedAt: current.time,
    airTempF: current.temperature_2m,
    humidity: current.relative_humidity_2m ?? null,
    pressureMb: current.pressure_msl,
    pressureDelta6hMb: pressureDelta,
    pressureTrend: trend,
    weatherCode: current.weather_code,
    cloudCoverPct: current.cloud_cover ?? null,
    windMph: current.wind_speed_10m ?? null,
    forecastHourly,
    daily: {
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      tempMaxF: daily.temperature_2m_max[0],
      tempMinF: daily.temperature_2m_min[0],
    },
  };
}

function classifyTrend(delta: number | null): PressureTrend {
  if (delta == null) return 'steady';
  if (delta <= -3) return 'falling-fast';
  if (delta <= -0.6) return 'falling';
  if (delta >= 3) return 'rising-fast';
  if (delta >= 0.6) return 'rising';
  return 'steady';
}

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    pressure_msl: number;
    weather_code: number;
    wind_speed_10m: number;
    cloud_cover: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    pressure_msl: number[];
    precipitation_probability: Array<number | null>;
    cloud_cover: Array<number | null>;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}
