const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Konfigurasi database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wpu_rest'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

app.use(bodyParser.json());

//Middleware untuk verifikasi token JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
       return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ auth: false, message: 'Internal Server Error' });
    }
    if (results.length > 0) {
      const user = results[0];
      // Verifikasi password
      if (user.password === password) {
        // Buat token JWT
        const token = jwt.sign({ id: user.id }, 'your_secret_key', {
          expiresIn: 86400 // expires in 24 hours
        });
        // Kirim respons dengan token
        res.status(200).json({ auth: true, token: token, username: user.username });
      } else {
        // Password tidak cocok
        res.status(401).json({ auth: false, message: 'Invalid credentials' });
      }
    } else {
      // Pengguna tidak ditemukan
      res.status(401).json({ auth: false, message: 'User not found' });
    }
  });
});
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed successfully.' });
});



app.get('/users', verifyToken, (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});



app.post('/users', (req, res) => { 
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }

  db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Periksa jumlah baris yang terpengaruh oleh query INSERT
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'User added successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to add user.' });
    }
  });
});


//MENGGUNAKAN TOKEN
// app.post('/users', verifyToken, (req, res) => {
//   const { email, username, password } = req.body;

//   // Pastikan email, username, dan password ada sebelum eksekusi query
//   if (!email || !username || !password) {
//     return res.status(400).json({ message: 'Email, username, and password are required.' });
//   }

//   db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, password], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }

//     // Periksa jumlah baris yang terpengaruh oleh query INSERT
//     if (result.affectedRows > 0) {
//       res.status(201).json({ message: 'User added successfully.' });
//     } else {
//       res.status(500).json({ message: 'Failed to add user.' });
//     }
//   });
// });






app.put('/users', (req, res) => {
  const email = req.query.email; 
  const { password } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'User Email is required.' });
  }

  db.query('UPDATE users SET password=? WHERE email=?', [password, email], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Periksa jumlah baris yang terpengaruh oleh query UPDATE
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});


//MENGGUNAKAN TOKEN
// app.put('/users', verifyToken, (req, res) => {
//   const userId = req.query.id; // Mengambil nilai ID dari parameter query
//   const { username, email, password } = req.body;
  
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required.' });
//   }

//   db.query('UPDATE users SET username=?, email=?, password=? WHERE id=?', [username, email, password, userId], (err, result) => {
//     if (err) {
//       console.error('Error updating user:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }

//     // Periksa jumlah baris yang terpengaruh oleh query UPDATE
//     if (result.affectedRows > 0) {
//       res.status(200).json({ message: 'User updated successfully.' });
//     } else {
//       res.status(404).json({ message: 'User not found.' });
//     }
//   });
// });



app.delete('/users', verifyToken, (req, res) => {
  const userId = req.query.id; // Mengambil nilai ID dari parameter query
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  db.query('DELETE FROM users WHERE id=?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Periksa jumlah baris yang terpengaruh oleh query DELETE
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});






// FORM_AUDIT
app.post('/from_audit', verifyToken, (req, res) => {
  const { judul, tanggal_audit, tanggal_close, auditor } = req.body;

  // Pastikan judul, tanggal_audit, tanggal_close, dan auditor ada sebelum eksekusi query
  if (!judul || !tanggal_audit || !tanggal_close || !auditor) {
    return res.status(400).json({ message: 'judul, tanggal_audit, tanggal_close, and auditor are required.' });
  }

  db.query('INSERT INTO from_audit (judul, tanggal_audit, tanggal_close, auditor) VALUES (?, ?, ?, ?)', [judul, tanggal_audit, tanggal_close, auditor], (err, result) => {
    if (err) {
      console.error('Error inserting audit:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // Periksa jumlah baris yang terpengaruh oleh query INSERT
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Audit added successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to add audit.' });
    }
  });
});


app.get('/from_audit', verifyToken, (req, res) => {
  const { auditor } = req.query; // Mengambil nilai auditor dari parameter query
  db.query('SELECT * FROM from_audit WHERE auditor=?', [auditor], (err, results) => {
    if (err) {
      console.error('Error querying from_audit:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});



app.put('/from_audit', verifyToken, (req, res) => {
  const userId = req.query.id; 
  const { judul, tanggal_audit, tanggal_close, auditor } = req.body;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  db.query('UPDATE from_audit SET judul=?, tanggal_audit=?, tanggal_close=? WHERE id=?', [judul, tanggal_audit, tanggal_close, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Periksa jumlah baris yang terpengaruh oleh query UPDATE
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});