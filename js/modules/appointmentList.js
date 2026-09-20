import { saveAppointmentsToStorage, loadAppointmentsFromStorage } from './storage.js';
import { showToast, escapeHtml } from './toast.js';

export const appointmentState = {
    appointments: [],
    nextId: 1
};

export function initAppointmentsList() {
    appointmentState.appointments = loadAppointmentsFromStorage();
    if (appointmentState.appointments.length > 0) {
        appointmentState.nextId = Math.max(...appointmentState.appointments.map(a => a.id)) + 1;
    }
    renderAppointments();
}

export function addAppointment(newApt) {
    appointmentState.appointments.unshift(newApt);
    saveAppointmentsToStorage(appointmentState.appointments);
    renderAppointments();
}

export function renderAppointments() {
    const listaCitas = document.getElementById('lista-citas');
    const noCitasMsg = document.getElementById('noCitasMsg');
    const appointmentsCount = document.getElementById('appointmentsCount');

    if (!listaCitas || !appointmentsCount) return;

    if (appointmentState.appointments.length === 0) {
        listaCitas.innerHTML = `
            <div class="no-appointments" id="noCitasMsg">
                <h4>No hay citas programadas</h4>
                <p>Tu próxima cita aparecerá aquí</p>
            </div>
        `;
        appointmentsCount.textContent = '0 citas';
        return;
    }

    appointmentsCount.textContent = `${appointmentState.appointments.length} cita${appointmentState.appointments.length !== 1 ? 's' : ''}`;
    listaCitas.innerHTML = appointmentState.appointments.map((apt, index) => createAppointmentHTML(apt, index)).join('');
    
    // Asignar eventos de eliminación js
    listaCitas.querySelectorAll('.appointment-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id, 10);
            deleteAppointment(id);
        });
    });
}

export function createAppointmentHTML(apt, index) {
    const date = new Date(apt.dateTime);
    const formattedDate = isNaN(date.getTime()) ? apt.dateTime : date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const serviceIcons = {
        'Consulta General': '🩺',
        'Vacunación': '💉',
        'Estética Canina': '✂️',
        'Laboratorio': '🔬',
        'Cirugía': '🏥',
        'Odontología': '🦷'
    };
    
    const petTypeIcons = {
        'perro': '🐕',
        'gato': '🐈',
        'otro': '🐾'
    };

    return `
        <article class="appointment-item" role="listitem" style="animation-delay: ${index * 50}ms">
            <div class="appointment-icon" aria-hidden="true">${serviceIcons[apt.service] || '🩺'}</div>
            <div class="appointment-details">
                <div class="appointment-pet">
                    <span class="appointment-pet-name">${escapeHtml(apt.petName)}</span>
                    <span class="appointment-pet-type">${petTypeIcons[apt.petType] || '🐾'}</span>
                </div>
                <div class="appointment-service">${escapeHtml(apt.service)}</div>
                <div class="appointment-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${formattedDate}
                </div>
                ${apt.notes ? `<div class="appointment-notes" style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">${escapeHtml(apt.notes)}</div>` : ''}
            </div>
            <button class="appointment-delete" data-id="${apt.id}" aria-label="Eliminar cita de ${escapeHtml(apt.petName)}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </article>
    `;
}

export function deleteAppointment(id) {
    const appointment = appointmentState.appointments.find(a => a.id === id);
    if (!appointment) return;

    if (confirm(`¿Eliminar la cita de ${appointment.petName}?`)) {
        appointmentState.appointments = appointmentState.appointments.filter(a => a.id !== id);
        saveAppointmentsToStorage(appointmentState.appointments);
        renderAppointments();
        showToast('info', 'Cita eliminada', 'La cita ha sido eliminada correctamente');
    }
}
