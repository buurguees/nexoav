# Componentes Responsivos por Dispositivo

## Descripción General

Este directorio contiene la documentación sobre cómo se organizan y adaptan los componentes para diferentes tipos de dispositivos (mobile, tablet, desktop) en el proyecto NEXOAV.

## Estructura de Documentación

- **[Estructura de Componentes](./estructura-componentes.md)**: Organización de carpetas y archivos por dispositivo
- **[Proceso de Desarrollo](./proceso-desarrollo.md)**: Cómo crear y mantener componentes responsivos
- **[Diferencias por Dispositivo](./diferencias-dispositivos.md)**: Comparación detallada de cambios entre versiones
- **[Guía de Estilos](./guia-estilos.md)**: Sistema de estilos CSS por dispositivo
- **[Casos de Uso](./casos-uso.md)**: Ejemplos prácticos de implementación
- **[Hook useBreakpoint](./hook-usebreakpoint.md)**: Documentación técnica del hook de detección de dispositivos
- **[Integración en App](./integracion-app.md)**: Cómo se integran los componentes responsivos en la aplicación
- **[CHANGELOG](./CHANGELOG.md)**: Registro de cambios y actualizaciones

## Tipos de Dispositivos Soportados

1. **Mobile** (< 768px)
   - Smartphones en orientación vertical
   - Pantallas pequeñas, interacción táctil
   - Componentes optimizados para espacio limitado

2. **Tablet Portrait** (768px - 1024px, vertical)
   - Tablets en orientación vertical
   - Más espacio que mobile, pero menos que desktop
   - Balance entre compacto y funcional

3. **Tablet Horizontal** (768px - 1024px, horizontal)
   - Tablets en orientación horizontal
   - Más espacio horizontal disponible
   - Componentes pueden usar layouts de 2 columnas

4. **Desktop** (> 1024px)
   - Pantallas grandes, escritorio
   - Máximo espacio disponible
   - Componentes completos con todas las funcionalidades

## Principios de Diseño Responsivo

1. **Mobile First**: Los componentes base se diseñan primero para mobile
2. **Progressive Enhancement**: Se añaden funcionalidades y espacio en dispositivos mayores
3. **Consistencia**: Misma funcionalidad, diferente presentación
4. **Performance**: Componentes optimizados para cada dispositivo
5. **Accesibilidad**: Mantener accesibilidad en todos los dispositivos

---

*Última actualización: Documentación de componentes responsivos iniciada*

