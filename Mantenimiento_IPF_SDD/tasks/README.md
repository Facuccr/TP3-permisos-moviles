# Backlog SDD
Usar T001 a T012 en orden. Estado inicial: TODO. Actualizar a DOING / DONE / BLOCKED con evidencia. No marcar DONE sin comprobación.
- [x] T001 Inspeccionar plantilla y dependencias; entregar inventario y plan de limpieza (sin borrar aún).
- [x] T002 Limpiar demos autorizadas, mantener Expo Router funcional, iniciar y verificar.
- [x] T003 Implementar rutas, tabs y modal; verificar URL exactas.
- [ ] T004 Crear tipos, persistencia y borrador entre pantallas.
- [ ] T005 Formulario, listado, detalle, id inválido y resolución simulada en datos.
- [ ] T006 Adaptadores de permisos, hook unificado, AppState y panel.
- [ ] T007 Modal previo, lógica Continuar/Abrir Ajustes y no insistir.
- [ ] T008 Escáner QR y alternativa manual.
- [ ] T009 Cámara fotográfica y picker sin permiso de galería.
- [ ] T010 Ubicación foreground, aproximada y sector manual.
- [ ] T011 Notificaciones locales, canal, interruptor y bandeja.
- [ ] T012 app.json, build, auditoría, pruebas, README, evidencias y RESPUESTAS.md.
## Plantilla de cierre
Tarea / archivos modificados / decisiones / pruebas (comando y resultado) / criterios cumplidos / riesgos / siguiente tarea.

## Registro de ejecuciones
### T001
- **Archivos modificados**: Ninguno.
- **Decisiones**: Inventario de archivos demo a eliminar y recursos de configuración esenciales a conservar; aprobación previa del usuario.
- **Pruebas**: Inspección estática y diagnóstico inicial.
- **Criterios cumplidos**: Preflight completado, inventario entregado y aprobado.
- **Siguiente tarea**: T002.

### T002
- **Archivos eliminados**: Demos de `src/app/explore.tsx`, componentes `animated-icon.*`, `app-tabs.*`, `external-link.tsx`, `hint-row.tsx`, `themed-text.tsx`, `themed-view.tsx`, `ui/collapsible.tsx`, `web-badge.tsx`, estilos `global.css`, `theme.ts`, hooks de demo, script `reset-project.js` e imágenes demo no referenciadas.
- **Archivos modificados**: `src/app/_layout.tsx`, `src/app/index.tsx`, `package.json`.
- **Decisiones**: Reemplazar layout y pantalla inicial por componentes funcionales mínimos en React Native + TypeScript con StyleSheet, eliminando acoplamiento a demos.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones superadas.
  - `npx expo export --no-minify`: Bundling exitoso para iOS, Android y Web; ruta `/` (index) resuelta.
- **Criterios cumplidos**: Base limpia, funcional, sin dependencias rotas, conservando Expo Router.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas (entorno de desarrollo/CLI sin emulador conectado actualmente); validado mediante compilación estática y bundling Metro completo.
### T003
- **Archivos creados**:
  - `src/app/(tabs)/_layout.tsx` (Tabs navigator: Reportes, Avisos, Permisos).
  - `src/app/(tabs)/index.tsx` (Ruta `/`).
  - `src/app/(tabs)/avisos.tsx` (Ruta `/avisos`).
  - `src/app/(tabs)/permisos.tsx` (Ruta `/permisos`).
  - `src/app/reporte/nuevo.tsx` (Ruta `/reporte/nuevo`).
  - `src/app/reporte/escanear.tsx` (Ruta `/reporte/escanear`).
  - `src/app/reporte/foto.tsx` (Ruta `/reporte/foto`).
  - `src/app/reporte/ubicacion.tsx` (Ruta `/reporte/ubicacion`).
  - `src/app/reporte/[id].tsx` (Ruta `/reporte/[id]`).
  - `src/app/permisos/[recurso].tsx` (Ruta modal `/permisos/[recurso]`).
  - `src/app/ajustes-app.tsx` (Ruta `/ajustes-app`).
- **Archivos modificados**: `src/app/_layout.tsx` (Stack raíz con presentación modal para `permisos/[recurso]`).
- **Archivos eliminados**: `src/app/index.tsx` (reubicado a `src/app/(tabs)/index.tsx` para evitar colisión de ruta en Expo Router).
- **Decisiones**: Utilizar grupo `(tabs)` de Expo Router para no agregar segmentos extra a la URL, cumpliendo las rutas exactas de `spec.md`. Configurar `presentation: 'modal'` en el Stack para `/permisos/[recurso]` sin botones propios de cierre dentro de la pantalla (según ADR-001).
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores de TypeScript.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en iOS, Android y Web; las 15 rutas estáticas y dinámicas resueltas correctamente sin advertencias ni conflictos.
- **Criterios cumplidos**: Todas las rutas de `spec.md` existen y resuelven; Stack raíz y Tabs configurados con navegación funcional.
- **Riesgos / Limitaciones**: Sin emulador ni dispositivo físico en este entorno; verificación basada en compilación estática y bundling Metro multiplataforma.
- **Siguiente tarea**: T004 (Crear tipos, persistencia y borrador entre pantallas).
