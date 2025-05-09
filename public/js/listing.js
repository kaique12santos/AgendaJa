document.addEventListener('DOMContentLoaded', function() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    const loadingRow = document.getElementById('loadingRow');
    const noAppointmentsRow = document.getElementById('noAppointmentsRow');
    const filterForm = document.getElementById('filterForm');
    const clearFiltersBtn = document.getElementById('clearFilters');
    

    const appointmentDetailsModal = new bootstrap.Modal(document.getElementById('appointmentDetailsModal'));
    const cancelConfirmModal = new bootstrap.Modal(document.getElementById('cancelConfirmModal'));
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    

    const resultToast = new bootstrap.Toast(document.getElementById('resultToast'));
    const toastHeader = document.getElementById('toastHeader');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    

    let currentAppointments = [];
    let appointmentToCancel = null;
    
    loadAppointments();
    
    function loadAppointments(filters = {}) {
        loadingRow.classList.remove('d-none');
        noAppointmentsRow.classList.add('d-none');
        
        const existingRows = appointmentsTable.querySelectorAll('tr:not(#loadingRow):not(#noAppointmentsRow)');
        existingRows.forEach(row => row.remove());
        
        console.log('Carregando agendamentos com filtros:', filters);
        
        let url = '/api/appointments';
        if (Object.keys(filters).length > 0) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });
            url += '?' + queryParams.toString();
        }
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar agendamentos');
                }
                return response.json();
            })
            .then(data => {

                const appointments = Array.isArray(data) ? data : (data.appointments || []);
                

                currentAppointments = appointments;
                
               
                loadingRow.classList.add('d-none');
                
                
                if (appointments.length === 0) {
                    noAppointmentsRow.classList.remove('d-none');
                } else {
           
                    appointments.forEach(appointment => {
                        appendAppointmentRow(appointment);
                    });
                }
                
                console.log('Dados recebidos da API:', data);
                console.log('Agendamentos processados:', appointments);
            })
            .catch(error => {
                console.error('Erro:', error);
                loadingRow.classList.add('d-none');
                
                showToast('Erro', `Falha ao carregar agendamentos: ${error.message}`, 'danger');
            });
    }
    
    function appendAppointmentRow(appointment) {
        const row = document.createElement('tr');
        
        if (!appointment || typeof appointment !== 'object') {
            console.error('Agendamento inválido:', appointment);
            return; 
        }
        
        const patientName = appointment.patientName || 'N/A';
        const doctorName = appointment.doctorName || 'N/A';
        const specialty = appointment.specialty || 'N/A';
        const time = appointment.time || 'N/A';
        
        let formattedDate = 'N/A';
        if (appointment.date) {
            try {
                const appointmentDate = new Date(appointment.date);
                if (!isNaN(appointmentDate.getTime())) {
                    formattedDate = appointmentDate.toLocaleDateString('pt-BR');
                }
            } catch (e) {
                console.error('Erro ao formatar data:', e);
            }
        }
        

        const appointmentId = appointment._id || appointment.id || '';
        
        row.innerHTML = `
            <td>${patientName}</td>
            <td>${doctorName}</td>
            <td>${specialty}</td>
            <td>${formattedDate}</td>
            <td>${time}</td>
            <td>
                <button class="btn btn-sm btn-info action-btn view-details" data-id="${appointmentId}" title="Ver Detalhes">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger action-btn cancel-appointment" data-id="${appointmentId}" title="Cancelar Consulta">
                    <i class="bi bi-x-circle"></i>
                </button>
            </td>
        `;
        
        appointmentsTable.appendChild(row);
        

        row.querySelector('.view-details').addEventListener('click', () => showAppointmentDetails(appointment._id));
        row.querySelector('.cancel-appointment').addEventListener('click', () => showCancelConfirmation(appointment._id));
    }
    

    function showAppointmentDetails(appointmentId) {
        const appointment = currentAppointments.find(a => 
            (a._id === appointmentId) || (a.id === appointmentId)
        );
        
        if (!appointment) {
            showToast('Erro', 'Agendamento não encontrado', 'danger');
            return;
        }
        
        let formattedDate = 'Data não disponível';
        if (appointment.date) {
            try {
                const appointmentDate = new Date(appointment.date);
                if (!isNaN(appointmentDate.getTime())) {
                    formattedDate = appointmentDate.toLocaleDateString('pt-BR');
                }
            } catch (e) {
                console.error('Erro ao formatar data para o modal:', e);
            }
        }
        
        const patientName = appointment.patientName || 'Nome não disponível';
        const patientEmail = appointment.patientEmail || 'Email não disponível';
        const patientPhone = appointment.patientPhone || 'Telefone não disponível';
        const doctorName = appointment.doctorName || 'Nome não disponível';
        const specialty = appointment.specialty || 'Especialidade não disponível';
        const time = appointment.time || 'Horário não disponível';
        const notes = appointment.notes || 'Nenhuma observação registrada.';
        
        document.getElementById('modalPatientName').textContent = patientName;
        document.getElementById('modalPatientContacts').textContent = 
            `Email: ${patientEmail} | Telefone: ${patientPhone}`;
        document.getElementById('modalAppointmentDetails').textContent = 
            `Dr(a). ${doctorName} - ${specialty} | ${formattedDate} às ${time}`;
        document.getElementById('modalNotes').textContent = notes;
        
  
        appointmentDetailsModal.show();
    }
    
    function showCancelConfirmation(appointmentId) {
        const appointment = currentAppointments.find(a => 
            (a._id === appointmentId) || (a.id === appointmentId)
        );
        
        if (!appointment) {
            showToast('Erro', 'Agendamento não encontrado', 'danger');
            return;
        }
        
        appointmentToCancel = appointment;
        
        let formattedDate = 'Data não disponível';
        if (appointment.date) {
            try {
                const appointmentDate = new Date(appointment.date);
                if (!isNaN(appointmentDate.getTime())) {
                    formattedDate = appointmentDate.toLocaleDateString('pt-BR');
                }
            } catch (e) {
                console.error('Erro ao formatar data para o modal de cancelamento:', e);
            }
        }
        
        const patientName = appointment.patientName || 'Nome não disponível';
        const time = appointment.time || 'Horário não disponível';
        
        document.getElementById('cancelPatientName').textContent = patientName;
        document.getElementById('cancelDateTime').textContent = `${formattedDate} às ${time}`;
        
    
        cancelConfirmModal.show();
    }
    
    confirmCancelBtn.addEventListener('click', function() {
        if (!appointmentToCancel) {
            cancelConfirmModal.hide();
            return;
        }
        
        const appointmentId = appointmentToCancel._id || appointmentToCancel.id;
        
        if (!appointmentId) {
            showToast('Erro', 'Identificador do agendamento não encontrado', 'danger');
            cancelConfirmModal.hide();
            return;
        }
        
        fetch(`/api/appointments/${appointmentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Erro ao cancelar consulta');
                });
            }
            return response.json();
        })
        .then(data => {
            cancelConfirmModal.hide();
            
            showToast('Sucesso', 'Consulta cancelada com sucesso!', 'success');
            
  
            loadAppointments(getFilterValues());
        })
        .catch(error => {
            console.error('Erro:', error);
            
   
            cancelConfirmModal.hide();
            

            showToast('Erro', `Erro ao cancelar consulta: ${error.message}`, 'danger');
        });
    });
    
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const filters = getFilterValues();
        
        console.log('Aplicando filtros:', filters);
        
        loadAppointments(filters);
    
        showToast('Filtros aplicados', 'A lista foi atualizada com seus filtros', 'info');
    });
    

    clearFiltersBtn.addEventListener('click', function() {
        
        filterForm.reset();
        
        
        loadAppointments();
    });
    
   
    function getFilterValues() {
        return {
            patientName: document.getElementById('filterPatient').value.trim(),
            doctorName: document.getElementById('filterDoctor').value.trim(),
            specialty: document.getElementById('filterSpecialty').value,
            date: document.getElementById('filterDate').value
        };
    }
    
    function showToast(title, message, type) {
       
        toastHeader.className = 'toast-header';
        if (type === 'success') {
            toastHeader.classList.add('bg-success', 'text-white');
        } else if (type === 'danger') {
            toastHeader.classList.add('bg-danger', 'text-white');
        } else if (type === 'warning') {
            toastHeader.classList.add('bg-warning', 'text-white');
        } else {
            toastHeader.classList.add('bg-primary', 'text-white');
        }
        
       
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        
        resultToast.show();
    }
    
    
    window.medicalAppointments = {
        reload: loadAppointments,
        filter: getFilterValues
    };
});