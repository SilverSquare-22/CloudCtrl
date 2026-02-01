import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city)
      return res.status(400).json({ error: "City is required" });

    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.API_KEY}&units=metric`
    );

    if (!resp.ok)
      return res.status(resp.status).json({ error: "City not found" });

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});