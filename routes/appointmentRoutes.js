
const express = require('express');
const router = express.Router();
const appointmentModule = require('../modules/appointments');


router.get('/', (req, res) => {

  appointmentModule.listAppointments((err, appointments) => {
    if (err) {
      console.error('Erro ao listar agendamentos:', err);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
    
    res.json({ appointments });
  });
});


router.get('/search', (req, res) => {
  const filters = {
    doctorName: req.query.doctor,
    patientName: req.query.patient,
    specialty: req.query.specialty,
    date: req.query.date
  };
  
  appointmentModule.searchAppointments(filters, (err, appointments) => {
    if (err) {
      console.error('Erro na busca de agendamentos:', err);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
    
    res.json({ appointments });
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  appointmentModule.getAppointmentById(id, (err, appointment) => {
    if (err) {
      console.error(`Erro ao buscar agendamento ${id}:`, err);
      

      if (err.message === 'Agendamento não encontrado') {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
    
    res.json({ appointment });
  });
});


router.post('/', (req, res) => {
  const appointmentData = req.body;
  
  try {
    if (!appointmentData) {
      throw new Error('Dados do agendamento não fornecidos');
    }
    
    appointmentModule.createAppointment(appointmentData, (err, newAppointment) => {
      if (err) {
        console.error('Erro ao criar agendamento:', err);
        
        if (err.name === 'ValidationError') {
          return res.status(400).json({ 
            error: 'Dados inválidos', 
            details: err.details 
          });
        }
        
        return res.status(500).json({ error: 'Erro ao criar agendamento' });
      }
      
      res.status(201).json({ 
        message: 'Agendamento criado com sucesso', 
        appointment: newAppointment 
      });
    });
  } catch (err) {

    console.error('Exceção capturada:', err);
    res.status(400).json({ error: err.message });
  }
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  
  appointmentModule.updateAppointment(id, updateData, (err, updatedAppointment) => {
    if (err) {
      console.error(`Erro ao atualizar agendamento ${id}:`, err);
      
      if (err.message === 'Agendamento não encontrado') {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: err.details 
        });
      }
      
      return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
    
    res.json({ 
      message: 'Agendamento atualizado com sucesso', 
      appointment: updatedAppointment 
    });
  });
});


router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  appointmentModule.cancelAppointment(id, (err, cancelledAppointment) => {
    if (err) {
      console.error(`Erro ao cancelar agendamento ${id}:`, err);
      
      if (err.message === 'Agendamento não encontrado') {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro ao cancelar agendamento' });
    }
    
    res.json({ 
      message: 'Agendamento cancelado com sucesso', 
      appointment: cancelledAppointment 
    });
  });
});

module.exports = router;