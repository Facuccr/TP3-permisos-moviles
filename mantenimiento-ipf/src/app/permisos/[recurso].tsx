import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PermissionExplanation } from '@/components/PermissionExplanation';
import { RecursoPermiso } from '@/types';

const RECURSOS_VALIDOS: RecursoPermiso[] = ['camara', 'ubicacion', 'notificaciones'];

export default function ModalPermisoScreen() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  const esValido = recurso && RECURSOS_VALIDOS.includes(recurso as RecursoPermiso);

  if (!esValido) {
    return (
      <View style={styles.container}>
        <View style={styles.invalidCard}>
          <Text style={styles.invalidIcon}>⚠️</Text>
          <Text style={styles.invalidTitle}>Recurso no reconocido</Text>
          <Text style={styles.invalidSubtitle}>
            El recurso «{recurso || 'desconocido'}» no requiere permisos de hardware específicos en esta aplicación.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PermissionExplanation recurso={recurso as RecursoPermiso} />
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
  invalidCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  invalidIcon: {
    fontSize: 40,
  },
  invalidTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  invalidSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
