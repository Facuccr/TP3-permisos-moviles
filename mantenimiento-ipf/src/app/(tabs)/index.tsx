import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReportesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes Edilicios</Text>
        <Text style={styles.subtitle}>
          Visualizá el estado de las incidencias o generá un nuevo reporte de mantenimiento.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        onPress={() => router.push('/reporte/nuevo')}>
        <Text style={styles.primaryButtonText}>+ Nuevo reporte</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso de prueba a rutas</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reporte de demostración #1</Text>
          <Text style={styles.cardSubtitle}>Aula 104 • Mobiliario • Pendiente</Text>
          <Link href="/reporte/rep-104" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Ver detalle del reporte →</Text>
            </Pressable>
          </Link>
        </View>
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
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  linkButton: {
    marginTop: 4,
    paddingVertical: 6,
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
