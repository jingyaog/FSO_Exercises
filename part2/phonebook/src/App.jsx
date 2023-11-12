import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const regex = new RegExp(newSearch, 'i')
  const personsToShow = persons.filter(person => person.name.match(regex))

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const changeName = (event) => {
    setNewName(event.target.value)
  }

  const changeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const changeSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const duplicates = persons.filter(person =>
      JSON.stringify(person.name) === JSON.stringify(newName))
    if (duplicates.length !== 0) {
      window.alert(`${newName} is already added to phonebook`)
      return
    }
    const person = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    axios
      .post('http://localhost:3001/persons', person)
      .then(response => {
        console.log(response)
      })
    setPersons(persons.concat(person))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text='filter shown with' newSearch={newSearch} handleSearchChange={changeSearch} />

      <h2>Add a new</h2>
      <PersonForm
        handleSubmit={addPerson}
        newName={newName}
        handleNameChange={changeName}
        newNumber={newNumber}
        handleNumberChange={changeNumber}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App