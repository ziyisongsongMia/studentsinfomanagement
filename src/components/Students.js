import { React, useState, useEffect, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import '../pages/Dashboard.css'
import { auth, db, logout } from '../pages/firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import {
  Table,
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  Radio,
  Space,
  Tree,
  Popconfirm,
} from 'antd'
import uuid from 'react-uuid'
import dayjs from 'dayjs'
import moment from 'moment'
import AddEditStudents from './AddEditStudents'
import StudentsAddCourse from './StudentsAddCourse'
/* import trialFireStore from '../pages/firebase.js' */
import {
  getFirestore,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { updateStudents } from '../redux/studentsSlice.js'

function Students() {
  /*  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('') */
  const navigate = useNavigate()
  const dispatch = useDispatch()

  /*   const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      // console.log(q)
      //console.log(doc)

      const data = doc.docs[0].data() //这是什么？
      // console.log(data)
      //setName(data.name)
      console.log(data.name)
    } catch (err) {
      //console.error(err)
      alert('An error occured while fetching user data') //为什么报错？
    }
  } */

  //General students form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addOrEdit, setAddOrEdit] = useState('')
  const [studentsData, setStudentsData] = useState([])
  const [curStudentObj, setCurStudentObj] = useState({})
  const [selectedCoursesKeys, setSelectedCoursesKeys] = useState([])
  const [isAddCoursesOpen, setIsAddCoursesOpen] = useState(false)
  const [treeCheckedIdsArr, setTreeCheckedIdsArr] = useState([])
  const [curKey, setCurKey] = useState('')

  /*   useEffect(() => {
    if (loading) return
    if (!user) return navigate('/')

    // fetchUserName()
  }, [user, loading]) */

  const getStudents = async () => {
    let allUsers = []
    const ref = collection(db, 'studentsTable')
    await getDocs(ref).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        allUsers.push({ ...doc.data() })
      })
    )
    /* let allUsers = JSON.parse(localStorage.getItem('users') || '[]') */
    setStudentsData(allUsers)
  }

  useEffect(() => {
    getStudents()
  }, [])

  ////////////////////set modal state starts //////////////////
  const showModal = () => {
    setIsModalOpen(true)
  }

  const openAddUser = () => {
    showModal()
    setAddOrEdit('adduser')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  ////////////////////set modal state ends//////////////////

  //////////////add user starts///////////

  ////////////add user ends////////////

  /////////Edit/////////////////////////////////////////////////////
  const HandleEdit = (record) => {
    /* console.log(record) */
    showModal()
    setAddOrEdit('edit')
    setCurStudentObj(record)
    /* setCurKey(record.key) */
  }

  ///////Edit is over//////////////////

  ///////Delete starts///////////////////////
  const HandleDelete = async (record) => {
    console.log(record)
    console.log(record.id)
    const ref1 = doc(db, 'studentsTable', record.id)
    await deleteDoc(ref1)
    /*     let localStorageArr = JSON.parse(localStorage.getItem('users'))
    let RemainingUsers = localStorageArr.filter((obj) => obj.key !== record.key)
    console.log(RemainingUsers)
   
    localStorage.setItem('users', JSON.stringify(RemainingUsers)) */

    const ref2 = collection(db, 'studentsTable')
    await getDocs(ref2).then((snapshot) => {
      let studentsLeft = []
      snapshot.docs.forEach((doc) => {
        studentsLeft.push({ ...doc.data() })
      })
      dispatch(updateStudents(studentsLeft))
      setStudentsData(studentsLeft)
    })
  }

  ///////Delete ends////////////////////////

  //////////Handle add course starts///////////////
  const HandleAddCourses = async (record) => {
    console.log(record) //9 items
    setIsAddCoursesOpen(true)
    setCurKey(record.key)

    let allUsers = []
    const ref = collection(db, 'studentsTable')
    await getDocs(ref).then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        allUsers.push({ ...doc.data() })
      })
    )

    setCurStudentObj(allUsers.find((obj) => obj.key === record.key))
    setTreeCheckedIdsArr(record.selected_courses_keys)
  }
  //////////Handle add course ends//////////////

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: 'Birthdate',
      dataIndex: 'birthdate',
      key: 'birthdate',
    },
    {
      title: 'Courses selected',
      dataIndex: 'courses_selected',
      key: 'courses_selected',
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

          <a
            onClick={() => {
              HandleAddCourses(record)
            }}
          >
            Add courses
          </a>
        </Space>
      ),
    },
  ]

  const AddEditStudentsProps = {
    curStudentObj,
    setCurStudentObj,
    studentsData,
    setIsModalOpen,
    setStudentsData,
    setIsModalOpen,
    addOrEdit,
    isModalOpen,
    handleCancel,
  }

  /* const allCourses = JSON.parse(localStorage.getItem('courses') || '[]') */
  const addCoursesProps = {
    isAddCoursesOpen,
    setIsAddCoursesOpen,
    curStudentObj,
    setCurStudentObj,
    setStudentsData,
    selectedCoursesKeys,
    setSelectedCoursesKeys,
    treeCheckedIdsArr,
    setTreeCheckedIdsArr,
    curKey,
    setCurKey,
  }

  return (
    <div>
      <Button type="primary" onClick={openAddUser}>
        Add user
      </Button>
      {/* initial table */}
      <Table
        dataSource={studentsData}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />

      <AddEditStudents {...AddEditStudentsProps} />
      <StudentsAddCourse {...addCoursesProps} />
    </div>
  )
}
export default Students
