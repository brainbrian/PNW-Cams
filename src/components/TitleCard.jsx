import React from "react";
import PropTypes from "prop-types";

import "../styles/components/TitleCard.scss";

/**
 * Convert direction in degrees to human readable value
 * @param  {Number} num Direction in degrees
 * @return {String}     String value of direction
 */
function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  return arr[val % arr.length];
}

const TitleCard = ({ link, name, weather }) => {
  let headingElement = null;

  if (link) {
    headingElement = (
      <h2 className="title-card__title">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </h2>
    );
  } else {
    headingElement = <h2 className="title-card__title">{name}</h2>;
  }

  /*
  const API_URL_SNOW =
    "https://forecast.weather.gov/MapClick.php?FcstType=json";
  const API_URL_SURF =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=aedd7de81c14d670e877d39ead4ed7b4";

  const getWeather = (locations, cat, dispatch) => {
    let baseApiUrl = API_URL_SNOW;
    if (cat === "surf") baseApiUrl = API_URL_SURF;
    locations.forEach((item, index) => {
      if (item.category === cat) {
        const apiUrl = `${baseApiUrl}&lat=${item.latitude}&lon=${item.longitude}`;
        fetchJsonp(apiUrl)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            dispatch(weatherUpdate({ index: index, data: json }));
          })
          .catch((reason) => {
            console.log("error", reason);
          });
      }
    });
  };
  */

  const data = weather;
  const weatherData = {};

  if (data.main) {
    // surf weather - openweathermap.org
    if (data.coord && data.coord.lat && data.coord.lon)
      weatherData.url = `http://forecast.weather.gov/MapClick.php?lat=${data.coord.lat}&lon=${data.coord.lon}`;
    if (data.main && data.main.temp) weatherData.temp = data.main.temp;
    if (data.wind) {
      if (data.wind.speed) weatherData.windSpeed = data.wind.speed;
      if (data.wind.deg)
        weatherData.windDirection = this.degToCompass(data.wind.deg);
    }
    if (data.rain && data.rain["3h"]) weatherData.rain = data.rain["3h"];
    if (data.snow && data.snow["3h"]) weatherData.snow = data.snow["3h"];
    if (data.weather && data.weather.length > 0 && data.weather[0].description)
      weatherData.description = data.weather[0].description; // or .main (shorter desc)
  } else if (data.data) {
    // snow weather - forecast.weather.gov
    // build weather data object based on category and returned data
    if (data.location && data.location.latitude && data.location.longitude)
      weatherData.url = `http://forecast.weather.gov/MapClick.php?lat=${data.location.latitude}&lon=${data.location.longitude}`;
    if (data.data) {
      if (
        data.data.temperature &&
        data.data.temperature.length > 0 &&
        data.data.temperature[0] !== "NA"
      )
        weatherData.temp = data.data.temperature[0];
      if (data.data.weather && data.data.weather.length > 0)
        weatherData.description = data.data.weather[0];
    }

    if (data.currentobservation) {
      if (
        data.currentobservation.Winds &&
        data.currentobservation.Winds !== "NA"
      )
        weatherData.windSpeed = data.currentobservation.Winds;
      if (
        data.currentobservation.Windd &&
        data.currentobservation.Windd !== "NA"
      )
        weatherData.windDirection = this.degToCompass(
          data.currentobservation.Windd
        );
    }

    if (
      data.location &&
      data.location.elevation &&
      data.location.elevation !== "NA"
    )
      weatherData.elevation = data.location.elevation;
  }

  return (
    <div className="title-card">
      <div className="title-card__vertical-align">
        {headingElement}
        {weatherData.url && (
          <a href={weatherData.url} className="weather-data" target="_blank">
            <ul>
              {weatherData.temp && (
                <li>
                  {weatherData.temp} <small>°f</small>
                </li>
              )}
              {weatherData.windSpeed && (
                <li>
                  {weatherData.windSpeed} <small>mph</small>
                  {weatherData.windDirection && (
                    <span> {weatherData.windDirection}</span>
                  )}
                  <small> wind</small>
                </li>
              )}
              {weatherData.elevation && (
                <li>
                  {weatherData.elevation}' <small>Elevation</small>
                </li>
              )}
              {weatherData.clouds && <li>{weatherData.clouds}</li>}
            </ul>
            {weatherData.url && <p>{weatherData.description}</p>}
          </a>
        )}
      </div>
    </div>
  );
};

TitleCard.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  weather: PropTypes.object,
};

export default TitleCard;
