const express = require('express');
const app = express();
const weatherRoutes = require('./routes/weather');

app.use(express.json());
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 