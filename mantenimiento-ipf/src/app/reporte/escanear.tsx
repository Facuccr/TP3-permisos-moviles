import { useCallback, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BarcodeScanningResult, CameraView } from 'expo-camera';
import { usePermiso } from '@/hooks/usePermiso';
import { useReportDraft } from '@/hooks/useReportDraft';

const SUGERENCIAS_AULAS = ['Aula 104', 'Laboratorio 2', 'Aula Magna', 'Taller 1'];

export default function EscanearQRScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();
  const { estado, cargando, pedir, abrirAjustes, refrescar } = usePermiso('camara');

  const [aulaManual, setAulaManual] = useState(borrador.aula || '');
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [escaneado, setEscaneado] = useState(false);
  const [ultimoQR, setUltimoQR] = useState<string | null>(null);
  const escaneandoRef = useRef(false);

  // Reiniciar estado de bloqueo de escaneo al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      escaneandoRef.current = false;
      setEscaneado(false);
      refrescar();
    }, [refrescar])
  );

  // Manejo de lectura de QR evitando lecturas duplicadas en bucle
  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (escaneandoRef.current) return;
    escaneandoRef.current = true;
    setEscaneado(true);

    const texto = result.data ? result.data.trim() : '';
    if (!texto) {
      escaneandoRef.current = false;
      setEscaneado(false);
      return;
    }

    setUltimoQR(texto);

    // ADR-001 (item 6): el texto del QR se interpreta como identificador de aula
    await actualizarBorrador({ aula: texto });
    router.back();
  };

  const handleAsignarAula = async (valor: string) => {
    const texto = valor.trim();
    if (!texto) {
      setErrorInput('Por favor, ingresá el nombre o código del aula.');
      return;
    }
    setErrorInput(null);
    await actualizarBorrador({ aula: texto });
    router.back();
  };

  const handleSolicitarPermiso = async () => {
    await pedir();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Escanear Código QR</Text>
          <Text style={styles.subtitle}>
            Apuntá la cámara al código QR del aula o ingresá el espacio manualmente.
          </Text>
          {borrador.aula ? (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>
                Aula actual en borrador: <Text style={styles.bold}>{borrador.aula}</Text>
              </Text>
            </View>
          ) : null}
        </View>

        {/* Sección de cámara según los 4 estados de permiso (R03) */}
        <View style={styles.scannerWrapper}>
          {cargando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.stateSubtitle}>Consultando estado de cámara...</Text>
            </View>
          ) : estado === 'bloqueado' ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateIcon}>🚫</Text>
              <Text style={styles.stateTitle}>Cámara bloqueada</Text>
              <Text style={styles.stateText}>
                El permiso de cámara fue denegado en el sistema operativo. Para habilitar el escáner debés concederlo desde Ajustes.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
                onPress={abrirAjustes}>
                <Text style={styles.settingsButtonText}>⚙️ Abrir Ajustes del dispositivo</Text>
              </Pressable>
            </View>
          ) : estado === 'preguntable' ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateIcon}>📷</Text>
              <Text style={styles.stateTitle}>Permiso de cámara requerido</Text>
              <Text style={styles.stateText}>
                Para escanear códigos QR necesitamos acceder a la cámara. Solo se activará mientras utilices el escáner.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.requestButton, pressed && styles.buttonPressed]}
                onPress={handleSolicitarPermiso}>
                <Text style={styles.requestButtonText}>Habilitar cámara</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}
                onPress={() => router.push('/permisos/camara' as any)}>
                <Text style={styles.linkButtonText}>Ver pantalla previa y beneficios →</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cameraBox}>
              <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={escaneado ? undefined : handleBarcodeScanned}>
                <View style={styles.overlay}>
                  <View style={styles.targetFrame}>
                    <View style={[styles.corner, styles.cornerTL]} />
                    <View style={[styles.corner, styles.cornerTR]} />
                    <View style={[styles.corner, styles.cornerBL]} />
                    <View style={[styles.corner, styles.cornerBR]} />
                  </View>
                  <Text style={styles.overlayText}>
                    {escaneado
                      ? `✓ Código detectado: ${ultimoQR || ''}`
                      : 'Centrá el código QR del aula en el recuadro'}
                  </Text>
                </View>
              </CameraView>
            </View>
          )}

          {/* Opción de simulación para entornos sin cámara física (emuladores/web) */}
          {estado === 'concedido' ? (
            <View style={styles.simContainer}>
              <Text style={styles.simText}>¿Probando en emulador sin cámara física?</Text>
              <Pressable
                style={({ pressed }) => [styles.simButton, pressed && styles.buttonPressed]}
                onPress={() => handleBarcodeScanned({ data: 'Aula 104' } as any)}>
                <Text style={styles.simButtonText}>⚡ Simular lectura QR (&apos;Aula 104&apos;)</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* Alternativa sin permisos: Ingreso manual de aula (R03 / R09) */}
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackTitle}>Alternativa sin cámara (Ingreso manual)</Text>
          <Text style={styles.fallbackSubtitle}>
            Siempre podés indicar el aula o espacio escribiéndolo o eligiendo una sugerencia rápida.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, errorInput ? styles.inputError : null]}
              placeholder="Ej: Laboratorio 3, Aula 201..."
              placeholderTextColor="#9ca3af"
              value={aulaManual}
              onChangeText={(val) => {
                setAulaManual(val);
                if (errorInput) setErrorInput(null);
              }}
            />
            <Pressable
              style={({ pressed }) => [styles.assignButton, pressed && styles.buttonPressed]}
              onPress={() => handleAsignarAula(aulaManual)}>
              <Text style={styles.assignButtonText}>Asignar</Text>
            </Pressable>
          </View>
          {errorInput ? <Text style={styles.errorText}>{errorInput}</Text> : null}

          <Text style={styles.suggestionsTitle}>Sugerencias rápidas:</Text>
          <View style={styles.suggestionsRow}>
            {SUGERENCIAS_AULAS.map((sug) => (
              <Pressable
                key={sug}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleAsignarAula(sug)}>
                <Text style={styles.suggestionText}>{sug}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver al formulario</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    padding: 20,
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
  currentBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  bold: {
    fontWeight: '700',
  },
  scannerWrapper: {
    gap: 8,
  },
  centerBox: {
    height: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 10,
  },
  stateIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  stateText: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 18,
  },
  requestButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 6,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 6,
  },
  settingsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 6,
    marginTop: 4,
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '500',
  },
  cameraBox: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  targetFrame: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#ffffff',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  overlayText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  simContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
  },
  simText: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  simButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  simButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  fallbackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  fallbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  fallbackSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  assignButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 4,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  suggestionText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '600',
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
    opacity: 0.8,
  },
});
