import { Guest, GuestPastStay, GuestRoomPreferences } from '../types/index.ts';

export const GUEST_PROFILES_DATA: Record<string, {
  vipTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  memberSince: string;
  totalStaysCount: number;
  totalNightsCount: number;
  lifetimeSpend: number;
  roomPreferences: GuestRoomPreferences;
  pastStays: GuestPastStay[];
}> = {
  'John Smith': {
    vipTier: 'GOLD',
    memberSince: 'March 2023',
    totalStaysCount: 5,
    totalNightsCount: 14,
    lifetimeSpend: 14850,
    roomPreferences: {
      preferredRoomCategory: 'Deluxe King Suite',
      floorPreference: 'High Floor (Floor 5), Corner unit away from elevators',
      bedAndPillow: '1 King Bed, 2 Firm Feather Pillows + 2 Memory Foam',
      temperaturePreference: '20.5°C / 69.0°F',
      minibarAndDining: [
        'San Pellegrino Sparkling (500ml)',
        'Fresh Green Apples',
        'Nespresso Ristretto Pods',
        'Roasted Salted Almonds'
      ],
      specialRequests: [
        'Late check-out requested (02:00 PM)',
        'Extra plush bath sheets in bathroom',
        'Quiet room facing the inner marina horizon'
      ],
      dietaryRestrictions: ['Low sodium', 'Lactose conscious (Oat milk only)'],
      allergies: ['No shellfish in in-room dining'],
      notes: 'Frequent C-suite business traveler with Apex Global Partners. Prefers express digital invoicing and early morning gym access.'
    },
    pastStays: [
      {
        id: 'stay-js-1',
        bookingReference: '#RES-45872',
        roomNumber: '502',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: 850,
        roomTotal: 1700,
        extrasTotal: 180,
        totalSpend: 1880,
        status: 'CHECKED_IN',
        chargesSummary: [
          { category: 'Room Charge', description: 'Room 502 (2 Nights)', amount: 1700 },
          { category: 'In-Room Dining', description: 'Executive Breakfast & Coffee', amount: 180 }
        ]
      },
      {
        id: 'stay-js-2',
        bookingReference: '#RES-41290',
        roomNumber: '508',
        roomCategory: 'Deluxe Room',
        checkInDate: '18 Aug 2025',
        checkOutDate: '22 Aug 2025',
        nights: 4,
        ratePerNight: 850,
        roomTotal: 3400,
        extrasTotal: 720,
        totalSpend: 4120,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Room Charge', description: 'Room 508 (4 Nights)', amount: 3400 },
          { category: 'In-Room Dining', description: 'Club Sandwich & Fresh Juices', amount: 360 },
          { category: 'Laundry & Pressing', description: 'Suit & Shirt Express Press', amount: 360 }
        ]
      },
      {
        id: 'stay-js-3',
        bookingReference: '#RES-38144',
        roomNumber: '518',
        roomCategory: 'Grand Suite',
        checkInDate: '05 Jun 2025',
        checkOutDate: '08 Jun 2025',
        nights: 3,
        ratePerNight: 1200,
        roomTotal: 3600,
        extrasTotal: 760,
        totalSpend: 4360,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Suite Charge', description: 'Grand Suite 518 (3 Nights)', amount: 3600 },
          { category: 'Spa & Wellness', description: 'Deep Tissue Massage (60 min)', amount: 450 },
          { category: 'Minibar', description: 'Sparkling Water & Gourmet Nuts', amount: 310 }
        ]
      },
      {
        id: 'stay-js-4',
        bookingReference: '#RES-34012',
        roomNumber: '402',
        roomCategory: 'Deluxe Room',
        checkInDate: '12 Jan 2025',
        checkOutDate: '15 Jan 2025',
        nights: 3,
        ratePerNight: 850,
        roomTotal: 2550,
        extrasTotal: 430,
        totalSpend: 2980,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Room Charge', description: 'Room 402 (3 Nights)', amount: 2550 },
          { category: 'Transportation', description: 'VIP Airport Chauffeur', amount: 430 }
        ]
      },
      {
        id: 'stay-js-5',
        bookingReference: '#RES-29801',
        roomNumber: '305',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Nov 2024',
        checkOutDate: '16 Nov 2024',
        nights: 2,
        ratePerNight: 750,
        roomTotal: 1500,
        extrasTotal: 190,
        totalSpend: 1690,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Room Charge', description: 'Room 305 (2 Nights)', amount: 1500 },
          { category: 'Dining', description: 'Horizon Bistro Dinner', amount: 190 }
        ]
      }
    ]
  },
  'Emma Wilson': {
    vipTier: 'PLATINUM',
    memberSince: 'November 2022',
    totalStaysCount: 8,
    totalNightsCount: 23,
    lifetimeSpend: 28400,
    roomPreferences: {
      preferredRoomCategory: 'Grand Executive Suite',
      floorPreference: 'Top floor with panoramic city sunrise view',
      bedAndPillow: 'King Plush with 100% Hungarian Goose Down Pillows',
      temperaturePreference: '21.0°C / 70.0°F',
      minibarAndDining: [
        'Evian Natural Spring Water',
        'English Breakfast Organic Tea',
        'Belgian Dark Chocolate 85%',
        'Artisan Avocado Toast'
      ],
      specialRequests: [
        'Daily morning Financial Times outside door',
        'Turndown service at 20:00 sharp with fresh lavender mist',
        'Eco yoga mat and wellness blocks placed in suite'
      ],
      dietaryRestrictions: ['Gluten-free', 'Pescatarian'],
      allergies: ['Peanut sensitivity'],
      notes: 'EuroCorp Senior Vice President. Highly values discreet service and privacy.'
    },
    pastStays: [
      {
        id: 'stay-ew-1',
        bookingReference: '#RES-45873',
        roomNumber: '505',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '17 Oct 2025',
        nights: 3,
        ratePerNight: 850,
        roomTotal: 2550,
        extrasTotal: 300,
        totalSpend: 2850,
        status: 'CHECKED_IN',
        chargesSummary: [
          { category: 'Room Charge', description: 'Room 505 (3 Nights)', amount: 2550 },
          { category: 'Room Service', description: 'Organic Tea & Fruit Platter', amount: 300 }
        ]
      },
      {
        id: 'stay-ew-2',
        bookingReference: '#RES-42104',
        roomNumber: '523',
        roomCategory: 'Suite',
        checkInDate: '02 Sep 2025',
        checkOutDate: '06 Sep 2025',
        nights: 4,
        ratePerNight: 1200,
        roomTotal: 4800,
        extrasTotal: 1000,
        totalSpend: 5800,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Suite Charge', description: 'Suite 523 (4 Nights)', amount: 4800 },
          { category: 'Spa', description: 'Signature Aromatherapy Ritual', amount: 650 },
          { category: 'Dining', description: 'Private Dining Service', amount: 350 }
        ]
      },
      {
        id: 'stay-ew-3',
        bookingReference: '#RES-39822',
        roomNumber: '518',
        roomCategory: 'Grand Suite',
        checkInDate: '14 Jul 2025',
        checkOutDate: '19 Jul 2025',
        nights: 5,
        ratePerNight: 1200,
        roomTotal: 6000,
        extrasTotal: 1200,
        totalSpend: 7200,
        status: 'COMPLETED',
        chargesSummary: [
          { category: 'Suite Charge', description: 'Grand Suite 518 (5 Nights)', amount: 6000 },
          { category: 'Culinary', description: 'Chef Tasting Menu for 2', amount: 1200 }
        ]
      }
    ]
  },
  'Robert Chen': {
    vipTier: 'GOLD',
    memberSince: 'January 2024',
    totalStaysCount: 4,
    totalNightsCount: 10,
    lifetimeSpend: 11200,
    roomPreferences: {
      preferredRoomCategory: 'Deluxe Ocean Horizon',
      floorPreference: 'Floor 5, quiet north wing',
      bedAndPillow: 'Firm Orthopedic Mattress, Ergonomic Contour Pillow',
      temperaturePreference: '19.5°C / 67.0°F',
      minibarAndDining: [
        'Jasmine Green Tea (Loose leaf)',
        'Perrier Sparkling Lime',
        'Roasted Macadamia Nuts'
      ],
      specialRequests: [
        'External HDMI 4K monitor and desk setup for laptop',
        'Early morning automated wake-up call at 06:30 AM'
      ],
      dietaryRestrictions: ['Low glycemic'],
      notes: 'Managing Director of Apex Ventures Singapore. Prefers quiet working environment and late afternoon pool access.'
    },
    pastStays: [
      {
        id: 'stay-rc-1',
        bookingReference: '#RES-45874',
        roomNumber: '508',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: 850,
        roomTotal: 1700,
        extrasTotal: 120,
        totalSpend: 1820,
        status: 'CHECKED_IN'
      },
      {
        id: 'stay-rc-2',
        bookingReference: '#RES-40112',
        roomNumber: '502',
        roomCategory: 'Deluxe Room',
        checkInDate: '10 Aug 2025',
        checkOutDate: '13 Aug 2025',
        nights: 3,
        ratePerNight: 850,
        roomTotal: 2550,
        extrasTotal: 480,
        totalSpend: 3030,
        status: 'COMPLETED'
      }
    ]
  },
  'Maria Garcia': {
    vipTier: 'SILVER',
    memberSince: 'May 2024',
    totalStaysCount: 3,
    totalNightsCount: 7,
    lifetimeSpend: 7450,
    roomPreferences: {
      preferredRoomCategory: 'Deluxe Room with Ocean Terrace',
      floorPreference: 'Floor 4 or 5',
      bedAndPillow: 'Medium-Plush King Bed, 100% Silk Pillowcases',
      temperaturePreference: '22.0°C / 71.6°F',
      minibarAndDining: [
        'Freixenet Vintage Cava',
        'Artisan Cheese & Iberico Tapas',
        'Still Artesian Mineral Water'
      ],
      specialRequests: [
        'Afternoon room service replenishment around 16:00',
        'Balcony terrace loungers prepared with cushions'
      ],
      notes: 'Design curator for Iberia Lux. Loves natural light and architectural interior aesthetics.'
    },
    pastStays: [
      {
        id: 'stay-mg-1',
        bookingReference: '#RES-45875',
        roomNumber: '510',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: 850,
        roomTotal: 1700,
        extrasTotal: 240,
        totalSpend: 1940,
        status: 'CHECKED_IN'
      }
    ]
  },
  'David Kim': {
    vipTier: 'SILVER',
    memberSince: 'July 2024',
    totalStaysCount: 3,
    totalNightsCount: 6,
    lifetimeSpend: 5600,
    roomPreferences: {
      preferredRoomCategory: 'Standard or Deluxe Room',
      floorPreference: 'Floor 5, elevator proximate',
      bedAndPillow: 'Medium-Firm Bed, Buckwheat or Firm Pillows',
      temperaturePreference: '21.0°C / 70.0°F',
      minibarAndDining: ['Iced Americano', 'Sparkling Water', 'Protein snack bars'],
      specialRequests: ['High-speed LAN Ethernet connection cable at work desk'],
      notes: 'Software architect from Seoul Tech Hub. Frequent business traveler.'
    },
    pastStays: [
      {
        id: 'stay-dk-1',
        bookingReference: '#RES-45876',
        roomNumber: '514',
        roomCategory: 'Standard Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: 650,
        roomTotal: 1300,
        extrasTotal: 150,
        totalSpend: 1450,
        status: 'CHECKED_IN'
      }
    ]
  },
  'Lisa Brown': {
    vipTier: 'PLATINUM',
    memberSince: 'August 2021',
    totalStaysCount: 12,
    totalNightsCount: 34,
    lifetimeSpend: 46200,
    roomPreferences: {
      preferredRoomCategory: 'Presidential / Grand Suite',
      floorPreference: 'Floor 5 Corner Suite (Panoramic Sunset view)',
      bedAndPillow: 'Featherbed topper with Lavender-scented aromatherapy pillow mist',
      temperaturePreference: '21.0°C / 70.0°F',
      minibarAndDining: [
        'Veuve Clicquot Yellow Label Champagne',
        'Truffle Cashews & Artisan Macarons',
        'San Pellegrino Sparkling Water'
      ],
      specialRequests: [
        'Direct VIP escort upon arrival, zero waiting at desk',
        'Complimentary luxury chauffeur service to Dubai International Airport (DXB)',
        'Full suite fruit basket replenished daily with exotic fruits'
      ],
      dietaryRestrictions: ['Vegetarian', 'Gluten-free on request'],
      notes: 'Managing Partner at Global Capital. VIP tier member for 4 consecutive years.'
    },
    pastStays: [
      {
        id: 'stay-lb-1',
        bookingReference: '#RES-45877',
        roomNumber: '518',
        roomCategory: 'Grand Suite',
        checkInDate: '14 Oct 2025',
        checkOutDate: '17 Oct 2025',
        nights: 3,
        ratePerNight: 1200,
        roomTotal: 3600,
        extrasTotal: 1450,
        totalSpend: 5050,
        status: 'CHECKED_IN',
        chargesSummary: [
          { category: 'Suite Charge', description: 'Grand Suite 518 (3 Nights)', amount: 3600 },
          { category: 'Beverage & Minibar', description: 'Champagne & Wine Service', amount: 850 },
          { category: 'Spa & Wellness', description: 'Couples Spa Package', amount: 600 }
        ]
      },
      {
        id: 'stay-lb-2',
        bookingReference: '#RES-41880',
        roomNumber: '518',
        roomCategory: 'Grand Suite',
        checkInDate: '10 Aug 2025',
        checkOutDate: '15 Aug 2025',
        nights: 5,
        ratePerNight: 1200,
        roomTotal: 6000,
        extrasTotal: 1800,
        totalSpend: 7800,
        status: 'COMPLETED'
      },
      {
        id: 'stay-lb-3',
        bookingReference: '#RES-37540',
        roomNumber: '523',
        roomCategory: 'Suite',
        checkInDate: '22 Mar 2025',
        checkOutDate: '27 Mar 2025',
        nights: 5,
        ratePerNight: 1200,
        roomTotal: 6000,
        extrasTotal: 1400,
        totalSpend: 7400,
        status: 'COMPLETED'
      }
    ]
  },
  'Ahmed Ali': {
    vipTier: 'GOLD',
    memberSince: 'September 2023',
    totalStaysCount: 6,
    totalNightsCount: 16,
    lifetimeSpend: 18900,
    roomPreferences: {
      preferredRoomCategory: 'Deluxe Ocean Suite',
      floorPreference: 'Floor 5, east facing morning light',
      bedAndPillow: 'King Plush with firm goose feather pillows',
      temperaturePreference: '20.0°C / 68.0°F',
      minibarAndDining: [
        'Arabic Coffee (Gahwa) with Medjool Dates',
        'Pellegrino Sparkling Water',
        'Fresh Mint & Lemonade'
      ],
      specialRequests: [
        'Prayer mat and Qibla indicator in room',
        'Arabic daily newspaper provided daily'
      ],
      dietaryRestrictions: ['100% Halal certified dining'],
      notes: 'Senior Executive at Emirates Holding. Regular monthly guest.'
    },
    pastStays: [
      {
        id: 'stay-aa-1',
        bookingReference: '#RES-45878',
        roomNumber: '520',
        roomCategory: 'Deluxe Room',
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: 850,
        roomTotal: 1700,
        extrasTotal: 220,
        totalSpend: 1920,
        status: 'CHECKED_IN'
      }
    ]
  },
  'Sophie Martin': {
    vipTier: 'PLATINUM',
    memberSince: 'February 2022',
    totalStaysCount: 9,
    totalNightsCount: 26,
    lifetimeSpend: 35900,
    roomPreferences: {
      preferredRoomCategory: 'Penthouse / Ocean Suite',
      floorPreference: 'Floor 5 Corner',
      bedAndPillow: 'Hypoallergenic King Plush with silk bolsters',
      temperaturePreference: '20.5°C / 69.0°F',
      minibarAndDining: [
        'French Roast French Press Coffee',
        'Fresh Baked Butter Croissants',
        'Perrier Sparkling Water',
        'Dark Cacao Truffles'
      ],
      specialRequests: [
        'Fresh white lilies in suite upon arrival',
        'Professional steam iron and board provided in suite',
        'Daily luxury turndown at 19:30'
      ],
      notes: 'Creative Director of Elysée Parfums Paris. Frequently hosts executive clients.'
    },
    pastStays: [
      {
        id: 'stay-sm-1',
        bookingReference: '#RES-45879',
        roomNumber: '523',
        roomCategory: 'Suite',
        checkInDate: '14 Oct 2025',
        checkOutDate: '18 Oct 2025',
        nights: 4,
        ratePerNight: 1200,
        roomTotal: 4800,
        extrasTotal: 1650,
        totalSpend: 6450,
        status: 'CHECKED_IN'
      },
      {
        id: 'stay-sm-2',
        bookingReference: '#RES-41550',
        roomNumber: '523',
        roomCategory: 'Suite',
        checkInDate: '01 Jun 2025',
        checkOutDate: '06 Jun 2025',
        nights: 5,
        ratePerNight: 1200,
        roomTotal: 6000,
        extrasTotal: 1900,
        totalSpend: 7900,
        status: 'COMPLETED'
      }
    ]
  }
};

/**
 * Helper to get default preferences and past stays if guest is not in static map
 */
export function getGuestProfileEnrichment(guestName: string, category: string, roomPrice: number) {
  if (GUEST_PROFILES_DATA[guestName]) {
    return GUEST_PROFILES_DATA[guestName];
  }

  // Generates realistic profile for any other guest
  const isVip = category === 'SUITE' || roomPrice > 1000;
  return {
    vipTier: (isVip ? 'GOLD' : 'SILVER') as 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM',
    memberSince: 'January 2024',
    totalStaysCount: 3,
    totalNightsCount: 7,
    lifetimeSpend: roomPrice * 7 + 650,
    roomPreferences: {
      preferredRoomCategory: category === 'SUITE' ? 'Grand Suite' : 'Deluxe King',
      floorPreference: 'High Floor, quiet wing away from lifts',
      bedAndPillow: 'King Bed with dual medium-firm feather pillows',
      temperaturePreference: '21.0°C / 70.0°F',
      minibarAndDining: ['Mineral Water', 'Espresso Pods', 'Assorted Artisan Nuts'],
      specialRequests: ['Late check-out on departure day if available', 'Extra bath towels'],
      dietaryRestrictions: ['None'],
      notes: 'Valued guest. Prefers prompt digital communication and seamless express check-out.'
    },
    pastStays: [
      {
        id: `stay-${guestName.replace(/\s+/g, '').toLowerCase()}-1`,
        bookingReference: `#RES-${Math.floor(40000 + Math.random() * 9000)}`,
        roomNumber: '502',
        roomCategory: category,
        checkInDate: '14 Oct 2025',
        checkOutDate: '16 Oct 2025',
        nights: 2,
        ratePerNight: roomPrice,
        roomTotal: roomPrice * 2,
        extrasTotal: 250,
        totalSpend: roomPrice * 2 + 250,
        status: 'CHECKED_IN' as const
      },
      {
        id: `stay-${guestName.replace(/\s+/g, '').toLowerCase()}-2`,
        bookingReference: `#RES-${Math.floor(30000 + Math.random() * 9000)}`,
        roomNumber: '408',
        roomCategory: category,
        checkInDate: '10 Aug 2025',
        checkOutDate: '13 Aug 2025',
        nights: 3,
        ratePerNight: roomPrice,
        roomTotal: roomPrice * 3,
        extrasTotal: 400,
        totalSpend: roomPrice * 3 + 400,
        status: 'COMPLETED' as const
      }
    ]
  };
}
