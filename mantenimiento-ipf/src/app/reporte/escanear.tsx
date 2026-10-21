import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReportDraft } from '@/hooks/useReportDraft';

export default function EscanearQRScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();

  const handleSeleccionarAula = async (aula: string) => {
    await actualizarBorrador({ aula });
    router.back();
  };

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
        {borrador.aula && (
          <Text style={styles.currentBadge}>Aula actual en borrador: {borrador.aula}</Text>
        )}
      </View>

      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>Alternativa sin permisos (Ingreso manual)</Text>
        <Text style={styles.fallbackText}>
          Siempre es posible ingresar el código o nombre del aula manualmente sin usar la cámara.
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.actionSmallButton, pressed && styles.buttonPressed]}
            onPress={() => handleSeleccionarAula('Aula 104')}>
            <Text style={styles.actionSmallButtonText}>Asignar Aula 104</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionSmallButton, pressed && styles.buttonPressed]}
            onPress={() => handleSeleccionarAula('Laboratorio 2')}>
            <Text style={styles.actionSmallButtonText}>Asignar Lab 2</Text>
          </Pressable>
        </View>

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
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    aspectRatio: 1.1,
  },
  scannerIcon: {
    fontSize: 44,
    marginBottom: 8,
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
  currentBadge: {
    marginTop: 12,
    backgroundColor: '#374151',
    color: '#60a5fa',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  fallbackContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    gap: 10,
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  fallbackText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionSmallButton: {
    flex: 1,
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionSmallButtonText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
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
