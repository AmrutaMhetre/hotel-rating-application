# Hotel Rating Application

This is a full-stack Hotel Rating application. You can:
- Add, edit, delete hotels manually
- Fetch hotels from an external API (Geoapify)
- Get highest-rated hotels

Both manually added hotels and API-fetched hotels are combined into a single list.

## Project Overview

The application consists of:

- A React frontend for displaying and managing hotel data
- A Node.js and Express backend providing REST APIs
- Backend API testing using Jest

## Functionalities

*Frontend*

- Display hotel details in a table
- Add a new hotel
- Edit existing hotel information
- Delete a hotel
- Load hotel data from an external API
- Fetch the highest rated hotel

*Backend*

- REST APIs to manage hotels
- API to fetch hotel data from Geoapify Places API
- API to find the highest rated hotel
- Merge manual and API-fetched hotels without duplicates
- In-memory storage for hotel data (no database)
- Error handling for missing fields, invalid IDs, API failure, and server errors

*Testing*

- Backend APIs tested using Jest and Supertest

## Technology Stack

*Frontend*

- ReactJS
- JavaScript
- HTML, CSS

*Backend*

- Node.js
- Express.js
- node-fetch

*Testing*

- Jest
- Supertest

## Project Structure

```text
hotel-rating-app/
│
├── backend/
│   ├── server.js
│   ├── server.test.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.js
│   ├── package.json
│
├── README.md
```

## How to Run the Application

*Backend*
- cd backend
- npm install
- node server.js

Backend will run on:
http://localhost:5000

*Frontend*
- cd frontend
- npm install
- npm start

Frontend will run on:
http://localhost:3000

## API Endpoints

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | /hotels                | Get all hotels                |
| POST   | /hotels                | Add a new hotel               |
| PUT    | /hotels/:id            | Update hotel                  |
| DELETE | /hotels/:id            | Delete hotel                  |
| GET    | /hotels/highest-rating | Get highest rated hotel       |
| GET    | /hotels/from-api       | Load hotels from external API |


## Running Tests

Backend tests are written using Jest.

- cd backend
- npm test

The tests cover:

- Fetching all hotels
- Adding a hotel
- Updating a hotel
- Deleting a hotel
- Fetching the highest rated hotel

## Error Handling

- **POST /hotels**  
  Returns **400 Bad Request** when required fields are missing.  
  Response: `{ "message": "Required fields are missing" }`

- **PUT /hotels/:id** and **DELETE /hotels/:id**  
  Returns **404 Not Found** when the hotel ID does not exist.  
  Response: `{ "message": "Not found" }`

- **GET /hotels/from-api**  
  Returns **500 Internal Server Error** when the external API fails.  
  Response: `{ "message": "Failed to fetch data from external API" }`

- **Any API request**  
  Returns **500 Internal Server Error** for unexpected server issues.  
  Response: `{ "message": "Internal server error" }`

## Notes

- Hotel data from the external API is mapped to match application fields.
- Manual and API-fetched hotels are merged without duplicates.
- Data is stored in memory (no database used).
- External API uses a fixed location with a maximum of 50 results.



