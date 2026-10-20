# Arquitectura técnica
## Carpetas previstas
src/app/_layout.tsx
src/app/(tabs)/_layout.tsx
src/app/(tabs)/index.tsx
src/app/(tabs)/avisos.tsx
src/app/(tabs)/permisos.tsx
src/app/reporte/nuevo.tsx
src/app/reporte/escanear.tsx
src/app/reporte/foto.tsx
src/app/reporte/ubicacion.tsx
src/app/reporte/[id].tsx
src/app/permisos/[recurso].tsx
src/app/ajustes-app.tsx
src/components/PermissionStatus.tsx
src/components/PermissionExplanation.tsx
src/components/ReportForm.tsx
src/components/ReportCard.tsx
src/hooks/usePermiso.ts
src/hooks/useAppResume.ts
src/lib/permissions.ts
src/lib/notifications.ts
src/lib/location.ts
src/lib/reports.ts
src/lib/storage.ts
src/types/index.ts
## Navegación
Expo Router: (tabs) agrupa rutas sin añadir segmento URL. Stack raíz con pantalla permisos/[recurso] modal. No duplicar nombres de ruta.
## Datos
Reporte: id:string; titulo:string; descripcion:string; aula:string; categoria:'electricidad'|'agua'|'mobiliario'|'equipos'; estado:'pendiente'|'en curso'|'resuelto'; fotoUri?:string; sector?:string; ubicacion?:{latitud?:number;longitud?:number;aproximada:boolean}; creadoEn:string; resueltoEn?:string.
Aviso: id, reporteId, mensaje, fecha, leido. Borrador compartido entre pantallas de reporte para preservar campos al navegar; evitar pasar fotos/objetos grandes en parámetros URL.
## Permisos
Recurso soportado: camara, ubicacion, notificaciones; fotos limitadas solo si realmente se consulta un permiso de biblioteca para un escenario opcional, sin solicitarlo para elegir foto. Evitar representar el picker como un permiso solicitado.
Adaptadores en src/lib/permissions.ts para consultar y pedir usando expo-camera, expo-location y expo-notifications. El hook normaliza respuestas y vuelve a consultar al activar AppState. Asegurar que el hook cumple reglas de hooks; no llamar hooks específicos condicionalmente según recurso. Se puede implementar con funciones asíncronas y useEffect.
## Persistencia
Propuesta: AsyncStorage instalado con npx expo install @react-native-async-storage/async-storage. Guardar metadatos y avisos; para foto persistente copiar URI temporal a almacenamiento de app con API de archivos compatible con SDK. Validar compatibilidad antes de implementar.
## Calidad
TypeScript sin any injustificado, validación de formularios, errores visibles, estados vacíos, accesibilidad básica, limpieza de listeners y suscripciones, ausencia de solicitudes duplicadas. Tests manuales Android y al menos una development build.
