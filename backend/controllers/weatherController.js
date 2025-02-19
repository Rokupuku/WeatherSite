const axios = require('axios');

exports.getWeather = async (req, res) => {
    const city = req.params.city;
    const apiKey = '202d8cdd9283b8e5d9d03a377fb357ad';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
}; 