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
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Volver arriba');
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);

    // Scroll listener combinado (progreso + botón volver arriba)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = progress + '%';

                if (scrollTop > 600) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
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
});
