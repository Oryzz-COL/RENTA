// One source of truth. Keep unconfirmed facts null; never substitute invented claims.
export const property = {
  brand: 'The Bogotá residence', // Working title, replace after naming approval.
  preview: true,
  minimumMonths: 1,
  maximumMonths: 12,
  whatsapp: null, // International digits only, e.g. 573001234567, once verified.
  email: null,
  address: null,
  mapUrl: null,
  legalOwner: null,
  privacyEmail: null,
  photos: [
    { src: '/assets/living.jpg', category: 'living', es: 'Luz, espacio y una pausa', en: 'Light, space, and a little stillness', credit: 'Unsplash · photo-1600210492486-724fe5c67fb0' },
    { src: '/assets/bedroom.jpg', category: 'rest', es: 'Un lugar para desconectar', en: 'Room to switch off', credit: 'Unsplash · photo-1611892440504-42a792e24d32' },
    { src: '/assets/kitchen.jpg', category: 'living', es: 'Lo cotidiano, a tu manera', en: 'Everyday rituals, your way', credit: 'Unsplash · photo-1556912172-45b7abe8b7e1' },
    { src: '/assets/details.jpg', category: 'details', es: 'Los detalles hacen hogar', en: 'The details that feel like home', credit: 'Unsplash · photo-1494438639946-1ebd1d20bf85' }
  ]
};
