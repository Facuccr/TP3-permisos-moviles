# Mantenimiento IPF — Especificación y Metodología SDD

Documentación técnica y registro de desarrollo guiado por especificación (**Spec-Driven Development — SDD**) para el TP3 Permisos Móviles (React Native II).

---

## 1. Documentos del Proyecto SDD

- [`AGENTS.md`](./AGENTS.md): Reglas de operación, pautas de permisos y comandos obligatorios.
- [`spec.md`](./spec.md): Especificación funcional, reglas de negocio (**R01** a **R10**), rutas exactas y casos límite.
- [`architecture.md`](./architecture.md): Arquitectura de software, modelos de datos, hooks y adaptadores.
- [`plan.md`](./plan.md): Plan de implementación por etapas (**EPIC 0** a **EPIC 9**).
- [`QA.md`](./QA.md): Matriz de pruebas manuales y verificación de calidad.
- [`tasks/README.md`](./tasks/README.md): Backlog de tareas (**T001** a **T012**) con registro detallado de ejecución y evidencias.
- [`decisions/ADR-001.md`](./decisions/ADR-001.md): Registro de decisiones de arquitectura y límites de alcance.
- [`../RESPUESTAS.md`](../RESPUESTAS.md): Respuestas teóricas completas a las Partes A a F del Trabajo Práctico.
- [`../mantenimiento-ipf/README.md`](../mantenimiento-ipf/README.md): Documentación del proyecto, plugins de `app.json` comentados y guía de build nativa.

---

## 2. Estado de Implementación

Todas las tareas del backlog (**T001** a **T012**) han sido implementadas y verificadas:
- **T001 - T002**: Inspección, inventario de demos y limpieza manteniendo Expo Router funcional.
- **T003**: 15 rutas exactas creadas y resueltas con Stack raíz y Tabs navigator.
- **T004**: Tipos de TypeScript, capa de almacenamiento AsyncStorage y store reactivo de borrador compartido.
- **T005**: Formulario con validación, listado de incidencias, detalle completo, manejo de ID inválido y resolución simulada en datos.
- **T006**: Adaptadores para cámara, ubicación y notificaciones; hook unificado `usePermiso`, sincronización con `AppState` y panel técnico de permisos (**R08**).
- **T007**: Modal explicativo previo `/permisos/[recurso]`, botones dinámicos Continuar/Abrir Ajustes, sin botones de descarte internos (**ADR-001**) y regla de no insistir (**R02**).
- **T008**: Escáner QR de aula con `CameraView`, cuatro estados de permiso (**R03**), debounce ante lecturas repetidas y alternativa manual obligatoria (**R09**).
- **T009**: Cámara fotográfica contextual y selector Photo Picker del sistema sin solicitar permisos de lectura de galería (**R04**).
- **T010**: Geolocalización en primer plano, estricta omisión de coordenadas si el permiso es aproximado (**R05**), alternativa manual de sector edilicio y módulo `location.ts`.
- **T011**: Notificaciones locales con canal Android `'reportes'` previo (**R06**), interruptor contextual en `/ajustes-app`, programación a 10s tras simular resolución y bandeja de avisos interna.
- **T012**: Configuración de plugins en `app.json`, propósito en iOS, exclusión de micrófono y permisos innecesarios, auditoría nativa, READMEs completos y registro de cierre.
