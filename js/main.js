/* 
========================================================================
   PORTAFOLIO ACADÉMICO MULTIMODAL - GRUPO 3
   Lógica JavaScript Modular - Interactividad y Navegación Académica
   Autor: Desarrollador Frontend Senior & Diseñador UI/UX
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INICIALIZAR ICONOS LUCIDE
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. HEADER CON EFECTO FROSTED GLASS AL HACER SCROLL
    const header = document.getElementById('mainHeader');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chequeo inicial

    // 3. MENÚ DE NAVEGACIÓN MÓVIL (SIMPLE HAMBURGER & OVERLAY)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMobileMenu = () => {
        const isOpen = mobileOverlay.classList.contains('open');
        
        hamburgerBtn.classList.toggle('active');
        
        const bars = hamburgerBtn.querySelectorAll('.bar');
        if (!isOpen) {
            bars[0].style.transform = 'translateY(7px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            mobileOverlay.classList.add('open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Evita scroll al estar abierto
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            mobileOverlay.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Restaura scroll
        }
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // 4. OBSERVADOR DE SECCIÓN ACTIVA EN LA BARRA DE NAVEGACIÓN
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Gatilla al entrar en la zona central de lectura
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));

    // 5. FILTRADO DINÁMICO DE EVIDENCIAS (STAGGERED DISSOLVE)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const evidenceCount = document.getElementById('evidenceCount');
    
    const filterGallery = (category) => {
        let visibleCount = 0;
        let totalCount = galleryCards.length;
        
        galleryCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                visibleCount++;
                
                // Animación de entrada staggered (secuencial)
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 30);
                
            } else {
                card.classList.remove('show');
                
                // Espera a que termine la transición de escala/opacidad en CSS
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
        
        // Actualizar contador
        if (evidenceCount) {
            evidenceCount.innerText = `Mostrando: ${visibleCount} de ${totalCount}`;
        }
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            
            const currentBtn = e.target.closest('.filter-btn');
            currentBtn.classList.add('active');
            
            const filterValue = currentBtn.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });
    
    // Filtro inicializado
    filterGallery('all');

    // 6. CONTROLADOR DE MODALES DE FICHA TÉCNICA
    const modalBtns = document.querySelectorAll('.open-modal-btn');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.modal-close-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Recalcular iconos de Lucide cargados dinámicamente en modal
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    const closeModal = (modal) => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            closeModal(modal);
        });
    });

    // Cerrar modal con tecla escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('open')) {
                    closeModal(modal);
                }
            });
        }
    });

    // 7. OBSERVADOR DE ANIMACIÓN EN SCROLL (EFECTO ENTRADA SUAVE)
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px', // Gatilla levemente antes del ingreso total
        threshold: 0.05
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target); // Se anima una sola vez
            }
        });
    }, scrollObserverOptions);
    
    animateElements.forEach(el => scrollObserver.observe(el));
    
});
