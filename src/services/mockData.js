
// Mock data for development

// Mock hotels
const mockHotels = [
  {
    _id: 'hotel1',
    name: 'Luxury Resort',
    description: 'Beautiful resort with ocean views',
    city: 'Miami',
    address: '123 Beach Dr',
    distance: '2km from city center',
    photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    rating: 4.8,
    price: 250,
    featured: true
  },
  {
    _id: 'hotel2',
    name: 'Downtown Suites',
    description: 'Modern suites in the heart of downtown',
    city: 'New York',
    address: '456 City Ave',
    distance: '0.5km from city center',
    photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
    rating: 4.5,
    price: 180,
    featured: true
  },
  {
    _id: 'hotel3',
    name: 'Mountain View Lodge',
    description: 'Cozy lodge with stunning mountain views',
    city: 'Denver',
    address: '789 Mountain Rd',
    distance: '5km from city center',
    photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
    rating: 4.7,
    price: 200,
    featured: false
  }
];

// Mock rooms
const mockRooms = [
  {
    _id: 'room1',
    name: 'Deluxe Suite',
    description: 'Spacious suite with ocean view',
    maxPeople: 2,
    price: 250,
    amenities: ['King Bed', 'Balcony', 'Mini Bar', 'Jacuzzi'],
    photos: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
    hotelId: 'hotel1',
    available: true
  },
  {
    _id: 'room2',
    name: 'Executive Room',
    description: 'Elegant room with city view',
    maxPeople: 2,
    price: 180,
    amenities: ['Queen Bed', 'Work Desk', 'Coffee Maker'],
    photos: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a'],
    hotelId: 'hotel2',
    available: true
  },
  {
    _id: 'room3',
    name: 'Family Suite',
    description: 'Perfect for families with children',
    maxPeople: 4,
    price: 300,
    amenities: ['2 Queen Beds', 'Sofa Bed', 'Kitchenette', 'Game Console'],
    photos: ['https://images.unsplash.com/photo-1540518614846-7eded433c457'],
    hotelId: 'hotel1',
    available: true
  }
];

// Mock bookings
const mockBookings = [
  {
    _id: 'booking1',
    hotel: {
      _id: 'hotel1',
      name: 'Luxury Resort',
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945']
    },
    room: {
      _id: 'room1',
      name: 'Deluxe Suite',
    },
    dateStart: new Date('2023-07-10'),
    dateEnd: new Date('2023-07-15'),
    price: 1250,
    status: 'confirmed'
  },
  {
    _id: 'booking2',
    hotel: {
      _id: 'hotel2',
      name: 'Downtown Suites',
      photos: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa']
    },
    room: {
      _id: 'room2',
      name: 'Executive Room',
    },
    dateStart: new Date('2023-08-20'),
    dateEnd: new Date('2023-08-25'),
    price: 900,
    status: 'pending'
  }
];

// Mock users
const mockUsers = [
  {
    _id: 'user1',
    username: 'johndoe',
    email: 'user@example.com',
    country: 'USA',
    city: 'New York',
    phone: '+1234567890',
    isAdmin: false,
    isModerator: false,
    isWorker: false
  },
  {
    _id: 'user2',
    username: 'adminuser',
    email: 'admin@example.com',
    country: 'USA',
    city: 'Chicago',
    phone: '+1987654321',
    isAdmin: true,
    isModerator: false,
    isWorker: false
  },
  {
    _id: 'user3',
    username: 'moderator',
    email: 'mod@example.com',
    country: 'Canada',
    city: 'Toronto',
    phone: '+1456789123',
    isAdmin: false,
    isModerator: true,
    isWorker: false
  },
  {
    _id: 'user4',
    username: 'worker',
    email: 'worker@example.com',
    country: 'UK',
    city: 'London',
    phone: '+4412345678',
    isAdmin: false,
    isModerator: false,
    isWorker: true
  }
];

// Export mock services
export const mockServices = {
  // Hotel services
  getAllHotels: async () => mockHotels,
  getHotelById: async (id) => mockHotels.find(hotel => hotel._id === id) || mockHotels[0],
  getFeaturedHotels: async () => mockHotels.filter(hotel => hotel.featured),
  
  // Room services
  getRoomsForHotel: async (hotelId) => mockRooms.filter(room => room.hotelId === hotelId),
  getRoomById: async (id) => mockRooms.find(room => room._id === id) || mockRooms[0],
  
  // Booking services
  getUserBookings: async (userId) => mockBookings,
  getBookingById: async (id) => mockBookings.find(booking => booking._id === id) || mockBookings[0],
  createBooking: async (bookingData) => ({
    _id: 'new-booking-id',
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date()
  }),
  cancelBooking: async (id) => ({
    _id: id,
    status: 'cancelled',
    cancellationDate: new Date()
  }),
  
  // User services
  getUserById: async (id) => mockUsers.find(user => user._id === id) || mockUsers[0],
  getAllUsers: async () => mockUsers
};

export default mockServices;
