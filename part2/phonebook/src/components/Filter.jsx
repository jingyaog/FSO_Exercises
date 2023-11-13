const Filter = (props) => {
  return (
    <div>
      {props.text} <input value={props.newSearch} onChange={props.handleSearchChange} />
    </div>
  )
}

export default Filter