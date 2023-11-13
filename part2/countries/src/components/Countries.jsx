import Country from './Country'
import CountryInfo from './CountryInfo'

const Countries = ({ countries }) => {
  if (countries.length === 0) {
    return (
      <div>
        No matching countries
      </div>
    )
  } else if (countries.length === 1) {
    return (
      <CountryInfo country={countries[0]}/>
    )
  } else if (countries.length <= 10) {
    return (
      <div>
        {countries.map(country => <Country key={country.name.official} country={country} />)}
      </div>
    )
  } else {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

export default Countries