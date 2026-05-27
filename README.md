# Portafolio Académico Multimodal 🎓 (Storytelling Premium Edition)

Este repositorio contiene el código fuente del **Portafolio Académico Multimodal** desarrollado para la asignatura de **Comunicación Efectiva** (Ciclo 2026-I) en la **Universidad Autónoma del Perú**. 

El proyecto ha sido rediseñado recientemente como una **Landing Page de Storytelling** de estilo académico premium. No es un simple repositorio de trabajos, sino que narra una historia visual fluida (de arriba hacia abajo) sobre la investigación de la brecha digital en el Perú, utilizando paletas institucionales, modales interactivos y mucho espacio en blanco.

🌍 **Enlace al sitio en vivo:** [https://nicolas-ricci.github.io/TAREA_comunicacion_efectiva/](https://nicolas-ricci.github.io/TAREA_comunicacion_efectiva/)

---

## 📌 Problemática Central
> *"La ineficacia de la educación virtual en las zonas rurales de Lima frente al Objetivo de Desarrollo Sostenible 4 (ODS 4) se explica por profundas brechas de conectividad, infraestructura eléctrica y exclusión social."*

## 👥 Equipo de Trabajo (Grupo 3)
*   **Nicolás Ricci Ale** - Coordinador / Redactor
*   **Joel Salinas Vásquez** - Investigador / Locutor
*   **Johnson Mostajo Rojas** - Investigador / Editor Técnico
*   **Anderson Martínez Junes** - Redactor / Locutor
*   **Docente:** Eielson Samir Valberde Espíritu

## 📂 Estructura Narrativa y Evidencias
La página está dividida en secciones estratégicas apiladas para contar una historia:

1. **Hero Institucional:** Portada a doble columna con el título, logo de la universidad (`uploads/Logo-autonoma.png`) y datos del equipo.
2. **Autores del Portafolio:** Cuadrícula de tarjetas con fotografías (formato 3:4).
3. **Problemática Investigada:** Declaración central apoyada con *chips* descriptivos e íconos.
4. **Ruta del Trabajo (Timeline):** Línea de tiempo cronológica horizontal.
5. **Evidencias de Aprendizaje (Bloques Verticales):**
   - **01. Vídeo Colaborativo:** Documental embebido directamente desde YouTube.
   - **02. Informe Académico:** Documento técnico visible mediante un modal dinámico de PDF (`uploads/informe.pdf`).
   - **03. Texto Argumentativo:** Ensayo crítico integrado en la narrativa visual, con su propio modal de PDF (`uploads/ensayo.pdf`).
   - **04. Podcast "Señal Perdida":** Reproductor de audio HTML5 incrustado directamente (`uploads/podcast.mp3`).
6. **Reflexión Final:** Diseño en grilla y listas para Síntesis, Autoevaluación, Transferencia Profesional y un Mensaje Final de impacto.
7. **Referencias Bibliográficas:** Formato APA con sangría francesa.

---

## 🛠️ Tecnologías Utilizadas

El proyecto combina un Frontend limpio y de diseño premium con un **Micro-CMS Local** impulsado por Node.js para facilitar la edición de contenido por parte del equipo.

*   **HTML5 / CSS3 Vanilla:** Diseño responsivo ultra-premium, paleta cromática sobria (Azul marino, Guinda, Dorado) y maquetación mediante *CSS Grid/Flexbox*. Sin frameworks, para máximo control.
*   **JavaScript (ES6):** Lógica para modales interactivos de PDF, sistema de guardado y carga de archivos locales.
*   **Node.js & Express:** (Backend Local). Un micro-servidor (`server.js`) diseñado exclusivamente para ejecutarse en la computadora de los autores, permitiendo sobrescribir textos (`index.html`) y guardar fotografías físicamente en el disco.
*   **Multer:** Librería para procesar y guardar las imágenes subidas desde el "Modo Edición" en la carpeta `/uploads`.

---

## ✨ Mejoras incorporadas para la presentación

El portafolio incluye funcionalidades diseñadas específicamente para facilitar la exposición en clase:

| Mejora | Descripción |
|---|---|
| 🎬 **Modal de bienvenida** | Al cargar la página aparece un overlay con los datos del grupo y el tema. Botón "Comenzar recorrido" para iniciar. |
| 📍 **Timelapse vertical** | Barra lateral izquierda con 7 dots numerados que se iluminan al scrollear. Clic en cada uno para saltar a esa sección. |
| 📱 **QR del sitio** | Código QR siempre visible en la esquina inferior derecha. Los compañeros lo escanean y siguen la presentación en su celular. |
| 🎓 **Pantalla Gracias** | Botón "🎬 Gracias" en la esquina inferior derecha. Al hacer clic, muestra una pantalla de cierre profesional con "Volver al inicio". |
| ⌨️ **Atajos de teclado** | `1`-`7` → ir a sección, `G` → mostrar Gracias, `Esc` → cerrar, `?` → ayuda en pantalla. |
| 📱 **Responsive** | En móvil se ocultan el timelapse, QR y botón Gracias. Los autores se muestran en una fila. |
| ⚡ **Optimizado** | Scroll con posiciones cacheadas (sin reflows), CSS sin código muerto, `loading="lazy"` en PDFs e imágenes, preload de estilos. |

---

## 🚀 Despliegue y Uso Local (Modo CMS)

A diferencia de una web estática común, este proyecto incluye un botón mágico de **"Editar Contenido"**. Para aprovechar la subida de fotos y el guardado automático de textos, debes levantarlo usando Node.js.

### Requisitos previos
- Tener [Node.js](https://nodejs.org/) instalado en tu computadora.

### Pasos para editar el proyecto localmente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Nicolas-Ricci/TAREA_comunicacion_efectiva.git
   cd TAREA_comunicacion_efectiva
   ```
2. Instala las dependencias del servidor local (solo la primera vez):
   ```bash
   npm install
   ```
3. Levanta el servidor local (El motor del CMS):
   ```bash
   node server.js
   ```
4. Abre `http://localhost:3000` en tu navegador.
5. Haz clic en el botón flotante **"Editar Contenido"** (abajo a la izquierda). Podrás modificar textos sobre la marcha o subir fotografías de autores haciendo clic en sus recuadros.
6. Haz clic en **"Guardar Cambios"** (botón verde). Tu archivo `index.html` se actualizará físicamente en el disco.
7. **Para archivos pesados (PDFs, Audio y el Logo):** Cópialos manualmente a la carpeta `/uploads/` con los nombres: `informe.pdf`, `ensayo.pdf`, `podcast.mp3`, `Logo-autonoma.png`.

### Despliegue en GitHub Pages
Una vez que termines de editar todo en tu `localhost:3000` y hayas guardado los cambios, simplemente haz un `git commit` y un `git push` a la rama `main`. El sitio estático se compilará y actualizará automáticamente en GitHub Pages, listo para ser entregado a tu profesor.
