
const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
  res.redirect('/listing');
});


router.get('/listing', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'listing.html'));
});


router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

// Rota para documentação/exemplo de uso do REPL
router.get('/repl-demo', (req, res) => {
  const replExamples = {
    message: 'Exemplos de como usar o REPL do Node.js com este projeto',
    examples: [
      {
        description: 'Importar e testar o módulo de agendamentos',
        command: 'const appointments = require("./modules/appointments");',
        nextCommand: 'appointments.listAppointments((err, list) => console.log(list));'
      },
      {
        description: 'Criar um agendamento de teste',
        command: `
const testAppointment = {
  patientName: "João Silva",
  patientEmail: "joao@email.com",
  patientPhone: "11987654321",
  doctorName: "Dra. Ana Médica",
  specialty: "Cardiologia",
  date: "2023-06-30",
  time: "14:30",
  notes: "Primeira consulta"
};

appointments.createAppointment(testAppointment, (err, result) => {
  if (err) console.error(err);
  else console.log("Criado:", result);
});`
      },
      {
        description: 'Testar manipulação de erros',
        command: `
// Teste com dados inválidos para ver tratamento de erro
const invalidAppointment = { patientName: "Te" };
appointments.createAppointment(invalidAppointment, (err, result) => {
  if (err) console.error("Erro esperado:", err.message);
  else console.log(result);
});`
      }
    ],
    howToUse: 'Para usar o REPL, abra o terminal e execute "node" no diretório do projeto. Em seguida, copie e cole os comandos acima para testar as funcionalidades.'
  };
  
  res.json(replExamples);
});

module.exports = router;