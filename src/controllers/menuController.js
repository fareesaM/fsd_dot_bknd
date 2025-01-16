const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

const { uploadImageToS3 } = require('../utils/s3'); // Helper function for S3 upload

// @desc    Add a new menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner)
const addMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const restaurantId = req.params.restaurantId;

  if (!name || !price) {
    res.status(400);
    throw new Error('Menu item name and price are required');
  }

  // Verify restaurant ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add menu items to this restaurant');
  }

  // Get the menu for the restaurant or create a new one
  let menu = await Menu.findOne({ restaurant: restaurantId });
  if (!menu) {
    menu = new Menu({ restaurant: restaurantId, items: [] });
  }

  // Upload image to S3 if provided
  let imageUrl = null;
  if (req.file) {
    try {
      imageUrl = await uploadImageToS3(req.file, 'menu');
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  // Add the new menu item
  const newItem = { name, description, price, imageUrl };
  menu.items.push(newItem);
  await menu.save();

  res.status(201).json(menu);
});

// @desc    Update a menu item
// @route   PUT /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Restaurant Owner)
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const { restaurantId, itemId } = req.params;

  // Verify restaurant ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update menu items for this restaurant');
  }

  // Get the menu and the specific item
  const menu = await Menu.findOne({ restaurant: restaurantId });
  if (!menu) {
    res.status(404);
    throw new Error('Menu not found');
  }

  const item = menu.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Upload new image to S3 if provided
  let imageUrl = null;
  if (req.file) {
    try {
      imageUrl = await uploadImageToS3(req.file);
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  // Update the menu item
  item.name = name || item.name;
  item.description = description || item.description;
  item.price = price || item.price;
  item.imageUrl = imageUrl || item.imageUrl;

  await menu.save();
  res.json(menu);
});

// @desc    Remove a menu item
// @route   DELETE /api/restaurants/:restaurantId/menu/:itemId
// @access  Private (Restaurant Owner)
const removeMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, itemId } = req.params;

  // Verify restaurant ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete menu items from this restaurant');
  }

  // Get the menu
  const menu = await Menu.findOne({ restaurant: restaurantId });
  if (!menu) {
    res.status(404);
    throw new Error('Menu not found');
  }

  // Remove the item from the menu
  menu.items = menu.items.filter(item => item._id.toString() !== itemId);
  await menu.save();

  res.json({ message: 'Menu item removed' });
});

// @desc    Get menu by restaurant ID
// @route   GET /api/menu/:restaurantId
// @access  Private (Authenticated Users)
const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
  if (!menu) {
    return res.status(200).json({ items: [] }); // Return empty array if menu doesn't exist
  }
  res.json({ items: menu.items });
});

module.exports = {
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
  getMenuByRestaurant,
};
