/**
 * MÓDULO DE PERSISTENCIA (DEV 4)
 * Gestión de almacenamiento de datos en LocalStorage
 */

const STORAGE_KEY = 'vet_appointments';

export function saveAppointmentsToStorage(appointments) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

export function loadAppointmentsFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('No se pudo cargar de localStorage:', e);
    }
    return [];
}
