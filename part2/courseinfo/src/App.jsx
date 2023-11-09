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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  
  return (
    <div>
      <h1>Web development curriculum</h1>
      <div>{courses.map(course => <Course key={course.id} course={course} />)}</div>
    </div>
  )
}

export default App