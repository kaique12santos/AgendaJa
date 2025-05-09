const {v4: uuidv4}= require('uuid');
const Joi = require('joi');
const { readDatabase,saveDatabase}=require('./database.js');

const appointmentSchema = Joi.object({
    patientName: Joi.string().min(3).max(100).required(),
    patientEmail: Joi.string().email().required(),
    patientPhone: Joi.string().min(8).max(20).required(),
    doctorName: Joi.string().min(3).max(100).required(),
    specialty: Joi.string().min(3).max(50).required(),
    date: Joi.date().iso().min('now').required(),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    notes: Joi.string().max(500).allow('', null)
  });
  
  
  const listAppointments = (callback) => {
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
  
      const sortedAppointments = data.appointments.sort((a, b) => 
        new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
      );
      
      callback(null, sortedAppointments);
    });
  };
  
  
  const createAppointment = (appointment, callback) => {
  
    const { error, value } = appointmentSchema.validate(appointment);
    
    if (error) {
      console.error('Erro de validação:', error.details);
      return callback(error, null);
    }
    
  
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
  
      const newAppointment = {
        id: uuidv4(),
        ...value,
        createdAt: new Date().toISOString()
      };
      
  
      data.appointments.push(newAppointment);
      
  
      saveDatabase(data, (saveErr) => {
        if (saveErr) {
          return callback(saveErr, null);
        }
        
        callback(null, newAppointment);
      });
    });
  };
  
  
  const getAppointmentById = (id, callback) => {
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
      const appointment = data.appointments.find(app => app.id === id);
      
      if (!appointment) {
        return callback(new Error('Agendamento não encontrado'), null);
      }
      
      callback(null, appointment);
    });
  };
  
  
  const updateAppointment = (id, updatedFields, callback) => {
  
    const updateSchema = appointmentSchema.fork(
      Object.keys(appointmentSchema.describe().keys), 
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(updatedFields);
    
    if (error) {
      console.error('Erro de validação na atualização:', error.details);
      return callback(error, null);
    }
    
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
      const index = data.appointments.findIndex(app => app.id === id);
      
      if (index === -1) {
        return callback(new Error('Agendamento não encontrado'), null);
      }
      
  
      data.appointments[index] = {
        ...data.appointments[index],
        ...value,
        updatedAt: new Date().toISOString()
      };
      
      saveDatabase(data, (saveErr) => {
        if (saveErr) {
          return callback(saveErr, null);
        }
        
        callback(null, data.appointments[index]);
      });
    });
  };
  
  
  const cancelAppointment = (id, callback) => {
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
      const index = data.appointments.findIndex(app => app.id === id);
      
      if (index === -1) {
        return callback(new Error('Agendamento não encontrado'), null);
      }
      
  
      const removedAppointment = data.appointments.splice(index, 1)[0];
      
      saveDatabase(data, (saveErr) => {
        if (saveErr) {
          return callback(saveErr, null);
        }
        
        callback(null, removedAppointment);
      });
    });
  };
  
  
  const searchAppointments = (filters, callback) => {
    readDatabase((err, data) => {
      if (err) {
        return callback(err, null);
      }
      
      let filteredAppointments = [...data.appointments];
      
    
      if (filters.doctorName) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.doctorName.toLowerCase().includes(filters.doctorName.toLowerCase())
        );
      }
      
      if (filters.patientName) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
        );
      }
      
      if (filters.specialty) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
        );
      }
      
      if (filters.date) {
        filteredAppointments = filteredAppointments.filter(app => 
          app.date === filters.date
        );
      }
      
      callback(null, filteredAppointments);
    });
  };
  
  module.exports = {
    listAppointments,
    createAppointment,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
    searchAppointments
  };