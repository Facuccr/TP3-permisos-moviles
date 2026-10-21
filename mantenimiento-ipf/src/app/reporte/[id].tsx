import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { notificationsLib } from '@/lib/notifications';
import { reportsLib } from '@/lib/reports';
import { Reporte } from '@/types';

const CATEGORIA_ICONS: Record<Reporte['categoria'], string> = {
  electricidad: '⚡',
  agua: '💧',
  mobiliario: '🪑',
  equipos: '🖥️',
};

const CATEGORIA_LABELS: Record<Reporte['categoria'], string> = {
  electricidad: 'Electricidad',
  agua: 'Agua',
  mobiliario: 'Mobiliario',
  equipos: 'Equipos',
};

const formatearFecha = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} a las ${hora}:${min} hs`;
  } catch {
    return isoString;
  }
};

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [resolviendo, setResolviendo] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorImagen, setErrorImagen] = useState<boolean>(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      if (!id || typeof id !== 'string') {
        setCargando(false);
        return;
      }

      try {
        const item = await reportsLib.obtenerReportePorId(id);
        if (activo) {
          setReporte(item);
        }
      } catch (err) {
        console.error('Error al cargar reporte por id:', err);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [id]);

  const handleSimularResolucion = async () => {
    if (!reporte || reporte.estado === 'resuelto' || resolviendo) return;

    setResolviendo(true);
    try {
      const actualizado = await reportsLib.actualizarEstadoReporte(reporte.id, 'resuelto');
      if (actualizado) {
        setReporte(actualizado);

        // R06: simular resolución agenda notificación local a 10s cuando se permite
        const notifResult = await notificationsLib.agendarNotificacionResolucion(actualizado);

        if (notifResult.agendada) {
          setMensajeExito(
            '¡Resolución simulada con éxito! Se generó el aviso interno y se agendó una notificación del sistema a los 10 segundos.'
          );
        } else {
          setMensajeExito(
            `¡Resolución simulada con éxito! Se generó el aviso interno en la bandeja. (Notificación del sistema omitida: ${notifResult.motivo || 'no autorizada'}).`
          );
        }
      }
    } catch (err) {
      console.error('Error al resolver reporte:', err);
    } finally {
      setResolviendo(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.centeredText}>Cargando reporte...</Text>
      </View>
    );
  }

  // Manejo de ID inexistente o inválido
  if (!reporte) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>Reporte no encontrado</Text>
          <Text style={styles.notFoundMessage}>
            No pudimos encontrar ningún reporte con el identificador «{id || 'desconocido'}». Es posible que haya sido eliminado o que el enlace sea incorrecto.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.replace('/')}>
            <Text style={styles.primaryButtonText}>← Volver a la lista de reportes</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // R05: no exponer coordenadas exactas si es aproximada
  const ubicacionTexto = reporte.sector
    ? `Sector: ${reporte.sector}`
    : reporte.ubicacion
    ? reporte.ubicacion.aproximada
      ? 'Ubicación aproximada (primer plano)'
      : `Ubicación precisa: ${reporte.ubicacion.latitud?.toFixed(4)}, ${reporte.ubicacion.longitud?.toFixed(4)}`
    : 'Sin ubicación registrada';

  const badgeEstadoStyle =
    reporte.estado === 'resuelto'
      ? styles.badgeResuelto
      : reporte.estado === 'en curso'
      ? styles.badgeEnCurso
      : styles.badgePendiente;

  const textoEstadoStyle =
    reporte.estado === 'resuelto'
      ? styles.textoBadgeResuelto
      : reporte.estado === 'en curso'
      ? styles.textoBadgeEnCurso
      : styles.textoBadgePendiente;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalle del Reporte</Text>
        <Text style={styles.idBadge}>ID: {reporte.id}</Text>
      </View>

      {mensajeExito ? (
        <View style={styles.successBanner}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>{mensajeExito}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaIcon}>{CATEGORIA_ICONS[reporte.categoria]}</Text>
            <Text style={styles.categoriaTexto}>{CATEGORIA_LABELS[reporte.categoria]}</Text>
          </View>

          <View style={[styles.badge, badgeEstadoStyle]}>
            <Text style={[styles.badgeTexto, textoEstadoStyle]}>
              {reporte.estado.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>{reporte.titulo}</Text>

        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Text style={styles.label}>Aula o espacio:</Text>
          <Text style={styles.valueHighlight}>{reporte.aula}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>Ubicación / Sector:</Text>
          <Text style={styles.value}>{ubicacionTexto}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.descriptionValue}>{reporte.descripcion}</Text>
        </View>

        <View style={styles.divider} />

        {/* Sección de fotografía */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>Fotografía adjunta:</Text>
          {reporte.fotoUri ? (
            <View style={styles.photoContainer}>
              {!errorImagen &&
              (reporte.fotoUri.startsWith('file://') || reporte.fotoUri.startsWith('http')) ? (
                <Image
                  source={{ uri: reporte.fotoUri }}
                  style={styles.attachedImage}
                  resizeMode="cover"
                  onError={() => setErrorImagen(true)}
                />
              ) : (
                <View style={styles.photoFallback}>
                  <Text style={styles.photoFallbackIcon}>📷</Text>
                  <Text style={styles.photoFallbackText}>Foto registrada en el dispositivo</Text>
                </View>
              )}
              <Text style={styles.photoUriText} numberOfLines={1}>
                {reporte.fotoUri}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyPhotoText}>Sin fotografía adjunta</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Fechas de auditoría */}
        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>
            <Text style={styles.dateLabel}>Creado:</Text> {formatearFecha(reporte.creadoEn)}
          </Text>
          {reporte.resueltoEn ? (
            <Text style={styles.dateText}>
              <Text style={styles.dateLabel}>Resuelto:</Text> {formatearFecha(reporte.resueltoEn)}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Acción: Simular resolución */}
      <View style={styles.actionContainer}>
        {reporte.estado === 'resuelto' ? (
          <View style={styles.alreadyResolvedBox}>
            <Text style={styles.alreadyResolvedText}>✓ Reporte resuelto</Text>
            <Text style={styles.alreadyResolvedSubtext}>
              El aviso correspondiente fue emitido y se encuentra registrado en la bandeja interna.
            </Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.resolveButton,
              resolviendo && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSimularResolucion}
            disabled={resolviendo}>
            {resolviendo ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.resolveButtonText}>⚡ Simular resolución</Text>
            )}
          </Pressable>
        )}

        <Text style={styles.resolveNote}>
          Al simular la resolución, se actualiza el estado del reporte a &apos;resuelto&apos; y se genera automáticamente un aviso interno en la app.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver a la lista de reportes</Text>
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
  centeredContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  centeredText: {
    fontSize: 15,
    color: '#6b7280',
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  idBadge: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  successIcon: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successText: {
    color: '#15803d',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  categoriaIcon: {
    fontSize: 12,
  },
  categoriaTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePendiente: {
    backgroundColor: '#fef3c7',
  },
  textoBadgePendiente: {
    color: '#92400e',
  },
  badgeEnCurso: {
    backgroundColor: '#dbeafe',
  },
  textoBadgeEnCurso: {
    color: '#1e40af',
  },
  badgeResuelto: {
    backgroundColor: '#dcfce7',
  },
  textoBadgeResuelto: {
    color: '#166534',
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  sectionRow: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
  },
  valueHighlight: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  descriptionValue: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  photoSection: {
    gap: 6,
  },
  photoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  attachedImage: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  photoFallback: {
    height: 90,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoFallbackIcon: {
    fontSize: 28,
  },
  photoFallbackText: {
    fontSize: 12,
    color: '#6b7280',
  },
  photoUriText: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  emptyPhotoText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  datesContainer: {
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateLabel: {
    fontWeight: '600',
    color: '#4b5563',
  },
  actionContainer: {
    marginTop: 4,
    gap: 8,
  },
  resolveButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  resolveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  alreadyResolvedBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  alreadyResolvedText: {
    color: '#065f46',
    fontSize: 15,
    fontWeight: '700',
  },
  alreadyResolvedSubtext: {
    color: '#047857',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  resolveNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  backButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  notFoundCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  notFoundIcon: {
    fontSize: 48,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notFoundMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
