import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalle del Reporte</Text>
        <Text style={styles.idBadge}>ID: {id || 'Sin identificador'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSection}>Información General</Text>
        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>Falla en enchufe del laboratorio</Text>

        <Text style={styles.label}>Aula:</Text>
        <Text style={styles.value}>Laboratorio 2</Text>

        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.value}>Electricidad</Text>

        <Text style={styles.label}>Estado actual:</Text>
        <Text style={styles.statusBadge}>Pendiente</Text>
      </View>

      <View style={styles.actionContainer}>
        <Pressable
          style={({ pressed }) => [styles.resolveButton, pressed && styles.buttonPressed]}>
          <Text style={styles.resolveButtonText}>⚡ Simular resolución</Text>
        </Pressable>
        <Text style={styles.resolveNote}>
          En T005 y T011, esta acción guardará un aviso interno y agendará una notificación local si el permiso fue concedido.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver a la lista</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  idBadge: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  cardSection: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  value: {
    fontSize: 15,
    color: '#1f2937',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 8,
    gap: 8,
  },
  resolveButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  resolveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resolveNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
