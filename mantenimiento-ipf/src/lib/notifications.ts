import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { permissionsLib } from './permissions';
import { storage } from './storage';
import { Reporte } from '@/types';

// Configurar el handler de presentación de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const CANAL_REPORTES_ID = 'reportes';

export const notificationsLib = {
  /**
   * Crea y asegura el canal de notificaciones 'reportes' en Android antes de solicitar permisos (R06).
   */
  async configurarCanalAndroid(): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync(CANAL_REPORTES_ID, {
          name: 'Resolución de Reportes',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'Avisos sobre la resolución de desperfectos edilicios reportados.',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563EB',
          enableLights: true,
          enableVibrate: true,
        });
      } catch (err) {
        console.warn('Error al configurar canal de notificaciones en Android:', err);
      }
    }
  },

  /**
   * Solicita el permiso de notificaciones contextual al activar el interruptor (R06).
   * Crea el canal de Android antes de la solicitud y persiste la preferencia.
   */
  async activarNotificacionesConPermiso(): Promise<{
    concedido: boolean;
    bloqueado: boolean;
  }> {
    // 1. Android: canal 'reportes' creado antes de solicitar (R06)
    await this.configurarCanalAndroid();

    // 2. Verificar estado actual
    const permActual = await permissionsLib.consultarPermiso('notificaciones');
    if (permActual.estado === 'concedido') {
      await storage.savePreferencias({ avisarResolucion: true });
      return { concedido: true, bloqueado: false };
    }

    if (permActual.estado === 'bloqueado') {
      await storage.savePreferencias({ avisarResolucion: false });
      return { concedido: false, bloqueado: true };
    }

    // 3. Solicitar permiso al sistema operativo (R01 / R06)
    const resultado = await permissionsLib.solicitarPermiso('notificaciones');
    const concedido = resultado.estado === 'concedido';

    await storage.savePreferencias({ avisarResolucion: concedido });
    return {
      concedido,
      bloqueado: resultado.estado === 'bloqueado',
    };
  },

  /**
   * Desactiva la preferencia de notificaciones.
   */
  async desactivarNotificaciones(): Promise<void> {
    await storage.savePreferencias({ avisarResolucion: false });
  },

  /**
   * Agenda una notificación local a 10 segundos al resolver un reporte (R06),
   * únicamente si las notificaciones están permitidas por el SO y activadas por el usuario.
   */
  async agendarNotificacionResolucion(
    reporte: Reporte
  ): Promise<{ agendada: boolean; motivo?: string }> {
    // 1. Validar preferencia guardada
    const prefs = await storage.getPreferencias();
    if (!prefs.avisarResolucion) {
      return {
        agendada: false,
        motivo: 'Opción desactivada en Ajustes de la aplicación.',
      };
    }

    // 2. Validar permiso en el sistema operativo
    const perm = await permissionsLib.consultarPermiso('notificaciones');
    if (perm.estado !== 'concedido') {
      return {
        agendada: false,
        motivo: 'Permiso de notificaciones no concedido en el sistema operativo.',
      };
    }

    try {
      // Asegurar canal antes de enviar en Android
      await this.configurarCanalAndroid();

      // Programar notificación a 10 segundos
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reporte Resuelto ✓',
          body: `El problema "${reporte.titulo}" en "${reporte.aula}" ha sido marcado como resuelto.`,
          sound: 'default',
          data: { reporteId: reporte.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          channelId: CANAL_REPORTES_ID,
          seconds: 10,
          repeats: false,
        },
      });

      return { agendada: true };
    } catch (err) {
      console.warn('Error al agendar notificación local:', err);
      return {
        agendada: false,
        motivo: 'No se pudo programar la notificación local en el dispositivo.',
      };
    }
  },
};
