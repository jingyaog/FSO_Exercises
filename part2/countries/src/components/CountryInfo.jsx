import axios from 'axios'
import { useState, useEffect } from 'react'

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({
    main: {temp: null},
    wind: {speed: null},
    weather: [{icon: '10d'}]
  })

  useEffect(() => {
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
    const api_key = import.meta.env.VITE_SOME_KEY

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [])
  
  return (
    <div>
      <h1>{country.name.official}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
      </ul>

      <img src={country.flags.png} />

      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default CountryInfo