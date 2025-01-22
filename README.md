# Dine On Time App

## Overview
Dine On Time is a robust restaurant management and reservation system. It allows users to register, browse restaurants, make reservations, and explore menus. Restaurant owners can manage their restaurants and menu items seamlessly. This guide provides a complete overview of the project, ensuring beginners can set it up and explore its functionality.

---

## Project Links
- **Code Repository**: [GitHub](https://github.com/fareesaM/fsd_dot_bknd)

- **Live Deployment**: [Render](https://fsd-dot-bknd.onrender.com)
  ![Code Repository](https://github.com/fareesaM/fsd_dot_bknd/blob/master/render_dashboard.png)

- **MongoDB Collection**: [MongoDB Atlas](https://cloud.mongodb.com/v2/67790ef86809db15e593568b#/metrics/replicaSet/677f339547e2e8151f1eedb0/explorer/test/menus/find)
  ![MongoDB Screenshot](https://github.com/fareesaM/fsd_dot_bknd/blob/master/mongo_db1.png)

- **AWS S3 Bucket**: [S3 Bucket](https://eu-north-1.console.aws.amazon.com/s3/buckets/dineontime-images?bucketType=general&region=eu-north-1&tab=objects#)
  ![AWS S3 Bucket](https://github.com/fareesaM/fsd_dot_bknd/blob/master/amazon_bucket.png)

---

## Features
1. **User Management**
2. **Restaurant Management**
3. **Menu Management**
4. **Reservation Management**

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- AWS S3 bucket credentials

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/fareesaM/fsd_dot_bknd.git
   cd fsd_dot_bknd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   AWS_ACCESS_KEY_ID=<Your AWS Access Key>
   AWS_SECRET_ACCESS_KEY=<Your AWS Secret Key>
   AWS_REGION=eu-north-1
   S3_BUCKET_NAME=dineontime-images
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

---

## API Documentation

### 1. User Management Endpoints
#### a. User Registration
- **Method**: POST
- **Endpoint**: `/api/users/register`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Expected Response**:
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "token": "your_jwt_token"
  }
  ```

#### b. User Login
- **Method**: POST
- **Endpoint**: `/api/users/login`
- **Body** (JSON):
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**:
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "token": "your_jwt_token"
  }
  ```

### 3. Menu Management Endpoints
#### a. Add Menu Item
- **Method**: POST
- **Endpoint**: `/api/restaurants/:restaurantId/menu`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  - name: Menu Item Name
  - description: Menu Item Description
  - price: 12.99
  - image: Upload an image file
- **Expected Response**:
  ```json
  {
    "_id": "menu_id",
    "restaurant": "restaurant_id",
    "items": [
      {
        "_id": "menu_item_id",
        "name": "Menu Item Name",
        "description": "Menu Item Description",
        "price": 12.99,
        "imageUrl": "https://your-s3-bucket-url/menu-item.png"
      }
    ]
  }
  ```

![Menu Item Screenshot](https://github.com/fareesaM/fsd_dot_bknd/blob/master/menu_item1.png)


### 2. Restaurant Management Endpoints

#### a. Create Restaurant

- **Method**: POST
- **Endpoint**: `/api/restaurants`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  Content-Type: multipart/form-data
  ```
- **Body** (form-data):
  - name: Restaurant Name
  - address: 123 Main St
  - phoneNumber: +123456789
  - email: [example@restaurant.com](mailto\:example@restaurant.com)
  - description: A sample restaurant
  - image: Upload an image file
- **Expected Response**:
  ```json
  {
    "_id": "restaurant_id",
    "name": "Restaurant Name",
    "address": "123 Main St",
    "phoneNumber": "+123456789",
    "email": "example@restaurant.com",
    "description": "A sample restaurant",
    "imageUrl": "https://your-s3-bucket-url/restaurant-image.png",
    "owner": "user_id"
  }
  ```

#### b. Get All Restaurants

- **Method**: GET
- **Endpoint**: `/api/restaurants`
- **Headers**: None
- **Expected Response**:
  ```json
  [
    {
      "_id": "restaurant_id",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "phoneNumber": "+123456789",
      "email": "example@restaurant.com",
      "description": "A sample restaurant",
      "imageUrl": "https://your-s3-bucket-url/restaurant-image.png",
      "owner": "user_id"
    }
  ]
  ```

#### c. Get Restaurant by ID

- **Method**: GET
- **Endpoint**: `/api/restaurants/:id`
- **Headers**: None
- **Expected Response**:
  ```json
  {
    "_id": "restaurant_id",
    "name": "Restaurant Name",
    "address": "123 Main St",
    "phoneNumber": "+123456789",
    "email": "example@restaurant.com",
    "description": "A sample restaurant",
    "imageUrl": "https://your-s3-bucket-url/restaurant-image.png",
    "menu": [
      {
        "_id": "menu_item_id",
        "name": "Menu Item",
        "description": "Description",
        "price": 12.99,
        "imageUrl": "https://your-s3-bucket-url/menu-item.png"
      }
    ]
  }
  ```

---

### 4. Reservation Management Endpoints

#### a. Create Reservation

- **Method**: POST
- **Endpoint**: `/api/reservations`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body** (JSON):
  ```json
  {
    "restaurantId": "restaurant_id",
    "menuIds": ["menu_item_id1", "menu_item_id2"],
    "date": "2025-01-20",
    "time": "19:00",
    "numberOfGuests": 4,
    "specialRequests": "Window seat"
  }
  ```
- **Expected Response**:
  ```json
  {
    "_id": "reservation_id",
    "restaurantId": "restaurant_id",
    "userId": "user_id",
    "menuIds": ["menu_item_id1", "menu_item_id2"],
    "date": "2025-01-20",
    "time": "19:00",
    "numberOfGuests": 4,
    "specialRequests": "Window seat",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

#### b. View Reservations

- **Method**: GET
- **Endpoint**: `/api/reservations`
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Expected Response**:
  ```json
  [
    {
      "_id": "reservation_id",
      "restaurantId": "restaurant_id",
      "userId": "user_id",
      "menuIds": ["menu_item_id1", "menu_item_id2"],
      "date": "2025-01-20",
      "time": "19:00",
      "numberOfGuests": 4,
      "specialRequests": "Window seat",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

---

### Note for Execution:

- While testing locally, use the `http://localhost:5000` link for API requests.
- For production, use the Render-deployed link: `https://fsd-dot-bknd.onrender.com`.

---

## Conclusion

Dine on Time is a robust backend project designed to simplify restaurant operations and enhance user experience. It employs a cutting-edge stack including MongoDB Atlas, AWS S3 for efficient storage, and Node.js with Express for a scalable and seamless backend. Key functionalities include user authentication, restaurant creation, reservation management, and pre-order capabilities. The live deployment on Render and the inclusion of detailed API routes make it both accessible to beginners and easy to work with for experienced developers.




This project showcases a full-stack implementation of a restaurant management system. It integrates modern tools like MongoDB Atlas, AWS S3, and Node.js for a seamless experience. Beginners can follow the setup instructions, while recruiters can assess its features and functionality for potential opportunities.



