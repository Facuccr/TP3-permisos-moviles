import { useState } from 'react';
import { router } from 'expo-router';
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
import { usePermiso } from '@/hooks/usePermiso';
import { useReportDraft } from '@/hooks/useReportDraft';
import { locationLib, SECTORES_PREDEFINIDOS } from '@/lib/location';

export default function UbicacionScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();
  const { estado, parcial, cargando: cargandoPermiso, pedir, abrirAjustes } = usePermiso('ubicacion');

  const [sectorManual, setSectorManual] = useState(borrador.sector || '');
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [obteniendoGps, setObteniendoGps] = useState(false);
  const [feedbackMensaje, setFeedbackMensaje] = useState<string | null>(null);

  // R05: Obtener ubicación foreground y respetar matiz aproximado
  const handleObtenerGps = async () => {
    setErrorInput(null);
    setFeedbackMensaje(null);

    if (estado === 'bloqueado') {
      await abrirAjustes();
      return;
    }

    if (estado !== 'concedido') {
      const res = await pedir();
      if (res.estado !== 'concedido') {
        if (res.estado === 'bloqueado') {
          setErrorInput('El permiso de ubicación fue denegado en el sistema.');
        }
        return;
      }
    }

    setObteniendoGps(true);
    try {
      const coords = await locationLib.obtenerUbicacionForeground();
      await actualizarBorrador({
        ubicacion: coords,
        sector: undefined,
      });

      if (coords.aproximada) {
        setFeedbackMensaje(
          'Se registró como Ubicación aproximada. Por privacidad (R05), no se exponen coordenadas exactas.'
        );
      } else {
        setFeedbackMensaje(
          `Ubicación precisa registrada (${coords.latitud?.toFixed(4)}, ${coords.longitud?.toFixed(4)}).`
        );
      }
    } catch (err) {
      console.warn('Error al obtener GPS:', err);
      setErrorInput('No se pudo obtener la posición del dispositivo. Verifique el GPS.');
    } finally {
      setObteniendoGps(false);
    }
  };

  // Asignar sector edilicio manual (Alternativa sin permisos R05 / R09)
  const handleAsignarSector = async (sectorTexto: string) => {
    const texto = sectorTexto.trim();
    if (!texto) {
      setErrorInput('Por favor, ingresá el nombre del sector o área edilicia.');
      return;
    }
    setErrorInput(null);
    setFeedbackMensaje(null);
    await actualizarBorrador({
      sector: texto,
      ubicacion: undefined,
    });
    router.back();
  };

  const handleSimularUbicacion = async (tipo: 'aproximada' | 'precisa') => {
    setErrorInput(null);
    await actualizarBorrador({
      ubicacion: {
        latitud: tipo === 'precisa' ? -34.6037 : undefined,
        longitud: tipo === 'precisa' ? -58.3816 : undefined,
        aproximada: tipo === 'aproximada',
      },
      sector: undefined,
    });
    setFeedbackMensaje(
      tipo === 'aproximada'
        ? 'Simulación: Ubicación aproximada (sin coordenadas, R05).'
        : 'Simulación: Ubicación precisa (-34.6037, -58.3816).'
    );
  };

  const handleQuitarUbicacion = async () => {
    await actualizarBorrador({
      sector: undefined,
      ubicacion: undefined,
    });
    setFeedbackMensaje(null);
  };

  const ubicacionTexto = locationLib.formatearUbicacion(borrador.ubicacion, borrador.sector);
  const tieneUbicacion = Boolean(borrador.sector || borrador.ubicacion);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Ubicación del Reporte</Text>
          <Text style={styles.subtitle}>
            Determiná la ubicación de la falla en primer plano (R05) o ingresá manualmente el sector edilicio.
          </Text>
        </View>

        {/* Estado actual de la ubicación en el borrador */}
        {tieneUbicacion ? (
          <View style={styles.currentCard}>
            <View style={styles.currentHeaderRow}>
              <Text style={styles.currentLabel}>Ubicación actual en borrador:</Text>
              <Pressable onPress={handleQuitarUbicacion}>
                <Text style={styles.removeText}>Quitar</Text>
              </Pressable>
            </View>
            <Text style={styles.currentValue}>{ubicacionTexto}</Text>

            <Pressable
              style={({ pressed }) => [styles.readyButton, pressed && styles.buttonPressed]}
              onPress={() => router.back()}>
              <Text style={styles.readyButtonText}>Listo, volver al formulario →</Text>
            </Pressable>
          </View>
        ) : null}

        {feedbackMensaje ? (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackIcon}>✓</Text>
            <Text style={styles.feedbackText}>{feedbackMensaje}</Text>
          </View>
        ) : null}

        {errorInput ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorInput}</Text>
          </View>
        ) : null}

        {/* Sección 1: Geolocalización GPS en primer plano */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>📍</Text>
            <View style={styles.sectionTitleCol}>
              <Text style={styles.sectionTitle}>Geolocalización en primer plano</Text>
              <Text style={styles.sectionSubtitle}>
                GPS solo mientras se usa la app. Si el permiso es aproximado, no se expondrán coordenadas exactas (R05).
              </Text>
            </View>
          </View>

          {estado === 'bloqueado' ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusBoxText}>
                El permiso de ubicación está bloqueado. Para utilizar el GPS debés habilitarlo en los Ajustes del dispositivo.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
                onPress={abrirAjustes}>
                <Text style={styles.settingsButtonText}>⚙️ Abrir Ajustes del dispositivo</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.gpsActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryGpsButton,
                  (obteniendoGps || cargandoPermiso) && styles.disabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleObtenerGps}
                disabled={obteniendoGps || cargandoPermiso}>
                {obteniendoGps ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.primaryGpsButtonText}>
                    {estado === 'concedido'
                      ? '📍 Obtener ubicación actual por GPS'
                      : 'Habilitar y obtener ubicación GPS'}
                  </Text>
                )}
              </Pressable>

              {estado === 'preguntable' ? (
                <Pressable
                  style={({ pressed }) => [styles.linkButton, pressed && styles.buttonPressed]}
                  onPress={() => router.push('/permisos/ubicacion' as any)}>
                  <Text style={styles.linkButtonText}>Ver pantalla previa y beneficios →</Text>
                </Pressable>
              ) : null}
            </View>
          )}

          {/* Opciones de simulación para entornos sin GPS real */}
          <View style={styles.simContainer}>
            <Text style={styles.simTitle}>Pruebas en emulador (Simulación):</Text>
            <View style={styles.simButtonsRow}>
              <Pressable
                style={({ pressed }) => [styles.simSmallButton, pressed && styles.buttonPressed]}
                onPress={() => handleSimularUbicacion('aproximada')}>
                <Text style={styles.simSmallButtonText}>⚡ Simular Aproximada</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.simSmallButton, pressed && styles.buttonPressed]}
                onPress={() => handleSimularUbicacion('precisa')}>
                <Text style={styles.simSmallButtonText}>⚡ Simular Precisa</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Sección 2: Alternativa manual de sector edilicio (R05 / R09) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>🏢</Text>
            <View style={styles.sectionTitleCol}>
              <Text style={styles.sectionTitle}>Alternativa sin GPS (Sector manual)</Text>
              <Text style={styles.sectionSubtitle}>
                Indicá el ala o sector del edificio manualmente sin solicitar permisos de ubicación.
              </Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Pasillo Este, Ala 2, Comedor..."
              placeholderTextColor="#9ca3af"
              value={sectorManual}
              onChangeText={setSectorManual}
            />
            <Pressable
              style={({ pressed }) => [styles.assignButton, pressed && styles.buttonPressed]}
              onPress={() => handleAsignarSector(sectorManual)}>
              <Text style={styles.assignButtonText}>Asignar</Text>
            </Pressable>
          </View>

          <Text style={styles.presetsTitle}>Sectores frecuentes del edificio:</Text>
          <View style={styles.presetsGrid}>
            {SECTORES_PREDEFINIDOS.map((sector) => (
              <Pressable
                key={sector}
                style={({ pressed }) => [styles.presetChip, pressed && styles.buttonPressed]}
                onPress={() => handleAsignarSector(sector)}>
                <Text style={styles.presetChipText}>{sector}</Text>
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
  currentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  currentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  removeText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  currentValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  readyButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  readyButtonText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '600',
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  feedbackIcon: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackText: {
    color: '#065f46',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  sectionIcon: {
    fontSize: 26,
  },
  sectionTitleCol: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  statusBox: {
    backgroundColor: '#fffaf0',
    borderWidth: 1,
    borderColor: '#fed7aa',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  statusBoxText: {
    fontSize: 12,
    color: '#9a3412',
    lineHeight: 16,
  },
  settingsButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  gpsActions: {
    gap: 8,
  },
  primaryGpsButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryGpsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '500',
  },
  simContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simSmallButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  simSmallButtonText: {
    color: '#334151',
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
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
  assignButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  presetChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
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
