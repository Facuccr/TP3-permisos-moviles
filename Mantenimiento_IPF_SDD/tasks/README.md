# Backlog SDD
Usar T001 a T012 en orden. Estado inicial: TODO. Actualizar a DOING / DONE / BLOCKED con evidencia. No marcar DONE sin comprobación.
- [x] T001 Inspeccionar plantilla y dependencias; entregar inventario y plan de limpieza (sin borrar aún).
- [x] T002 Limpiar demos autorizadas, mantener Expo Router funcional, iniciar y verificar.
- [x] T003 Implementar rutas, tabs y modal; verificar URL exactas.
- [x] T004 Crear tipos, persistencia y borrador entre pantallas.
- [x] T005 Formulario, listado, detalle, id inválido y resolución simulada en datos.
- [x] T006 Adaptadores de permisos, hook unificado, AppState y panel.
- [x] T007 Modal previo, lógica Continuar/Abrir Ajustes y no insistir.
- [x] T008 Escáner QR y alternativa manual.
- [x] T009 Cámara fotográfica y picker sin permiso de galería.
- [x] T010 Ubicación foreground, aproximada y sector manual.
- [x] T011 Notificaciones locales, canal, interruptor y bandeja.
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
### T004
- **Archivos creados**:
  - `src/types/index.ts` (Modelos `Reporte`, `Aviso`, `BorradorReporte`, `PreferenciaAjustes`, tipos de categoría, estados y permisos).
  - `src/lib/storage.ts` (Capa de almacenamiento persistente AsyncStorage para reportes, avisos, borrador y preferencias).
  - `src/lib/reports.ts` (Lógica de dominio: CRUD de reportes, avisos automáticos al resolver, y utilidades de borrador).
  - `src/hooks/useReportDraft.ts` (Hook reactivo con sincronización inmediata en memoria y persistencia para compartir el borrador entre pantallas).
- **Archivos modificados**:
  - `package.json` y `package-lock.json` (instalación de `@react-native-async-storage/async-storage`).
  - `src/app/reporte/nuevo.tsx` (consumo del borrador reactivo, muestra estado de aula, foto y ubicación, y opción de limpiar).
  - `src/app/reporte/escanear.tsx` (actualiza campo `aula` en el borrador compartido y regresa sin parámetros en URL).
  - `src/app/reporte/foto.tsx` (actualiza `fotoUri` en el borrador compartido y regresa sin parámetros en URL).
  - `src/app/reporte/ubicacion.tsx` (actualiza `ubicacion` o `sector` en el borrador compartido y regresa sin parámetros en URL).
- **Decisiones**:
  - Instalar `@react-native-async-storage/async-storage` mediante `npx expo install` compatible con SDK 57 (según `architecture.md`).
  - Implementar un store reactivo singleton en `useReportDraft` con persistencia en background, evitando pasar URIs o datos complejos en parámetros URL.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones superadas.
  - `npx expo export --no-minify`: Bundling exitoso en iOS, Android y Web; 15 rutas resueltas.
- **Criterios cumplidos**: Tipos de datos completos, persistencia local integrada y sincronización de borrador entre pantallas sin serialización en URL.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T005.

### T005
- **Archivos creados**:
  - `src/components/ReportCard.tsx` (Componente de tarjeta para el listado de reportes con badges de categoría y estado, aula, ubicación aproximada/precisa sin exponer coordenadas según R05, indicador de foto y fecha formateada).
  - `src/components/ReportForm.tsx` (Formulario para nuevo reporte con validación de campos obligatorios, selección de categoría mediante chips, sincronización con el borrador reactivo, acciones de hardware contextuales sin solicitar permisos al montar según R01/R09, y limpieza de borrador).
- **Archivos modificados**:
  - `src/app/reporte/nuevo.tsx` (Integra `ReportForm` y redirige al detalle al guardar).
  - `src/app/(tabs)/index.tsx` (Listado real conectado a `reportsLib.obtenerReportes()` mediante `useFocusEffect`, estado vacío con llamada a la acción y navegación a cada detalle).
  - `src/app/reporte/[id].tsx` (Pantalla de detalle con validación de ID, manejo amigable de ID inexistente o inválido con botón de retorno, visualización completa de datos, foto y ubicación respetando R05, y botón interactivo para simular resolución en datos con actualización inmediata).
  - `src/app/(tabs)/avisos.tsx` (Bandeja de avisos conectada a `reportsLib.obtenerAvisos()` con recarga en foco, visualización de avisos generados al resolver reportes, marcación de leídos y enlace al reporte asociado).
- **Decisiones**:
  - Mantener estricto cumplimiento de R01: `ReportForm` no solicita permisos de hardware al cargarse.
  - Cumplir R05: tanto en la tarjeta como en el detalle y formulario, si la ubicación es aproximada, se muestra explícitamente "Ubicación aproximada" sin divulgar latitud ni longitud.
  - Manejo amigable y robusto de ID inexistente en `reporte/[id]`: pantalla limpia con ícono y botón de retorno al listado sin lanzar errores no controlados.
  - La simulación de resolución actualiza el estado a `'resuelto'`, persiste la fecha de resolución en almacenamiento local y genera el aviso interno correspondiente.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores de TypeScript.
  - `npx expo-doctor`: 21/21 verificaciones superadas.
  - `npx expo export --no-minify`: Bundling exitoso para Android, iOS y Web con las 15 rutas estáticas y dinámicas resueltas.
- **Criterios cumplidos**: Formulario funcional con validación, listado conectado con estado vacío, detalle completo con manejo de ID inválido y simulación de resolución en datos con generación de avisos.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T006.

### T006
- **Archivos creados**:
  - `src/lib/permissions.ts` (Adaptadores de permisos para cámara, ubicación foreground y notificaciones usando `expo-camera`, `expo-location` y `expo-notifications`; normalización canónica de estados y apertura de ajustes del sistema).
  - `src/hooks/useAppResume.ts` (Hook utilitario suscrito a `AppState` para detectar el regreso a primer plano `active` tras salir de ajustes).
  - `src/hooks/usePermiso.ts` (Hook reactivo unificado según R07 que devuelve estado normalizado, indicador de matiz parcial, métodos `pedir`, `abrirAjustes`, `refrescar` y actualización automática en `AppState`).
  - `src/components/PermissionStatus.tsx` (Componente visual para panel de permisos que expone el estado de cada recurso, diagnóstico técnico R08 con `Platform.OS`, `statusRaw`, `canAskAgain`, matices de precisión y acciones contextuales).
- **Archivos modificados**:
  - `package.json` y `package-lock.json` (Instalación de `expo-camera`, `expo-location` y `expo-notifications` compatibles con SDK 57).
  - `src/types/index.ts` (Definición de `DetallesMatizPermiso` y `ResultadoPermisoNormalizado`).
  - `src/app/(tabs)/permisos.tsx` (Panel de permisos dinámico con información del principio de mínimo privilegio y renderizado de cada recurso mediante `PermissionStatus`).
- **Decisiones**:
  - Respetar estrictamente las reglas de hooks de React: `usePermiso` consume funciones asíncronas puras en `src/lib/permissions.ts` en lugar de llamar hooks nativos específicos de forma condicional según recurso.
  - Implementar los 4 estados canónicos exactos según la especificación: `null` -> `cargando`, `granted` -> `concedido`, `undetermined` o `denied + canAskAgain true` -> `preguntable`, y `denied + canAskAgain false` -> `bloqueado`.
  - Integrar reconsulta automática con `AppState` sin almacenar respuestas persistentes falsas, asegurando sincronización inmediata al volver de Ajustes.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones superadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Adaptadores de permisos integrados, hook unificado `usePermiso` con normalización y AppState, y panel de permisos completo con diagnóstico técnico y matices R08.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T007.

### T007
- **Archivos creados**:
  - `src/components/PermissionExplanation.tsx` (Componente explicativo de permisos con beneficios claros por recurso, lógica de acción Continuar/Abrir Ajustes según estado, nota explícita sobre Ajustes, sin botones 'Ahora no' ni 'Cerrar' dentro de la pantalla según ADR-001 y spec.md, y cierre automático sin insistir tras denegación según R02).
- **Archivos modificados**:
  - `src/app/permisos/[recurso].tsx` (Valida que el parámetro de recurso sea soportado y monta `PermissionExplanation` en pantalla modal de Expo Router).
  - `src/components/PermissionStatus.tsx` (Enlace directo 'Ver pantalla previa y beneficios' hacia el modal `/permisos/[recurso]` para cada recurso).
- **Decisiones**:
  - Respetar estrictamente ADR-001 (punto 9) y spec.md: no incluir botones propios de 'Ahora no', 'Cerrar' o 'Cancelar' dentro del layout de la pantalla, conservando la navegación nativa del sistema (deslizamiento hacia abajo en modal iOS o botón/gesto atrás del sistema en Android).
  - Aplicar regla R02: al presionar 'Continuar' y resolverse el diálogo del sistema operativo (sea concedido o denegado), la pantalla modal se cierra automáticamente (`router.back()`), impidiendo re-mostrar la pantalla explicativa en bucle tras una denegación.
  - Si el recurso está en estado `bloqueado`, el botón principal conmuta a 'Abrir Ajustes' y ejecuta `abrirAjustes()`, actualizando el estado de forma reactiva al volver a la app.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Modal previo con beneficio por recurso, botones Continuar o Abrir Ajustes según estado, nota sobre Ajustes, omisión de botones de descarte internos y no insistencia automática tras denegación.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T008.

### T008
- **Archivos creados**: Ninguno.
- **Archivos modificados**:
  - `src/app/reporte/escanear.tsx` (Integración de `CameraView` de `expo-camera` para escaneo de códigos QR, soporte de los cuatro estados de permiso R03, prevención de lecturas duplicadas mediante flag de bloqueo, alternativa manual de aula siempre disponible con entrada de texto y sugerencias rápidas según R09, simulación para emuladores y actualización inmediata del borrador compartido).
- **Decisiones**:
  - Implementar los 4 estados canónicos exactos para la cámara en la pantalla de escaneo: `cargando` (spinner), `bloqueado` (explicación + botón Abrir Ajustes), `preguntable` (explicación contextual + botón para habilitar y enlace a pantalla previa), y `concedido` (visor `CameraView` activo).
  - Bloquear lecturas repetidas usando un ref síncrono (`escaneandoRef`) y desactivar `onBarcodeScanned` tras la primera lectura válida, evitando ejecuciones o navegaciones duplicadas al enfocar un QR.
  - Asegurar la alternativa manual en todos los estados (R09): el usuario siempre puede escribir el aula o pulsar un chip de sugerencia y guardar sin conceder permisos de cámara.
  - Interpretar el QR como identificador de aula según ADR-001 (punto 6).
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Escaneo QR funcional, estados canónicos de cámara cubiertos, prevención de lecturas repetidas, alternativa manual disponible y persistencia en borrador.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T009.

### T009
- **Archivos creados**: Ninguno.
- **Archivos modificados**:
  - `package.json` y `package-lock.json` (Instalación de `expo-image-picker` compatible con SDK 57).
  - `src/app/reporte/foto.tsx` (Flujo contextual de cámara con verificación de permisos R01/R03, selector de imágenes seguro sin solicitar permisos de lectura de galería según R04, manejo robusto de cancelación sin fallos, vista previa de foto con eliminación o reemplazo, y actualización reactiva en el borrador compartido).
- **Decisiones**:
  - Respetar estrictamente la regla R04: invocar `ImagePicker.launchImageLibraryAsync` directamente sin solicitar permisos amplios de galería (`READ_MEDIA_IMAGES`), aprovechando el Photo Picker seguro del sistema operativo.
  - Para la captura de foto con cámara, evaluar el estado mediante `usePermiso('camara')`: si está concedido lanza `ImagePicker.launchCameraAsync`; si está preguntable solicita el permiso en contexto (R01); si está bloqueado orienta al usuario hacia Ajustes.
  - Garantizar que cancelar la cámara o el selector no altere la foto previamente elegida ni lance excepciones no capturadas.
  - Proporcionar simulación de captura para pruebas en emuladores o entornos sin cámara nativa.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Cámara contextual con verificación de permisos, selector seguro sin permisos de galería, manejo de cancelación, vista previa y persistencia de foto en borrador.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T010.

### T010
- **Archivos creados**:
  - `src/lib/location.ts` (Módulo de dominio para geolocalización foreground con `expo-location`, detección de matiz aproximado vs preciso, omisión de coordenadas exactas si la precisión es aproximada según R05, formateo textual y catálogo de sectores frecuentes).
- **Archivos modificados**:
  - `src/app/reporte/ubicacion.tsx` (Pantalla de ubicación foreground con verificación de permisos R01/R05, adquisición de posición GPS, manejo de estados preguntable/bloqueado/concedido, alternativa manual de sector edilicio siempre disponible según R05/R09 con entrada libre y chips predefinidos, y simulación de GPS aproximado/preciso para pruebas).
- **Decisiones**:
  - Regla R05: cuando el usuario otorga precisión aproximada (Android coarse o iOS reduced), se almacena `{ aproximada: true, latitud: undefined, longitud: undefined }`, impidiendo deliberadamente divulgar o mostrar coordenadas numéricas en cualquier componente.
  - Ubicación en primer plano únicamente: no se solicita ni implementa geolocalización en background (según spec.md y ADR-001).
  - Alternativa manual garantizada (R05 / R09): en cualquier estado de permiso (incluso bloqueado o denegado), el usuario puede especificar el sector o ala del edificio manualmente.
  - Sincronización con el borrador compartido: la selección de ubicación o sector se persiste reactivamente y se refleja en el formulario y en el detalle de la incidencia.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Ubicación foreground implementada, matiz aproximado sin coordenadas respetado (R05), alternativa manual de sector disponible (R09) y persistencia en borrador.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T011.

### T011
- **Archivos creados**:
  - `src/lib/notifications.ts` (Módulo para gestión de notificaciones locales con `expo-notifications`, configuración previa del canal Android 'reportes' según R06, activación contextual ligada al interruptor, handler de presentación en primer plano, y programación de notificación local a 10s tras simular resolución).
- **Archivos modificados**:
  - `src/app/ajustes-app.tsx` (Pantalla de Ajustes con interruptor 'Avisarme cuando se resuelva mi reporte', solicitud de permisos únicamente al encender el switch según R06, persistencia en storage, manejo de estado bloqueado con botón para abrir Ajustes, y texto explicativo sobre el canal Android y bandeja interna).
  - `src/app/reporte/[id].tsx` (Al presionar 'Simular resolución' genera siempre el aviso interno y agenda la notificación local del sistema a 10 segundos únicamente si el interruptor y el permiso están concedidos, informando el estado exacto en el banner de éxito).
- **Decisiones**:
  - Regla R06: en Android el canal 'reportes' se crea obligatoriamente antes de solicitar el permiso al sistema operativo.
  - Regla R06 / R01: la solicitud del permiso de notificaciones se dispara únicamente cuando el usuario activa el interruptor en `/ajustes-app`. Si el usuario deniega o cancela, el switch permanece inactivo y no se insiste (R02).
  - Complementariedad (ADR-001 punto 4): los avisos internos en `/avisos` se registran siempre sin excepción; la notificación local a 10s es complementaria y se agenda solo cuando está permitida.
  - Configurar `setNotificationHandler` con presentación completa (`shouldShowAlert`, `shouldPlaySound`, `shouldShowBanner`, `shouldShowList`) para visualización fluida incluso con la app abierta.
- **Pruebas**:
  - `npx tsc --noEmit`: 0 errores.
  - `npx expo-doctor`: 21/21 verificaciones aprobadas.
  - `npx expo export --no-minify`: Bundling exitoso en Android, iOS y Web con las 15 rutas resueltas.
- **Criterios cumplidos**: Canal Android creado previamente, interruptor contextual en ajustes, aviso interno siempre guardado, notificación local a +10s programada condicionalmente y bandeja funcional.
- **Riesgos / Limitaciones**: Pruebas en hardware físico no ejecutadas; validación realizada mediante compilación estática y bundling Metro completo.
- **Siguiente tarea**: T012 (app.json, build, auditoría, pruebas, README, evidencias y RESPUESTAS.md).
