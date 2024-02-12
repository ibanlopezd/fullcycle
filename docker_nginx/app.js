const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const dbConfig = {
  connectionLimit: 10,
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'fullcycle'
};

const db = mysql.createPool(dbConfig);

const maxAttempts = 5;
let attempts = 0;

const createPoolWithRetry = () => {
  db.getConnection((err, connection) => {
    if (err) {
      attempts++;
        if (attempts <= maxAttempts) {
          console.log(`Error connecting to MySQL database. Will try again in 10 seconds. Retrying attempt ${attempts}...`);
          setTimeout(createPoolWithRetry, 10000); 
        } else {
          console.error('Exceeded maximum connection attempts. Giving up.');
        }
        return;
    }

    console.log('Connected to MySQL database!');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ipaddr VARCHAR(255) NOT NULL
      )
    `;

    connection.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table created successfully!');
      connection.release(); 
    });
  });
};

createPoolWithRetry();

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
