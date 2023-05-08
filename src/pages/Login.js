import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
  db,
} from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../redux/userSlice.js'
import { updateStudents } from '../redux/studentsSlice.js'
import { updateCourses } from '../redux/coursesSlice.js'
import './Login.css'
import { getDocs, collection } from 'firebase/firestore'
import { updateCurrentUser } from '../redux/currentUserSlice.js'
import axios from 'axios'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, loading, error] = useAuthState(auth)
  const [provider, setProvider] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  /* let currentUser = useSelector((state) => state.currentUser?.value || []) */

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      console.log(loading)
      return
    }
    if (user) navigate('/layout') //should go to Layout page
  }, [user, loading])

  const HandleGoogle = async () => {
    let curData = await signInWithGoogle()
    /* console.log('curData', JSON.stringify(curData)) */
    dispatch(updateCurrentUser(curData))
    setProvider('google')
  }

  const HandleEmailPassword = async (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:3001', {
        email: email,
        password: password,
      })
      .then((response) => {
        if (!response.data.message) {
          console.log(response.data[0])
          dispatch(updateCurrentUser(response.data[0]))
          dispatch(login({ ...response.data[0], loggedIn: true }))
          navigate('/layout')
        }
      })

    let allStudents = []
    try {
      const res = await axios.get('http://localhost:3001/layout')
      console.log(res.data)
      allStudents.push(...res.data)
    } catch (err) {
      console.log(err)
    }
    dispatch(updateStudents(allStudents))
    setProvider('email')

    let allCourses = []
    try {
      const res = await axios.get('http://localhost:3001/layout/CoursesInfo')
      console.log(res.data)
      allCourses.push(...res.data)
    } catch (err) {
      console.log(err)
    }
    dispatch(updateCourses(allCourses))
  }

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          id="email"
          value={email}
          onChange={(e) => {
            return setEmail(e.target.value)
          }}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          id="psw"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="login__btn" onClick={HandleEmailPassword}>
          Login
        </button>
        <button className="login__btn login__google" onClick={HandleGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  )
}
export default Login
