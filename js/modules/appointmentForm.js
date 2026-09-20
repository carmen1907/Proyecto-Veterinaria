import { showToast } from './toast.js';
import { addAppointment, appointmentState } from './appointmentList.js';

export function initAppointmentForm() {
    const form = document.getElementById('form-cita');
    if (!form) return;

    setMinDateTime();

    // Validación en tiempo real
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(input);
        });
    });

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) {
            showToast('error', 'Error', 'Por favor corrige los errores en el formulario');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-flex';

        // Simular envío a servidor
        await new Promise(resolve => setTimeout(resolve, 800));

        const formData = new FormData(form);
        const appointment = {
            id: appointmentState.nextId++,
            owner: formData.get('dueño'),
            petName: formData.get('mascota'),
            petType: formData.get('tipo-mascota'),
            service: formData.get('servicio'),
            dateTime: formData.get('fecha'),
            notes: formData.get('notas'),
            createdAt: new Date().toISOString()
        };

        addAppointment(appointment);
        form.reset();
        setMinDateTime();

        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';

        showToast('success', '¡Cita confirmada!', `La cita para ${appointment.petName} ha sido agendada.`);
    });
}

export function setMinDateTime() {
    const fechaInput = document.getElementById('fecha');
    if (!fechaInput) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    fechaInput.min = now.toISOString().slice(0, 16);
}

export function validateField(input) {
    const errorId = `${input.id}-error`;
    const errorEl = document.getElementById(errorId);
    
    if (!input.checkValidity()) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = getErrorMessage(input);
        return false;
    } else {
        input.classList.remove('error');
        return true;
    }
}

export function getErrorMessage(input) {
    if (input.validity.valueMissing) {
        const labels = {
            'dueño': 'Por favor ingresa tu nombre',
            'mascota': 'Por favor ingresa el nombre de tu mascota',
            'tipo-mascota': 'Por favor selecciona el tipo de mascota',
            'servicio': 'Por favor selecciona un servicio',
            'fecha': 'Por favor selecciona una fecha y hora válida'
        };
        return labels[input.id] || 'Este campo es obligatorio';
    }
    if (input.validity.typeMismatch) {
        return 'Formato inválido';
    }
    return 'Valor inválido';
}

export function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) isValid = false;
    });
    return isValid;
}
