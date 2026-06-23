# ADR 0002 — Estéticas intercambiables via CSS + datos mínimos

**Estado:** Aceptado  
**Fecha:** 2026-06-23

---

## Contexto

La instalación necesita poder mostrarse con tres apariencias visuales distintas (`classic`, `matrix`, `darktech`) seleccionables por el equipo creativo desde `/docs`. La estética activa cambia colores, tipografía, bordes, efectos de fondo y chrome del Layout, pero no altera los textos ni la lógica de los captchas.

## Decisión

El sistema de estéticas se implementa con CSS variables por tema (aplicadas vía atributo `data-theme` en el root) más un objeto de configuración mínimo por estética que controla:

- Variables CSS (paleta, fuente, border-radius)
- Tipo de fondo (QR grid, matrix rain canvas, plano)
- Visibilidad del chrome del Layout (tease ambiental, QR finders, footer críptico solo en `matrix`)

La selección se persiste en localStorage — excepción explícita a la regla de "no usar localStorage" documentada en CLAUDE.md, porque no afecta la lógica del loop infinito (cada visita sigue siendo nueva en cuanto a captchas).

La estética default (sin valor en localStorage) es `classic`.

## Alternativas consideradas

**Variantes completas de componentes por estética:** cada tema tiene su propio set de Layout, CheckboxCaptcha, etc. Máxima fidelidad a los prompts originales pero triplica el código a mantener y acopla contenido a presentación.

**Solo CSS sin datos:** puro swap de variables CSS. Más simple pero no puede ocultar/mostrar chrome del Layout ni manejar el canvas de matrix rain, que son diferencias estructurales reales.

**Query param en lugar de localStorage:** el tema viaja en la URL (?theme=matrix). Evita localStorage pero complica el flujo: el QR impreso en sala tendría que incluir el param, y cambiar de estética requiere regenerar el QR.

## Razones

CSS + datos mínimos es el punto justo: cubre las diferencias visuales reales sin duplicar componentes. El localStorage para un solo flag no contradice el espíritu de la regla (que busca que el estado de captchas sea efímero), y simplifica la experiencia del equipo creativo — eligen una vez y queda.
