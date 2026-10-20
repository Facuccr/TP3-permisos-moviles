# Trabajo Práctico N° 3 - Respuestas

## Parte A. ¿Qué es un permiso y por qué existe?

### A1. Conceptos
**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**
Un permiso es la autorización para acceder a un recurso sensible del dispositivo. La app declara qué necesita y pide acceso; el sistema operativo muestra el diálogo y hace cumplir la decisión; y la persona usuaria es quien decide si acepta o rechaza.
**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**
La caja de arena es un espacio aislado donde vive cada app, pudiendo ver solo sus propios archivos. Los permisos son la "llave" para salir de ahí. Sin permisos, una app solo puede mostrar pantallas, guardar sus propios datos internos y conectarse a internet.
**c) Nombrá las cuatro razones por las que existen los permisos y dá un ejemplo concreto de cada una.**
1. Privacidad (ej: evitar que tu voz salga sin tu acuerdo).
2. Seguridad (ej: limitar el daño de una app maliciosa a lo que se le permitió).
3. Transparencia (ej: mostrar un punto verde en la barra cuando se usa la cámara).
4. Control (ej: poder revocar el acceso a la ubicación desde los Ajustes meses después).
**d) En la analogía del portero del edificio, ¿quién es la visita, quién el portero y quién el dueño del departamento? ¿Qué significa que "el portero se acuerda de la respuesta"?**
La visita es la app, el portero es el sistema operativo y el dueño es la persona usuaria. Significa que el sistema guarda la decisión de la persona para aplicarla automáticamente en el futuro (conceder el paso o bloquearlo).

### A2. Declarar y solicitar
| | Declarar (al compilar) | Solicitar (al ejecutar) |
|---|---|---|
| **¿Qué se hace?** | Se avisa qué recursos se podrían usar. | Se pide acceso al momento de usar la función. |
| **¿Dónde / cómo en Android?** | `<uses-permission>` en `AndroidManifest.xml`. | Solo para los permisos de tiempo de ejecución (peligrosos). |
| **¿Dónde / cómo en iOS?** | Texto de propósito en el `Info.plist`. | Para cada recurso protegido (ej. cámara, ubicación). |
| **¿Dónde / cómo en Expo?** | En `app.json` (plugins o keys nativas). | Con `request...PermissionsAsync()` o los hooks. |
| **¿Qué pasa si se omite?** | Android deniega silenciosamente. iOS cierra la app y Apple rechaza la build. | Si no se pide en ejecución, no se tiene acceso al recurso. |

### A3. Verdadero o falso
a) **Falso.** El diálogo lo dibuja el sistema operativo, nunca tu código.
b) **Verdadero.**
c) **Falso.** Agregar un permiso nuevo exige recompilar una nueva build, no viaja por OTA.
d) **Falso.** Si no está en el manifiesto, Android lo deniega en el acto sin diálogo.
e) **Falso.** `expo-permissions` está obsoleto; cada módulo maneja sus propios permisos.
f) **Verdadero.**
g) **Verdadero.**
h) **Verdadero.**

### A4. Los estados de un permiso
**a)** En iOS hay un solo intento (rechazo = bloqueado). En Android hay dos (1er rechazo = denegado preguntable; 2do rechazo = bloqueado).
**b)**
| Estado | status | canAskAgain | ¿Puede aparecer el diálogo? |
|---|---|---|---|
| Sin decidir | `'undetermined'` | `true` | Sí |
| Concedido | `'granted'` | `true` (en general) | No (ya está concedido) |
| Denegado | `'denied'` | `true` | Sí |
| Bloqueado | `'denied'` | `false` | No (solo desde Ajustes) |

---

## Parte B. Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos
* INTERNET: Normal / Al instalar.
* CAMERA: Tiempo de ejecución / Con diálogo.
* VIBRATE: Normal / Al instalar.
* SYSTEM_ALERT_WINDOW: Especial / En Ajustes.
* POST_NOTIFICATIONS: Tiempo de ejecución / Con diálogo (Android 13+).
* ACCESS_NETWORK_STATE: Normal / Al instalar.
* READ_CONTACTS: Tiempo de ejecución / Con diálogo.
* SCHEDULE_EXACT_ALARM: Especial / En Ajustes.
* RECORD_AUDIO: Tiempo de ejecución / Con diálogo.
* MANAGE_EXTERNAL_STORAGE: Especial / En Ajustes.

### B2. Grupos y nombres
a) Son categorías visuales. Si pide ubicación precisa y aproximada juntas, la persona ve un solo diálogo de "Ubicación".
b) Prefijo: `android.permission.`. Nombre completo: `android.permission.CAMERA`.
c) Son para apps firmadas con el mismo certificado que el sistema operativo.

### B3. Leé el manifiesto
a) Se conceden solos INTERNET; se piden en tiempo de ejecución CAMERA, ACCESS_COARSE/FINE_LOCATION y POST_NOTIFICATIONS.
b) Significa que rige hasta la API 32 (Android 12L). Desde Android 13 lo reemplazan `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y `READ_MEDIA_AUDIO`.
c) Quita ese permiso del manifiesto final. En `app.json` se genera usando `blockedPermissions: ["android.permission.RECORD_AUDIO"]`.
d) En el arreglo `permissions` dentro de `expo.android`.
e) Porque se sobrescribe al correr `prebuild`. `blockedPermissions` no funciona en Expo Go.

### B4. Así pregunta Android
a) No se puede. Hay que explicarlo en una pantalla previa propia antes de llamar al pedido.
b) "En uso" se mantiene mientras la app esté abierta. "Solo esta vez" se revoca al salir. Aplica para Ubicación, Cámara y Micrófono.
c) Android deja de mostrar el diálogo y asume "no volver a preguntar". `canAskAgain` toma valor `false`.
d) Bien: Buscar farmacias de turno en la zona. Mal: App de navegación GPS paso a paso.
e) Termina (mata) el proceso de la app para asegurar que los permisos se apliquen desde cero al reabrirla.

### B5. Android, versión por versión
* API 23 (Android 6): Nacen los permisos en tiempo de ejecución.
* API 29 (Android 10): Ubicación en segundo plano pasa a ser permiso aparte.
* API 30 (Android 11): Dos rechazos = no preguntar más.
* API 31 (Android 12): Ubicación precisa/aproximada.
* API 33 (Android 13): POST_NOTIFICATIONS / READ_MEDIA_IMAGES.
* API 34 (Android 14): Fotos parciales / SCHEDULE_EXACT_ALARM inactivo.
* API 37 (Android 17): ACCESS_LOCAL_NETWORK.
**targetSdkVersion** es la API a la que apunta tu app. Google Play exige API 36 desde agosto 2026.

---

## Parte C. iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist
* Cámara: `NSCameraUsageDescription`
* Micrófono: `NSMicrophoneUsageDescription`
* Ubicación en uso: `NSLocationWhenInUseUsageDescription`
* Ubicación siempre: `NSLocationAlwaysAndWhenInUseUsageDescription`
* Fotos (leer): `NSPhotoLibraryUsageDescription`
* Fotos (solo guardar): `NSPhotoLibraryAddUsageDescription`
* Contactos: `NSContactsUsageDescription`
* Face ID: `NSFaceIDUsageDescription`
* Rastreo (ATT): `NSUserTrackingUsageDescription`
* Notificaciones: (No lleva clave).

### C2. Sin texto, no hay permiso
a) La app se cierra (crashea). En App Store Connect tira el error ITMS-90683.
b) Lo muestra una sola vez. Si rechaza, queda bloqueado y solo se cambia desde Ajustes.
c) iOS arma el título (con el nombre de la app) y los botones. Vos escribís la descripción en `app.json` (plugins o `ios.infoPlist`).
d) Pasa porque Apple detecta el código de la API protegida. Se resuelve agregando un texto explicativo o quitando el permiso sobrante.

### C3. Probador de textos de propósito
* "Necesitamos tu ubicación." -> **No aprobado.** "Usamos tu ubicación para buscar tiendas en tu zona."
* "Para mejorar tu experiencia." -> **No aprobado.** "Usamos tu ubicación para ordenar las ofertas por cercanía."
* "Usamos tu ubicación para mostrarte las farmacias..." -> **Aprobado.**
* "La app no funciona sin ubicación." -> **No aprobado.** "Usamos tu ubicación para habilitar el GPS de tu viaje."
* "Ubicación requerida por el sistema." -> **No aprobado.** "Usamos tu ubicación para registrar dónde entregaste el paquete."

### C4. Acceso parcial y gradual
* Fotos limitadas: iOS 14 / `accessPrivileges: 'limited'`
* Ubicación aproximada: iOS 14 / `ios.accuracy: 'reduced'`
* Permitir una vez: iOS 13 / Al reiniciar vuelve a `undetermined`
* Ubicación escalonada: iOS 13 / Segundo pedido con `requestBackgroundPermissionsAsync`
* Notificaciones provisionales: iOS 12 / `allowProvisional: true`
* ATT: iOS 14.5 / `expo-tracking-transparency`

### C5. Android vs iOS, lado a lado
* **Declarar:** Android (Manifest `<uses-permission>`). iOS (Info.plist, texto de propósito).
* **Texto:** Android (del sistema). iOS (propio).
* **Oportunidades:** Android (2). iOS (1).
* **Solo una vez:** Android (Ubicación, cámara, micrófono). iOS (Solo ubicación).
* **Notificaciones:** Android (Permiso Runtime 13+). iOS (Siempre, o provisional).
* **Segundo plano:** Android (Abre ajustes). iOS (Segundo diálogo).
* **Si falta:** Android (Deniega silencioso). iOS (Crashea/rechazo de tienda).

---

## Parte D. Expo: una API, dos plataformas

### D1. Módulos y funciones
* Escanear un QR: `expo-camera` / `useCameraPermissions()`
* Grabar video: `expo-camera` / `useMicrophonePermissions()` (junto al de cámara)
* Mostrar farmacias: `expo-location` / `useForegroundPermissions()`
* Seguir un envío background: `expo-location` / `useBackgroundPermissions()`
* Recordatorio: `expo-notifications` / `requestPermissionsAsync()`
* Nota de voz: `expo-audio` / `requestRecordingPermissionsAsync()`

### D2. Consultar, pedir y el hook
a) `get...` consulta sin mostrar nada. `request...` dispara el diálogo.
b) 1. `permiso` (el estado), 2. `pedirPermiso` (función), 3. `consultarPermiso` (función). Mientras es null, mostrar un indicador de carga.
c) Devuelve denegado al instante sin diálogo. Si se llama en un bucle, la app se traba o bloquea la UI.

### D3. Leé la respuesta
* `null` -> Mostrar indicador de carga.
* `granted` -> Ejecutar la función.
* `undetermined` -> Mostrar pantalla previa explicando y un botón para pedir.
* `denied` / `canAskAgain: true` -> Mostrar alternativa y botón para reintentar.
* `denied` / `canAskAgain: false` -> Mostrar alternativa y botón que abra Ajustes.
* `accessPrivileges: 'limited'` -> Trabajar con las fotos seleccionadas, ofrecer ampliar.
* `accuracy: 'coarse'` -> Trabajar con la zona (ej. no mostrar distancias exactas en metros).

Las dos claves principales son `granted` (¿Lo puedo usar?) y `canAskAgain` (¿Lo pido de nuevo o lo mando a Ajustes?).

### D4. Simulación del ciclo completo
(Android 14)
1. `undetermined` / `true` / Sin diálogo
2. `denied` / `true` / Con diálogo
3. `denied` / `false` / Con diálogo (es el 2do)
4. `denied` / `false` / Sin diálogo (ya está bloqueado)
5. `granted` / `true` / Sin diálogo (habilitado en Ajustes)
6. Muestra "bloqueado" porque el hook en la app nunca se enteró del cambio (requiere AppState).

En iOS, cambia en el paso 3: el primer rechazo ya pone `canAskAgain: false`. En iOS, si se elige "Permitir una vez" y se reabre la app, el permiso vuelve a `undetermined`.

### D5. Configurar app.json
```json
"plugins": [
  ["expo-camera", {
    "cameraPermission": "Usamos la cámara para escanear el QR del aula.",
    "microphonePermission": false,
    "recordAudioAndroid": false
  }],
  ["expo-location", {
    "locationWhenInUsePermission": "Usamos la ubicación para mostrar los puntos de reciclaje de tu zona."
  }]
],
"android": {
  "blockedPermissions": ["android.permission.SYSTEM_ALERT_WINDOW"]
}
```
`expo-camera` agrega `RECORD_AUDIO` por defecto porque el componente puede grabar video con sonido.

### D6. Expo Go no es tu app
a) Porque usás el Info.plist compilado de la app Expo Go, no el tuyo.
b) Expo Go sirve para lógica visual y flujos. Push en Android (13+) y ubicación background necesitan development build.
c) `npx expo prebuild --clean` y `npx expo run:android`
d) Android: `adb shell pm revoke <paquete> <permiso>`. iOS: `xcrun simctl privacy booted reset <recurso> <bundleId>`.

---

## Parte E. Recetas: leer y corregir código

### E1. Encontrá los errores (cámara)
Falta manejar `null`, usa comparación estricta en lugar de leer el booleano `granted`, y asume que si no es granted se puede pedir, ignorando el estado de bloqueo.
**Corrección:**
```typescript
if (!permiso) return <Cargando />;
if (permiso.granted) return <CameraView style={{ flex: 1}} facing="back" />;
if (permiso.canAskAgain) return <Explicacion texto="..."><Button title="Continuar" onPress={pedirPermiso} /></Explicacion>;
return <Explicacion texto="..."><Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} /></Explicacion>;
```

### E2. El orden importa (ubicación)
a) Pide background antes que foreground. En Android abrirá ajustes sin contexto, en iOS no preguntará nada o fallará.
b) Primero pedir foreground; si se aprueba, pedir background.
c)
```typescript
const permiso = await Location.requestForegroundPermissionsAsync();
if (!permiso.granted) return null;
const aproximada = permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';
const { coords } = await Location.getCurrentPositionAsync();
return { ...coords, aproximada };
```
d) No hace falta. Google Play exige que si usás background esté totalmente justificado en video y con aviso destacado.

### E3. Notificaciones mudas
a) En Android 13+, no hay diálogo de notificaciones si la app no ha creado un Notification Channel antes.
b) En Android 12 o inferior, son concedidas al instalar, responde sin diálogo.
c) Notificaciones provisionales (`allowProvisional: true`).
d) Conviene pedirlo después de que el usuario realiza una acción de interés (ej. suscribirse a un recordatorio), no al abrir la app de golpe.

### E4. Fotos sin pedir permiso
* Elegir foto de perfil: `ImagePicker.launchImageLibraryAsync` / Permiso: Ninguno.
* Sacar foto: `ImagePicker.launchCameraAsync` / Permiso: Cámara.
* Editor/Galería: `expo-media-library` / Permiso: Fotos.
* Adjuntar comprobante: `ImagePicker.launchImageLibraryAsync` / Permiso: Ninguno.
Google Play restringe permisos masivos de galería solo a apps que son galerías/editores (desde 2025). El "mejor permiso" es el que no tenés que pedir (usando el selector nativo).

### E5. Volver de Ajustes
```typescript
const estabaAfuera = anterior.current !== 'active';
if (estabaAfuera && nuevo === 'active') revisar();
return () => sub.remove();
```
a) Porque ocurren a nivel sistema y tu app en segundo plano está "congelada".
b) La función `consultarPermiso` generada por el hook.
c) Porque si el usuario lo revoca desde Ajustes y vuelve, Android mata el proceso. El valor guardado "para siempre" estaría obsoleto.

---

## Parte F. Buenas prácticas y tiendas

### F1. Pedir en contexto
* **Delivery ubicación:** Al querer ver comercios cercanos. Alternativa: buscar por texto.
* **Billetera virtual cámara:** Al tocar "Pagar con QR". Alternativa: ingresar código de barras a mano.
* **Red social contactos:** Al tocar "Buscar amigos". Alternativa: Compartir link vía WhatsApp.
* **Mensajería micrófono:** Al intentar enviar el primer audio. Alternativa: Escribir texto.
* **Turnos notificaciones:** Al confirmar un turno. Alternativa: Verlos en una pantalla de la app.
* **Editor galería:** Al abrir el lienzo. Alternativa: Usar el selector.
Entrena el "No permitir" automático (fatiga de permisos).

### F2. La pantalla previa
a) El beneficio en una frase, un botón de "Continuar", y la aclaración de que se puede cambiar en Ajustes.
b) Porque el permiso real lo otorga el diálogo del sistema; tu botón solo lo desencadena.
c) Rechaza las apps que obligan a salir de esas pantallas previas simulando diálogos de sistema con "Ahora no" o similares.
d) Explica cómo ir a habilitarlo y el botón es "Abrir Ajustes".

### F3. Mínimo privilegio
a) Aproximada: alcanza con saber la zona, no requiere metros exactos.
b) En uso: la persona la lleva en el bolsillo, pero con la app activa/tracking en primer plano (Foreground Service).
c) Selector: elige solo la foto requerida sin darte toda su galería.
d) Sin micrófono: el código QR es visual, no tiene audio.

### F4. Tiendas
a) Google Play: Justificar segundo plano con video, restringir MANAGE_EXTERNAL_STORAGE. Apple: Textos de propósito descriptivos, ATT para publicidad.
b) Un archivo que declara qué datos se recolectan y para qué, obligatorio en iOS. Se configura en `ios.privacyManifests`.
c) Suma acceso de red local y Google Play exigirá selectores nativos de contactos para dejar de usar READ_CONTACTS.

### F5. Errores comunes
a) Faltó configurar la key de propósito (ej: NSCameraUsageDescription) en el app.json.
b) Expo Go tiene sus propios permisos ya aceptados a nivel app base; la build requiere la declaración de tus permisos en el app.json.
c) Falta el hook de `AppState` (ej. `useRevisarAlVolver`) para actualizar el estado cuando la app retorna al frente.
d) Se puso `requestPermissionsAsync()` en el nivel principal del render sin useEffect o en un estado inicial, disparando el llamado en cada ciclo.
e) Mal diseño UX: No se degradó con elegancia. Las notificaciones no son vitales, debe dejarlos pasar a la app de todos modos.