import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function UbicacionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ubicación del Reporte</Text>
        <Text style={styles.subtitle}>
          Permite geolocalizar la incidencia en primer plano o ingresar manualmente el sector edilicio.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardIcon}>📍</Text>
        <Text style={styles.cardTitle}>Geolocalización en primer plano</Text>
        <Text style={styles.cardDescription}>
          Si el usuario concede permiso aproximado, no se expondrán coordenadas exactas y se indicará &apos;Ubicación aproximada&apos;.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <Text style={styles.primaryButtonText}>Obtener ubicación actual</Text>
        </Pressable>
      </View>

      <View style={styles.fallbackBox}>
        <Text style={styles.fallbackTitle}>Alternativa sin GPS</Text>
        <Text style={styles.fallbackText}>
          Podés especificar el sector o ala del edificio de forma manual (ej. Planta Baja, Ala Norte).
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver al formulario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'space-between',
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  fallbackText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
});
