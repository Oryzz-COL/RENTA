// One source of truth. Keep unconfirmed facts null or flagged; never substitute invented claims.
export const property = {
  brand: 'Smart Studio',
  preview: true,
  minimumNights: 30,
  maximumMonths: 12,
  proposedRateUSD: 1100, // Proposed introductory rate from the owner's concept. Not final.
  whatsapp: null, // International digits only, e.g. 573001234567, once verified.
  email: null,
  address: 'Torre Medina, Cra. 11 #134-27, Bogotá',
  // Mapbox public token (starts with pk.). Restrict it to the site's URLs in account.mapbox.com.
  // Leave null to use the no-account MapLibre + OpenFreeMap fallback.
  mapboxToken: null, // Injected from MAPBOX_TOKEN (.env or hosting env) by scripts/serve.mjs and scripts/build.mjs.
  // Satellite tiles need a payment method on the Mapbox account (the free tier still applies). Set true once added.
  mapboxSatellite: false,
  legalOwner: null,
  privacyEmail: null,
  // Pin from Mapbox geocoding of "Carrera 11 134-27" (interpolated address). Confirm on site before launch.
  location: { lng: -74.0368, lat: 4.7145, approximate: true },
  photos: [
    { src: '/assets/living.jpg', en: 'Living and lounge', es: 'Sala y descanso' },
    { src: '/assets/bedroom.jpg', en: 'Bed, ready to rest', es: 'La cama, lista para descansar' },
    { src: '/assets/kitchen.jpg', en: 'Equipped kitchen', es: 'Cocina equipada' },
    { src: '/assets/workspace.jpg', en: 'Room to work', es: 'Espacio para trabajar' },
    { src: '/assets/bathroom.jpg', en: 'Bathroom', es: 'Baño' },
    { src: '/assets/studio.jpg', en: 'Day mode', es: 'Modo día' },
    { src: '/assets/kitchen2.jpg', en: 'Morning coffee corner', es: 'Rincón del café' },
    { src: '/assets/details.jpg', en: 'Calm details', es: 'Detalles en calma' }
  ]
};

// Points of interest, coordinates from OpenStreetMap (Nominatim) in November 2026.
// Distances on the page are straight-line estimates computed from property.location.
export const placeCategories = ['everyday', 'study', 'health', 'parks', 'food', 'shopping', 'transport'];
export const places = [
  { id: 'country', cat: 'parks', name: 'Country Club de Bogotá', lng: -74.0362, lat: 4.7128, en: 'Green views across the street', es: 'Vista verde al frente' },
  { id: 'exito', cat: 'everyday', name: 'Éxito Calle 134', lng: -74.0341, lat: 4.7123, en: 'Large supermarket', es: 'Supermercado grande' },
  { id: 'carulla', cat: 'everyday', name: 'Carulla Cra. 11', lng: -74.0356, lat: 4.7194, en: 'Supermarket', es: 'Supermercado' },
  { id: 'farmatodo', cat: 'everyday', name: 'Farmatodo Calle 140', lng: -74.0322, lat: 4.7174, en: 'Pharmacy and essentials', es: 'Farmacia y básicos' },
  { id: 'oxxo', cat: 'everyday', name: 'Oxxo Calle 140', lng: -74.0400, lat: 4.7210, en: 'Convenience store', es: 'Tienda de conveniencia' },
  { id: 'bosque', cat: 'study', name: 'Universidad El Bosque', lng: -74.0314, lat: 4.7107, en: 'University campus', es: 'Campus universitario' },
  { id: 'santafe', cat: 'health', name: 'Fundación Santa Fe de Bogotá', lng: -74.0329, lat: 4.6966, en: 'Major hospital', es: 'Hospital de referencia' },
  { id: 'oftalmo', cat: 'health', name: 'Instituto Nacional de Oftalmología', lng: -74.0293, lat: 4.7035, en: 'Eye clinic', es: 'Clínica oftalmológica' },
  { id: 'ginebra', cat: 'parks', name: 'Parque Ginebra Norte', lng: -74.0290, lat: 4.7091, en: 'Neighborhood park', es: 'Parque de barrio' },
  { id: 'bellasuiza', cat: 'parks', name: 'Parque Bella Suiza', lng: -74.0318, lat: 4.7048, en: 'Park and green walks', es: 'Parque y caminatas' },
  { id: 'bodytech', cat: 'parks', name: 'Bodytech Calle 138', lng: -74.0346, lat: 4.7175, en: 'Gym', es: 'Gimnasio' },
  { id: 'c140', cat: 'food', name: 'Calle 140', lng: -74.0385, lat: 4.7204, en: 'Restaurants and cafés', es: 'Restaurantes y cafés' },
  { id: 'jv138', cat: 'food', name: 'Juan Valdez Calle 138', lng: -74.0293, lat: 4.7154, en: 'Colombian coffee', es: 'Café colombiano' },
  { id: 'usaquen', cat: 'food', name: 'Usaquén', lng: -74.0309, lat: 4.6952, en: 'Historic square, Sunday market', es: 'Plaza histórica y mercado dominical' },
  { id: 'unicentro', cat: 'shopping', name: 'Unicentro', lng: -74.0413, lat: 4.7022, en: 'Shopping mall', es: 'Centro comercial' },
  { id: 'puertasol', cat: 'shopping', name: 'C.C. Puerta del Sol', lng: -74.0365, lat: 4.7197, en: 'Shopping center', es: 'Centro comercial' },
  { id: 'palatino', cat: 'shopping', name: 'C.C. Palatino', lng: -74.0293, lat: 4.7157, en: 'Shopping center', es: 'Centro comercial' },
  { id: 'busav9', cat: 'transport', name: 'Av. Carrera 9 bus stop', lng: -74.0325, lat: 4.7118, en: 'City bus (SITP) on Av. 9', es: 'Paradero SITP en la Av. 9' }
];
