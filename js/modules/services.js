// MÓDULO DE SERVICIOS - ANIMACIONES E INTERACTIVIDAD

export function initServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;

    // Animación de entrada escalonada al hacer scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = (Array.from(serviceCards).indexOf(card) % 3) * 120;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, delay);

                cardObserver.unobserve(card);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease';
        cardObserver.observe(card);
    });

    // Interacción con los botones de acción rápida
    const actionButtons = document.querySelectorAll('.service-action-btn[data-service-select]');
    const serviceSelect = document.getElementById('servicio');

    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedService = btn.getAttribute('data-service-select');
            
            if (selectedService === 'Urgencias 24/7') {
                // Si es urgencias, dejamos que navegue a #contacto
                return;
            }

            if (serviceSelect && selectedService) {
                // Seleccionar el servicio en el formulario de citas
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    if (serviceSelect.options[i].value === selectedService) {
                        serviceSelect.selectedIndex = i;
                        // Disparar evento change si hay listeners
                        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }

                // Efecto visual de resaltado en el select al llegar
                setTimeout(() => {
                    serviceSelect.focus();
                    serviceSelect.style.borderColor = 'var(--primary)';
                    serviceSelect.style.boxShadow = '0 0 0 4px var(--primary-glow)';
                    setTimeout(() => {
                        serviceSelect.style.borderColor = '';
                        serviceSelect.style.boxShadow = '';
                    }, 1800);
                }, 400);
            }
        });
    });
}
