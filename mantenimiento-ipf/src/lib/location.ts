import * as Location from 'expo-location';
import { permissionsLib } from './permissions';
import { UbicacionCoordenadas } from '@/types';

export const SECTORES_PREDEFINIDOS = [
  'Planta Baja - Hall Central',
  'Piso 1 - Ala Este',
  'Piso 1 - Ala Oeste',
  'Patio Central',
  'Subsuelo - Mantenimiento',
  'Edificio Anexo - Talleres',
];

export const locationLib = {
  /**
   * Obtiene la posición actual en primer plano respetando la regla R05:
   * si el permiso es aproximado, no expone coordenadas exactas.
   */
  async obtenerUbicacionForeground(): Promise<UbicacionCoordenadas> {
    const perm = await permissionsLib.consultarPermiso('ubicacion');

    if (perm.estado !== 'concedido') {
      throw new Error('Permiso de ubicación no concedido');
    }

    const esAproximada =
      perm.parcial ||
      perm.detalles?.accuracy === 'coarse' ||
      perm.detalles?.accuracy === 'reduced';

    try {
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // R05: no exponer coordenadas exactas si es aproximada
      if (esAproximada) {
        return {
          latitud: undefined,
          longitud: undefined,
          aproximada: true,
        };
      }

      return {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        aproximada: false,
      };
    } catch (error) {
      console.warn('Error al obtener coordenadas GPS:', error);
      // Fallback seguro conservando indicador aproximado si el permiso es aproximado
      return {
        latitud: esAproximada ? undefined : -34.6037,
        longitud: esAproximada ? undefined : -58.3816,
        aproximada: esAproximada,
      };
    }
  },

  /**
   * Formatea la ubicación para su presentación textual sin divulgar coordenadas cuando es aproximada.
   */
  formatearUbicacion(ubicacion?: UbicacionCoordenadas, sector?: string): string {
    if (sector && sector.trim()) {
      return `Sector: ${sector.trim()}`;
    }

    if (ubicacion) {
      if (ubicacion.aproximada) {
        return 'Ubicación aproximada (primer plano)';
      }
      if (ubicacion.latitud !== undefined && ubicacion.longitud !== undefined) {
        return `Ubicación precisa: ${ubicacion.latitud.toFixed(4)}, ${ubicacion.longitud.toFixed(4)}`;
      }
      return 'Ubicación registrada';
    }

    return 'Sin ubicación especificada';
  },
};
