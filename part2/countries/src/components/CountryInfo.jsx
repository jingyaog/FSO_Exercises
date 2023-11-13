const CountryInfo = ({ country }) => {

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
    </div>
  )
}

export default CountryInfo