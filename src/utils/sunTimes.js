// Approximate coordinates for major timezones
const TIMEZONE_COORDS = {
  'America/New_York': { lat: 40.7128, lng: -74.0060 },
  'America/Chicago': { lat: 41.8781, lng: -87.6298 },
  'America/Denver': { lat: 39.7392, lng: -104.9903 },
  'America/Los_Angeles': { lat: 34.0522, lng: -118.2437 },
  'America/San_Francisco': { lat: 37.7749, lng: -122.4194 },
  'America/Phoenix': { lat: 33.4484, lng: -112.0740 },
  'America/Anchorage': { lat: 61.2181, lng: -149.9003 },
  'America/Toronto': { lat: 43.6532, lng: -79.3832 },
  'America/Vancouver': { lat: 49.2827, lng: -123.1207 },
  'America/Mexico_City': { lat: 19.4326, lng: -99.1332 },
  'America/Sao_Paulo': { lat: -23.5505, lng: -46.6333 },
  'America/Buenos_Aires': { lat: -34.6037, lng: -58.3816 },
  'America/Argentina/Buenos_Aires': { lat: -34.6037, lng: -58.3816 },
  'America/Bogota': { lat: 4.7110, lng: -74.0721 },
  'America/Caracas': { lat: 10.4806, lng: -66.9036 },
  'America/Lima': { lat: -12.0464, lng: -77.0428 },
  'America/Santiago': { lat: -33.4489, lng: -70.6693 },
  'Europe/London': { lat: 51.5074, lng: -0.1278 },
  'Europe/Paris': { lat: 48.8566, lng: 2.3522 },
  'Europe/Berlin': { lat: 52.5200, lng: 13.4050 },
  'Europe/Rome': { lat: 41.9028, lng: 12.4964 },
  'Europe/Madrid': { lat: 40.4168, lng: -3.7038 },
  'Europe/Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Europe/Stockholm': { lat: 59.3293, lng: 18.0686 },
  'Europe/Moscow': { lat: 55.7558, lng: 37.6173 },
  'Europe/Athens': { lat: 37.9838, lng: 23.7275 },
  'Europe/Dublin': { lat: 53.3498, lng: -6.2603 },
  'Europe/Lisbon': { lat: 38.7223, lng: -9.1393 },
  'Europe/Prague': { lat: 50.0755, lng: 14.4378 },
  'Europe/Warsaw': { lat: 52.2297, lng: 21.0122 },
  'Europe/Zurich': { lat: 47.3769, lng: 8.5417 },
  'Atlantic/Reykjavik': { lat: 64.1466, lng: -21.9426 },
  'Asia/Dubai': { lat: 25.2048, lng: 55.2708 },
  'Asia/Tel_Aviv': { lat: 31.7683, lng: 35.2137 },
  'Asia/Riyadh': { lat: 24.7136, lng: 46.6753 },
  'Asia/Kuwait': { lat: 29.3759, lng: 47.9774 },
  'Asia/Baghdad': { lat: 33.3152, lng: 44.3661 },
  'Asia/Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Asia/Seoul': { lat: 37.5665, lng: 126.9780 },
  'Asia/Shanghai': { lat: 31.2304, lng: 121.4737 },
  'Asia/Hong_Kong': { lat: 22.3193, lng: 114.1694 },
  'Asia/Singapore': { lat: 1.3521, lng: 103.8198 },
  'Asia/Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Asia/Kuala_Lumpur': { lat: 3.1390, lng: 101.6869 },
  'Asia/Jakarta': { lat: -6.2088, lng: 106.8456 },
  'Asia/Manila': { lat: 14.5995, lng: 120.9842 },
  'Asia/Taipei': { lat: 25.0330, lng: 121.5654 },
  'Asia/Kolkata': { lat: 28.6139, lng: 77.2090 },
  'Asia/Karachi': { lat: 24.8607, lng: 67.0011 },
  'Asia/Dhaka': { lat: 23.8103, lng: 90.4125 },
  'Asia/Ho_Chi_Minh': { lat: 10.8231, lng: 106.6297 },
  'Asia/Delhi': { lat: 28.6139, lng: 77.2090 },
  'Asia/Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Asia/Hanoi': { lat: 21.0285, lng: 105.8542 },
  'Australia/Sydney': { lat: -33.8688, lng: 151.2093 },
  'Australia/Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Australia/Brisbane': { lat: -27.4698, lng: 153.0251 },
  'Australia/Perth': { lat: -31.9505, lng: 115.8605 },
  'Australia/Adelaide': { lat: -34.9285, lng: 138.6007 },
  'Australia/Darwin': { lat: -12.4634, lng: 130.8456 },
  'Australia/Hobart': { lat: -42.8821, lng: 147.3272 },
  'Pacific/Auckland': { lat: -36.8485, lng: 174.7633 },
  'Pacific/Honolulu': { lat: 21.3099, lng: -157.8581 },
  'Pacific/Fiji': { lat: -18.1416, lng: 178.4419 },
  'Africa/Cairo': { lat: 30.0444, lng: 31.2357 },
  'Africa/Johannesburg': { lat: -26.2041, lng: 28.0473 },
  'Africa/Lagos': { lat: 6.5244, lng: 3.3792 },
  'Africa/Nairobi': { lat: -1.2921, lng: 36.8219 },
  'Africa/Casablanca': { lat: 33.5731, lng: -7.5898 },
}

// Get approximate coordinates for a timezone
function getCoordinates(timeZone) {
  return TIMEZONE_COORDS[timeZone] || { lat: 0, lng: 0 }
}

// Calculate day of year
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Simplified sunrise/sunset calculation
// Based on approximate solar position calculations
function calculateSunTimes(date, lat, lng, timeZone) {
  const dayOfYear = getDayOfYear(date)
  
  // Solar declination (approximate)
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180)
  
  // Hour angle calculation
  const latRad = lat * Math.PI / 180
  const declRad = declination * Math.PI / 180
  
  // Calculate hour angle for sunrise/sunset
  const cosHourAngle = -Math.tan(latRad) * Math.tan(declRad)
  
  // Handle polar day/night
  if (cosHourAngle >= 1) {
    // Polar night (sun never rises)
    return { sunrise: null, sunset: null, isPolarNight: true }
  }
  if (cosHourAngle <= -1) {
    // Polar day (sun never sets)
    return { sunrise: null, sunset: null, isPolarDay: true }
  }
  
  const hourAngle = Math.acos(cosHourAngle) * 180 / Math.PI
  
  // Equation of time (approximate)
  const B = (360 / 365) * (dayOfYear - 81) * Math.PI / 180
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
  
  // Time offset from UTC for this longitude
  const timeOffset = lng / 15
  
  // Solar noon in local time (12:00 + equation of time + longitude offset)
  const solarNoon = 12 + (equationOfTime / 60) + timeOffset
  
  // Sunrise and sunset in hours (local time)
  const sunrise = solarNoon - (hourAngle / 15)
  const sunset = solarNoon + (hourAngle / 15)
  
  return { sunrise, sunset, isPolarNight: false, isPolarDay: false }
}

// Get current time in a specific timezone
function getTimeInTimezone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  })
  
  const parts = formatter.formatToParts(date)
  const hour = parseInt(parts.find(p => p.type === 'hour').value)
  const minute = parseInt(parts.find(p => p.type === 'minute').value)
  const second = parseInt(parts.find(p => p.type === 'second').value)
  
  return hour + minute / 60 + second / 3600
}

// Calculate darkness level (0 = full day, 1 = full night)
// Returns a value between 0 and 1
export function getDarknessLevel(timeZone) {
  const now = new Date()
  // Use coordinates for the display timezone (e.g., SF coordinates even if using LA timezone)
  const coords = getCoordinates(timeZone)
  
  // Import mapping dynamically to avoid circular dependency
  let actualTz = timeZone
  try {
    const { getActualTimezone } = require('./timeZoneMapping')
    actualTz = getActualTimezone(timeZone)
  } catch (e) {
    // Fallback if mapping not available
  }
  
  if (!coords.lat && !coords.lng) {
    // Fallback to simple hour-based calculation
    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: actualTz,
      hour: 'numeric',
      hour12: false
    }).format(now))
    
    if (hour >= 6 && hour < 20) return 0
    if (hour >= 20 || hour < 6) return 1
    return 0.5
  }
  
  const sunTimes = calculateSunTimes(now, coords.lat, coords.lng, actualTz)
  const currentHour = getTimeInTimezone(now, actualTz)
  
  // Handle polar regions
  if (sunTimes.isPolarNight) {
    return 1 // Always dark
  }
  if (sunTimes.isPolarDay) {
    return 0 // Always light
  }
  
  if (sunTimes.sunrise === null || sunTimes.sunset === null) {
    // Fallback
    if (currentHour >= 6 && currentHour < 20) return 0
    return 1
  }
  
  // Normalize times to 0-24 range
  const normSunrise = ((sunTimes.sunrise % 24) + 24) % 24
  const normSunset = ((sunTimes.sunset % 24) + 24) % 24
  
  // Calculate darkness with smooth transitions
  // Add 1.5 hours before sunrise and after sunset for twilight
  const twilightDuration = 1.5
  const dawnStart = normSunrise - twilightDuration
  const duskEnd = normSunset + twilightDuration
  
  let darkness = 1
  
  // Normalize to handle day/night cycle
  // Convert to a linear scale where we can easily calculate position
  const normalizeHour = (hour) => {
    if (hour < 0) return hour + 24
    if (hour >= 24) return hour - 24
    return hour
  }
  
  const normDawnStart = normalizeHour(dawnStart)
  const normDuskEnd = normalizeHour(duskEnd)
  
  // Determine which period we're in
  if (normSunrise < normSunset) {
    // Standard day: sunrise < sunset
    if (currentHour >= normSunrise && currentHour < normSunset) {
      // Full daylight
      darkness = 0
    } else if (currentHour >= normSunset) {
      // After sunset - evening/night
      if (normDuskEnd > normSunset) {
        // Twilight period (same day)
        if (currentHour < normDuskEnd) {
          darkness = (currentHour - normSunset) / twilightDuration
        } else {
          darkness = 1
        }
      } else {
        // Dusk wraps to next day
        if (currentHour < normDuskEnd) {
          darkness = (currentHour + 24 - normSunset) / (twilightDuration + 24 - normSunset + normDuskEnd)
        } else {
          darkness = 1
        }
      }
    } else {
      // Before sunrise - night/morning
      if (normDawnStart < normSunrise) {
        // Twilight period (same day)
        if (currentHour >= normDawnStart) {
          darkness = 1 - (currentHour - normDawnStart) / twilightDuration
        } else {
          darkness = 1
        }
      } else {
        // Dawn wraps from previous day
        if (currentHour >= normDawnStart - 24) {
          darkness = 1 - (currentHour - (normDawnStart - 24)) / twilightDuration
        } else {
          darkness = 1
        }
      }
    }
  } else {
    // Edge case (shouldn't happen in normal circumstances)
    darkness = 0.5
  }
  
  // Ensure darkness is between 0 and 1
  return Math.max(0, Math.min(1, darkness))
}

// Get RGB values for background based on darkness
export function getBackgroundColor(darkness) {
  // Interpolate from white (255, 255, 255) to black (0, 0, 0)
  const r = Math.round(255 * (1 - darkness))
  const g = Math.round(255 * (1 - darkness))
  const b = Math.round(255 * (1 - darkness))
  
  return `rgb(${r}, ${g}, ${b})`
}

// Get text color based on darkness (white for dark, black for light)
export function getTextColor(darkness) {
  return darkness > 0.5 ? '#ffffff' : '#000000'
}
