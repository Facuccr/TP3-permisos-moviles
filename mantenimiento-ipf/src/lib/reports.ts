import { storage } from './storage';
import { Aviso, BorradorReporte, EstadoReporte, Reporte } from '@/types';

export type NuevoReporteInput = Omit<Reporte, 'id' | 'creadoEn' | 'estado' | 'resueltoEn'>;

const generarId = (prefijo: string = 'rep'): string => {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
};

export const reportsLib = {
  async obtenerReportes(): Promise<Reporte[]> {
    return storage.getReportes();
  },

  async obtenerReportePorId(id: string): Promise<Reporte | null> {
    if (!id || typeof id !== 'string') return null;
    const reportes = await storage.getReportes();
    const encontrado = reportes.find((r) => r.id === id);
    return encontrado || null;
  },

  async crearReporte(datos: NuevoReporteInput): Promise<Reporte> {
    const nuevoReporte: Reporte = {
      ...datos,
      id: generarId('rep'),
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
    };

    const existentes = await storage.getReportes();
    const actualizados = [nuevoReporte, ...existentes];
    await storage.saveReportes(actualizados);

    // Limpiar el borrador una vez guardado con éxito
    await storage.clearBorrador();

    return nuevoReporte;
  },

  async actualizarEstadoReporte(
    id: string,
    nuevoEstado: EstadoReporte
  ): Promise<Reporte | null> {
    const reportes = await storage.getReportes();
    const indice = reportes.findIndex((r) => r.id === id);
    if (indice === -1) return null;

    const reporteActual = reportes[indice];
    const reporteActualizado: Reporte = {
      ...reporteActual,
      estado: nuevoEstado,
      resueltoEn: nuevoEstado === 'resuelto' ? new Date().toISOString() : reporteActual.resueltoEn,
    };

    reportes[indice] = reporteActualizado;
    await storage.saveReportes(reportes);

    // Si se resuelve, generar automáticamente aviso interno
    if (nuevoEstado === 'resuelto') {
      await reportsLib.crearAviso(
        id,
        `El reporte "${reporteActualizado.titulo}" en el aula "${reporteActualizado.aula}" ha sido marcado como resuelto.`
      );
    }

    return reporteActualizado;
  },

  async obtenerAvisos(): Promise<Aviso[]> {
    return storage.getAvisos();
  },

  async crearAviso(reporteId: string, mensaje: string): Promise<Aviso> {
    const nuevoAviso: Aviso = {
      id: generarId('aviso'),
      reporteId,
      mensaje,
      fecha: new Date().toISOString(),
      leido: false,
    };

    const avisos = await storage.getAvisos();
    const actualizados = [nuevoAviso, ...avisos];
    await storage.saveAvisos(actualizados);
    return nuevoAviso;
  },

  async marcarAvisoLeido(id: string): Promise<void> {
    const avisos = await storage.getAvisos();
    const actualizados = avisos.map((a) => (a.id === id ? { ...a, leido: true } : a));
    await storage.saveAvisos(actualizados);
  },

  async obtenerBorrador(): Promise<BorradorReporte> {
    const borrador = await storage.getBorrador();
    return borrador || {};
  },

  async guardarBorrador(parcial: Partial<BorradorReporte>): Promise<BorradorReporte> {
    const actual = (await storage.getBorrador()) || {};
    const fusionado: BorradorReporte = { ...actual, ...parcial };
    await storage.saveBorrador(fusionado);
    return fusionado;
  },

  async limpiarBorrador(): Promise<void> {
    await storage.clearBorrador();
  },
};
