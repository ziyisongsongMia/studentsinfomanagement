import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useNavigate } from 'react-router-dom'
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from './firebase'
import Axios from 'axios'
import uuid from 'react-uuid'
import './Register.css'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate()

  /*   const register = () => {
    if (!name) alert('Please enter name') //alert后下面的还执行吗
    registerWithEmailAndPassword(
      name,
      email,
      password,
      gender,
      address,
      postcode
    )
  } */

  const register = (e) => {
    e.preventDefault()
    Axios.post('http://localhost:3001/register', {
      address: address,
      authProvider: 'local',
      email: email,
      id: uuid(),
      name: name,
      password: password,
      gender: gender,
      postcode: postcode,
      uid: uuid(),
    }).then((response) => {
      console.log(response)
      if (!response.data.message) {
        navigate('/dashboard')
      }
    })
  }

  useEffect(() => {
    if (loading) return
    //The useHistory hook gives you access to the history instance that you may use to navigate.
    if (user) navigate('/dashboard')
  }, [user, loading])

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="text"
          className="register__textBox"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Your Gender"
        />
        <input
          type="text"
          className="register__textBox"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Your Address"
        />
        <input
          type="text"
          className="register__textBox"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Your Postcode"
        />
        <button className="register__btn" onClick={register}>
          Register
        </button>

        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  )
}
export default Register
