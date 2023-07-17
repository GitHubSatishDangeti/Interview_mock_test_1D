import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', isValidPIN: false, error: ''}

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {user_id: username, pin: password}

    if (username === '' || username !== '142420') {
      this.setState({isValidPIN: true, error: 'Invalid user ID'})
      console.log('user')
    } else if (password === '' || password !== '231225') {
      this.setState({isValidPIN: true, error: 'Invalid PIN'})
      console.log('pin')
    } else {
      console.log('ok')
      const body = JSON.stringify(userDetails)
      console.log(body)
      const url = 'https://apis.ccbp.in/ebank/login'
      const options = {
        method: 'POST',
        header: {
          'Control-Type': 'application/json',
          Accept: 'application/json',
        },
        body,
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        const token = data.jwt_token
        console.log(token)
        Cookies.set('jwt_token', token, {expires: 30})

        const {history} = this.props
        history.replace('/')
        this.setState({error: '', isValidPIN: false})
      }
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, isValidPIN, error} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
          alt="website login"
        />
        <form onSubmit={this.onFormSubmit} type="submit">
          <h1>Welcome Back!</h1>
          <div>
            <label htmlFor="username">User ID</label>
            <input
              value={username}
              id="username"
              type="text"
              placeholder="Enter User ID"
              onChange={this.onUsernameChange}
            />
          </div>
          <div>
            <label htmlFor="pin">PIN</label>
            <input
              value={password}
              id="pin"
              type="password"
              placeholder="Enter PIN"
              onChange={this.onPasswordChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {!isValidPIN ? null : <p>{error}</p>}
      </div>
    )
  }
}
export default Login
