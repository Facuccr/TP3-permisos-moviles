import { useEffect, useState } from 'react';
import { reportsLib } from '@/lib/reports';
import { BorradorReporte } from '@/types';

// Estado en memoria singleton para sincronización reactiva inmediata entre pantallas
let borradorEnMemoria: BorradorReporte = {};
let inicializado = false;
const listeners = new Set<(borrador: BorradorReporte) => void>();

const notificarListeners = () => {
  listeners.forEach((listener) => listener(borradorEnMemoria));
};

export function useReportDraft() {
  const [borrador, setBorrador] = useState<BorradorReporte>(borradorEnMemoria);
  const [cargando, setCargando] = useState<boolean>(!inicializado);

  useEffect(() => {
    // Si aún no se inicializó desde AsyncStorage, leerlo una vez
    if (!inicializado) {
      reportsLib.obtenerBorrador().then((guardado) => {
        borradorEnMemoria = guardado;
        inicializado = true;
        setBorrador(borradorEnMemoria);
        setCargando(false);
        notificarListeners();
      });
    }

    const listener = (nuevoBorrador: BorradorReporte) => {
      setBorrador(nuevoBorrador);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const actualizarBorrador = async (parcial: Partial<BorradorReporte>) => {
    borradorEnMemoria = { ...borradorEnMemoria, ...parcial };
    setBorrador(borradorEnMemoria);
    notificarListeners();
    await reportsLib.guardarBorrador(borradorEnMemoria);
  };

  const limpiarBorrador = async () => {
    borradorEnMemoria = {};
    setBorrador({});
    notificarListeners();
    await reportsLib.limpiarBorrador();
  };

  return {
    borrador,
    actualizarBorrador,
    limpiarBorrador,
    cargando,
  };
}
