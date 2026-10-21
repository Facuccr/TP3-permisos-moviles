import { useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePermiso } from '@/hooks/usePermiso';
import { useReportDraft } from '@/hooks/useReportDraft';

export default function FotoScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();
  const { estado, cargando: cargandoPermiso, pedir, abrirAjustes } = usePermiso('camara');

  const [procesando, setProcesando] = useState<boolean>(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  // R04: selector seguro mediante launchImageLibraryAsync sin permiso amplio de galería
  const handleElegirDeGaleria = async () => {
    setErrorMensaje(null);
    setProcesando(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      // Si el usuario cancela, no romper ni alterar el estado previo
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await actualizarBorrador({ fotoUri: uri });
      }
    } catch (err) {
      console.error('Error al abrir selector del sistema:', err);
      setErrorMensaje('No se pudo abrir el selector de imágenes del sistema.');
    } finally {
      setProcesando(false);
    }
  };

  // Tomar foto con la cámara (requiere permiso contextual R01)
  const handleTomarFoto = async () => {
    setErrorMensaje(null);

    if (estado === 'bloqueado') {
      setErrorMensaje(
        'El acceso a la cámara está bloqueado por el sistema. Habilitálo desde los Ajustes.'
      );
      return;
    }

    if (estado !== 'concedido') {
      // Si está preguntable, solicitar permiso de cámara en contexto (R01)
      const res = await pedir();
      if (res.estado !== 'concedido') {
        if (res.estado === 'bloqueado') {
          setErrorMensaje('El permiso de cámara fue bloqueado permanentemente.');
        }
        return;
      }
    }

    setProcesando(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      // Cancelar no rompe ni genera excepciones
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await actualizarBorrador({ fotoUri: uri });
      }
    } catch (err) {
      console.warn('Cámara nativa no disponible en este entorno:', err);
      setErrorMensaje('La cámara nativa no está disponible en este dispositivo o simulador.');
    } finally {
      setProcesando(false);
    }
  };

  // Simulación para entornos de desarrollo/emulador sin hardware
  const handleSimularFoto = async () => {
    const uriSimulada = `file:///simulated/foto-${Date.now()}.jpg`;
    await actualizarBorrador({ fotoUri: uriSimulada });
  };

  const handleQuitarFoto = async () => {
    await actualizarBorrador({ fotoUri: undefined });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjuntar Fotografía</Text>
        <Text style={styles.subtitle}>
          Podés tomar una foto con la cámara o elegir una imagen con el selector del sistema sin permisos de galería (R04).
        </Text>
      </View>

      {errorMensaje ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerIcon}>⚠️</Text>
          <Text style={styles.errorBannerText}>{errorMensaje}</Text>
        </View>
      ) : null}

      {/* Vista previa de foto actual en borrador */}
      {borrador.fotoUri ? (
        <View style={styles.currentPhotoCard}>
          <Text style={styles.photoCardHeader}>Fotografía adjunta en borrador</Text>
          <View style={styles.photoPreviewWrapper}>
            {borrador.fotoUri.startsWith('http') || borrador.fotoUri.startsWith('file://') ? (
              <Image
                source={{ uri: borrador.fotoUri }}
                style={styles.photoImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.photoFallback}>
                <Text style={styles.photoFallbackIcon}>📷</Text>
                <Text style={styles.photoFallbackText}>Foto simulada en borrador</Text>
              </View>
            )}
          </View>
          <Text style={styles.photoUriText} numberOfLines={1}>
            {borrador.fotoUri}
          </Text>

          <View style={styles.photoActionsRow}>
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
              onPress={handleQuitarFoto}
              disabled={procesando}>
              <Text style={styles.deleteButtonText}>Quitar foto</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.confirmButton, pressed && styles.buttonPressed]}
              onPress={() => router.back()}
              disabled={procesando}>
              <Text style={styles.confirmButtonText}>Listo, volver →</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Acciones principales */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>
          {borrador.fotoUri ? 'Cambiar fotografía' : 'Opciones para adjuntar foto'}
        </Text>

        {/* Opción 1: Cámara fotográfica */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            estado === 'bloqueado' && styles.actionCardWarning,
            procesando && styles.disabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={estado === 'bloqueado' ? abrirAjustes : handleTomarFoto}
          disabled={procesando || cargandoPermiso}>
          <Text style={styles.actionIcon}>📸</Text>
          <View style={styles.actionInfo}>
            <View style={styles.actionTitleRow}>
              <Text style={styles.actionTitle}>Tomar foto con la cámara</Text>
              {estado === 'bloqueado' ? (
                <View style={styles.miniBadgeBlocked}>
                  <Text style={styles.miniBadgeText}>Bloqueado</Text>
                </View>
              ) : estado === 'concedido' ? (
                <View style={styles.miniBadgeGranted}>
                  <Text style={styles.miniBadgeText}>Permitido</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.actionSubtitle}>
              {estado === 'bloqueado'
                ? 'Permiso denegado. Tocá aquí para abrir Ajustes del sistema.'
                : estado === 'concedido'
                ? 'Dispara la cámara nativa para capturar la falla.'
                : 'Solicitará permiso contextual antes del disparo (R01).'}
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        {/* Opción 2: Selector del sistema (R04) */}
        <Pressable
          style={({ pressed }) => [
            styles.actionCard,
            procesando && styles.disabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleElegirDeGaleria}
          disabled={procesando}>
          <Text style={styles.actionIcon}>📁</Text>
          <View style={styles.actionInfo}>
            <View style={styles.actionTitleRow}>
              <Text style={styles.actionTitle}>Elegir desde selector del sistema</Text>
              <View style={styles.miniBadgePicker}>
                <Text style={styles.miniBadgePickerText}>Sin permiso (R04)</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>
              Abre el Photo Picker seguro del sistema operativo sin pedir acceso amplio a tu galería.
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        {/* Opción de prueba para emuladores */}
        <View style={styles.simBox}>
          <Text style={styles.simBoxTitle}>Pruebas en emulador / sin hardware:</Text>
          <Pressable
            style={({ pressed }) => [styles.simButton, pressed && styles.buttonPressed]}
            onPress={handleSimularFoto}
            disabled={procesando}>
            <Text style={styles.simButtonText}>⚡ Simular fotografía en borrador</Text>
          </Pressable>
        </View>
      </View>

      {procesando ? (
        <View style={styles.processingRow}>
          <ActivityIndicator color="#2563eb" size="small" />
          <Text style={styles.processingText}>Procesando fotografía...</Text>
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        onPress={() => router.back()}
        disabled={procesando}>
        <Text style={styles.backButtonText}>← Volver al formulario</Text>
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
    paddingBottom: 40,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  errorBannerIcon: {
    fontSize: 16,
  },
  errorBannerText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  currentPhotoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  photoCardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  photoPreviewWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  photoImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e5e7eb',
  },
  photoFallback: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoFallbackIcon: {
    fontSize: 32,
  },
  photoFallbackText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  photoUriText: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  photoActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 14,
  },
  actionCardWarning: {
    borderColor: '#fca5a5',
    backgroundColor: '#fffaf0',
  },
  actionIcon: {
    fontSize: 30,
  },
  actionInfo: {
    flex: 1,
    gap: 2,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  miniBadgeBlocked: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBadgeGranted: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBadgePicker: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  miniBadgePickerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  chevron: {
    fontSize: 18,
    color: '#9ca3af',
  },
  simBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
    marginTop: 4,
  },
  simBoxTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  simButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  simButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  processingText: {
    fontSize: 13,
    color: '#2563eb',
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
