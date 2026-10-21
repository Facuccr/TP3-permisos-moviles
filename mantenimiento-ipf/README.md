# Mantenimiento IPF — Aplicación Móvil de Incidencias

Aplicación móvil desarrollada con **React Native**, **Expo SDK 57**, **TypeScript** estricto y **Expo Router** para el reporte y seguimiento de problemas edilicios en instituciones educativas (TP3 — Permisos Móviles).

---

## 1. Arquitectura y Rutas de la Aplicación

La navegación está construida utilizando **Expo Router** basado en el sistema de archivos (`src/app/`). La aplicación no requiere backend externo ni autenticación; opera con almacenamiento local persistente (`@react-native-async-storage/async-storage`) y un borrador reactivo compartido en memoria.

| Ruta | Tipo | Propósito | Reglas de Permisos |
|---|---|---|---|
| `/` | Tab | Listado de reportes edilicios con estado y acceso a nuevo reporte. | No solicita permisos. |
| `/reporte/nuevo` | Pantalla | Formulario con título, descripción, categoría y accesos contextuales. | **R01**: Sin solicitar permisos al entrar. |
| `/reporte/escanear` | Pantalla | Visor de cámara para lectura de QR de aula con 4 estados canónicos. | **R03**: Cámara contextual y alternativa manual obligatoria. |
| `/reporte/foto` | Pantalla | Toma de foto con cámara o selección mediante Photo Picker del sistema. | **R04**: Selector sin permiso amplio de galería; cámara contextual. |
| `/reporte/ubicacion` | Pantalla | Geolocalización GPS en primer plano o ingreso de sector edilicio manual. | **R05**: Sin exponer coordenadas si es aproximada; sector manual. |
| `/reporte/[id]` | Pantalla | Detalle completo de la incidencia y botón de simulación de resolución. | Manejo amigable de ID inexistente o inválido. |
| `/avisos` | Tab | Bandeja de notificaciones internas de resoluciones simuladas. | Siempre disponible sin requerir permisos del SO. |
| `/permisos` | Tab | Panel de diagnóstico técnico de hardware, plataforma y matices. | **R08**: Muestra `Platform.OS`, `status`, `canAskAgain` y precisión. |
| `/permisos/[recurso]` | Modal | Pantalla explicativa previa con beneficio específico y acción según estado. | **R01/R02/ADR-001**: Sin botones 'Ahora no' ni 'Cerrar' dentro de la pantalla. |
| `/ajustes-app` | Pantalla | Interruptor *"Avisarme cuando se resuelva mi reporte"*. | **R06**: Solicita permiso solo al activar el switch; canal Android previo. |

---

## 2. Tabla de Permisos y Principio de Mínimo Privilegio

La aplicación cumple estrictamente con el principio de mínimo privilegio (**least privilege**) y degradación elegante (**graceful degradation**): ninguna denegación impide registrar un reporte válido (**R09**).

| Recurso | Permiso Android | Clave iOS (Info.plist) | Momento de Solicitud | Alternativa Sin Permiso (Fallback) |
|---|---|---|---|---|
| **Cámara (QR)** | `CAMERA` | `NSCameraUsageDescription` | Al tocar *"Escanear QR"* en el formulario. | Entrada manual de aula o selección de chips sugeridos. |
| **Cámara (Foto)** | `CAMERA` | `NSCameraUsageDescription` | Al presionar *"Tomar foto con la cámara"*. | Elegir foto existente con el selector o enviar sin foto. |
| **Galería / Selector** | *Ninguno* (Photo Picker) | *Ninguno* (PHPicker) | Al presionar *"Elegir desde selector del sistema"*. | El sistema operativo provee la imagen sin conceder acceso a la galería. |
| **Ubicación** | `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` | `NSLocationWhenInUseUsageDescription` | Al presionar *"Obtener ubicación GPS"*. | Especificar manualmente el sector o ala del edificio. |
| **Notificaciones** | `POST_NOTIFICATIONS` (Android 13+) | Notificaciones locales | Al encender el interruptor en `/ajustes-app`. | Bandeja interna en tab `/avisos` siempre operativa. |

### Permisos Deliberadamente Excluidos (Mínimo Privilegio)
- **Sin Micrófono (`RECORD_AUDIO`)**: Desactivado explícitamente en el plugin de cámara (`recordAudioAndroid: false`), ya que el escáner de códigos QR y la captura de fotos no requieren audio.
- **Sin Acceso Amplio a Galería (`READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`)**: Se utiliza `ImagePicker.launchImageLibraryAsync` que invoca el Photo Picker moderno del sistema, respetando **R04**.
- **Sin Ubicación en Segundo Plano (`ACCESS_BACKGROUND_LOCATION`)**: Excluida en `app.json` (`isAndroidBackgroundLocationEnabled: false`), dado que la geolocalización es exclusivamente foreground (**R05**).

---

## 3. Configuración de Plugins en `app.json` (Explicada en Markdown)

En cumplimiento de las buenas prácticas de Expo y JSON estándar (el archivo `app.json` no admite comentarios internos), a continuación se detalla la justificación técnica de cada plugin y sus propiedades:

```json
{
  "plugins": [
    "expo-router",
    [
      "expo-camera",
      {
        "cameraPermission": "Permite acceder a la cámara para escanear códigos QR de aulas y fotografiar problemas edilicios.",
        "microphonePermission": false,
        "recordAudioAndroid": false
      }
    ],
    [
      "expo-location",
      {
        "locationWhenInUsePermission": "Permite geolocalizar la incidencia en primer plano para asistir al equipo de mantenimiento.",
        "isAndroidBackgroundLocationEnabled": false,
        "isAndroidForegroundServiceEnabled": false
      }
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "Permite seleccionar imágenes del dispositivo para adjuntar al reporte edilicio.",
        "microphonePermission": false
      }
    ],
    [
      "expo-notifications",
      {
        "icon": "./assets/images/icon.png",
        "color": "#2563eb",
        "defaultChannel": "reportes"
      }
    ]
  ]
}
```

### Justificación de Opciones:
1. **`expo-camera`**:
   - `cameraPermission`: Cadena de propósito obligatoria para iOS (`NSCameraUsageDescription`).
   - `microphonePermission: false`: Omite el texto de propósito de micrófono en iOS.
   - `recordAudioAndroid: false`: Evita la inyección innecesaria de `android.permission.RECORD_AUDIO` en el manifiesto Android.
2. **`expo-location`**:
   - `locationWhenInUsePermission`: Cadena de propósito para iOS en primer plano (`NSLocationWhenInUseUsageDescription`).
   - `isAndroidBackgroundLocationEnabled: false`: Bloquea explícitamente el permiso `ACCESS_BACKGROUND_LOCATION`.
   - `isAndroidForegroundServiceEnabled: false`: Bloquea servicios foreground continuos de tracking.
3. **`expo-image-picker`**:
   - `photosPermission`: Mensaje de autorización para selección de fotos en dispositivos legacy.
   - `microphonePermission: false`: Bloquea la inyección de `RECORD_AUDIO` en Android (aplicando `tools:node="remove"`) y omite el propósito en iOS, asegurando mínimo privilegio absoluto.
4. **`expo-notifications`**:
   - `defaultChannel: "reportes"`: Asigna el canal de notificación Android por defecto configurado antes de solicitar permisos (**R06**).
   - `color`: Tono azul institucional para el ícono de notificación.

---

## 4. Auditoría de Manifiesto y Cadenas de Propósito

Al evaluar la configuración de prebuild mediante `npx expo config --type introspect`, los artefactos nativos resultantes reflejan:

### Android (`AndroidManifest.xml`)
- `android.permission.CAMERA` (Solicitado en tiempo de ejecución para QR y captura de foto).
- `android.permission.ACCESS_COARSE_LOCATION` (Permite precisión aproximada).
- `android.permission.ACCESS_FINE_LOCATION` (Permite precisión exacta opcional).
- `android.permission.POST_NOTIFICATIONS` (Permiso de notificación en tiempo de ejecución para Android 13+).
- `android.permission.INTERNET` (Acceso estándar de red).

### iOS (`Info.plist`)
- `NSCameraUsageDescription`: *"Permite acceder a la cámara para escanear códigos QR de aulas y fotografiar problemas edilicios."*
- `NSLocationWhenInUseUsageDescription`: *"Permite geolocalizar la incidencia en primer plano para asistir al equipo de mantenimiento."*
- `NSPhotoLibraryUsageDescription`: *"Permite seleccionar imágenes del dispositivo para adjuntar al reporte edilicio."*

---

## 5. Instrucciones de Ejecución y Verificación

### Prerrequisitos
- Node.js 18+ o superior.
- Dependencias instaladas en la carpeta `mantenimiento-ipf`.

### Comandos de Verificación de Calidad
```bash
# 1. Comprobación de tipos estricta (TypeScript)
npx tsc --noEmit

# 2. Diagnóstico integral de compatibilidad Expo SDK 57
npx expo-doctor

# 3. Compilación y bundling Metro multiplataforma (Android, iOS y Web)
npx expo export --no-minify

# 4. Iniciar servidor de desarrollo Metro
npx expo start
```

---

## 6. Generación de Development Build (EAS Build / Prebuild)

Para verificar el comportamiento nativo real (cadenas de propósito de iOS, canales de notificación en Android y diálogos del sistema operativo que difieren de la sandbox genérica de Expo Go):

### Opción A: EAS Build en la Nube
```bash
# Iniciar sesión en EAS
npx eas-cli login

# Configurar el proyecto
npx eas-cli build:configure

# Generar development build para Android
npx eas-cli build --profile development --platform android
```

### Opción B: Prebuild Local
```bash
# Generar carpetas nativas android/ e ios/ temporales
npx expo prebuild

# Ejecutar en emulador o dispositivo físico
npx expo run:android
npx expo run:ios
```

---

## 7. Respuestas Teóricas

Las respuestas completas, justificadas y redactadas para las **Partes A, B, C, D, E y F** del Trabajo Práctico N° 3 se encuentran en el archivo [`RESPUESTAS.md`](../RESPUESTAS.md) en la raíz del repositorio.
