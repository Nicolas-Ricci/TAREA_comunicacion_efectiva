/**
 * PORTAFOLIO ACADÉMICO MULTIMODAL - GRUPO 3
 * Lógica principal: Navegación, Modales, CMS Local y micro-interacciones
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       0. DETECCIÓN DE ENTORNO
       El CMS local solo se activa cuando se sirve con node server.js
       En GitHub Pages se ocultan los botones flotantes de edición.
       ========================================================== */
    const isLocalCMS =
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1' ||
        location.hostname === '0.0.0.0';

    /* ==========================================================
       1. NAVEGACIÓN MÓVIL Y SMOOTH SCROLL
       ========================================================== */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const headerOffset = 88;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================
       2. LÓGICA DE MODALES
       ========================================================== */
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeButtons = document.querySelectorAll('.modal-close');

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modalBackdrop.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ==========================================================
       3. ANIMACIONES DE ENTRADA AL SCROLL
       Usa IntersectionObserver para añadir .is-visible cuando el
       elemento entra en viewport. Las clases se limpian antes de
       guardar el HTML para no contaminar el archivo final.
       ========================================================== */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: mostrar todo
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ==========================================================
       4. BARRA DE PROGRESO DE SCROLL (creada dinámicamente)
       ========================================================== */
    const progressBar = document.createElement('div');
    progressBar.className = 'nav-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    /* ==========================================================
       5. BOTÓN "VOLVER ARRIBA" (creado dinámicamente)
       ========================================================== */
    // Eliminado: botón "Volver arriba" reemplazado por el botón Gracias + timelapse

    // Scroll listener combinado (progreso + botón volver arriba)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = progress + '%';

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ==========================================================
       6. MODO EDICIÓN & SUBIDA DE ARCHIVOS (CMS LOCAL)
       Solo se activa cuando se está sirviendo desde localhost.
       ========================================================== */
    const editBtn = document.getElementById('editModeBtn');
    const saveBtn = document.getElementById('saveModeBtn');
    const editableElements = document.querySelectorAll('.editable');
    const uploaders = document.querySelectorAll('.uploader');
    let isEditing = false;

    if (!isLocalCMS) {
        // En producción (GitHub Pages) — ocultar completamente los botones de edición
        if (editBtn) editBtn.remove();
        if (saveBtn) saveBtn.remove();
        return;
    }

    // En local — mostrar el botón "Editar Contenido"
    if (editBtn) editBtn.classList.remove('hidden');

    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                return data.filePath;
            } else {
                throw new Error(data.message || 'Error al subir');
            }
        } catch (error) {
            console.error(error);
            alert("Error al subir el archivo. ¿Está corriendo el servidor (node server.js)?");
            return null;
        }
    }

    if (editBtn && saveBtn) {
        editBtn.addEventListener('click', () => {
            isEditing = true;

            editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));
            uploaders.forEach(el => el.classList.add('editing'));

            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
            saveBtn.querySelector('span').textContent = 'Guardar Cambios';

            alert("Modo Edición Activado.\n\n- Escribe directamente sobre los textos resaltados.\n- Haz clic en las fotos para subir imágenes desde tu PC.\n- Al terminar, presiona 'Guardar Cambios' para actualizar el archivo.");
        });

        uploaders.forEach(uploader => {
            uploader.addEventListener('click', async () => {
                if (!isEditing) return;

                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png, image/jpeg, image/jpg, image/webp';

                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const overlaySpan = uploader.querySelector('.upload-overlay span');
                    const originalText = overlaySpan.textContent;
                    overlaySpan.textContent = "⏳ Subiendo...";

                    const newPath = await uploadFile(file);

                    if (newPath) {
                        const img = uploader.querySelector('img');
                        if (img) img.src = newPath;
                        overlaySpan.textContent = "✅ Listo";
                        setTimeout(() => { overlaySpan.textContent = originalText; }, 2000);
                    } else {
                        overlaySpan.textContent = "❌ Error";
                        setTimeout(() => { overlaySpan.textContent = originalText; }, 2000);
                    }
                };

                input.click();
            });
        });

        saveBtn.addEventListener('click', async () => {
            saveBtn.querySelector('span').textContent = 'Guardando...';

            editableElements.forEach(el => el.removeAttribute('contenteditable'));
            uploaders.forEach(el => el.classList.remove('editing'));

            // Clonar todo el documento para limpiarlo antes de guardar
            const documentClone = document.documentElement.cloneNode(true);

            // Restaurar estado inicial de botones flotantes en el clon
            const cloneEditBtn = documentClone.querySelector('#editModeBtn');
            const cloneSaveBtn = documentClone.querySelector('#saveModeBtn');
            if (cloneEditBtn) {
                cloneEditBtn.classList.add('hidden'); // Se mostrará vía JS en local
                cloneEditBtn.classList.remove('hidden-temp');
            }
            if (cloneSaveBtn) {
                cloneSaveBtn.classList.add('hidden');
                const span = cloneSaveBtn.querySelector('span');
                if (span) span.textContent = 'Guardar Cambios';
            }

            // Limpiar modales abiertos
            documentClone.querySelector('#modal-backdrop')?.classList.remove('active');
            documentClone.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            const bodyEl = documentClone.querySelector('body');
            if (bodyEl) bodyEl.style.overflow = '';

            // Limpiar clases de animaciones (.is-visible) y elementos dinámicos
            documentClone.querySelectorAll('.is-visible').forEach(el => el.classList.remove('is-visible'));
            documentClone.querySelectorAll('.nav-progress, .back-to-top').forEach(el => el.remove());

            // Limpiar atributos contenteditable que pudieran haber quedado
            documentClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

            const htmlContent = "<!DOCTYPE html>\n" + documentClone.outerHTML;

            try {
                const response = await fetch('/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html' },
                    body: htmlContent
                });

                const result = await response.json();
                if (result.success) {
                    alert("¡Cambios guardados con éxito en el archivo index.html!");
                } else {
                    alert("Error al guardar: " + result.message);
                }
            } catch (err) {
                console.error(err);
                alert("Error de conexión. Asegúrate de que el servidor (node server.js) esté corriendo.");
            } finally {
                saveBtn.classList.add('hidden');
                editBtn.classList.remove('hidden');
                isEditing = false;
            }
        });
    }

    /* ==========================================================
       7. BIENVENIDA — overlay independiente
       ========================================================== */
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const welcomeBtn = document.getElementById('welcomeBtn');

    if (welcomeOverlay) {
        welcomeOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function cerrarBienvenida() {
        if (welcomeOverlay) welcomeOverlay.classList.remove('open');
        document.body.style.overflow = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', cerrarBienvenida);
    }

    /* ==========================================================
       8. TIMELAPSE VERTICAL — indicador + navegación por clic
       ========================================================== */
    const vtDots = document.querySelectorAll('.vt-dot');

    const sections = [
        { id: 'inicio',      num: '01', label: 'Inicio' },
        { id: 'autores',     num: '02', label: 'Autores' },
        { id: 'problematica',num: '03', label: 'Problemática' },
        { id: 'ruta',        num: '04', label: 'Proceso' },
        { id: 'evidencias',  num: '05', label: 'Evidencias' },
        { id: 'reflexion',   num: '06', label: 'Reflexión' },
        { id: 'referencias', num: '07', label: 'Referencias' },
    ];

    // Cache de posiciones para evitar reflow en cada scroll
    let sectionBounds = sections.map(s => ({ top: 0, bottom: 0 }));
    function cacheSectionBounds() {
        sections.forEach((sec, i) => {
            const el = document.getElementById(sec.id);
            if (el) {
                sectionBounds[i].top = el.offsetTop;
                sectionBounds[i].bottom = el.offsetTop + el.offsetHeight;
            }
        });
    }
    cacheSectionBounds();
    window.addEventListener('resize', cacheSectionBounds, { passive: true });

    let tickingTL = false;
    window.addEventListener('scroll', () => {
        if (!tickingTL) {
            window.requestAnimationFrame(() => {
                const scrollCenter = window.scrollY + window.innerHeight / 2;

                for (let i = 0; i < sections.length; i++) {
                    const bounds = sectionBounds[i];
                    if (scrollCenter >= bounds.top && scrollCenter < bounds.bottom) {
                        vtDots.forEach(d => d.classList.remove('active'));
                        if (vtDots[i]) vtDots[i].classList.add('active');
                        break;
                    }
                }
                tickingTL = false;
            });
            tickingTL = true;
        }
    }, { passive: true });

    // Clic en cada dot → saltar a la sección
    const headerOffset2 = 88;
    vtDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset2;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================
       9. PANTALLA DE CIERRE "GRACIAS"
       ========================================================== */
    const graciasBtn = document.getElementById('graciasBtn');
    const graciasOverlay = document.getElementById('graciasOverlay');
    const graciasCloseBtn = document.getElementById('graciasCloseBtn');
    const graciasCerrarBtn = document.getElementById('graciasCerrarBtn');
    const volverInicioBtn = document.getElementById('volverInicioBtn');

    function openGracias() {
        if (graciasOverlay) graciasOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeGracias() {
        if (graciasOverlay) graciasOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function volverAlInicio() {
        closeGracias();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (graciasBtn) graciasBtn.addEventListener('click', openGracias);
    if (graciasCloseBtn) graciasCloseBtn.addEventListener('click', closeGracias);
    if (graciasCerrarBtn) graciasCerrarBtn.addEventListener('click', closeGracias);
    if (volverInicioBtn) volverInicioBtn.addEventListener('click', volverAlInicio);
    if (graciasOverlay) {
        graciasOverlay.addEventListener('click', (e) => {
            if (e.target === graciasOverlay) closeGracias();
        });
    }

    /* ==========================================================
       10. QR BADGE — clic abre el sitio en nueva pestaña
       ========================================================== */
    const qrBadge = document.getElementById('qrBadge');
    if (qrBadge) {
        qrBadge.addEventListener('click', () => {
            window.open('https://nicolas-ricci.github.io/TAREA_comunicacion_efectiva/', '_blank');
        });
    }

    /* ==========================================================
       11. ATAJOS DE TECLADO
       ========================================================== */
    let kbdHintTimer = null;

    function showKbdHint(text, durationMs = 2000) {
        let hint = document.getElementById('kbdHint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'kbdHint';
            hint.className = 'kbd-hint';
            document.body.appendChild(hint);
        }
        hint.innerHTML = text;
        hint.classList.add('visible');

        if (kbdHintTimer) clearTimeout(kbdHintTimer);
        kbdHintTimer = setTimeout(() => {
            hint.classList.remove('visible');
        }, durationMs);
    }

    document.addEventListener('keydown', (e) => {
        // Ignorar si el usuario está escribiendo en un input/editable
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        const key = e.key;

        // 1-7 — ir a sección
        const sectionKeys = {
            '1': 'inicio',
            '2': 'autores',
            '3': 'problematica',
            '4': 'ruta',
            '5': 'evidencias',
            '6': 'reflexion',
            '7': 'referencias',
        };
        if (key >= '1' && key <= '7') {
            const targetId = sectionKeys[key];
            if (targetId) {
                e.preventDefault();
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset2;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                    showKbdHint('Sección <kbd>' + key + '</kbd> · ' + sections[parseInt(key) - 1].label);
                }
            }
            return;
        }

        // G — mostrar Gracias
        if (key === 'g' || key === 'G') {
            e.preventDefault();
            openGracias();
            return;
        }

        // Escape — cerrar pantalla de gracias
        if (key === 'Escape') {
            if (graciasOverlay && graciasOverlay.classList.contains('open')) {
                closeGracias();
            }
            return;
        }

        // ? — mostrar ayuda
        if (key === '?') {
            e.preventDefault();
            showKbdHint(
                '<kbd>1</kbd>-<kbd>7</kbd> Secciones &nbsp;·&nbsp; <kbd>G</kbd> Gracias &nbsp;·&nbsp; <kbd>Esc</kbd> Cerrar &nbsp;·&nbsp; <kbd>?</kbd> Ayuda',
                4000
            );
            return;
        }
    });
});
