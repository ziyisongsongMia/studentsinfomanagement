import { useState, useEffect } from 'react'
import {
  Button,
  Form,
  Modal,
  Input,
  Table,
  Radio,
  Space,
  Popconfirm,
} from 'antd'
import uuid from 'react-uuid'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../pages/firebase'
import { useNavigate } from 'react-router-dom'
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
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../pages/firebase.js'
import { useSelector, useDispatch } from 'react-redux'
import { updateCourses } from '../redux/coursesSlice.js'

export default function CoursesInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addOrEdit, setAddOrEdit] = useState('')
  const [curCourseObj, setCurCourseObj] = useState({})
  const [coursesData, setCoursesData] = useState([])
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const showModal = () => {
    setIsModalOpen(true)
  }
  const openAddCourse = () => {
    showModal()
    setAddOrEdit('addCourse')
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  /*  const getAllCourses = async () => {
    let ref = collection(db, 'coursesTable')
    let allCourses = []
    let newStudentsArr = onSnapshot(ref, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        allCourses.push({ ...doc.data() })
      })
    })
    
    
    return allCourses
  }
 */
  /////////Edit/////////////////////////////////////////////////////
  const HandleEdit = (record) => {
    /* console.log(record) */
    showModal()
    setAddOrEdit('edit')
    setCurCourseObj(record)
  }

  const HandleEditFinish = async (values) => {
    /*  console.log(values)
    console.log(curCourseObj) */

    const newValues = {
      ...values,
      key: curCourseObj.key,
      id: curCourseObj.id,
    }

    /*    let courses = getAllCourses()
    console.log(courses) */

    await updateDoc(doc(db, 'coursesTable', newValues.id), newValues)
    setCurCourseObj(newValues)

    /* // let localStorageArr = JSON.parse(localStorage.getItem('courses') || [])
    let findIndex = localStorageArr.findIndex(
      (item) => item.key === curCourseObj.key
    )
    if (findIndex > -1) {
      localStorageArr[findIndex] = { ...newValues }
    }
    localStorage.setItem('courses', JSON.stringify(localStorageArr)) */
    let ref = collection(db, 'coursesTable')

    onSnapshot(ref, (snapshot) => {
      let courses = [] //一定要在里面，否则会有相同的key?
      snapshot.docs.forEach((doc) => {
        courses.push({ ...doc.data() })
      })

      /* console.log('results', courses) */
      setCoursesData(courses) //为什么一定要在里面？
      dispatch(updateCourses(courses))
    })

    handleCancel()
  }
  ///////Edit is over//////////////////

  ///////Delete starts///////////////////////
  const HandleDelete = async (record) => {
    /* console.log(record)
    console.log(record.id) */
    const ref1 = doc(db, 'coursesTable', record.id)
    await deleteDoc(ref1)
    /*    let localStorageArr = JSON.parse(localStorage.getItem('courses'))
    let RemainingCourses = localStorageArr.filter(
      (obj) => obj.key !== record.key
    )
    console.log(RemainingCourses)
    setCoursesData(RemainingCourses)
    localStorage.setItem('courses', JSON.stringify(RemainingCourses)) */

    const ref2 = collection(db, 'coursesTable')
    await getDocs(ref2).then((snapshot) => {
      let coursesLeft = []
      snapshot.docs.forEach((doc) => {
        coursesLeft.push({ ...doc.data() })
      })
      dispatch(updateCourses(coursesLeft))
      setCoursesData(coursesLeft)
      /*  console.log(coursesLeft) */
    })
  }

  ///////Delete ends////////////////////////

  ///////Add starts///////////////////////

  const HandleAddCourseFinish = async (values) => {
    let val = values
    val.key = uuid()

    const AddRes = await addDoc(collection(db, 'coursesTable'), val)
    const AddId = AddRes.id
    const AddRef = doc(db, 'coursesTable', AddId)
    await updateDoc(AddRef, {
      id: AddId,
    })

    let courses = []
    const ref = collection(db, 'coursesTable')
    await getDocs(ref).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() })
      })
    )

    dispatch(updateCourses(courses))

    /* let newCoursesArr = [...coursesData, val]
    localStorage.setItem('courses', JSON.stringify(newCoursesArr)) 
    setCoursesData(newCoursesArr)*/
    setCoursesData(courses)
    handleCancel()
  }
  ///////Add ends///////////////////////

  const onFinishFailed = (errorInfo) => {
    console.log('Failed', errorInfo)
  }

  const addCourseInitialVal = {
    Course: '',
    instructor: '',
    email: '',
    phone: '',
    location: '',
    time: '',
    department: 'mathematics',
  }

  const editInitialVal = {
    course: curCourseObj.course,
    instructor: curCourseObj.instructor,
    email: curCourseObj.email,
    phone: curCourseObj.phone,
    location: curCourseObj.location,
    time: curCourseObj.time,
    department: curCourseObj.department,
  }

  const columns = [
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              HandleEdit(record)
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => HandleDelete(record)}
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const getCourses = async () => {
    // let allCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    let courses = []
    const ref = collection(db, 'coursesTable')
    await getDocs(ref).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() })
      })
    )
    setCoursesData(courses)
  }

  useEffect(() => {
    getCourses()
  }, [])

  return (
    <div>
      <Button type="primary" onClick={openAddCourse}>
        Add Course
      </Button>
      {/* original modal starts */}
      <Modal
        title={addOrEdit === 'addCourse' ? 'New Course' : 'Edit'}
        open={isModalOpen}
        footer={[
          <Button type="primary" key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        onCancel={handleCancel}
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
          initialValues={
            addOrEdit === 'addCourse' ? addCourseInitialVal : editInitialVal
          }
          onFinish={
            addOrEdit === 'addCourse' ? HandleAddCourseFinish : HandleEditFinish
          }
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Course"
            name="course"
            rules={[
              {
                required: true,
                message: 'Please input the course name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Instructor"
            name="instructor"
            rules={[
              {
                required: true,
                message: 'Please input the instructor',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input the email',
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input the phone',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[
              {
                required: true,
                message: 'Please choose the location',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            rules={[
              {
                required: true,
                message: 'Please choose the time',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: 'Please choose the department',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={'mathematics'}> Mathematics </Radio>
              <Radio value={'engineering'}> Engineering </Radio>
            </Radio.Group>
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Add Course modal */}
      {/* <Modal
        title="Select Courses"
        open={isAddCoursesOpen}
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
            remember: true,
          }}
          onFinish={HandleAddCoursesFinish}
          onFinishFailed={HandleAddCoursesFinishFailed}
          autoComplete="off"
        >
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
              // onClick={HandleAddCoursesCancel} 
            >
              Courses confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}
      <Table
        dataSource={coursesData}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
      ;
    </div>
  )
}
