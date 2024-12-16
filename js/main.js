// DOM selection
const search = document.getElementById("search");
const forecastBox = document.getElementById("forecastBox");

let weatherData = {};

search.addEventListener("input", (e) => {
  getWeather(e.target.value);
});

const getDate = (date) => {
  const dateDetails = new Date(date);
  const weekDay = dateDetails.toLocaleString("en-US", { weekday: "long" });
  const day = dateDetails.toLocaleString("en-US", { day: "2-digit" });
  const month = dateDetails.toLocaleString("en-US", { month: "long" });
  return { weekDay, day, month };
};

const getWeather = async (city = "Cairo") => {
  if (city.length === 0) getWeather();
  if (city.length < 3) return;
  try {
    let data = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=e93b37c502d447818da150838241412&q=${city}&days=3`
    );
    data = await data.json();
    weatherData = data;
    display(weatherData.forecast.forecastday);
  } catch (error) {
    console.log(error);
  }
};

const display = (array) => {
  let box = ``;
  for (let i = 0; i < array.length; i++) {
    const { weekDay, day, month } = getDate(array[i].date);
    box += `
    ${
      i === 0
        ? `<div class="col-md-4">
                        <div class="forecast today">
                            <div class="forecast-header d-flex justify-content-between">
                                <div>${weekDay}</div>
                                <div>${day} ${month}</div>
                            </div>
                            <div class="forecast-body">
                                <div class="location">${weatherData.location.name}</div>
                                <div class="degree">
                                    <div class="num">${weatherData.current.temp_c} &deg;C</div>
                                    <div class="icon">
                                    <img src="${weatherData.current.condition.icon}" alt="Weather Logo">
                                    </div>
                                </div>
                                <div class="blue">${weatherData.current.condition.text}</div>
                                <div class="d-flex justify-content-between">
                                <span><i class="fa-solid fa-umbrella"></i> ${weatherData.current.humidity}</span>
                                <span><i class="fa-solid fa-wind"></i> ${weatherData.current.wind_kph}</span>
                                <span><i class="fa-solid fa-compass"></i> ${weatherData.current.wind_dir}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        : `<div class="col-md-4">
                        <div class="forecast">
                            <div class="forecast-header">
                                <div>${weekDay}</div>
                            </div>
                            <div class="forecast-body">
                                <div class="icon">
                                <img src="${array[i].day.condition.icon}" alt="Weather Logo">
                                </div>
                                <div class="degree">
                                    <div class="num">${array[i].day.maxtemp_c} &deg;C</div>
                                    <div class="num">${array[i].day.mintemp_c} &deg;C</div>
                                </div>
                                <div class="blue">${array[i].day.condition.text}</div>
                            </div>
                        </div>
                    </div>`
    }
    `;
  }
  forecastBox.innerHTML = box;
};

window.navigator.geolocation.getCurrentPosition(
  (data) => {
    getWeather(`${data.coords.latitude},${data.coords.longitude}`);
  },
  () => {
    getWeather();
  }
);
