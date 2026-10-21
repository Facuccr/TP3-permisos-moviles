import { Linking, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  DetallesMatizPermiso,
  EstadoPermiso,
  RecursoPermiso,
  ResultadoPermisoNormalizado,
} from '@/types';

/**
 * Normaliza cualquier respuesta nativa de permisos según los 4 estados canónicos:
 * - null/undefined -> 'cargando'
 * - granted -> 'concedido'
 * - undetermined -> 'preguntable'
 * - denied + canAskAgain true -> 'preguntable'
 * - denied + canAskAgain false -> 'bloqueado'
 */
export const normalizarPermiso = (
  recurso: RecursoPermiso,
  raw: any
): ResultadoPermisoNormalizado => {
  if (!raw) {
    return {
      recurso,
      estado: 'cargando',
      parcial: false,
      canAskAgain: true,
      actualizadoEn: new Date().toISOString(),
    };
  }

  const statusRaw: string = raw.status || (raw.granted ? 'granted' : 'undetermined');
  const canAskAgain: boolean =
    raw.canAskAgain !== undefined ? Boolean(raw.canAskAgain) : true;
  const granted: boolean = Boolean(raw.granted);

  let estado: EstadoPermiso = 'cargando';

  if (granted || statusRaw === 'granted') {
    estado = 'concedido';
  } else if (statusRaw === 'undetermined') {
    estado = 'preguntable';
  } else if (statusRaw === 'denied') {
    if (canAskAgain) {
      estado = 'preguntable';
    } else {
      estado = 'bloqueado';
    }
  } else {
    estado = canAskAgain ? 'preguntable' : 'bloqueado';
  }

  let parcial = false;
  const detalles: DetallesMatizPermiso = {
    statusRaw,
  };

  // Matices de ubicación (R05 / R08)
  if (recurso === 'ubicacion') {
    if (raw.android?.accuracy) {
      detalles.accuracy = raw.android.accuracy;
      if (raw.android.accuracy === 'coarse') {
        parcial = true;
      }
    } else if (raw.ios?.accuracy) {
      detalles.accuracy = raw.ios.accuracy;
      if (raw.ios.accuracy === 'reduced') {
        parcial = true;
      }
    }
    if (raw.ios?.scope) {
      detalles.scope = raw.ios.scope;
    }
  } else if (recurso === 'notificaciones') {
    if (raw.ios?.status !== undefined) {
      // 3 = Provisional en iOS UNAuthorizationStatus
      if (raw.ios.status === 3) {
        parcial = true;
      }
    }
  }

  return {
    recurso,
    estado,
    parcial,
    canAskAgain,
    statusRaw,
    detalles,
    actualizadoEn: new Date().toISOString(),
  };
};

export const permissionsLib = {
  /**
   * Consulta el estado actual de un recurso de hardware sin solicitarlo al usuario.
   */
  async consultarPermiso(recurso: RecursoPermiso): Promise<ResultadoPermisoNormalizado> {
    try {
      if (recurso === 'camara') {
        const resp = await Camera.getCameraPermissionsAsync();
        return normalizarPermiso('camara', resp);
      }

      if (recurso === 'ubicacion') {
        // Solo primer plano según R05 / spec.md
        const resp = await Location.getForegroundPermissionsAsync();
        return normalizarPermiso('ubicacion', resp);
      }

      if (recurso === 'notificaciones') {
        const resp = await Notifications.getPermissionsAsync();
        return normalizarPermiso('notificaciones', resp);
      }

      return normalizarPermiso(recurso, null);
    } catch (error) {
      console.warn(`Error al consultar permiso para ${recurso}:`, error);
      return normalizarPermiso(recurso, {
        status: 'undetermined',
        granted: false,
        canAskAgain: true,
      });
    }
  },

  /**
   * Solicita el permiso al sistema operativo para el recurso dado.
   */
  async solicitarPermiso(recurso: RecursoPermiso): Promise<ResultadoPermisoNormalizado> {
    try {
      if (recurso === 'camara') {
        const resp = await Camera.requestCameraPermissionsAsync();
        return normalizarPermiso('camara', resp);
      }

      if (recurso === 'ubicacion') {
        const resp = await Location.requestForegroundPermissionsAsync();
        return normalizarPermiso('ubicacion', resp);
      }

      if (recurso === 'notificaciones') {
        const resp = await Notifications.requestPermissionsAsync();
        return normalizarPermiso('notificaciones', resp);
      }

      return normalizarPermiso(recurso, null);
    } catch (error) {
      console.warn(`Error al solicitar permiso para ${recurso}:`, error);
      return normalizarPermiso(recurso, {
        status: 'denied',
        granted: false,
        canAskAgain: false,
      });
    }
  },

  /**
   * Abre la pantalla de ajustes de la aplicación en el sistema operativo.
   */
  async abrirAjustes(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error al abrir configuración de la app:', error);
    }
  },

  /**
   * Devuelve la plataforma actual para fines de diagnóstico y auditoría (R08).
   */
  obtenerPlataforma(): { os: string; version: string | number } {
    return {
      os: Platform.OS,
      version: Platform.Version,
    };
  },
};
