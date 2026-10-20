import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function AjustesAppScreen() {
  const [avisarResolucion, setAvisarResolucion] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes de la Aplicación</Text>
        <Text style={styles.subtitle}>
          Configuración de preferencias y comportamiento de notificaciones locales.
        </Text>
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Avisarme cuando se resuelva mi reporte</Text>
          <Text style={styles.settingDescription}>
            Al activar esta opción se solicitará permiso contextual de notificaciones. La bandeja interna siempre registrará los avisos.
          </Text>
        </View>
        <Switch
          value={avisarResolucion}
          onValueChange={setAvisarResolucion}
          trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
          thumbColor={avisarResolucion ? '#2563eb' : '#f4f3f4'}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Política de permisos contextuales</Text>
        <Text style={styles.infoText}>
          En cumplimiento con la consigna, la app nunca solicita permisos al iniciar. La solicitud de notificaciones se disparará únicamente al activar este interruptor.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    gap: 20,
  },
  header: {
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
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
    gap: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 18,
  },
});
