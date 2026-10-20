import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FotoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjuntar Fotografía</Text>
        <Text style={styles.subtitle}>
          Podés tomar una fotografía directamente con la cámara o elegir una imagen del dispositivo mediante el selector seguro.
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}>
          <Text style={styles.actionIcon}>📸</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Tomar foto con la cámara</Text>
            <Text style={styles.actionSubtitle}>
              Requiere permiso explícito de cámara antes del disparo
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}>
          <Text style={styles.actionIcon}>📁</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Elegir desde selector del sistema</Text>
            <Text style={styles.actionSubtitle}>
              Utiliza ImagePicker sin solicitar permiso general de galería
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
  actionsContainer: {
    gap: 16,
    marginVertical: 24,
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
