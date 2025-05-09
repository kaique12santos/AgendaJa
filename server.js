
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');


const { logError } = require('./modules/database');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); 


const appointmentRoutes = require('./routes/appointmentRoutes');
const pageRoutes = require('./routes/pageRoutes');


app.use('/api/appointments', appointmentRoutes);
app.use('/', pageRoutes);


app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  logError(err); 
  res.status(500).json({ error: 'Erro interno do servidor' });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para visualizar a aplicação`);

});


process.on('uncaughtException', (err) => {
  console.error('ERRO NÃO TRATADO:', err);
  logError(err);
  process.exit(1); 
});

module.exports = app;