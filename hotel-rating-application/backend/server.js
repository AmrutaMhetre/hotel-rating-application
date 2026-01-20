const express = require("express");
// const fetch = require("node-fetch");
require('dotenv').config(); // Load environment variables
const app = express();

const PORT = process.env.PORT || 5000; 
const apiKey = process.env.GEOAPIFY_API_KEY;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let hotels = [
  {
    id: 1,
    name: "Hotel Sunrise",
    location: "Pune",
    rating: 4.2,
    category: "4 Star",
    peakPeriod: "Dec - Jan"
  },
  {
    id: 2,
    name: "Sea View Resort",
    location: "Goa",
    rating: 4.8,
    category: "5 Star",
    peakPeriod: "Nov - Feb"
  }
];

app.get("/hotels", (req, res) => {
  res.json(hotels);
});

app.post("/hotels", (req, res) => {
  const { name, location, rating } = req.body;

  if (!name || !location || !rating) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const newHotel = { id: hotels.length + 1, ...req.body };
  hotels.push(newHotel);
  res.status(201).json(newHotel);
});


app.put("/hotels/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = hotels.findIndex(h => h.id === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  hotels[index] = { id, ...req.body };
  res.json(hotels[index]);
});

app.delete("/hotels/:id", (req, res) => {
  const id = parseInt(req.params.id);
  hotels = hotels.filter(h => h.id !== id);
  res.json({ message: "Deleted" });
});

app.get("/hotels/highest-rating", (req, res) => {
  const highest = hotels.reduce((max, h) => h.rating > max.rating ? h : max);
  res.json(highest);
});

app.get("/hotels/from-api", async (req, res) => {
  try {

if (!apiKey) {
  return res.status(500).json({ message: "API key missing" });
}


    const response = await fetch(
      `https://api.geoapify.com/v2/places?categories=accommodation.hotel&bias=proximity:73.8567,18.5204&limit=50&apiKey=${apiKey}`
    );

    if (!response.ok) {
  return res.status(response.status).json({
    message: "Failed to fetch data from external API"
  });
}

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      console.log("Geoapify response:", data);
      return res.json([]);
    }

   const mappedHotels = data.features.map((item, index) => ({
    id: hotels.length + index + 1,                  
    name: item.properties.name || "Unknown Hotel", 
    location: item.properties.city || "Pune",       
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)), 
    category: "4 Star",                            
    peakPeriod: "Dec - Jan"                        
  }));


    // prevent duplicates using hotel name
    const existingNames = new Set(hotels.map(h => h.name));

    const uniqueApiHotels = mappedHotels.filter(
      h => !existingNames.has(h.name)
    );

    // merge without overriding existing hotels
    hotels = [...hotels, ...uniqueApiHotels];

    // return full list so frontend stays in sync
    res.json(hotels);


  } catch (error) {
      console.error("Error fetching external API:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }

});

app.listen(PORT, () => {
  console.log("Backend running on port 5000");
});

module.exports = app;
