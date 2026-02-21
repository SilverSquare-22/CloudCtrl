export default async function handler(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.API_KEY}&units=metric`
    );

    if (!resp.ok) {
      return res.status(resp.status).json({ error: "City not found" });
    }

    const data = await resp.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
}