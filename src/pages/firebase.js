// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from 'firebase/firestore'
import { logedout } from '../redux/userSlice.js'
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from '../redux/currentUserSlice.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDt56g1rcmSECNQHR4UsLdwceWRVedK8RY',
  authDomain: 'studentsinfomanagement.firebaseapp.com',
  databaseURL: 'https://studentsinfomanagement-default-rtdb.firebaseio.com',
  projectId: 'studentsinfomanagement',
  storageBucket: 'studentsinfomanagement.appspot.com',
  messagingSenderId: '792650891116',
  appId: '1:792650891116:web:7deb0b0af99e5ce30afd49',
  measurementId: 'G-F0RTL8GZEP',
}

const app = initializeApp(firebaseConfig)
//Localize the authentication flow
const auth = getAuth(app)
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

//Create an instance of the Google provider object:
const googleProvider = new GoogleAuthProvider()

// const dispatch = useDispatch()

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const curData = { uid: res.user.uid, name: res.user.displayName }
    console.log('curData', JSON.stringify(curData))
    // localStorage.setItem('currentUser', JSON.stringify(curData))
    // dispatch(updateCurrentUser(curData))

    return curData
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

/* const trialFireStore = async () => {
  try {
    const qry2 = query(collection(db, 'users'))
    console.log(qry2)
  } catch (error) {
    console.log(error)
  }
} */

const logInWithEmailAndPassword = async (email, password) => {
  try {
    /*  const qry = query(collection(db, 'users'))
    console.log('qry1', qry)
    const querySnapshot = await getDocs(qry)
    console.log('querySnapshot', querySnapshot)
    const curData = querySnapshot.docs.map((cur) => cur.data())
    console.log('curData', curData) */

    const res = await signInWithEmailAndPassword(auth, email, password)

    const qry = query(collection(db, 'users'), where('email', '==', email))

    /*   const qry2 = query(collection(db, 'users'))
    const querySnapshot2 = await getDocs(qry2)
    const curData2 = querySnapshot2.docs
    console.log('curData2', curData2)
    let results = []
    querySnapshot2.docs.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() })
    })
    console.log('results', results) */

    /*  console.log('qry1', qry) */
    const querySnapshot = await getDocs(qry)
    /*    console.log('querySnapshot', querySnapshot) */

    const curData = querySnapshot.docs[0].data()
    /*  console.log('curData', curData) */
    const snapshotsData = {
      id: querySnapshot.docs[0].id,
      ...curData,
    }
    console.log('snapshotsData', snapshotsData)
    // localStorage.setItem('currentUser', JSON.stringify(snapshotsData))
    return snapshotsData
  } catch (err) {
    console.log(err)
  }
}

const registerWithEmailAndPassword = async (
  name,
  email,
  password,
  gender,
  address,
  postcode
) => {
  try {
    if (!(name && email && address && gender && address && postcode)) {
      alert('Please fill in all fields properly')
      return
    }

    let response = await createUserWithEmailAndPassword(auth, email, password)

    const user = response.user

    const res = await addDoc(collection(db, 'users'), {
      uid: user.uid,
      authProvider: 'local',
      name,
      email,
      password,
      gender,
      address,
      postcode,
    })

    /*  const res2 = await addDoc(collection(db, 'userss'), {
      uid: user.uid,
      authProvider: 'local',
      name,
      email,
      password,
      gender,
      address,
      postcode,
    }) */
    /*  console.log(res) */
  } catch (error) {
    alert(error.message)
  }
}

const sendPasswordReset = async (email) => {
  try {
    // The password reset email will be sent by Firebase.
    await sendPasswordResetEmail(auth, email)
    alert('Password reset link sent!')
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const logout = () => {
  signOut(auth)
  window.location.replace('/')
}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  /* trialFireStore, */
}
