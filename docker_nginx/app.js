const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const db = mysql.createPool({
  connectionLimit: 10, 
  host: 'mysql', 
  user: 'root',
  password: 'password',
  database: 'fullcycle'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release(); 
});

app.get('/', (req, res) => {
  const name = 'John Doe'; 
  const ipaddr = req.ip; 

  const sql = `INSERT INTO people (name, ipaddr) VALUES (?, ?)`;
  const values = [name, ipaddr];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Data inserted into database');
    res.send(`<h1>Full Cycle Rocks!</h1><h2>Your IP address: ${ipaddr}</h2>`);
  });
});

app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
