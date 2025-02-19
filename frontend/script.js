const apiKey = '202d8cdd9283b8e5d9d03a377fb357ad'; // OpenWeatherMap API 키를 여기에 입력하세요.

function updateElementText(id, text) {
    document.getElementById(id).textContent = text;
}

function setBackground(weatherMain) {
    // 배경색 변경 대신 배경 이미지를 사용하므로 이 함수는 필요하지 않을 수 있습니다.
}

function setWeatherIcon(weatherMain, elementId) {
    let iconClass;
    switch (weatherMain) {
        case 'Clear':
            iconClass = 'fa-sun';
            break;
        case 'Clouds':
            iconClass = 'fa-cloud';
            break;
        case 'Rain':
            iconClass = 'fa-cloud-showers-heavy';
            break;
        case 'Drizzle':
            iconClass = 'fa-cloud-rain';
            break;
        case 'Thunderstorm':
            iconClass = 'fa-bolt';
            break;
        case 'Snow':
            iconClass = 'fa-snowflake';
            break;
        default:
            iconClass = 'fa-question';
    }
    document.getElementById(elementId).className = `fa-solid ${iconClass} fa-5x`;
}

function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const highestTemperature = data.main.temp_max;
            const lowestTemperature = data.main.temp_min;
            const humidity = data.main.humidity;
            const weatherMain = data.weather[0].main;

            updateElementText('location_name', city);
            updateElementText('current_temperature', `${temperature}°C`);
            updateElementText('highest_temperature', `${highestTemperature}°C`);
            updateElementText('lowest_temperature', `${lowestTemperature}°C`);
            updateElementText('humidity', `${humidity}%`);

            // 날씨에 따라 아이콘 변경
            setWeatherIcon(weatherMain, 'current_weather_icon');

            // 애니메이션 클래스 추가
            const wrapper = document.querySelector('.wrapper');
            wrapper.classList.add('background-blur');
        })
        .catch(error => console.error('Error fetching weather data:', error));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const dailyData = {};

            data.list.forEach(reading => {
                const date = reading.dt_txt.split(' ')[0];
                if (!dailyData[date]) {
                    dailyData[date] = {
                        temp_max: reading.main.temp_max,
                        temp_min: reading.main.temp_min,
                        weatherMain: reading.weather[0].main
                    };
                } else {
                    dailyData[date].temp_max = Math.max(dailyData[date].temp_max, reading.main.temp_max);
                    dailyData[date].temp_min = Math.min(dailyData[date].temp_min, reading.main.temp_min);
                }
            });

            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            Object.keys(dailyData).slice(0, 5).forEach((date, index) => {
                const day = index + 1;
                const highestTemperature = dailyData[date].temp_max;
                const lowestTemperature = dailyData[date].temp_min;
                const weatherMain = dailyData[date].weatherMain;

                const dateObj = new Date(date);
                const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];

                updateElementText(`day${day}_title`, dayOfWeek);
                updateElementText(`day${day}_highest_temperature`, `${highestTemperature}°C`);
                updateElementText(`day${day}_lowest_temperature`, `${lowestTemperature}°C`);

                // 날씨에 따라 아이콘 변경
                setWeatherIcon(weatherMain, `day${day}_icon`);
            });
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

document.getElementById('search_button').addEventListener('click', () => {
    const city = document.getElementById('search_input').value;
    if (city) {
        fetchWeatherData(city);
    }
});

// 초기 데이터 로드
fetchWeatherData('Seoul'); 