import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState('success')
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
    const replaceMsg = `${newName} is already added to phonebook, replace the old number with a new one?`
    const existing = persons.filter(person =>
      JSON.stringify(person.name) === JSON.stringify(newName))
    if (existing.length !== 0) {
      if (window.confirm(replaceMsg)) {
        const personToUpdate = existing[0]
        const id = personToUpdate.id
        const updatedPerson = { ...personToUpdate, number: newNumber }
        personService
          .update(id, updatedPerson)
          .then(returnedPerson => {
            console.log(returnedPerson)
            setPersons(persons.map(person => person.id === id ? returnedPerson : person))
            setStyle('success')
            setMessage(`Updated ${personToUpdate.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log(error.response.data.error)
            setStyle('error')
            setMessage(error.response.data.error)
            // setPersons(persons.filter(p => p.id !== id))
          })
      }
    }
    else {
      const person = {
        name: newName,
        number: newNumber
      }
  
      personService
        .create(person)
        .then(response => {
          setPersons(persons.concat(response))
          setStyle('success')
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setStyle('error')
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const personToDelete = persons.filter(person => person.id === id)[0]
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setStyle('success')
          setMessage(`${personToDelete.name} deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(() => {
          setStyle('error')
          setMessage(`the person '${personToDelete.name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={style} />
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