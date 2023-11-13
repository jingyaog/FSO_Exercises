import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const regex = new RegExp(newSearch, 'i')
  const personsToShow = persons.filter(person => person.name.match(regex))

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
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

    personService
      .create(person)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    const personToDelete = persons.filter(person => person.id === id)[0]
    console.log(personToDelete)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          console.log(`${personToDelete.name} deleted`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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
      <Persons personsToShow={personsToShow} handleClick={deletePerson} />
    </div>
  )
}

export default App