import { useState } from 'react'
import CountryInfo from './CountryInfo'

const Country = ({ country }) => {

  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  if (!visibility) {
    return (
      <div>{country.name.common} <button onClick={toggleVisibility}>show</button></div>
    )
  } else {
    return (
      <div>
        {country.name.common} <button onClick={toggleVisibility}>close</button>
        <CountryInfo country={country} />
      </div>
    )
  }
  
}

export default Country