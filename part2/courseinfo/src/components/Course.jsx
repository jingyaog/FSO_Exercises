const Header = (props) => {
  return (
    <div>
      <h2>{props.course}</h2>
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <li>
      {part.name} {part.exercises}
    </li>
  )
}

const Content = (props) => {
  return (
    <div>
      <ul>
        {props.parts.map(part => <Part part={part} key={part.id} />)}
      </ul>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <b>total of {props.parts.reduce((s, p) => s + p.exercises, 0)} exercises</b>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course