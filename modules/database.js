
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

try {
  if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'data'));
  }
} catch (err) {
  console.error('Erro ao criar diretório de dados:', err);
}

const initDatabase = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ appointments: [] }, null, 2));
      console.log('Banco de dados inicializado com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
    throw err; 
  }
};


const readDatabase = (callback) => {
  
  try {
    initDatabase();
    
    
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler banco de dados:', err);
        return callback(err, null);
      }
      
      try {
        const parsedData = JSON.parse(data);
        callback(null, parsedData);
      } catch (parseErr) {
        console.error('Erro ao fazer parse do JSON:', parseErr);
        callback(parseErr, null);
      }
    });
  } catch (err) {
    callback(err, null);
  }
};


const saveDatabase = (data, callback) => {
  try {
    
    const jsonData = JSON.stringify(data, null, 2);
    
    
    fs.writeFile(DB_FILE, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao salvar no banco de dados:', err);
        return callback(err);
      }
      
      console.log('Dados salvos com sucesso!');
      callback(null);
    });
  } catch (err) {
    console.error('Erro ao processar dados para salvar:', err);
    callback(err);
  }
};


const logError = (err) => {
  const logPath = path.join(__dirname, '..', 'data', 'errors.log');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${err.stack || err.message || err}\n`;
  
  try {
    fs.appendFileSync(logPath, logEntry);
  } catch (logErr) {
    console.error('Erro ao registrar log:', logErr);
  }
};

module.exports = {
  readDatabase,
  saveDatabase,
  logError
};