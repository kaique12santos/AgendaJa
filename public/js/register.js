document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            showAlert(errorAlert, 'Por favor, preencha todos os campos corretamente.');
            return;
        }
        
        const formData = {
            patientName: document.getElementById('patientName').value.trim(),
            patientEmail: document.getElementById('patientEmail').value.trim(),
            patientPhone: document.getElementById('patientPhone').value.trim(),
            doctorName: document.getElementById('doctorName').value.trim(),
            specialty: document.getElementById('specialty').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value.trim()
        };
        
        fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Erro ao agendar consulta');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Consulta agendada:', data);
            
            appointmentForm.reset();
            
            showAlert(successAlert, 'Consulta agendada com sucesso!');
            
            setTimeout(() => {
                window.location.href = '/listing';
            }, 2000);
        })
        .catch(error => {
            console.error('Erro:', error);
    
            showAlert(errorAlert, `Erro ao agendar consulta: ${error.message}`);
        });
    });
    
    function validateForm() {
        let isValid = true;
        
        const patientName = document.getElementById('patientName');
        if (patientName.value.trim().length < 3) {
            patientName.classList.add('is-invalid');
            isValid = false;
        } else {
            patientName.classList.remove('is-invalid');
            patientName.classList.add('is-valid');
        }
        
        const patientEmail = document.getElementById('patientEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(patientEmail.value.trim())) {
            patientEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            patientEmail.classList.remove('is-invalid');
            patientEmail.classList.add('is-valid');
        }
        
        const patientPhone = document.getElementById('patientPhone');
        if (patientPhone.value.trim().length < 8) {
            patientPhone.classList.add('is-invalid');
            isValid = false;
        } else {
            patientPhone.classList.remove('is-invalid');
            patientPhone.classList.add('is-valid');
        }
        
        const doctorName = document.getElementById('doctorName');
        if (doctorName.value.trim().length < 3) {
            doctorName.classList.add('is-invalid');
            isValid = false;
        } else {
            doctorName.classList.remove('is-invalid');
            doctorName.classList.add('is-valid');
        }
        
        const specialty = document.getElementById('specialty');
        if (!specialty.value) {
            specialty.classList.add('is-invalid');
            isValid = false;
        } else {
            specialty.classList.remove('is-invalid');
            specialty.classList.add('is-valid');
        }
        
        const date = document.getElementById('date');
        if (!date.value || date.value < today) {
            date.classList.add('is-invalid');
            isValid = false;
        } else {
            date.classList.remove('is-invalid');
            date.classList.add('is-valid');
        }
        
        const time = document.getElementById('time');
        if (!time.value) {
            time.classList.add('is-invalid');
            isValid = false;
        } else {
            time.classList.remove('is-invalid');
            time.classList.add('is-valid');
        }
        
        return isValid;
    }
    
    function showAlert(alertElement, message) {
        if (alertElement.textContent !== message) {
            alertElement.textContent = message;
        }
        
        alertElement.classList.remove('d-none');
        
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, 5000);
    }
    
    const formInputs = appointmentForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
        
        input.addEventListener('blur', function() {
            if (this.id === 'patientName' || this.id === 'doctorName') {
                if (this.value.trim().length < 3) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.add('is-valid');
                }
            } else if (this.id === 'patientEmail') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value.trim())) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.add('is-valid');
                }
            }
        });
    });
});