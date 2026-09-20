//PUNTO DE ENTRADA PRINCIPAL

import { initServices } from './modules/services.js';
import { initAppointmentForm } from './modules/appointmentForm.js';
import { initAppointmentsList } from './modules/appointmentList.js';

document.addEventListener('DOMContentLoaded', () => {

    //Inicialización de servicios y animaciones
    initServices();
    
    //Inicialización de formulario de citas y validaciones
    initAppointmentForm();

    //Inicialización de lista de citas y persistencia
    initAppointmentsList();

    
});