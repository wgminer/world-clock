// Timezone shorthand mapping (for URL encoding)
// Maps IANA timezone identifiers to short codes for URLs
export const TIMEZONE_SHORTHAND = {
  // North America
  'America/New_York': 'NYC',
  'America/Chicago': 'CHI',
  'America/Denver': 'DEN',
  'America/Los_Angeles': 'LA',
  'America/San_Francisco': 'SF',
  'America/Seattle': 'SEA',
  'America/Portland': 'PDX',
  'America/San_Diego': 'SAN',
  'America/Phoenix': 'PHX',
  'America/Anchorage': 'ANC',
  'Pacific/Honolulu': 'HNL',
  'Pacific/Hawaii': 'HAW',
  'America/Toronto': 'TOR',
  'America/Montreal': 'MTL',
  'America/Quebec_City': 'QBC',
  'America/Ottawa': 'YOW',
  'America/Halifax': 'HFX',
  'America/St_Johns': 'YYT',
  'America/Winnipeg': 'WPG',
  'America/Regina': 'YQR',
  'America/Edmonton': 'YEG',
  'America/Calgary': 'YYC',
  'America/Vancouver': 'VAN',
  'America/Victoria_BC': 'YYJ',
  'America/Mexico_City': 'MEX',
  // South America
  'America/Sao_Paulo': 'SP',
  'America/Rio_de_Janeiro': 'RIO',
  'America/Buenos_Aires': 'BA',
  'America/Argentina/Buenos_Aires': 'BA',
  'America/Bogota': 'BOG',
  'America/Caracas': 'CCS',
  'America/Lima': 'LIM',
  'America/Santiago': 'SCL',
  'America/Montevideo': 'MVD',
  'America/La_Paz': 'LPB',
  'America/Asuncion': 'ASU',
  'America/Guayaquil': 'GYE',
  'America/Georgetown': 'GEO',
  'America/Paramaribo': 'PBM',
  // Europe
  'Europe/London': 'LON',
  'Europe/Paris': 'PAR',
  'Europe/Berlin': 'BER',
  'Europe/Rome': 'ROM',
  'Europe/Madrid': 'MAD',
  'Europe/Amsterdam': 'AMS',
  'Europe/Stockholm': 'STO',
  'Europe/Moscow': 'MSK',
  'Europe/Athens': 'ATH',
  'Europe/Dublin': 'DUB',
  'Europe/Lisbon': 'LIS',
  'Europe/Prague': 'PRG',
  'Europe/Warsaw': 'WAW',
  'Europe/Zurich': 'ZUR',
  'Atlantic/Reykjavik': 'REK',
  // Middle East
  'Asia/Dubai': 'DXB',
  'Asia/Tel_Aviv': 'TLV',
  'Asia/Riyadh': 'RUH',
  'Asia/Kuwait': 'KWI',
  'Asia/Baghdad': 'BGW',
  // Asia - Major Cities
  'Asia/Tokyo': 'TYO',
  'Asia/Yokohama': 'YOK',
  'Asia/Osaka': 'OSA',
  'Asia/Kyoto': 'KYO',
  'Asia/Nagoya': 'NGO',
  'Asia/Fukuoka': 'FUK',
  'Asia/Sapporo': 'SPK',
  'Asia/Hiroshima': 'HIJ',
  'Asia/Seoul': 'SEL',
  'Asia/Shanghai': 'SHA',
  'Asia/Hong_Kong': 'HKG',
  'Asia/Singapore': 'SIN',
  'Asia/Bangkok': 'BKK',
  'Asia/Kuala_Lumpur': 'KUL',
  'Asia/Jakarta': 'JKT',
  'Asia/Manila': 'MNL',
  'Asia/Taipei': 'TPE',
  'Asia/Kolkata': 'CCU',
  'Asia/Karachi': 'KHI',
  'Asia/Dhaka': 'DAC',
  'Asia/Ho_Chi_Minh': 'SGN',
  'Asia/Delhi': 'DEL',
  'Asia/Mumbai': 'BOM',
  'Asia/Hanoi': 'HAN',
  'Asia/Bangalore': 'BLR',
  'Asia/Chennai': 'MAA',
  'Asia/Hyderabad': 'HYD',
  'Asia/Yangon': 'RGN',
  'Asia/Phnom_Penh': 'PNH',
  'Asia/Vientiane': 'VTE',
  'Asia/Brunei': 'BWN',
  'Asia/Dili': 'DIL',
  // Australia & Pacific
  'Australia/Sydney': 'SYD',
  'Australia/Melbourne': 'MEL',
  'Australia/Brisbane': 'BNE',
  'Australia/Canberra': 'CBR',
  'Australia/Gold_Coast': 'OOL',
  'Australia/Perth': 'PER',
  'Australia/Adelaide': 'ADL',
  'Australia/Darwin': 'DRW',
  'Australia/Hobart': 'HBA',
  'Pacific/Auckland': 'AKL',
  'Pacific/Fiji': 'SUV',
  // Africa
  'Africa/Cairo': 'CAI',
  'Africa/Johannesburg': 'JNB',
  'Africa/Lagos': 'LOS',
  'Africa/Nairobi': 'NBO',
  'Africa/Casablanca': 'CMN',
}

const TIMEZONE_DISPLAY_OVERRIDES = {
  'America/Victoria_BC': 'Victoria, BC',
}

// Reverse mapping: shorthand to full timezone
export const SHORTHAND_TO_TIMEZONE = Object.fromEntries(
  Object.entries(TIMEZONE_SHORTHAND).map(([tz, shorthand]) => [shorthand, tz])
)

// Get shorthand code for URL encoding
export function getTimezoneShorthand(timeZone) {
  return TIMEZONE_SHORTHAND[timeZone] || timeZone
}

// Get full city name for display
export function getTimezoneDisplayName(timeZone) {
  if (TIMEZONE_DISPLAY_OVERRIDES[timeZone]) {
    return TIMEZONE_DISPLAY_OVERRIDES[timeZone]
  }
  const parts = timeZone.split('/')
  const city = parts[parts.length - 1].replace(/_/g, ' ')
  
  // Capitalize each word
  return city.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

// Decode shorthand from URL to full timezone
export function decodeTimezoneFromShorthand(shorthand) {
  return SHORTHAND_TO_TIMEZONE[shorthand] || shorthand
}
