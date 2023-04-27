import React from 'react'
import { Button, Form, Input, InputNumber, message } from 'antd'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { db } from '../pages/firebase.js'
import { login } from '../redux/userSlice.js'
import { updateCurrentUser } from '../redux/currentUserSlice.js'

export default function UserInfo() {
  const dispatch = useDispatch()
  let currentUser = useSelector((state) => state.currentUser?.value || [])
  console.log('@@', typeof currentUser, currentUser)

  const updateProfile = async (val) => {
    try {
      await updateDoc(doc(db, 'users', val.id), val)
      dispatch(login(val))
      alert('Profile updated successfully')
    } catch (error) {
      return { message: 'Fail to update profile' }
    }
  }

  const onFinish = (values) => {
    /*  console.log('currentUser0', currentUser0)
     */
    /* let currentUser = JSON.parse(localStorage.getItem('currentUser')) */
    /*use useSelector*/
    const finalVal = {
      ...values,
      uid: currentUser.uid,
      authProvider: currentUser.authProvider || '',
      id: currentUser.id,
      password: currentUser.password,
    }

    // localStorage.setItem('currentUser', JSON.stringify(finalVal))
    dispatch(updateCurrentUser(finalVal))
    console.log({ finalVal })

    updateProfile(finalVal)
    /*   console.log('line 31')

    console.log('line 33')
    console.log(finalVal) */
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        style={{ maxWidth: 600, margin: '40px' }}
        initialValues={
          currentUser
          // JSON.parse(localStorage.getItem('currentUser')) /* currentUser0 */
        }
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email address' },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        {/*  <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please choose your gender' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please choose your address' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Postcode"
          name="postcode"
          rules={[{ required: true, message: 'Please chooser your postcode' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ position: 'relative', top: '56px', left: '280px' }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
