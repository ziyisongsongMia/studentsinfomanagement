import { React, useEffect, useRef } from 'react'
import { Button, Modal, DatePicker, Form, Input, Radio } from 'antd'
import uuid from 'react-uuid'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { updateStudents } from '../redux/studentsSlice.js'
/* import AddFieldFire from './AddFieldFire.js' */
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../pages/firebase.js'
import axios from 'axios'

function AddEditStudents(props) {
  const dateFormat = 'YYYY-MM-DD'

  /*  let usersReduxArr = useSelector((state) => state.users.value || []) */
  const dispatch = useDispatch()

  const addUserInitialVal = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    sex: 'female',
    birthdate: '',
  }
  const editInitialVal = {
    firstname: props.curStudentObj.firstname,
    lastname: props.curStudentObj.lastname,
    email: props.curStudentObj.email,
    phone: props.curStudentObj.phone,
    sex: props.curStudentObj.sex,
    birthdate: dayjs(props.curStudentObj.birthdate),
  }

  const HandleAddUserFinish = async (values) => {
    console.log(values)
    let val = values
    val.key = uuid()
    val.birthdate = val.birthdate.format(dateFormat)
    val.name = val.firstname + ' ' + val.lastname
    val.id = uuid()

    try {
      await axios.post('http://localhost:3001/layout', val)
    } catch (err) {
      console.log(err)
    }

    let newArr = []
    try {
      const res = await axios.get('http://localhost:3001/layout')
      console.log(res.data)
      newArr.push(...res.data)
    } catch (err) {
      console.log(err)
    }

    dispatch(updateStudents(newArr))
    props.setStudentsData(newArr)
    props.handleCancel()
  }

  const HandleEditFinish = async (values) => {
    const newValues = {
      ...values,
      birthdate: values.birthdate.format(dateFormat),
      key: props.curStudentObj.key,
      name: values.firstname + ' ' + values.lastname,
      courses_selected: props.curStudentObj.courses_selected || '',
      selected_courses_keys: props.curStudentObj.selected_courses_keys || '',
      id: props.curStudentObj.id,
    }

    try {
      await axios.put(`http://localhost:3001/layout/${newValues.id}`, newValues)
    } catch (err) {
      console.log(err)
    }

    let newArr = []
    try {
      const res = await axios.get('http://localhost:3001/layout')
      console.log(res.data)
      newArr.push(...res.data)
    } catch (err) {
      console.log(err)
    }
    props.setStudentsData(newArr)
    dispatch(updateStudents(newArr))
    props.setCurStudentObj(newValues)
    props.handleCancel()

    props.setCurStudentObj(newValues)

    props.handleCancel()
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day')
  }
  return (
    <div>
      <Modal
        title={props.addOrEdit === 'adduser' ? 'New Student' : 'Edit Student'}
        open={props.isModalOpen}
        footer={[
          <Button
            type="primary"
            /* key="back" */
            onClick={props.handleCancel}
          >
            Cancel
          </Button>,
        ]}
        onCancel={props.handleCancel}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={
            props.addOrEdit === 'adduser' ? addUserInitialVal : editInitialVal
            /* onFinishFailed={onFinishFailed} */
          }
          onFinish={
            props.addOrEdit === 'adduser'
              ? HandleAddUserFinish
              : HandleEditFinish
          }
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Firstname"
            name="firstname"
            rules={[{ required: true, message: 'Please input your firstname' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastname"
            rules={[{ required: true, message: 'Please input your lastname' }]}
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

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sex"
            name="sex"
            rules={[{ required: true, message: 'Please choose your sex' }]}
          >
            <Radio.Group>
              <Radio value={'female'}>female</Radio>
              <Radio value={'male'}>male</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Birthdate"
            name="birthdate"
            rules={[
              { required: true, message: 'Please chooser your birthdate' },
            ]}
          >
            <DatePicker format={dateFormat} disabledDate={disabledDate} />
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
      </Modal>
    </div>
  )
}

export default AddEditStudents
