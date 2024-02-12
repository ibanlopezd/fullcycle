const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'fullcycle'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados MySQL estabelecida!');
});

app.get('/', (req, res) => {
  const name = 'John Doe'; // Nome a ser cadastrado
  const sql = `INSERT INTO people (name) VALUES ('${name}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao inserir nome no banco de dados:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    console.log('Nome cadastrado no banco de dados');
    res.send('<h1>Full Cycle Rocks!</h1>');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});
