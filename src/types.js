
/**
 * Hotel object type
 * @typedef {Object} Hotel
 * @property {string} _id - Hotel unique identifier
 * @property {string} name - Hotel name
 * @property {string} description - Hotel description
 * @property {string} city - City where the hotel is located
 * @property {string} address - Hotel address
 * @property {string} distance - Distance from city center
 * @property {Array<string>} photos - Array of photo URLs
 * @property {number} rating - Hotel rating (0-5)
 * @property {number} price - Base price per night
 * @property {boolean} featured - Whether hotel is featured
 */

/**
 * Room object type
 * @typedef {Object} Room
 * @property {string} _id - Room unique identifier
 * @property {string} name - Room type name
 * @property {string} description - Room description
 * @property {number} maxPeople - Maximum number of people
 * @property {number} price - Room price per night
 * @property {Array<string>} amenities - List of amenities
 * @property {Array<string>} photos - Array of photo URLs
 * @property {boolean} available - Whether room is available
 * @property {string} hotelId - ID of the hotel this room belongs to
 */

/**
 * Booking object type
 * @typedef {Object} Booking
 * @property {string} _id - Booking unique identifier
 * @property {Object} hotel - Hotel object or reference
 * @property {Object} room - Room object or reference
 * @property {Date} dateStart - Check-in date
 * @property {Date} dateEnd - Check-out date
 * @property {number} price - Total booking price
 * @property {string} status - Booking status (confirmed, pending, cancelled)
 */

/**
 * User object type
 * @typedef {Object} User
 * @property {string} _id - User unique identifier
 * @property {string} username - Username
 * @property {string} email - User email
 * @property {string} country - User country
 * @property {string} city - User city
 * @property {string} phone - User phone number
 * @property {boolean} isAdmin - Whether user is an admin
 * @property {boolean} isModerator - Whether user is a moderator
 * @property {boolean} isWorker - Whether user is a worker
 */

/**
 * Admin object type
 * @typedef {Object} Admin
 * @property {string} _id - Admin unique identifier
 * @property {string} userId - Reference to the User
 * @property {boolean} superAdmin - Whether admin is a super admin
 * @property {Object} permissions - Admin permissions
 */

/**
 * Moderator object type
 * @typedef {Object} Moderator
 * @property {string} _id - Moderator unique identifier
 * @property {string} userId - Reference to the User
 * @property {Array<string>} assignedHotels - List of hotel IDs assigned to the moderator
 * @property {Object} permissions - Moderator permissions
 */

/**
 * Worker object type
 * @typedef {Object} Worker
 * @property {string} _id - Worker unique identifier
 * @property {string} userId - Reference to the User
 * @property {string} hotelId - Reference to the Hotel
 * @property {string} role - Worker role
 * @property {Array<Object>} assignedRooms - List of rooms assigned for cleaning
 */

/**
 * Search criteria type
 * @typedef {Object} SearchCriteria
 * @property {string} city - City to search in
 * @property {Date} checkIn - Check-in date
 * @property {Date} checkOut - Check-out date
 * @property {number} guests - Number of guests
 * @property {number[]} priceRange - Min and max price range
 */

// Export empty objects to allow importing these types
// The actual type checking happens at runtime
export const Hotel = {};
export const Room = {};
export const Booking = {};
export const User = {};
export const Admin = {};
export const Moderator = {};
export const Worker = {};
export const SearchCriteria = {};
