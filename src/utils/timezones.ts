export interface TimezoneOption {
  id: string;
  label: string;
}

function formatLabel(tz: string): string {
  const parts = tz.split("/");
  const city = (parts[parts.length - 1] || "").replace(/_/g, " ");
  const region = parts[0].replace(/_/g, " ");
  return parts.length > 1 ? `${city} (${region})` : tz;
}

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const cityAliases: Record<string, string> = {
  "Gijón": "Europe/Madrid",
  "Barcelona": "Europe/Madrid",
  "Sevilla": "Europe/Madrid",
  "Seville": "Europe/Madrid",
  "Valencia": "Europe/Madrid",
  "Málaga": "Europe/Madrid",
  "Bilbao": "Europe/Madrid",
  "Zaragoza": "Europe/Madrid",
  "Murcia": "Europe/Madrid",
  "Palma": "Europe/Madrid",
  "Florence": "Europe/Rome",
  "Milan": "Europe/Rome",
  "Milano": "Europe/Rome",
  "Naples": "Europe/Rome",
  "Venice": "Europe/Rome",
  "Turin": "Europe/Rome",
  "Torino": "Europe/Rome",
  "Genoa": "Europe/Rome",
  "Bologna": "Europe/Rome",
  "Munich": "Europe/Berlin",
  "München": "Europe/Berlin",
  "Frankfurt": "Europe/Berlin",
  "Hamburg": "Europe/Berlin",
  "Cologne": "Europe/Berlin",
  "Köln": "Europe/Berlin",
  "Stuttgart": "Europe/Berlin",
  "Düsseldorf": "Europe/Berlin",
  "Leipzig": "Europe/Berlin",
  "Dresden": "Europe/Berlin",
  "Marseille": "Europe/Paris",
  "Lyon": "Europe/Paris",
  "Toulouse": "Europe/Paris",
  "Nice": "Europe/Paris",
  "Bordeaux": "Europe/Paris",
  "Strasbourg": "Europe/Paris",
  "Lille": "Europe/Paris",
  "Nantes": "Europe/Paris",
  "Montpellier": "Europe/Paris",
  "Osaka": "Asia/Tokyo",
  "Kyoto": "Asia/Tokyo",
  "Yokohama": "Asia/Tokyo",
  "Nagoya": "Asia/Tokyo",
  "Kobe": "Asia/Tokyo",
  "Sapporo": "Asia/Tokyo",
  "Fukuoka": "Asia/Tokyo",
  "Hiroshima": "Asia/Tokyo",
  "Shenzhen": "Asia/Shanghai",
  "Guangzhou": "Asia/Shanghai",
  "Beijing": "Asia/Shanghai",
  "Wuhan": "Asia/Shanghai",
  "Nanjing": "Asia/Shanghai",
  "Hangzhou": "Asia/Shanghai",
  "Chengdu": "Asia/Shanghai",
  "Mumbai": "Asia/Kolkata",
  "Bangalore": "Asia/Kolkata",
  "Bengaluru": "Asia/Kolkata",
  "Chennai": "Asia/Kolkata",
  "Hyderabad": "Asia/Kolkata",
  "Pune": "Asia/Kolkata",
  "Ahmedabad": "Asia/Kolkata",
  "Delhi": "Asia/Kolkata",
  "New Delhi": "Asia/Kolkata",
  "Jaipur": "Asia/Kolkata",
  "San Francisco": "America/Los_Angeles",
  "Seattle": "America/Los_Angeles",
  "Portland": "America/Los_Angeles",
  "Las Vegas": "America/Los_Angeles",
  "San Diego": "America/Los_Angeles",
  "Boston": "America/New_York",
  "Miami": "America/New_York",
  "Philadelphia": "America/New_York",
  "Atlanta": "America/New_York",
  "Washington DC": "America/New_York",
  "Washington": "America/New_York",
  "Baltimore": "America/New_York",
  "Orlando": "America/New_York",
  "Houston": "America/Chicago",
  "Dallas": "America/Chicago",
  "Austin": "America/Chicago",
  "San Antonio": "America/Chicago",
  "Minneapolis": "America/Chicago",
  "Milwaukee": "America/Chicago",
  "Nashville": "America/Chicago",
  "New Orleans": "America/Chicago",
  "Memphis": "America/Chicago",
  "St. Louis": "America/Chicago",
  "Manchester": "Europe/London",
  "Birmingham": "Europe/London",
  "Liverpool": "Europe/London",
  "Leeds": "Europe/London",
  "Glasgow": "Europe/London",
  "Edinburgh": "Europe/London",
  "Bristol": "Europe/London",
  "Cardiff": "Europe/London",
  "Belfast": "Europe/London",
  "Rotterdam": "Europe/Amsterdam",
  "The Hague": "Europe/Amsterdam",
  "Utrecht": "Europe/Amsterdam",
  "Antwerp": "Europe/Brussels",
  "Ghent": "Europe/Brussels",
  "Bruges": "Europe/Brussels",
  "Porto": "Europe/Lisbon",
  "Gothenburg": "Europe/Stockholm",
  "Malmö": "Europe/Stockholm",
  "Bergen": "Europe/Oslo",
  "Aarhus": "Europe/Copenhagen",
  "Kraków": "Europe/Warsaw",
  "Wrocław": "Europe/Warsaw",
  "Gdańsk": "Europe/Warsaw",
  "Thessaloniki": "Europe/Athens",
  "Melbourne": "Australia/Sydney",
  "Brisbane": "Australia/Brisbane",
  "Perth": "Australia/Perth",
  "Adelaide": "Australia/Adelaide",
  "Gold Coast": "Australia/Brisbane",
  "Canberra": "Australia/Sydney",
  "Cape Town": "Africa/Johannesburg",
  "Durban": "Africa/Johannesburg",
  "Marrakech": "Africa/Casablanca",
  "Fez": "Africa/Casablanca",
  "Mombasa": "Africa/Nairobi",
  "Busan": "Asia/Seoul",
  "Incheon": "Asia/Seoul",
  "Abu Dhabi": "Asia/Dubai",
  "Sharjah": "Asia/Dubai",
  "Jeddah": "Asia/Riyadh",
  "Mecca": "Asia/Riyadh",
  "Medina": "Asia/Riyadh",
  "Guadalajara": "America/Mexico_City",
  "Monterrey": "America/Monterrey",
  "Cancún": "America/Cancun",
  "Medellín": "America/Bogota",
  "Cali": "America/Bogota",
  "Rio de Janeiro": "America/Sao_Paulo",
  "Brasília": "America/Sao_Paulo",
  "Salvador": "America/Bahia",
  "Córdoba": "America/Argentina/Cordoba",
  "Rosario": "America/Argentina/Cordoba",
  "Valparaíso": "America/Santiago",
  "Montevideo": "America/Montevideo",
};

const aliasTimezones: TimezoneOption[] = Object.entries(cityAliases).map(
  ([city, id]) => ({ id, label: `${city} (${id.split("/")[0].replace(/_/g, " ")})` })
);

export const allTimezones: TimezoneOption[] = [
  ...Intl.supportedValuesOf("timeZone").map((id) => ({ id, label: formatLabel(id) })),
  ...aliasTimezones,
];

export function searchTimezones(query: string): TimezoneOption[] {
  const q = normalize(query);
  if (!q) return [];
  const seen = new Set<string>();
  return allTimezones
    .filter((tz) => {
      if (!normalize(tz.label).includes(q)) return false;
      if (seen.has(tz.id)) return false;
      seen.add(tz.id);
      return true;
    })
    .slice(0, 50);
}

export function formatTime(timezone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(timezone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
