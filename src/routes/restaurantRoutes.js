// const express = require('express');
// const router = express.Router();
// const {
//   createRestaurant,
//   getRestaurants,
//   getRestaurantById,
//   updateRestaurant,
//   deleteRestaurant,
//   getMyRestaurants  // Import the getMyRestaurants function
// } = require('../controllers/restaurantController');
// const { protect, restaurantOwner } = require('../middleware/authMiddleware');

// // Specific route for fetching restaurants owned by the logged-in user
// router.route('/myrestaurants')
//   .get(protect, getMyRestaurants);

// // General route for getting all restaurants or creating a new one
// router.route('/')
//   .get(getRestaurants)
//   .post(protect, restaurantOwner, createRestaurant);

// // Route for specific restaurant operations (get by ID, update, delete)
// router.route('/:id')
//   .get(getRestaurantById)
//   .put(protect, restaurantOwner, updateRestaurant)
//   .delete(protect, restaurantOwner, deleteRestaurant);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
} = require('../controllers/restaurantController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
    }
  },
});

// Routes
router.post('/', protect, restaurantOwner, upload.single('image'), createRestaurant);
router.get('/', getRestaurants);
router.get('/myrestaurants', protect, restaurantOwner, getMyRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', protect, restaurantOwner, upload.single('image'), updateRestaurant);
router.delete('/:id', protect, restaurantOwner, deleteRestaurant);

module.exports = router;
