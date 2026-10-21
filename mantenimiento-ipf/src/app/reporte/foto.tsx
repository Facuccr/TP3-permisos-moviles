import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReportDraft } from '@/hooks/useReportDraft';

export default function FotoScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();

  const handleSimularFoto = async (origen: 'camara' | 'galeria') => {
    // Preservar la URI en el borrador compartido sin pasarla por query string
    const uriSimulada = `file:///simulated/foto-${origen}-${Date.now()}.jpg`;
    await actualizarBorrador({ fotoUri: uriSimulada });
    router.back();
  };

  const handleQuitarFoto = async () => {
    await actualizarBorrador({ fotoUri: undefined });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjuntar Fotografía</Text>
        <Text style={styles.subtitle}>
          Podés tomar una fotografía directamente con la cámara o elegir una imagen del dispositivo mediante el selector seguro.
        </Text>
      </View>

      {borrador.fotoUri ? (
        <View style={styles.currentPhotoCard}>
          <Text style={styles.photoCardTitle}>Foto actual en borrador</Text>
          <Text style={styles.photoUriText}>{borrador.fotoUri}</Text>
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
            onPress={handleQuitarFoto}>
            <Text style={styles.deleteButtonText}>Quitar foto del borrador</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => handleSimularFoto('camara')}>
          <Text style={styles.actionIcon}>📸</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Tomar foto con la cámara</Text>
            <Text style={styles.actionSubtitle}>
              Requiere permiso explícito de cámara antes del disparo (T009)
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => handleSimularFoto('galeria')}>
          <Text style={styles.actionIcon}>📁</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Elegir desde selector del sistema</Text>
            <Text style={styles.actionSubtitle}>
              Utiliza ImagePicker sin solicitar permiso general de galería (T009)
            </Text>
          </View>
        </Pressable>
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
  currentPhotoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 12,
    gap: 6,
  },
  photoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  photoUriText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 16,
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 14,
  },
  buttonPressed: {
    backgroundColor: '#f3f4f6',
  },
  actionIcon: {
    fontSize: 28,
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
