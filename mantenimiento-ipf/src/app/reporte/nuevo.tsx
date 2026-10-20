import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NuevoReporteScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Reporte</Text>
        <Text style={styles.subtitle}>
          Completá los datos del problema edilicio. Los accesos a hardware se solicitan únicamente al presionar cada acción.
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones contextuales</Text>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/escanear')}>
          <Text style={styles.actionIcon}>📷</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Escanear código QR de aula</Text>
            <Text style={styles.actionSubtitle}>Permite identificar el aula automáticamente</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/foto')}>
          <Text style={styles.actionIcon}>🖼️</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Adjuntar fotografía</Text>
            <Text style={styles.actionSubtitle}>Tomar foto o elegir del selector del sistema</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/ubicacion')}>
          <Text style={styles.actionIcon}>📍</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Determinar ubicación</Text>
            <Text style={styles.actionSubtitle}>GPS foreground o ingreso manual de sector</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>
          El formulario completo con validación y borrador compartido se implementará en las tareas T004 y T005.
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  buttonPressed: {
    backgroundColor: '#f3f4f6',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: '#9ca3af',
  },
  placeholderBox: {
    backgroundColor: '#eef2ff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  placeholderText: {
    fontSize: 13,
    color: '#4338ca',
    lineHeight: 18,
    textAlign: 'center',
  },
});
