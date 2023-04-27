import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Reset from './pages/Reset'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login.js'

import TheLayout from './components/TheLayout.js'
import Students from './components/Students.js'
import CoursesInfo from './components/CoursesInfo.js'
import UserInfo from './components/UserInfo.js'
import { auth } from './pages/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import ProtectedRoute from './components/ProtectedRoute.js'
import './pages/Login.css'

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/layout"
            element={
              <ProtectedRoute user={user}>
                <TheLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Students />}></Route>
            <Route path="CoursesInfo" element={<CoursesInfo />} />
            <Route path="UserInfo" element={<UserInfo />} />
          </Route>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset" element={<Reset />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App

/*    <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router> */

/* import Buttons from './Buttons'
import Yellow from './pages/Yellow'
import Blue from './pages/Blue'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Firebase from './firebase.js'

function App() {
  return (
    <div className="app">
      {' '}
      <Firebase />{' '}
    </div>
    //  <BrowserRouter>
    //  <Routes>
    //    <Route path="/" element={<Buttons />} />
    //    <Route path="yellow" element={<Yellow />} />
    //    <Route path="blue" element={<Blue />} />
    //  </Routes>
    //</BrowserRouter>
  )
}

export default App
 */
