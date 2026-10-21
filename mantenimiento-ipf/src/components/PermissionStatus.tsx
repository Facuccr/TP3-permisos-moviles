import React from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePermiso } from '@/hooks/usePermiso';
import { RecursoPermiso } from '@/types';

interface PermissionStatusProps {
  recurso: RecursoPermiso;
  onPedir?: () => void;
  onVerExplicacion?: () => void;
}

const RECURSO_INFO: Record<
  RecursoPermiso,
  { nombre: string; icono: string; descripcion: string; uso: string }
> = {
  camara: {
    nombre: 'Cámara',
    icono: '📷',
    descripcion: 'Escaneo de códigos QR en aulas y captura de fotografías de fallas.',
    uso: 'R03 / R04',
  },
  ubicacion: {
    nombre: 'Ubicación (Primer Plano)',
    icono: '📍',
    descripcion: 'Geolocalización del problema edilicio. Permite precisión aproximada o exacta.',
    uso: 'R05',
  },
  notificaciones: {
    nombre: 'Notificaciones Locales',
    icono: '🔔',
    descripcion: 'Avisos locales al resolverse un reporte registrado por el usuario.',
    uso: 'R06',
  },
};

export const PermissionStatus: React.FC<PermissionStatusProps> = ({
  recurso,
  onVerExplicacion,
}) => {
  const {
    estado,
    parcial,
    canAskAgain,
    statusRaw,
    detalles,
    cargando,
    pedir,
    abrirAjustes,
    refrescar,
  } = usePermiso(recurso);

  const info = RECURSO_INFO[recurso];

  const badgeStyle =
    estado === 'concedido'
      ? styles.badgeConcedido
      : estado === 'preguntable'
      ? styles.badgePreguntable
      : estado === 'bloqueado'
      ? styles.badgeBloqueado
      : styles.badgeCargando;

  const badgeTextStyle =
    estado === 'concedido'
      ? styles.badgeTextConcedido
      : estado === 'preguntable'
      ? styles.badgeTextPreguntable
      : estado === 'bloqueado'
      ? styles.badgeTextBloqueado
      : styles.badgeTextCargando;

  return (
    <View style={styles.card}>
      {/* Encabezado del recurso */}
      <View style={styles.headerRow}>
        <View style={styles.recursoTitleContainer}>
          <Text style={styles.recursoIcon}>{info.icono}</Text>
          <View>
            <Text style={styles.recursoNombre}>{info.nombre}</Text>
            <Text style={styles.recursoUso}>{info.uso}</Text>
          </View>
        </View>

        <View style={[styles.badge, badgeStyle]}>
          <Text style={[styles.badgeText, badgeTextStyle]}>
            {estado.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.recursoDescripcion}>{info.descripcion}</Text>

      {/* Matiz parcial si corresponde (R05 / R08) */}
      {parcial ? (
        <View style={styles.parcialBanner}>
          <Text style={styles.parcialIcon}>ℹ️</Text>
          <Text style={styles.parcialText}>
            Acceso parcial concedido ({detalles?.accuracy === 'coarse' || detalles?.accuracy === 'reduced' ? 'Ubicación aproximada' : 'Modo reducido'}).
          </Text>
        </View>
      ) : null}

      {/* Panel de diagnóstico técnico (R08) */}
      <View style={styles.diagBox}>
        <Text style={styles.diagTitle}>Diagnóstico técnico (R08):</Text>
        <View style={styles.diagGrid}>
          <Text style={styles.diagItem}>
            <Text style={styles.diagLabel}>Plataforma: </Text>
            {Platform.OS} (v{Platform.Version})
          </Text>
          <Text style={styles.diagItem}>
            <Text style={styles.diagLabel}>Estado nativo: </Text>
            {statusRaw || '(indefinido)'}
          </Text>
          <Text style={styles.diagItem}>
            <Text style={styles.diagLabel}>canAskAgain: </Text>
            {canAskAgain ? 'true (preguntable)' : 'false (bloqueado)'}
          </Text>
          {detalles?.accuracy ? (
            <Text style={styles.diagItem}>
              <Text style={styles.diagLabel}>Precisión: </Text>
              {detalles.accuracy}
            </Text>
          ) : null}
          {detalles?.scope ? (
            <Text style={styles.diagItem}>
              <Text style={styles.diagLabel}>Alcance: </Text>
              {detalles.scope}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Acciones contextuales según estado */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [styles.smallButton, pressed && styles.buttonPressed]}
          onPress={() => refrescar()}
          disabled={cargando}>
          {cargando ? (
            <ActivityIndicator size="small" color="#4b5563" />
          ) : (
            <Text style={styles.smallButtonText}>🔄 Reconsultar</Text>
          )}
        </Pressable>

        {estado === 'bloqueado' ? (
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
            onPress={abrirAjustes}>
            <Text style={styles.settingsButtonText}>⚙️ Abrir Ajustes</Text>
          </Pressable>
        ) : estado === 'preguntable' ? (
          <Pressable
            style={({ pressed }) => [styles.requestButton, pressed && styles.buttonPressed]}
            onPress={onVerExplicacion ? onVerExplicacion : () => pedir()}>
            <Text style={styles.requestButtonText}>Probar solicitud</Text>
          </Pressable>
        ) : (
          <View style={styles.grantedCheck}>
            <Text style={styles.grantedCheckText}>✓ Activo</Text>
          </View>
        )}
      </View>

      {estado === 'bloqueado' ? (
        <Text style={styles.blockedNote}>
          El sistema operativo bloqueó nuevos diálogos automáticos. Para habilitar esta función debés hacerlo desde los Ajustes del dispositivo. Al regresar, el estado se actualizará automáticamente.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recursoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recursoIcon: {
    fontSize: 26,
  },
  recursoNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recursoUso: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  recursoDescripcion: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeConcedido: {
    backgroundColor: '#dcfce7',
  },
  badgeTextConcedido: {
    color: '#15803d',
  },
  badgePreguntable: {
    backgroundColor: '#fef3c7',
  },
  badgeTextPreguntable: {
    color: '#b45309',
  },
  badgeBloqueado: {
    backgroundColor: '#fee2e2',
  },
  badgeTextBloqueado: {
    color: '#b91c1c',
  },
  badgeCargando: {
    backgroundColor: '#f3f4f6',
  },
  badgeTextCargando: {
    color: '#6b7280',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  parcialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 8,
    borderRadius: 6,
    gap: 6,
  },
  parcialIcon: {
    fontSize: 14,
  },
  parcialText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  diagBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  diagTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  diagGrid: {
    gap: 2,
  },
  diagItem: {
    fontSize: 12,
    color: '#334155',
    fontFamily: 'monospace',
  },
  diagLabel: {
    color: '#64748b',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  smallButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  requestButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  requestButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingsButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  settingsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  grantedCheck: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  grantedCheckText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  blockedNote: {
    fontSize: 11,
    color: '#b91c1c',
    lineHeight: 15,
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
