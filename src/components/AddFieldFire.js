/* import React from 'react'
import { db } from '../pages/firebase.js'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from 'firebase/firestore'

const AddFieldFire = async (collecName, obj) => {
  try {
    await addDoc(collection(db, collecName, obj))
  } catch (err) {
    console.log('hello')
   //console.log(err.message) 
    console.log('hello2')
  }

  return
}

export default AddFieldFire
 */
