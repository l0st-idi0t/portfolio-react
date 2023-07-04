import React, { useEffect, useState, useCallback } from "react";
import "../styles/App.css";

interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      icon: string;
    };
  };
}

const WeatherClockWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getWeatherData(lat, lon);
        },
        () => {
          alert("Cannot get your location for weather.");
        }
      );
    } else {
      alert("GeoLocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    // get weather data when component mounts
    getLocation();

    // update clock every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // clean up interval on component unmount
    return () => clearInterval(interval);
  }, [getLocation]);

  const getWeatherData = (lat: number, lon: number) => {
    const apiKey = "7b29be37390b450d9e743140230704";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat}, ${lon}&aqi=no`;

    fetch(url)
      .then((response) => response.json())
      .then((data: WeatherData) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour "0" should be "12"
    let strMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    let strTime = hours + ":" + strMinutes + " " + ampm;
    return strTime;
  };

  return (
    <div className="widget">
      {weatherData && (
        <div id="weather-widget">
          <img
            id="weather-icon"
            src={"https:" + weatherData.current.condition.icon}
            alt="Weather"
          />
          <p id="weather-temp">{`${weatherData.current.temp_c}°C / ${weatherData.current.temp_f}°F`}</p>
        </div>
      )}
      <div id="clock">{formatAMPM(currentTime)}</div>
    </div>
  );
};

export default WeatherClockWidget;
