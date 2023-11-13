const Person = ({ person, handleClick }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => handleClick(person.id)}>delete</button>
    </div>
  )
}

export default Person