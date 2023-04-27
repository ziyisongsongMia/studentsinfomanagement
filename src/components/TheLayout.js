import { Layout, Menu } from 'antd'

import { Link, Outlet } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import '../pages/Dashboard.css'
import { auth, db, logout } from '../pages/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentUser } from '../redux/currentUserSlice.js'

export default function TheLayout() {
  const { Header, Content, Footer } = Layout

  const name = useSelector((state) => state.user.value?.name || '')
  console.log('name', name, typeof name)
  /* let currentUser = useSelector((state) => state.currentUser?.value || '')
  console.log('currentUser', currentUser) */

  const navigate = useNavigate()

  /*   const fetchUserName = () => {
    //  const Name = currentUser?.name || '' 
    JSON.parse(localStorage.getItem('currentUser'))
    console.log('currentUser', JSON.parse(localStorage.getItem('currentUser')))
  }

  useEffect(() => {
    fetchUserName()
  }, []) */

  return (
    <div className="layout">
      <Header>
        <div />
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { key: 1, label: <Link to="/layout"> Students </Link> },
            {
              key: 2,
              label: <Link to="/layout/CoursesInfo"> CourseInfo </Link>,
            },
            {
              key: 3,
              label: <Link to="/layout/UserInfo"> UserInfo </Link>,
            },
            {
              key: 4,
              label: (
                <button className="dashboard__btn" onClick={logout}>
                  Logout
                </button>
              ),
            },
            {
              key: 5,
              label: (
                <div style={{ color: 'white' }}>
                  Hello,
                  {name}
                </div>
              ),
            },
          ]}
        ></Menu>
      </Header>

      <Outlet />
    </div>
  )
}
