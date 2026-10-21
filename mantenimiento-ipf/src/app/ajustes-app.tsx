import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { usePermiso } from '@/hooks/usePermiso';
import { notificationsLib } from '@/lib/notifications';
import { storage } from '@/lib/storage';

export default function AjustesAppScreen() {
  const { estado: estadoPermiso, abrirAjustes, refrescar } = usePermiso('notificaciones');
  const [avisarResolucion, setAvisarResolucion] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);

  const cargarPreferencias = async () => {
    try {
      const prefs = await storage.getPreferencias();
      setAvisarResolucion(prefs.avisarResolucion);
    } catch (err) {
      console.error('Error al cargar preferencias:', err);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPreferencias();
      refrescar();
    }, [refrescar])
  );

  const handleToggleSwitch = async (nuevoValor: boolean) => {
    setMensajeEstado(null);

    if (nuevoValor) {
      setProcesando(true);
      try {
        // R06: Android canal 'reportes' antes de solicitar; pedir solo al activar interruptor
        const resultado = await notificationsLib.activarNotificacionesConPermiso();

        if (resultado.concedido) {
          setAvisarResolucion(true);
          setMensajeEstado(
            '✓ Notificaciones activadas. Recibirás una alerta del sistema a los 10 segundos de simularse una resolución.'
          );
        } else if (resultado.bloqueado) {
          setAvisarResolucion(false);
          setMensajeEstado(
            'El permiso está bloqueado en el sistema operativo. Para activarlo, debés habilitarlo desde Ajustes.'
          );
        } else {
          setAvisarResolucion(false);
          setMensajeEstado(
            'No se concedió el permiso de notificaciones. La opción se mantiene desactivada.'
          );
        }
      } finally {
        setProcesando(false);
      }
    } else {
      setProcesando(true);
      try {
        await notificationsLib.desactivarNotificaciones();
        setAvisarResolucion(false);
        setMensajeEstado('Notificaciones del sistema desactivadas. Los avisos internos seguirán registrándose.');
      } finally {
        setProcesando(false);
      }
    }
  };

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.centerText}>Cargando ajustes...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes de la Aplicación</Text>
        <Text style={styles.subtitle}>
          Configuración de preferencias y comportamiento de notificaciones locales.
        </Text>
      </View>

      {mensajeEstado ? (
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>{mensajeEstado}</Text>
        </View>
      ) : null}

      <View style={styles.settingCard}>
        <View style={styles.settingTextContainer}>
          <View style={styles.settingTitleRow}>
            <Text style={styles.settingTitle}>Avisarme cuando se resuelva mi reporte</Text>
            <View
              style={[
                styles.statusBadge,
                avisarResolucion ? styles.badgeActive : styles.badgeInactive,
              ]}>
              <Text
                style={[
                  styles.statusBadgeText,
                  avisarResolucion ? styles.badgeTextActive : styles.badgeTextInactive,
                ]}>
                {avisarResolucion ? 'ACTIVO' : 'INACTIVO'}
              </Text>
            </View>
          </View>
          <Text style={styles.settingDescription}>
            Al activar esta opción se solicitará permiso contextual de notificaciones. Al simularse una resolución, se agendará una notificación del sistema a 10 segundos.
          </Text>
        </View>

        <Switch
          value={avisarResolucion}
          onValueChange={handleToggleSwitch}
          disabled={procesando}
          trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
          thumbColor={avisarResolucion ? '#2563eb' : '#f4f3f4'}
        />
      </View>

      {estadoPermiso === 'bloqueado' ? (
        <View style={styles.blockedAlert}>
          <Text style={styles.blockedAlertTitle}>⚠️ Permiso bloqueado en el sistema</Text>
          <Text style={styles.blockedAlertText}>
            El sistema operativo tiene las notificaciones bloqueadas para esta aplicación. Para que el interruptor funcione, debés habilitarlas en los Ajustes del dispositivo.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
            onPress={abrirAjustes}>
            <Text style={styles.settingsButtonText}>⚙️ Abrir Ajustes del dispositivo</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Política de notificaciones (R06 / ADR-001)</Text>
        <Text style={styles.infoText}>
          • El permiso nunca se solicita al abrir la aplicación; se solicita únicamente al activar el interruptor superior.
        </Text>
        {Platform.OS === 'android' ? (
          <Text style={styles.infoText}>
            • En Android, el canal &apos;reportes&apos; se crea antes de solicitar el permiso al sistema operativo.
          </Text>
        ) : null}
        <Text style={styles.infoText}>
          • La bandeja interna de Avisos siempre registra las resoluciones, independientemente de si las notificaciones del sistema están autorizadas o no.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    gap: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  centerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
  },
  feedbackText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 14,
  },
  settingTextContainer: {
    flex: 1,
    gap: 6,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeInactive: {
    backgroundColor: '#f3f4f6',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextActive: {
    color: '#15803d',
  },
  badgeTextInactive: {
    color: '#6b7280',
  },
  blockedAlert: {
    backgroundColor: '#fffaf0',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  blockedAlertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9a3412',
  },
  blockedAlertText: {
    fontSize: 13,
    color: '#7c2d12',
    lineHeight: 18,
  },
  settingsButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  settingsButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
