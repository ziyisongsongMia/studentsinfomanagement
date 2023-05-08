import react from 'react'
import { useState, useRef } from 'react'
import { Button, Modal, Form, Tree } from 'antd'
import React from 'react'
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
import { useSelector, useDispatch } from 'react-redux'
import { updateStudents } from '../redux/studentsSlice.js'
import axios from 'axios'

export default function StudentsAddCourse(props) {
  const dispatch = useDispatch()

  //classify courses into math and engineering
  let coursesReduxArr = useSelector((state) => state.coursesTable.value || [])
  const allMathCourses = coursesReduxArr
    .filter((obj) => obj.department === 'mathematics')
    .map((math) => {
      return { title: math.course, key: math.key }
    }) //210
  //console.log(allMathCourses)

  const allEngineerCourses = coursesReduxArr
    .filter((obj) => obj.department === 'engineering')
    .map((engineering) => {
      return { title: engineering.course, key: engineering.key }
    })
  //console.log(allEngineerCourses)

  //treeData
  const treeData = [
    {
      title: 'Mathematics',
      key: 'mathematics',
      children: allMathCourses,
    },
    {
      title: 'Engineering',
      key: 'engineering',
      children: allEngineerCourses,
    },
  ]

  //cancel window handler
  const HandleAddCoursesCancel = () => {
    props.setIsAddCoursesOpen(false)
  }

  //get and save the id array of all checked courses
  const TreeOnCheck = (checkedKeys, info) => {
    console.log('TreeOnCheck', checkedKeys)
    props.setTreeCheckedIdsArr(checkedKeys)
  }

  //handle submit
  const HandleAddCoursesFinish = async (values) => {
    //get all courses array
    let allCourses = []
    try {
      const res = await axios.get(`http://localhost:3001/layout/CoursesInfo`)
      allCourses.push(...res.data)
    } catch (err) {
      console.log(err)
    }

    //get all students array
    let allUsersInfo = []
    try {
      const res = await axios.get(`http://localhost:3001/layout`)
      console.log(res.data)
      allUsersInfo.push(...res.data)
    } catch (err) {
      console.log(err)
    }

    //get all checked courses objects as an array
    let selectedCourses = []
    for (let i = 0; i < props.treeCheckedIdsArr.length; i++) {
      let temp = allCourses.filter(
        (course) => course.key === props.treeCheckedIdsArr[i]
      )
      selectedCourses.push(...temp)
    }

    //get array of all keys of all checked courses
    let TempSelectedCourseskeys = selectedCourses.map((course) => course.key)
    props.setSelectedCoursesKeys(TempSelectedCourseskeys)
    //console.log('TempSelectedCourseskeys', TempSelectedCourseskeys)

    // get array of all names of all checked courses
    const selectedCoursesTitles = selectedCourses
      .map((each) => each.course)
      .toString()

    //for curStudentObj, add the names and keys of selected courses
    let updatedStudentObj = {
      ...props.curStudentObj,
      courses_selected: selectedCoursesTitles,
      selected_courses_keys: TempSelectedCourseskeys,
    }
    props.setCurStudentObj(updatedStudentObj)

    //update all students array, with the new current student object
    let newArr = allUsersInfo.map((obj) =>
      obj.key === props.curKey ? updatedStudentObj : obj
    )

    props.setStudentsData(newArr)
    dispatch(updateStudents(newArr))
    props.setIsAddCoursesOpen(false)

    //convert two properties into string and store them:
    let tempStudentObj = updatedStudentObj
    console.log(
      tempStudentObj.selected_courses_keys,
      typeof tempStudentObj.selected_courses_keys
    )
    console.log('test 1')
    let tempObj = {
      selected_courses_keys: props.treeCheckedIdsArr.toString(),
    }
    console.log('test 2')
    console.log({
      ...tempStudentObj,
      ...tempObj,
    })
    console.log('test 3')
    console.log(
      'tempStudentObj.courses_selected',
      tempStudentObj.courses_selected,
      typeof tempStudentObj.courses_selected
    ) //string
    console.log('test 4')
    // tempStudentObj.courses_selected = tempStudentObj.courses_selected.toString()
    /*     tempStudentObj.selected_courses_keys =
      tempStudentObj.selected_courses_keys.toString() */
    console.log(tempStudentObj)
    console.log(
      tempStudentObj.selected_courses_keys,
      typeof tempStudentObj.selected_courses_keys
    ) //array with ids

    try {
      await axios.put(`http://localhost:3001/layout/${tempStudentObj.id}`, {
        ...tempStudentObj,
        ...tempObj,
      })
      console.log({ ...tempStudentObj })
      console.log({ ...tempObj })
      console.log({ ...tempStudentObj, ...tempObj })
      console.log('test 9')
    } catch (err) {
      console.log(err)
    }
  }

  const HandleAddCoursesFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <Modal
        title="Select courses"
        open={props.isAddCoursesOpen}
        height={600}
        footer={[
          <Button type="primary" key="back" onClick={HandleAddCoursesCancel}>
            Cancel
          </Button>,
        ]}
        onCancel={HandleAddCoursesCancel}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            add_course_tree: props.curStudentObj.selected_courses_keys && [],
          }}
          onFinish={HandleAddCoursesFinish}
          onFinishFailed={HandleAddCoursesFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="add_course_tree" name="add_course_tree">
            <Tree
              checkable
              expandedKeys={['mathematics', 'engineering']}
              checkedKeys={props.treeCheckedIdsArr}
              onCheck={TreeOnCheck}
              treeData={treeData}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ position: 'relative', top: '56px', left: '135px' }}
            >
              Courses confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
