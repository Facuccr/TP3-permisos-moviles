import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Reporte } from '@/types';

interface ReportCardProps {
  reporte: Reporte;
  onPress: () => void;
}

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

const formatearFecha = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  } catch {
    return isoString;
  }
};

export const ReportCard: React.FC<ReportCardProps> = ({ reporte, onPress }) => {
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

  // R05: no exponer coordenadas exactas si es aproximada
  const ubicacionTexto = reporte.sector
    ? `Sector: ${reporte.sector}`
    : reporte.ubicacion
    ? reporte.ubicacion.aproximada
      ? 'Ubicación aproximada'
      : 'Ubicación precisa'
    : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Reporte ${reporte.titulo}, aula ${reporte.aula}, estado ${reporte.estado}`}>
      <View style={styles.headerRow}>
        <View style={styles.categoriaTag}>
          <Text style={styles.categoriaIcon}>{CATEGORIA_ICONS[reporte.categoria] || '📌'}</Text>
          <Text style={styles.categoriaTexto}>
            {CATEGORIA_LABELS[reporte.categoria] || reporte.categoria}
          </Text>
        </View>

        <View style={[styles.badge, badgeEstadoStyle]}>
          <Text style={[styles.badgeTexto, textoEstadoStyle]}>
            {reporte.estado.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {reporte.titulo}
      </Text>

      <Text style={styles.descripcion} numberOfLines={2}>
        {reporte.descripcion}
      </Text>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Aula:</Text>
          <Text style={styles.metaValue}>{reporte.aula}</Text>
        </View>

        {ubicacionTexto ? (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Lugar:</Text>
            <Text style={styles.metaValue}>{ubicacionTexto}</Text>
          </View>
        ) : null}

        {reporte.fotoUri ? (
          <View style={styles.fotoIndicator}>
            <Text style={styles.fotoIndicatorText}>📷 Con foto</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.fecha}>{formatearFecha(reporte.creadoEn)}</Text>
        <Text style={styles.verDetalle}>Ver detalle →</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    gap: 8,
  },
  cardPressed: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
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
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  descripcion: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  fotoIndicator: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fotoIndicatorText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  fecha: {
    fontSize: 12,
    color: '#9ca3af',
  },
  verDetalle: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
});
