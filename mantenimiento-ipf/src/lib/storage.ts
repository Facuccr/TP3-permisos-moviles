import AsyncStorage from '@react-native-async-storage/async-storage';
import { Aviso, BorradorReporte, PreferenciaAjustes, Reporte } from '@/types';

const STORAGE_KEYS = {
  REPORTES: '@mantenimiento_ipf:reportes',
  AVISOS: '@mantenimiento_ipf:avisos',
  BORRADOR: '@mantenimiento_ipf:borrador',
  PREFERENCIAS: '@mantenimiento_ipf:preferencias',
} as const;

export const storage = {
  async getReportes(): Promise<Reporte[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REPORTES);
      return data ? (JSON.parse(data) as Reporte[]) : [];
    } catch (error) {
      console.error('Error al obtener reportes de almacenamiento:', error);
      return [];
    }
  },

  async saveReportes(reportes: Reporte[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTES, JSON.stringify(reportes));
    } catch (error) {
      console.error('Error al guardar reportes en almacenamiento:', error);
    }
  },

  async getAvisos(): Promise<Aviso[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AVISOS);
      return data ? (JSON.parse(data) as Aviso[]) : [];
    } catch (error) {
      console.error('Error al obtener avisos de almacenamiento:', error);
      return [];
    }
  },

  async saveAvisos(avisos: Aviso[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AVISOS, JSON.stringify(avisos));
    } catch (error) {
      console.error('Error al guardar avisos en almacenamiento:', error);
    }
  },

  async getBorrador(): Promise<BorradorReporte | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BORRADOR);
      return data ? (JSON.parse(data) as BorradorReporte) : null;
    } catch (error) {
      console.error('Error al obtener borrador de almacenamiento:', error);
      return null;
    }
  },

  async saveBorrador(borrador: BorradorReporte): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BORRADOR, JSON.stringify(borrador));
    } catch (error) {
      console.error('Error al guardar borrador en almacenamiento:', error);
    }
  },

  async clearBorrador(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BORRADOR);
    } catch (error) {
      console.error('Error al limpiar borrador de almacenamiento:', error);
    }
  },

  async getPreferencias(): Promise<PreferenciaAjustes> {
    const defaultPreferencias: PreferenciaAjustes = { avisarResolucion: false };
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCIAS);
      return data ? (JSON.parse(data) as PreferenciaAjustes) : defaultPreferencias;
    } catch (error) {
      console.error('Error al obtener preferencias de almacenamiento:', error);
      return defaultPreferencias;
    }
  },

  async savePreferencias(preferencias: PreferenciaAjustes): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCIAS, JSON.stringify(preferencias));
    } catch (error) {
      console.error('Error al guardar preferencias en almacenamiento:', error);
    }
  },
};
