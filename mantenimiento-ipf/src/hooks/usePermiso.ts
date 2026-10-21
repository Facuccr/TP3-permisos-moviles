import { useCallback, useEffect, useState } from 'react';
import { useAppResume } from './useAppResume';
import { permissionsLib } from '@/lib/permissions';
import {
  DetallesMatizPermiso,
  EstadoPermiso,
  RecursoPermiso,
  ResultadoPermisoNormalizado,
} from '@/types';

export interface UsePermisoReturn {
  estado: EstadoPermiso;
  parcial: boolean;
  canAskAgain: boolean;
  statusRaw?: string;
  detalles?: DetallesMatizPermiso;
  cargando: boolean;
  pedir: () => Promise<ResultadoPermisoNormalizado>;
  abrirAjustes: () => Promise<void>;
  refrescar: () => Promise<ResultadoPermisoNormalizado>;
}

/**
 * Hook unificado para gestión y consulta de permisos según R07.
 * Normaliza estados ('cargando', 'concedido', 'preguntable', 'bloqueado'),
 * expone matices parciales, función para pedir, abrir ajustes y reconsulta con AppState.
 */
export function usePermiso(recurso: RecursoPermiso): UsePermisoReturn {
  const [resultado, setResultado] = useState<ResultadoPermisoNormalizado>({
    recurso,
    estado: 'cargando',
    parcial: false,
    canAskAgain: true,
    actualizadoEn: new Date().toISOString(),
  });
  const [cargando, setCargando] = useState<boolean>(true);

  const refrescar = useCallback(async (): Promise<ResultadoPermisoNormalizado> => {
    setCargando(true);
    try {
      const res = await permissionsLib.consultarPermiso(recurso);
      setResultado(res);
      return res;
    } finally {
      setCargando(false);
    }
  }, [recurso]);

  // Consulta inicial pasiva (sin solicitar diálogo de permiso)
  useEffect(() => {
    refrescar();
  }, [refrescar]);

  // Reconsultar automáticamente al volver de Ajustes mediante AppState (R07)
  useAppResume(() => {
    refrescar();
  });

  const pedir = useCallback(async (): Promise<ResultadoPermisoNormalizado> => {
    setCargando(true);
    try {
      const res = await permissionsLib.solicitarPermiso(recurso);
      setResultado(res);
      return res;
    } finally {
      setCargando(false);
    }
  }, [recurso]);

  const abrirAjustes = useCallback(async () => {
    await permissionsLib.abrirAjustes();
  }, []);

  return {
    estado: resultado.estado,
    parcial: resultado.parcial,
    canAskAgain: resultado.canAskAgain,
    statusRaw: resultado.statusRaw,
    detalles: resultado.detalles,
    cargando,
    pedir,
    abrirAjustes,
    refrescar,
  };
}
