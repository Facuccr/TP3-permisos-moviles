import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DESCRIPCIONES_RECURSOS: Record<
  string,
  { titulo: string; beneficio: string; icono: string }
> = {
  camara: {
    titulo: 'Permiso de Cámara',
    beneficio:
      'Permite escanear códigos QR en las aulas para autocompletar la ubicación y capturar fotos de las fallas edilicias.',
    icono: '📷',
  },
  ubicacion: {
    titulo: 'Permiso de Ubicación',
    beneficio:
      'Permite registrar las coordenadas en primer plano para asistir a la cuadrilla de mantenimiento a encontrar la incidencia con exactitud.',
    icono: '📍',
  },
  notificaciones: {
    titulo: 'Permiso de Notificaciones',
    beneficio:
      'Te avisará oportunamente en tu dispositivo cuando el desperfecto edilicio que reportaste haya sido resuelto.',
    icono: '🔔',
  },
};

export default function ModalPermisoScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const info = (recurso && DESCRIPCIONES_RECURSOS[recurso]) || {
    titulo: `Permiso: ${recurso || 'Recurso'}`,
    beneficio: 'Este recurso es necesario para brindar una funcionalidad contextual dentro del reporte.',
    icono: '🛡️',
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>{info.icono}</Text>
        <Text style={styles.title}>{info.titulo}</Text>
        <Text style={styles.beneficio}>{info.beneficio}</Text>

        <View style={styles.actionSection}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </Pressable>

          <Text style={styles.note}>
            Si previamente denegaste este permiso permanentemente, deberás habilitarlo desde los Ajustes del sistema.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  icon: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  beneficio: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    width: '100%',
    marginTop: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
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
  },
});
