// Curated city list for the search-box autocomplete (native <datalist>).
// Zero API cost, no client-exposed key — just a typo-reducing suggestion list.
// India-first (metros + tier-2) then global majors, since pricing is now global.
export const CITIES: string[] = [
  // India — metros
  "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Gurgaon", "Noida",
  // India — tier-2
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal",
  "Chandigarh", "Coimbatore", "Kochi", "Visakhapatnam", "Vadodara",
  "Nashik", "Patna", "Ludhiana", "Agra", "Varanasi", "Guwahati",
  "Bhubaneswar", "Mysore", "Mangalore", "Dehradun", "Goa",
  // USA
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Diego",
  "San Francisco", "Austin", "Seattle", "Dallas", "Boston", "Miami",
  "Atlanta", "Denver", "Portland", "Las Vegas", "San Jose",
  // Canada
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa",
  // UK & Ireland
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Edinburgh",
  "Bristol", "Liverpool", "Dublin",
  // Europe
  "Berlin", "Munich", "Hamburg", "Frankfurt", "Amsterdam", "Rotterdam",
  "Paris", "Lyon", "Madrid", "Barcelona", "Lisbon", "Rome", "Milan",
  "Zurich", "Vienna", "Stockholm", "Copenhagen", "Oslo", "Warsaw",
  // Middle East
  "Dubai", "Abu Dhabi", "Riyadh", "Doha",
  // Asia-Pacific
  "Singapore", "Kuala Lumpur", "Bangkok", "Jakarta", "Manila",
  "Ho Chi Minh City", "Tokyo", "Seoul", "Hong Kong",
  "Sydney", "Melbourne", "Brisbane", "Auckland",
];
