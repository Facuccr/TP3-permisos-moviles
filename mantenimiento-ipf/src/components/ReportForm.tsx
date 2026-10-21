import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useReportDraft } from '@/hooks/useReportDraft';
import { reportsLib } from '@/lib/reports';
import { CategoriaReporte, Reporte } from '@/types';

interface ReportFormProps {
  onSuccess?: (reporte: Reporte) => void;
}

const CATEGORIAS: { id: CategoriaReporte; label: string; icon: string }[] = [
  { id: 'electricidad', label: 'Electricidad', icon: '⚡' },
  { id: 'agua', label: 'Agua', icon: '💧' },
  { id: 'mobiliario', label: 'Mobiliario', icon: '🪑' },
  { id: 'equipos', label: 'Equipos', icon: '🖥️' },
];

export const ReportForm: React.FC<ReportFormProps> = ({ onSuccess }) => {
  const { borrador, actualizarBorrador, limpiarBorrador, cargando } = useReportDraft();

  const [titulo, setTitulo] = useState(borrador.titulo || '');
  const [descripcion, setDescripcion] = useState(borrador.descripcion || '');
  const [aula, setAula] = useState(borrador.aula || '');
  const [categoria, setCategoria] = useState<CategoriaReporte>(
    borrador.categoria || 'electricidad'
  );

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  // Sincronizar el formulario cuando el borrador se actualice desde pantallas externas
  useEffect(() => {
    if (borrador.aula && borrador.aula !== aula) {
      setAula(borrador.aula);
    }
    if (borrador.titulo && !titulo) {
      setTitulo(borrador.titulo);
    }
    if (borrador.descripcion && !descripcion) {
      setDescripcion(borrador.descripcion);
    }
    if (borrador.categoria && borrador.categoria !== categoria) {
      setCategoria(borrador.categoria);
    }
  }, [borrador]);

  const handleTituloChange = (val: string) => {
    setTitulo(val);
    actualizarBorrador({ titulo: val });
    if (errores.titulo) {
      setErrores((prev) => ({ ...prev, titulo: '' }));
    }
  };

  const handleDescripcionChange = (val: string) => {
    setDescripcion(val);
    actualizarBorrador({ descripcion: val });
    if (errores.descripcion) {
      setErrores((prev) => ({ ...prev, descripcion: '' }));
    }
  };

  const handleAulaChange = (val: string) => {
    setAula(val);
    actualizarBorrador({ aula: val });
    if (errores.aula) {
      setErrores((prev) => ({ ...prev, aula: '' }));
    }
  };

  const handleCategoriaChange = (cat: CategoriaReporte) => {
    setCategoria(cat);
    actualizarBorrador({ categoria: cat });
    if (errores.categoria) {
      setErrores((prev) => ({ ...prev, categoria: '' }));
    }
  };

  const handleQuitarFoto = async () => {
    await actualizarBorrador({ fotoUri: undefined });
  };

  const handleQuitarUbicacion = async () => {
    await actualizarBorrador({ sector: undefined, ubicacion: undefined });
  };

  const handleReiniciarFormulario = async () => {
    setTitulo('');
    setDescripcion('');
    setAula('');
    setCategoria('electricidad');
    setErrores({});
    await limpiarBorrador();
  };

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio.';
    } else if (titulo.trim().length < 4) {
      nuevosErrores.titulo = 'El título debe tener al menos 4 caracteres.';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.trim().length < 6) {
      nuevosErrores.descripcion = 'Ingrese una descripción un poco más detallada.';
    }

    if (!aula.trim()) {
      nuevosErrores.aula = 'El aula es obligatoria (escribila o escaneá el QR).';
    }

    if (!categoria) {
      nuevosErrores.categoria = 'Seleccioná una categoría.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar() || guardando) return;

    setGuardando(true);
    try {
      // R09: ninguna denegación impide guardar un reporte válido
      const nuevoReporte = await reportsLib.crearReporte({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        aula: aula.trim(),
        categoria,
        fotoUri: borrador.fotoUri,
        sector: borrador.sector,
        ubicacion: borrador.ubicacion,
      });

      // Limpiar memoria reactiva
      await limpiarBorrador();

      if (onSuccess) {
        onSuccess(nuevoReporte);
      } else {
        router.replace(`/reporte/${nuevoReporte.id}`);
      }
    } catch (err) {
      console.error('Error al guardar el reporte:', err);
      setErrores({ general: 'Ocurrió un error inesperado al guardar el reporte.' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando datos del borrador...</Text>
      </View>
    );
  }

  // R05: Ubicación aproximada no expone coordenadas exactas
  const ubicacionTexto = borrador.sector
    ? `Sector manual: ${borrador.sector}`
    : borrador.ubicacion
    ? borrador.ubicacion.aproximada
      ? 'Ubicación aproximada (primer plano)'
      : `Ubicación precisa: ${borrador.ubicacion.latitud?.toFixed(4)}, ${borrador.ubicacion.longitud?.toFixed(4)}`
    : null;

  return (
    <View style={styles.formContainer}>
      {errores.general ? (
        <View style={styles.generalErrorBanner}>
          <Text style={styles.generalErrorText}>{errores.general}</Text>
        </View>
      ) : null}

      {/* Campo: Título */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Título del problema <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errores.titulo ? styles.inputError : null]}
          placeholder="Ej: Falla en luz del proyector"
          placeholderTextColor="#9ca3af"
          value={titulo}
          onChangeText={handleTituloChange}
          editable={!guardando}
        />
        {errores.titulo ? <Text style={styles.errorText}>{errores.titulo}</Text> : null}
      </View>

      {/* Campo: Categoría */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Categoría <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.categoriaGrid}>
          {CATEGORIAS.map((cat) => {
            const isSelected = categoria === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoriaChip,
                  isSelected && styles.categoriaChipSelected,
                ]}
                onPress={() => handleCategoriaChange(cat.id)}
                disabled={guardando}>
                <Text style={styles.categoriaChipIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoriaChipText,
                    isSelected && styles.categoriaChipTextSelected,
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errores.categoria ? <Text style={styles.errorText}>{errores.categoria}</Text> : null}
      </View>

      {/* Campo: Aula */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Aula o espacio <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.aulaInputRow}>
          <TextInput
            style={[styles.input, styles.aulaInput, errores.aula ? styles.inputError : null]}
            placeholder="Ej: Aula 104 o Lab 2"
            placeholderTextColor="#9ca3af"
            value={aula}
            onChangeText={handleAulaChange}
            editable={!guardando}
          />
          <Pressable
            style={({ pressed }) => [styles.scanButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/reporte/escanear')}
            disabled={guardando}>
            <Text style={styles.scanButtonIcon}>📷</Text>
            <Text style={styles.scanButtonText}>Escanear QR</Text>
          </Pressable>
        </View>
        {errores.aula ? <Text style={styles.errorText}>{errores.aula}</Text> : null}
      </View>

      {/* Campo: Descripción */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Descripción detallada <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea, errores.descripcion ? styles.inputError : null]}
          placeholder="Describí lo que ocurre, indicios visibles o riesgos..."
          placeholderTextColor="#9ca3af"
          value={descripcion}
          onChangeText={handleDescripcionChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!guardando}
        />
        {errores.descripcion ? (
          <Text style={styles.errorText}>{errores.descripcion}</Text>
        ) : null}
      </View>

      {/* Adjuntos opcionales: Fotografía y Ubicación */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionHeader}>Datos adicionales (Opcionales)</Text>

      {/* Fotografía */}
      <View style={styles.attachmentBox}>
        <View style={styles.attachmentHeader}>
          <Text style={styles.attachmentTitle}>Fotografía de la falla</Text>
          {borrador.fotoUri ? (
            <Pressable onPress={handleQuitarFoto} disabled={guardando}>
              <Text style={styles.removeText}>Quitar</Text>
            </Pressable>
          ) : null}
        </View>

        {borrador.fotoUri ? (
          <View style={styles.photoAttachedContainer}>
            {borrador.fotoUri.startsWith('http') || borrador.fotoUri.startsWith('file://') ? (
              <Image
                source={{ uri: borrador.fotoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
            ) : null}
            <View style={styles.photoInfo}>
              <Text style={styles.photoAttachedText}>✓ Foto adjuntada en el borrador</Text>
              <Text style={styles.photoUriSnippet} numberOfLines={1}>
                {borrador.fotoUri}
              </Text>
              <Pressable
                style={styles.changeAttachmentButton}
                onPress={() => router.push('/reporte/foto')}
                disabled={guardando}>
                <Text style={styles.changeAttachmentText}>Cambiar foto →</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.actionAddButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/reporte/foto')}
            disabled={guardando}>
            <Text style={styles.actionAddIcon}>🖼️</Text>
            <View style={styles.actionAddInfo}>
              <Text style={styles.actionAddTitle}>Tomar o elegir fotografía</Text>
              <Text style={styles.actionAddSubtitle}>
                Cámara o selector de imágenes del sistema
              </Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </Pressable>
        )}
      </View>

      {/* Ubicación o Sector */}
      <View style={styles.attachmentBox}>
        <View style={styles.attachmentHeader}>
          <Text style={styles.attachmentTitle}>Ubicación / Sector edilicio</Text>
          {ubicacionTexto ? (
            <Pressable onPress={handleQuitarUbicacion} disabled={guardando}>
              <Text style={styles.removeText}>Quitar</Text>
            </Pressable>
          ) : null}
        </View>

        {ubicacionTexto ? (
          <View style={styles.locationAttachedContainer}>
            <Text style={styles.locationAttachedIcon}>📍</Text>
            <View style={styles.locationInfo}>
              <Text style={styles.locationAttachedText}>{ubicacionTexto}</Text>
              <Pressable
                style={styles.changeAttachmentButton}
                onPress={() => router.push('/reporte/ubicacion')}
                disabled={guardando}>
                <Text style={styles.changeAttachmentText}>Modificar ubicación →</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.actionAddButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/reporte/ubicacion')}
            disabled={guardando}>
            <Text style={styles.actionAddIcon}>📍</Text>
            <View style={styles.actionAddInfo}>
              <Text style={styles.actionAddTitle}>Geolocalizar o definir sector</Text>
              <Text style={styles.actionAddSubtitle}>
                GPS en primer plano o ingreso de sector manual
              </Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </Pressable>
        )}
      </View>

      {/* Botones de acción */}
      <View style={styles.submitContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            guardando && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={guardando}>
          {guardando ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>💾 Guardar Reporte</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
          onPress={handleReiniciarFormulario}
          disabled={guardando}>
          <Text style={styles.resetButtonText}>Limpiar formulario</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  generalErrorBanner: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  generalErrorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#dc2626',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  textArea: {
    minHeight: 90,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 2,
  },
  categoriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  categoriaChipSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  categoriaChipIcon: {
    fontSize: 14,
  },
  categoriaChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  categoriaChipTextSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  aulaInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aulaInput: {
    flex: 1,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  scanButtonIcon: {
    fontSize: 14,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  attachmentBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachmentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  removeText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  actionAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  actionAddIcon: {
    fontSize: 20,
  },
  actionAddInfo: {
    flex: 1,
  },
  actionAddTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  actionAddSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 1,
  },
  chevron: {
    fontSize: 14,
    color: '#9ca3af',
  },
  photoAttachedContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  photoPreview: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  photoInfo: {
    flex: 1,
    gap: 2,
  },
  photoAttachedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  photoUriSnippet: {
    fontSize: 11,
    color: '#4b5563',
    fontFamily: 'monospace',
  },
  changeAttachmentButton: {
    marginTop: 2,
  },
  changeAttachmentText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  locationAttachedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 10,
  },
  locationAttachedIcon: {
    fontSize: 20,
  },
  locationInfo: {
    flex: 1,
    gap: 2,
  },
  locationAttachedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e40af',
  },
  submitContainer: {
    marginTop: 8,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
  },
});
