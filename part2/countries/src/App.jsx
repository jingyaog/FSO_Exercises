import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [newSearch, setNewSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const regex = new RegExp(newSearch, 'i')
    const countriesToShow = allCountries.filter(country => {
      return country.name.common.match(regex)
    })
    setCountries(countriesToShow)
  }, [newSearch, allCountries])

  const changeSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <Filter text='find countries' newSearch={newSearch} handleSearchChange={changeSearch} />
      <Countries countries={countries} />
    </div>
  )
}

export default App
