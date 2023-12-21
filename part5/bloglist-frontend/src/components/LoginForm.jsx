import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={login}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            data-cy="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            data-cy="password"
          />
        </div>
        <button type="submit" data-cy="login">login</button>
      </form>
    </div>
  )
}

export default LoginForm