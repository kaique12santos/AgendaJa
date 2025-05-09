# 🩺 AgendeJá – Sistema de Agendamento de Consultas Médicas

Este é um mini-projeto desenvolvido com **Node.js** para gerenciamento de agendamentos médicos, com rotas para cadastro, listagem, busca, atualização e cancelamento de consultas. O objetivo é demonstrar o uso de conceitos fundamentais do Node.js como módulos, callbacks, tratamento de erros, REPL e comandos de console.

## 📚 Estudo de Caso

A startup fictícia **AgendeJá** precisa de uma solução ágil, escalável e de baixo custo inicial para agendamento de consultas médicas online. Com isso, o time optou por Node.js por sua natureza assíncrona, modular e leve.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para criação de APIs RESTful.
- **File System (fs)**: Manipulação de arquivos para simular um banco de dados local.
- **npm**: Gerenciador de pacotes Node.js.
- **Validação personalizada**: Simples regras de validação interna (sem bibliotecas externas neste protótipo).
- **uuid**: Para geração de identificadores únicos dos agendamentos.
- **morgan**: Middleware para registrar requisições HTTP no terminal (log).
- **nodemon**: Utilitário que reinicia automaticamente o servidor durante o desenvolvimento.
- **body-parser**: Middleware moderno para interpretar o corpo das requisições (JSON, formulário, etc).
- **joi**: Biblioteca de validação de dados, usada para validar os campos dos agendamentos.


---

## 📁 Estrutura do Projeto

```
project-root/
│
├── package.json           # Configuração do projeto e dependências
├── server.js              # Arquivo principal do servidor
│
├── modules/               # Módulos do sistema
│   ├── appointments.js    # Lógica de manipulação de agendamentos
│   └── database.js        # Simulação de um banco de dados
│
├── routes/                # Rotas da API
│   ├── appointmentRoutes.js  # Rotas para operações com agendamentos
│   └── pageRoutes.js      # Rotas para renderização de páginas
│
├── public/                # Arquivos estáticos
│   ├── css/               # Estilos CSS
│   │   └── style.css      # Folha de estilo principal
│   └── js/                # JavaScript do cliente
│       ├── register.js    # Lógica da página de cadastro
│       └── listing.js     # Lógica da página de listagem
│
└── views/                 # Páginas HTML
    ├── register.html      # Página de cadastro
    └── listing.html       # Página de listagem
└── README.md
```

---

## ✅ Funcionalidades

- **[POST] /appointments** – Criar um novo agendamento
- **[GET] /appointments** – Listar todos os agendamentos
- **[GET] /appointments/search** – Buscar por filtros (nome, data, especialidade)
- **[GET] /appointments/:id** – Consultar agendamento por ID
- **[PUT] /appointments/:id** – Atualizar agendamento
- **[DELETE] /appointments/:id** – Cancelar agendamento
- **[GET] /repl-demo** – Exemplos de uso via REPL

---

## 🔁 Uso do REPL

Você pode testar os módulos diretamente no terminal com o REPL do Node.js:

```bash
$ node
> const appointments = require('./modules/appointments');
> appointments.listAppointments((err, list) => console.log(list));
```

Veja mais exemplos acessando `/repl-demo` em sua API.

---

## 📦 Inicialização com npm

```bash
npm init -y
npm install express
```

---

## 🧪 Executando o Projeto

```bash
node server.js
```

Acesse:
- Formulário: `http://localhost:3000/register`
- Listagem: `http://localhost:3000/listing`
- API REST: `http://localhost:3000/appointments`

---

## ⚙️ Conceitos Node.js Aplicados

- **Modularização**: Código separado em arquivos com responsabilidades distintas.
- **Callbacks**: Operações assíncronas de leitura e escrita de dados.
- **Tratamento de erros**: Uso de `try/catch` e callbacks error-first.
- **Console**: Uso de `console.log` e `console.error` para logs.
- **REPL**: Demonstrado para testes interativos em tempo real.

---

## 💡 Melhorias Futuras

- Uso de bibliotecas de validação como `Joi` ou `Yup`
- Interface com banco de dados real (PostgreSQL, MongoDB)
- Upload de arquivos e envio de e-mails de confirmação
- Autenticação e controle de usuários

---

## 👨‍💻 Autor: Kaique Caitano dos Santos

Projeto desenvolvido como parte do estudo de caso proposto para aprofundar conceitos de Node.js.

---