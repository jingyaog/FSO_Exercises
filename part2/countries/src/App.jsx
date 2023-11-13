import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import axios from 'axios'

function App() {
  const [newSearch, setNewSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const regex = new RegExp(newSearch, 'i')
        const countriesToShow = response.data.filter(country => {
          return country.name.common.match(regex)
        })
        setCountries(countriesToShow)
      })
  }, [newSearch])

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
