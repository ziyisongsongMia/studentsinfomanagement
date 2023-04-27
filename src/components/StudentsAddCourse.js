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

export default function StudentsAddCourse(props) {
  const dispatch = useDispatch()

  /* const HandleAddCourses = (record) => {
    props.setIsAddCoursesOpen(true)
    props.setCurKey(record.key)

    let ref = collection(db, 'studentsTable')
    let StudentsArr = onSnapshot(ref, (snapshot) => {
      let allStudents = []
      snapshot.docs.forEach((doc) => {
        allStudents.push({ ...doc.data() })
      })
      return allStudents
    })

    props.setCurStudentObj(
      // JSON.parse(localStorage.getItem('users') || '[]') 
      StudentsArr.find(
        (obj) => obj.key === record.key
      )
    )
    console.log(StudentsArr.find((obj) => obj.key === record.key))
    console.log(record)

    props.setTreeCheckedIdsArr(record.selected_courses_keys)
  } */

  /*   let ref = collection(db, 'coursesTable')
  onSnapshot(ref, (snapshot) => {
    let allCourses = []
    snapshot.docs.forEach((doc) => {
      allCourses.push({ ...doc.data() })
    })
  }) */

  let coursesReduxArr = useSelector((state) => state.coursesTable.value || [])
  const allMathCourses =
    /* JSON.parse(localStorage.getItem('courses') || '[]') */
    coursesReduxArr
      .filter((obj) => obj.department === 'mathematics')
      .map((math) => {
        return { title: math.course, key: math.key }
      }) //210
  console.log(allMathCourses)

  const allEngineerCourses = coursesReduxArr
    .filter((obj) => obj.department === 'engineering')
    .map((engineering) => {
      return { title: engineering.course, key: engineering.key }
    }) //210
  console.log(allEngineerCourses)

  const treeData = [
    //223
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

  const HandleAddCoursesCancel = () => {
    props.setIsAddCoursesOpen(false)
  } //289

  //get id array of all checked courses
  const TreeOnCheck = (checkedKeys, info) => {
    console.log('TreeOnCheck', checkedKeys)
    props.setTreeCheckedIdsArr(checkedKeys)
    /*  console.log(props.curStudentObj) */
  }

  const HandleAddCoursesFinish = async (values) => {
    console.log(values)
    console.log(props.curStudentObj)
    //get all courses and students arrays from redux
    /*    let allCourses = useSelector((state) => state.coursesTable.value || [])
    let allUsersInfo = useSelector((state) => state.studentsTable.value || []) */
    let allCourses = []
    const ref1 = collection(db, 'coursesTable')
    await getDocs(ref1).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        allCourses.push({ ...doc.data() })
      })
    )
    console.log('allCourses', allCourses)

    let allUsersInfo = []
    const ref2 = collection(db, 'studentsTable')
    await getDocs(ref2).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        allUsersInfo.push({ ...doc.data() })
      })
    )
    console.log('allUsersInfo', allUsersInfo)

    //get array of all checked courses objects
    let selectedCourses = []
    for (let i = 0; i < props.treeCheckedIdsArr.length; i++) {
      let temp = allCourses.filter(
        (course) => course.key === props.treeCheckedIdsArr[i]
      )
      selectedCourses.push(...temp)
    } //248

    //get array of all keys of all checked courses
    let TempSelectedCourseskeys = selectedCourses.map((course) => course.key) //checkedKeys?
    props.setSelectedCoursesKeys(TempSelectedCourseskeys) //260,checkedKeys?
    console.log('TempSelectedCourseskeys', TempSelectedCourseskeys)

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
    console.log(updatedStudentObj)
    props.setCurStudentObj(updatedStudentObj)

    //update all students array, because of the selected courses keys and names
    let newArr = allUsersInfo.map((obj) =>
      obj.key === props.curKey ? updatedStudentObj : obj
    )
    console.log(newArr)
    await updateDoc(
      doc(db, 'studentsTable', updatedStudentObj.id),
      updatedStudentObj
    )
    /* localStorage.setItem('users', JSON.stringify(newArr)) */
    props.setStudentsData(newArr)
    dispatch(updateStudents(newArr))
    props.setIsAddCoursesOpen(false)
  }

  const HandleAddCoursesFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  } //285

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
            add_course_tree: props.curStudentObj.selected_courses_keys,
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
