// Map display timezones to actual IANA timezones
// Some cities share timezones but we want to show them separately
export const TIMEZONE_MAPPING = {
  'America/San_Francisco': 'America/Los_Angeles', // SF uses LA timezone
}

// Get the actual IANA timezone for a given timezone identifier
export function getActualTimezone(timeZone) {
  return TIMEZONE_MAPPING[timeZone] || timeZone
}
