import Person from './Person'

const Persons = ({ personsToShow, handleClick }) => {
  return (
    <div>
      {personsToShow.map(person =>
        <Person key={person.id} person={person} handleClick={handleClick} />
      )}
    </div>
  )
}

export default Persons