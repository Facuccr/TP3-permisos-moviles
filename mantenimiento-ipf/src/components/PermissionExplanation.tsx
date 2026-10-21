import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { usePermiso } from '@/hooks/usePermiso';
import { RecursoPermiso } from '@/types';

export interface PermissionExplanationProps {
  recurso: RecursoPermiso;
  onPermisoResuelto?: (concedido: boolean) => void;
}

const BENEFICIOS: Record<
  RecursoPermiso,
  { titulo: string; beneficio: string; icono: string; detalle: string }
> = {
  camara: {
    titulo: 'Permiso de Cámara',
    icono: '📷',
    beneficio:
      'Permite escanear códigos QR en aulas para identificar el espacio automáticamente y capturar fotografías de las fallas edilicias.',
    detalle:
      'Tu cámara solo se activará en el momento exacto en que pulses escanear o tomar foto. No se capturan imágenes en segundo plano.',
  },
  ubicacion: {
    titulo: 'Permiso de Ubicación',
    icono: '📍',
    beneficio:
      'Permite geolocalizar la incidencia en primer plano para asistir a la cuadrilla de mantenimiento a encontrar el lugar rápidamente.',
    detalle:
      'Solo se utiliza en primer plano mientras utilizás la función. Podés otorgar precisión aproximada o exacta según tu preferencia.',
  },
  notificaciones: {
    titulo: 'Permiso de Notificaciones',
    icono: '🔔',
    beneficio:
      'Te enviará un aviso local en este dispositivo en cuanto el reporte de mantenimiento que enviaste sea marcado como resuelto.',
    detalle:
      'Solo se emiten notificaciones locales sobre el estado de tus propios reportes, sin spam ni publicidad.',
  },
};

export const PermissionExplanation: React.FC<PermissionExplanationProps> = ({
  recurso,
  onPermisoResuelto,
}) => {
  const { estado, cargando, pedir, abrirAjustes } = usePermiso(recurso);
  const [solicitando, setSolicitando] = useState(false);

  const info = BENEFICIOS[recurso];

  const handleAction = async () => {
    if (estado === 'bloqueado') {
      await abrirAjustes();
      return;
    }

    if (estado === 'concedido') {
      if (onPermisoResuelto) {
        onPermisoResuelto(true);
      } else {
        router.back();
      }
      return;
    }

    // Estado 'preguntable'
    setSolicitando(true);
    try {
      const res = await pedir();
      const concedido = res.estado === 'concedido';

      if (onPermisoResuelto) {
        onPermisoResuelto(concedido);
      } else {
        // R02: no mostrar automáticamente la pantalla previa tras una denegación.
        // Se regresa a la pantalla de origen sin insistir ni entrar en bucles de solicitud.
        router.back();
      }
    } finally {
      setSolicitando(false);
    }
  };

  const isBloqueado = estado === 'bloqueado';
  const isConcedido = estado === 'concedido';
  const buttonText = isBloqueado
    ? 'Abrir Ajustes'
    : isConcedido
    ? 'Continuar'
    : 'Continuar';

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{info.icono}</Text>
      <Text style={styles.title}>{info.titulo}</Text>

      {isConcedido ? (
        <View style={styles.grantedBadge}>
          <Text style={styles.grantedBadgeText}>✓ Permiso ya concedido</Text>
        </View>
      ) : null}

      <Text style={styles.beneficio}>{info.beneficio}</Text>
      <Text style={styles.detalle}>{info.detalle}</Text>

      <View style={styles.actionSection}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            isBloqueado && styles.blockedButton,
            (cargando || solicitando) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAction}
          disabled={cargando || solicitando}>
          {cargando || solicitando ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>{buttonText}</Text>
          )}
        </Pressable>

        <Text style={styles.note}>
          {isBloqueado
            ? 'El sistema operativo bloqueó nuevos diálogos automáticos. Para habilitar esta función debés hacerlo desde los Ajustes del dispositivo.'
            : 'Nota sobre Ajustes: Si previamente denegaste este permiso permanentemente, deberás habilitarlo desde los Ajustes del sistema.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 48,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  grantedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  grantedBadgeText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '600',
  },
  beneficio: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  detalle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionSection: {
    width: '100%',
    marginTop: 10,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  blockedButton: {
    backgroundColor: '#dc2626',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
});
