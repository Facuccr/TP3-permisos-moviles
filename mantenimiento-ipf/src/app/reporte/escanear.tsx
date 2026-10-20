import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function EscanearQRScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Escanear Código QR</Text>
        <Text style={styles.subtitle}>
          Apuntá la cámara al código QR ubicado en la puerta o pared del aula.
        </Text>
      </View>

      <View style={styles.scannerBox}>
        <Text style={styles.scannerIcon}>📷</Text>
        <Text style={styles.scannerText}>Área del visor de cámara QR</Text>
        <Text style={styles.scannerSubtext}>
          Se integrará con expo-camera en la tarea T008 contemplando los 4 estados de permiso.
        </Text>
      </View>

      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>Alternativa sin permisos</Text>
        <Text style={styles.fallbackText}>
          Siempre es posible ingresar el código o nombre del aula manualmente sin usar la cámara.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Volver al formulario</Text>
        </Pressable>
      </View>
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
  scannerBox: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    aspectRatio: 1,
  },
  scannerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  scannerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  scannerSubtext: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  fallbackContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
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
    marginBottom: 12,
    lineHeight: 18,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
