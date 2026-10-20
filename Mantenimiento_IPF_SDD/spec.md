# Especificación funcional — Mantenimiento IPF
## Fuente y alcance
Basado en Parte G, páginas 13–15 del TP3 Permisos móviles. Las Partes A–F son una entrega separada en RESPUESTAS.md. La presentación HTML es material de referencia, no código para portar.
## Objetivo
Permitir reportar problemas edilicios con título, descripción, aula, categoría, foto opcional, ubicación o sector opcional y estado. Categorías: electricidad, agua, mobiliario, equipos. Estados: pendiente, en curso, resuelto. Los reportes son propios del dispositivo; no hay backend ni autenticación exigidos.
## Rutas exactas
/ Inicio: tab Reportes, lista y botón Nuevo reporte.
/reporte/nuevo: formulario, acciones escanear, foto, ubicación; sin permiso al entrar.
/reporte/escanear: cámara QR, estados cargando/concedido/preguntable/bloqueado; alternativa aula manual.
/reporte/foto: sacar foto (cámara) o elegir foto mediante selector sin permiso de galería.
/reporte/ubicacion: ubicación foreground; mostrar 'Ubicación aproximada' si corresponde; sector manual.
/reporte/[id]: validar id, detalle, botón Simular resolución.
/avisos: tab Avisos, bandeja interna.
/permisos: tab Permisos, estado de recursos y matices, plataforma y actualización al volver de Ajustes.
/permisos/[recurso]: modal previo con beneficio, Continuar o Abrir Ajustes según estado, nota sobre Ajustes; sin botones Ahora no ni Cerrar dentro de la pantalla.
/ajustes-app: interruptor Avisarme cuando se resuelva mi reporte.
## Reglas
R01: permisos solo al tocar función; pantalla previa antes de cada diálogo del SO.
R02: no mostrar automáticamente la pantalla previa tras una denegación.
R03: cámara: cuatro estados y entrada manual.
R04: galería: ImagePicker.launchImageLibraryAsync sin READ_MEDIA_IMAGES ni permiso general de galería.
R05: ubicación: solo primer plano, no exponer coordenadas exactas si es aproximada; alternativa sector manual.
R06: notificaciones: pedir solo al activar interruptor; Android canal reportes antes de solicitar; simular resolución agenda notificación local a 10 s cuando se permite; aviso interno siempre disponible.
R07: hook src/hooks/usePermiso.ts devuelve estado normalizado, parcial, pedir y abrirAjustes; refrescar con AppState.
R08: panel muestra Platform.OS, status/canAskAgain y matices accessPrivileges/accuracy cuando apliquen.
R09: ninguna denegación impide guardar un reporte válido.
R10: persistencia local propuesta para reportes, borradores, preferencias y avisos; no requerida expresamente por consigna.
## Casos límite
Permiso null -> cargando; denied + canAskAgain true -> preguntable; denied + false -> bloqueado; granted -> concedido. La condición undetermined se considera preguntable. Manejar errores, cancelación del picker, QR repetidos, ruta id inválido, retorno de Ajustes, Android/iOS y simulador sin hardware.
## No alcance
Backend, login, cuentas, envío push remoto, ubicación background, micrófono, acceso completo a galería, mapas remotos, sincronización multiusuario. Opcionales G4 solo tras terminar lo obligatorio.
## Criterios de aceptación
Todas las rutas funcionan; cada permiso tiene flujo contextual y fallback; crear y consultar reportes sin permisos; resolución produce aviso interno y notificación cuando corresponde; README, RESPUESTAS.md, capturas y development build documentadas.
