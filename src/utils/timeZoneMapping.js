// Map display timezones to actual IANA timezones
// Some cities share timezones but we want to show them separately
export const TIMEZONE_MAPPING = {
  'America/San_Francisco': 'America/Los_Angeles', // SF uses LA timezone
  'America/Seattle': 'America/Los_Angeles', // Seattle uses LA timezone
  'America/Portland': 'America/Los_Angeles', // Portland uses LA timezone
  'America/San_Diego': 'America/Los_Angeles',
  'America/Rio_de_Janeiro': 'America/Sao_Paulo', // Rio uses Sao Paulo timezone
  // Canada — separate labels for shared IANA zones
  'America/Montreal': 'America/Toronto',
  'America/Quebec_City': 'America/Toronto',
  'America/Ottawa': 'America/Toronto',
  'America/Calgary': 'America/Edmonton',
  'America/Victoria_BC': 'America/Vancouver',
  'Pacific/Hawaii': 'Pacific/Honolulu',
  // Australia
  'Australia/Canberra': 'Australia/Sydney',
  'Australia/Gold_Coast': 'Australia/Brisbane',
  // Japan (all JST)
  'Asia/Osaka': 'Asia/Tokyo',
  'Asia/Kyoto': 'Asia/Tokyo',
  'Asia/Yokohama': 'Asia/Tokyo',
  'Asia/Nagoya': 'Asia/Tokyo',
  'Asia/Fukuoka': 'Asia/Tokyo',
  'Asia/Sapporo': 'Asia/Tokyo',
  'Asia/Hiroshima': 'Asia/Tokyo',
  // India - all cities use Asia/Kolkata timezone
  'Asia/Delhi': 'Asia/Kolkata',
  'Asia/Mumbai': 'Asia/Kolkata',
  'Asia/Bangalore': 'Asia/Kolkata',
  'Asia/Chennai': 'Asia/Kolkata',
  'Asia/Hyderabad': 'Asia/Kolkata',
}

// Get the actual IANA timezone for a given timezone identifier
export function getActualTimezone(timeZone) {
  return TIMEZONE_MAPPING[timeZone] || timeZone
}
