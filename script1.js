let users = [];

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Registration logic
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    users.push({ name, email, password });
    alert('Registration successful!');
    showPage('login');
});
async function getWeatherByLocation(lat, lon) {
    const apiKey = 'b45c5f9a78c6aadae34015991296e47b'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== '200') {
            alert('Unable to fetch weather for your location.');
            return;
        }

        displayWeather(data);
    } catch (error) {
        alert('Error fetching weather data for your location.');
    }
}
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        },
        error => {
            alert('Unable to retrieve your location.');
        }
    );
}


// Login logic
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        showPage('home');
    } else {
        alert('Invalid login credentials.');
    }
});

// Fetch weather data
async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'b45c5f9a78c6aadae34015991296e47b'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== '200') {
            alert('City not found!');
            return;
        }

        displayWeather(data);
    } catch (error) {
        alert('Error fetching weather data.');
    }
}


// Display weather data
function displayWeather(data) {
    const weatherDetails = document.getElementById('weather-details');
    weatherDetails.innerHTML = `
        <h3>${data.city.name}, ${data.city.country}</h3>
        <p>${data.list[0].weather[0].description}, ${data.list[0].main.temp}°C</p>
    `;

    // Display hourly forecast
    const chartData = data.list.slice(0, 8).map(item => ({
        time: item.dt_txt.split(' ')[1],
        temp: item.main.temp
    }));

    renderChart(chartData);
}

// Render chart
function renderChart(data) {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.time),
            datasets: [{
                label: 'Temperature (°C)',
                data: data.map(item => item.temp),
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Temperature (°C)' } }
            }
        }
    });
}