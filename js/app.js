//PUNTO DE ENTRADA PRINCIPAL

import { initServices } from './modules/services.js';
import { initAppointmentForm } from './modules/appointmentForm.js';

document.addEventListener('DOMContentLoaded', () => {

    //Inicialización de servicios y animaciones
    initServices();
    
    //Inicialización de formulario de citas y validaciones
    initAppointmentForm();

    
});