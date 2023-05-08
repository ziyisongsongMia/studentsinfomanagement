const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

/*  */

app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '123456',
  database: 'register',
})

app.post('/register', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const address = req.body.address
  const authProvider = req.body.authProvider
  const gender = req.body.gender
  const id = req.body.id
  const name = req.body.name
  const postcode = req.body.postcode
  const uid = req.body.uid
  db.query(
    'INSERT INTO users (address, authProvider, email,id, name, password, gender, postcode, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [address, authProvider, email, id, name, password, gender, postcode, uid],
    (err, result) => {
      if (result) {
        res.send(result)
      } else {
        res.send({ message: 'ENTER CORRECT ASKED DETAILS!' })
      }
    }
  )
})

app.post('/', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err) {
        req.setEncoding({ err: err })
      } else {
        if (result.length > 0) {
          res.send(result)
        } else {
          res.send({ message: 'WRONG USERNAME OR PASSWORD!' })
        }
      }
    }
  )
})

///////////////////////Students starts///////////////////////
app.get('/', (req, res) => {
  res.json('hello')
})

app.get('/layout', (req, res) => {
  const q = 'SELECT * FROM studentstable'
  db.query(q, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err)
    }

    return res.json(data)
  })
})

app.post('/layout', (req, res) => {
  const q =
    'INSERT INTO studentstable(`birthdate`, `courses_selected`, `email`, `firstname`,`id`,`key`,`lastname`,`name`,`phone`,`selected_courses_keys`,`sex`) VALUES (?)'

  const values = [
    req.body.birthdate,
    req.body.courses_selected,
    req.body.email,
    req.body.firstname,
    req.body.id,
    req.body.key,
    req.body.lastname,
    req.body.name,
    req.body.phone,
    req.body.selected_courses_keys,
    req.body.sex,
  ]

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

app.delete('/layout/:id', (req, res) => {
  const studentId = req.params.id
  const q = ' DELETE FROM studentstable WHERE id = ? '

  db.query(q, [studentId], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

app.put('/layout/:id', (req, res) => {
  const studentId = req.params.id
  const q =
    'UPDATE studentstable SET `birthdate`= ?, `courses_selected`= ?, `email`= ?, `firstname`= ?,`id`= ?,`key`= ?,`lastname`= ?,`name`= ?,`phone`= ?,`selected_courses_keys`= ?,`sex`= ? WHERE id = ?'

  const values = [
    req.body.birthdate,
    req.body.courses_selected,
    req.body.email,
    req.body.firstname,
    req.body.id,
    req.body.key,
    req.body.lastname,
    req.body.name,
    req.body.phone,
    req.body.selected_courses_keys,
    req.body.sex,
  ]

  db.query(q, [...values, studentId], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

////////////////////Students ends//////////////////////////

////////////////////Courses starts//////////////////////////
app.get('/layout/CoursesInfo', (req, res) => {
  const q = 'SELECT * FROM coursestable'
  db.query(q, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err)
    }
    return res.json(data)
  })
})

app.post('/layout/CoursesInfo', (req, res) => {
  const q =
    'INSERT INTO coursestable(`course`,`department`,`email`,`id`,`instructor`,`key`,`location`,`phone`,`time`) VALUES (?)'

  const values = [
    req.body.course,
    req.body.department,
    req.body.email,
    req.body.id,
    req.body.instructor,
    req.body.key,
    req.body.location,
    req.body.phone,
    req.body.time,
  ]

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

app.put('/layout/CoursesInfo/:id', (req, res) => {
  const courseId = req.params.id
  const q =
    'UPDATE coursestable SET `course`=?,`department`=?,`email`=?,`id`=?,`instructor`=?,`key`=?,`location`=?,`phone`=?,`time`=? WHERE id =?'

  const values = [
    req.body.course,
    req.body.department,
    req.body.email,
    req.body.id,
    req.body.instructor,
    req.body.key,
    req.body.location,
    req.body.phone,
    req.body.time,
  ]

  db.query(q, [...values, courseId], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

app.delete('/layout/CoursesInfo/:id', (req, res) => {
  const courseId = req.params.id
  const q = 'DELETE FROM coursestable WHERE id = ?'

  db.query(q, [courseId], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

////////////////////Courses ends//////////////////////////

////////////////////UserInfo starts//////////////////////////
app.put('/layout/UserInfo/:id', (req, res) => {
  let userId = req.params.id
  const q =
    'UPDATE users SET `email`= ?, `name`= ?, `gender`=?, `address`=?,`postcode`= ? WHERE id = ?'

  const values = [
    req.body.email,
    req.body.name,
    req.body.gender,
    req.body.address,
    req.body.postcode,
  ]

  db.query(q, [...values, userId], (err, data) => {
    if (err) return res.send(err)
    return res.json(data)
  })
})

////////////////////UserInfo starts//////////////////////////

app.listen(3001, () => {
  console.log('running backend server')
})
