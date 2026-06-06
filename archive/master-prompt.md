# Master Prompt for Open Design Refactoring

Por favor realiza una refactorización completa de la página principal del Portal de Juegos Educativos (IST Games).

## Objetivos Principales
1. **Búsqueda e Integración de Componentes**: Conéctate al MCP server `magic` (21st.dev) para buscar, refinar y aplicar componentes premium en la página. Debes utilizar componentes geniales e interactivos inspirados en:
   - PaceUI Dot Loader: `https://21st.dev/community/components/paceui/dot-loader/default` (o similar para animaciones de carga elegantes).
   - HexTaUI Toolbar: `https://21st.dev/community/components/hextaui/toolbar/default` (para el menú o dock inferior).
   - Shugar Award Badge: `https://21st.dev/community/components/shugar/award-badge/default` (para insignias de tarjetas destacadas).
   - VictorWelander Gooey Text Morphing: `https://21st.dev/community/components/victorwelander/gooey-text-morphing/default` (para el morphing del texto de cabecera).
   - Aceternity Container Scroll Animation: `https://21st.dev/community/components/aceternity/container-scroll-animation/default` (para un efecto de perspectiva 3D premium al scrollear la grilla de juegos).

2. **Estética y Visualidad**:
   - **NO utilices estética Cyberpunk, Neon agresivo ni weas oscuras ilegibles**.
   - Utiliza una estética **Clean, Minimalista y Altamente Legible**, manteniendo el estilo premium y profesional de IST Games.
   - Utiliza exclusivamente la paleta de colores del archivo original en OKLCH (azul, morado y esmeralda).

3. **Arquitectura de Archivos**:
   - Estructura y distribuye el código de manera limpia en `index.html` (estructura), `style.css` (diseño) y `main.js` (comportamiento interactivo).

4. **Preservar Funcionalidad**:
   - No rompas el sistema de filtrado por categorías ni la funcionalidad de búsqueda de simulaciones.
