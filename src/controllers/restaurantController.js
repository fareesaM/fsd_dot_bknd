const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');
const { uploadImageToS3 } = require('../utils/s3');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Owner)
// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Owner)
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, address, phoneNumber, email, description } = req.body;

  if (!name || !address || !phoneNumber || !email) {
    res.status(400);
    throw new Error('All fields (name, address, phoneNumber, email) are required.');
  }

  let imageUrl = null;
  if (req.file) {
    try {
      imageUrl = await uploadImageToS3(req.file, 'restaurant');
      console.log('Image uploaded successfully:', imageUrl); // Debugging log
    } catch (error) {
      console.error('Image upload failed:', error);
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const restaurant = await Restaurant.create({
    name,
    address,
    phoneNumber,
    email,
    description,
    imageUrl, // Save the image URL in the restaurant document
    owner: req.user._id,
  });

  // Include the imageUrl in the response
  res.status(201).json({
    _id: restaurant._id,
    name: restaurant.name,
    address: restaurant.address,
    phoneNumber: restaurant.phoneNumber,
    email: restaurant.email,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl, // Include the imageUrl in the response
    owner: restaurant.owner,
  });
});



// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  console.log("Fetching all restaurants");
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
});

// @desc    Get a restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  const restaurant = await Restaurant.findById(restaurantId).populate({
    path: 'menu',
    populate: { path: 'items' },
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json(restaurant);
});

// @desc    Get restaurants created by the logged-in user
// @route   GET /api/restaurants/myrestaurants
// @access  Private (Restaurant Owner)
const getMyRestaurants = asyncHandler(async (req, res) => {
  console.log(`Fetching restaurants for user: ${req.user._id}`);

  const restaurants = await Restaurant.find({ owner: req.user._id }).populate({
    path: 'menu',
    populate: { path: 'items' },
  });

  res.json(restaurants);
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant Owner)
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  console.log(`Updating restaurant with ID: ${restaurantId}`);

  const { name, address, phoneNumber, email, description } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  if (restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this restaurant');
  }

  let imageUrl = restaurant.imageUrl; // Keep existing image if no new image is uploaded
  if (req.file) {
    try {
      imageUrl = await uploadImageToS3(req.file, 'restaurant'); // Upload new image to S3
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  restaurant.name = name || restaurant.name;
  restaurant.address = address || restaurant.address;
  restaurant.phoneNumber = phoneNumber || restaurant.phoneNumber;
  restaurant.email = email || restaurant.email;
  restaurant.description = description || restaurant.description;
  restaurant.imageUrl = imageUrl;

  const updatedRestaurant = await restaurant.save();

  res.json(updatedRestaurant);
});

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Restaurant Owner)
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  console.log(`Deleting restaurant with ID: ${restaurantId}`);

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  if (restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this restaurant');
  }

  await restaurant.deleteOne();

  res.json({ message: 'Restaurant removed' });
});

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
};
