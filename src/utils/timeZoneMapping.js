// Map display timezones to actual IANA timezones
// Some cities share timezones but we want to show them separately
export const TIMEZONE_MAPPING = {
  'America/San_Francisco': 'America/Los_Angeles', // SF uses LA timezone
  'America/Seattle': 'America/Los_Angeles', // Seattle uses LA timezone
  'America/Portland': 'America/Los_Angeles', // Portland uses LA timezone
  'America/Rio_de_Janeiro': 'America/Sao_Paulo', // Rio uses Sao Paulo timezone
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
