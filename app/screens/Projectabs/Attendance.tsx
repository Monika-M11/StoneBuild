/**
 * PATH: app/screens/ProjectTabs/Attendance.tsx
 *
 * Attendance tab body — rendered inside ProjectDetailScreen.
 * Features:
 *   • Fetch GPS location  (expo-location)
 *   • Take photo          (expo-image-picker)
 *   • Upload file         (expo-document-picker)
 *   • Attendance history list
 */
import { useToast } from '@/providers/ToastProvider';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../../constants/theme';
import { DefaultText, useTheme } from '../../../providers/ThemeProvider';


// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Props { projectId?: string }

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  location?: LocationData;
  photoUri?: string;
  fileName?: string;
  fileSize?: string;
  status: 'Present' | 'Late' | 'Absent';
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const DUMMY_RECORDS: AttendanceRecord[] = [
  {
    id: '1',
    date: 'Mon, 14 Apr 2025',
    time: '08:52 AM',
    location: { latitude: 11.0168, longitude: 76.9558, accuracy: 5, address: 'Coimbatore, Tamil Nadu' },
    status: 'Present',
  },
  {
    id: '2',
    date: 'Tue, 15 Apr 2025',
    time: '09:18 AM',
    location: { latitude: 11.0168, longitude: 76.9558, accuracy: 8, address: 'Coimbatore, Tamil Nadu' },
    status: 'Late',
  },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Present: { bg: '#e1f5ee', color: '#085041' },
  Late:    { bg: '#faeeda', color: '#633806' },
  Absent:  { bg: '#fde8e8', color: '#7c0c0c' },
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AttendanceTab({ projectId }: Props) {
  const theme = useTheme();

  const [location, setLocation]               = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [photoUri, setPhotoUri]               = useState<string | null>(null);
  const [cameraLoading, setCameraLoading]     = useState(false);
  const [uploadedFile, setUploadedFile]       = useState<{ name: string; size: string } | null>(null);
  const [fileLoading, setFileLoading]         = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [records, setRecords]                 = useState<AttendanceRecord[]>(DUMMY_RECORDS);
  const { showToast } = useToast();
  const [photoSize, setPhotoSize] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1048576)     return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // ── Location ───────────────────────────────────────────────
  const handleFetchLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude, longitude: pos.coords.longitude,
      });
      setLocation({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy:  pos.coords.accuracy,
        address: geo
          ? `${geo.street ?? ''} ${geo.city ?? ''}, ${geo.region ?? ''}`.trim()
          : undefined,
      });
    } catch {
      Alert.alert('Error', 'Could not fetch location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

 const handleTakePhoto = async () => {
  setCameraLoading(true);

  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('Permission Denied', 'Camera permission is required', 'error');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.canceled || !result.assets[0]) return;

    let uri = result.assets[0].uri;

    // ==============================
    // 🔹 GET ORIGINAL SIZE
    // ==============================
    const originalResponse = await fetch(uri);
    const originalBlob = await originalResponse.blob();
    const originalSize = originalBlob.size;
    const originalSizeKB = (originalSize / 1024).toFixed(2);

    // ==============================
    // 🔹 COMPRESSION LOOP
    // ==============================
    let compressed = uri;
    let finalFileSize = originalSize;
    let finalSizeInKB = originalSizeKB;

    const compressLevels = [0.5, 0.3, 0.2, 0.1];

    for (let quality of compressLevels) {
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const response = await fetch(manipulated.uri);
      const blob = await response.blob();

      finalFileSize = blob.size;
      finalSizeInKB = (finalFileSize / 1024).toFixed(2);

      if (finalFileSize <= 50 * 1024) {
        compressed = manipulated.uri;
        break;
      }
    }

    // ==============================
    // ❌ STILL TOO LARGE
    // ==============================
    if (finalFileSize > 50 * 1024) {
      showToast(
        'Image Too Large',
        `Original: ${originalSizeKB} KB\nCompressed: ${finalSizeInKB} KB\nPlease compress below 50 KB using an online tool`,
        'error'
      );
      return;
    }

    // ==============================
    // ✅ SUCCESS
    // ==============================
    showToast(
      'Image Compressed',
      `Original: ${originalSizeKB} KB → Final: ${finalSizeInKB} KB`,
      'success'
    );
setPhotoSize(`${finalSizeInKB} KB`);

    setPhotoUri(compressed);

  } catch (err) {
    console.log(err);
    showToast('Error', 'Could not open camera', 'error');
  } finally {
    setCameraLoading(false);
  }
};
  // ── File picker ────────────────────────────────────────────
 const handleUploadFile = async () => {
  setFileLoading(true);

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];

    // ✅ Allowed types (images + documents)
    const allowedTypes = [
      // 📄 Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      // 🖼️ Images
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
      showToast(
        'Invalid File',
        'Upload only PDF, DOC, JPG, or PNG files',
        'error'
      );
      return;
    }

    // ✅ Set file
    setUploadedFile({
      name: asset.name,
      size: asset.size ? formatSize(asset.size) : 'Unknown',
    });

    // ✅ Optional: success feedback
    showToast(
      'File Selected',
      `${asset.name} (${asset.size ? formatSize(asset.size) : 'Unknown'})`,
      'success'
    );

  } catch (err) {
    console.log(err);
    showToast('Error', 'Could not open file picker', 'error');
  } finally {
    setFileLoading(false);
  }
};
  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!location && !photoUri && !uploadedFile) {
      Alert.alert('Incomplete', 'Please add at least one detail before marking attendance.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    const now  = new Date();
    const hour = now.getHours();
    const newRec: AttendanceRecord = {
      id:       Date.now().toString(),
      date:     now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      time:     now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location: location  ?? undefined,
      photoUri: photoUri  ?? undefined,
      fileName: uploadedFile?.name,
      fileSize: uploadedFile?.size,
      status:   hour < 9 ? 'Present' : 'Late',
    };
    setRecords((p) => [newRec, ...p]);
    setLocation(null);
    setPhotoUri(null);
    setUploadedFile(null);
    setSubmitting(false);
    Alert.alert('✓ Attendance Marked', 'Your attendance has been recorded successfully.');
  };

  const noneSelected = !location && !photoUri && !uploadedFile;

  // ─────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Capture Card ── */}
      <View style={styles.card}>

        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrap}>
            <Ionicons name="finger-print-outline" size={18} color={Colors.light.primaryDark} />
          </View>
          <View>
            <DefaultText style={[styles.cardTitle, { fontFamily: theme.fonts.bold }]}>
              Mark Attendance
            </DefaultText>
            <DefaultText style={styles.cardSubtitle}>
              Add location, photo or file to verify your presence
            </DefaultText>
          </View>
        </View>

        {/* Rows */}
        <View style={styles.actionList}>
          <ActionRow
            icon="location-outline"
            label="Current Location"
            description="Fetch your GPS coordinates"
            buttonLabel="Fetch"
            loading={locationLoading}
            done={!!location}
            onPress={handleFetchLocation}
            onClear={() => setLocation(null)}
            theme={theme}
          >
            {location && (
              <View style={styles.resultChip}>
                <Ionicons name="navigate" size={11} color={Colors.light.primaryDark} />
                <DefaultText style={styles.resultText} numberOfLines={1}>
                  {location.address ?? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </DefaultText>
                {location.accuracy != null && (
                  <DefaultText style={styles.resultBadge}>±{Math.round(location.accuracy)}m</DefaultText>
                )}
              </View>
            )}
          </ActionRow>

          <View style={styles.divider} />

          <ActionRow
            icon="camera-outline"
            label="Take Photo"
            description="Capture a selfie or site photo"
            buttonLabel="Open"
            loading={cameraLoading}
            done={!!photoUri}
            onPress={handleTakePhoto}
            onClear={() => setPhotoUri(null)}
            theme={theme}
          >
            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
            )}
          </ActionRow>

          <View style={styles.divider} />

          <ActionRow
            icon="document-attach-outline"
            label="Upload File"
            description="Attach a report, PDF or document"
            buttonLabel="Browse"
            loading={fileLoading}
            done={!!uploadedFile}
            onPress={handleUploadFile}
            onClear={() => setUploadedFile(null)}
            theme={theme}
          >
            {uploadedFile && (
              <View style={styles.resultChip}>
                <Ionicons name="document" size={11} color={Colors.light.primaryDark} />
                <DefaultText style={styles.resultText} numberOfLines={1}>{uploadedFile.name}</DefaultText>
                <DefaultText style={styles.resultBadge}>{uploadedFile.size}</DefaultText>
              </View>
            )}
          </ActionRow>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, noneSelected && styles.submitBtnDisabled]}
          activeOpacity={0.82}
          onPress={handleSubmit}
          disabled={submitting || noneSelected}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <DefaultText style={[styles.submitBtnText, { fontFamily: theme.fonts.bold }]}>
                Mark Attendance
              </DefaultText>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── History ── */}
      <View style={styles.sectionRow}>
        <DefaultText style={[styles.sectionTitle, { fontFamily: theme.fonts.bold }]}>
          Recent Records
        </DefaultText>
        <DefaultText style={styles.sectionCount}>{records.length} entries</DefaultText>
      </View>

      {records.map((rec) => {
        const { bg, color } = STATUS_STYLE[rec.status];
        return (
          <View key={rec.id} style={styles.historyCard}>
            <View style={[styles.historyDot, { backgroundColor: color }]} />
            <View style={styles.historyInfo}>
              <DefaultText style={[styles.historyDate, { fontFamily: theme.fonts.bold }]}>
                {rec.date}
              </DefaultText>
              <DefaultText style={styles.historyTime}>{rec.time}</DefaultText>
              {rec.location?.address && (
                <View style={styles.historyMeta}>
                  <Ionicons name="location-outline" size={11} color={Colors.light.textSecondary} />
                  <DefaultText style={styles.historyMetaText}>{rec.location.address}</DefaultText>
                </View>
              )}
              {rec.fileName && (
                <View style={styles.historyMeta}>
                  <Ionicons name="document-outline" size={11} color={Colors.light.textSecondary} />
                  <DefaultText style={styles.historyMetaText}>{rec.fileName}</DefaultText>
                </View>
              )}
            </View>
            <View style={[styles.statusPill, { backgroundColor: bg }]}>
              <DefaultText style={[styles.statusText, { color }]}>{rec.status}</DefaultText>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────
// ActionRow sub-component
// ─────────────────────────────────────────────────────────────
interface ActionRowProps {
  icon: string;
  label: string;
  description: string;
  buttonLabel: string;
  loading: boolean;
  done: boolean;
  onPress: () => void;
  onClear: () => void;
  theme: any;
  children?: React.ReactNode;
}

function ActionRow({
  icon, label, description, buttonLabel,
  loading, done, onPress, onClear, theme, children,
}: ActionRowProps) {
  return (
    <View style={rowStyles.wrap}>
      <View style={rowStyles.top}>
        <View style={[rowStyles.iconBox, done && rowStyles.iconBoxDone]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={done ? Colors.light.primaryDark : Colors.light.textSecondary}
          />
        </View>

        <View style={rowStyles.textCol}>
          <DefaultText style={[rowStyles.label, { fontFamily: theme.fonts.semiBold }]}>
            {label}
          </DefaultText>
          <DefaultText style={rowStyles.description}>{description}</DefaultText>
        </View>

        {done ? (
          <TouchableOpacity onPress={onClear} activeOpacity={0.7} style={rowStyles.clearBtn}>
            <Ionicons name="close-circle" size={22} color="#c0392b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={rowStyles.actionBtn}
            onPress={onPress}
            activeOpacity={0.75}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.light.primaryDark} />
            ) : (
              <DefaultText style={[rowStyles.actionBtnText, { fontFamily: theme.fonts.bold }]}>
                {buttonLabel}
              </DefaultText>
            )}
          </TouchableOpacity>
        )}
      </View>

      {done && children && (
        <View style={rowStyles.preview}>{children}</View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.inputBg },
  content:   { padding: 16, paddingBottom: 100 },

  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: `${Colors.light.primary}18`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle:    { fontSize: 15, color: Colors.light.text },
  cardSubtitle: { fontSize: 11, color: Colors.light.textSecondary, marginTop: 2 },

  actionList: { gap: 2 },
  divider:    { height: 1, backgroundColor: '#f0f2f5', marginVertical: 2 },

  resultChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.light.primary}12`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  resultText:  { fontSize: 11, color: Colors.light.primaryDark, flexShrink: 1, maxWidth: 200 },
  resultBadge: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    backgroundColor: Colors.light.inputBg,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  photoPreview: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    backgroundColor: Colors.light.inputBg,
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: Colors.light.primaryDark,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.35 },
  submitBtnText:     { fontSize: 15, color: '#fff' },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, color: Colors.light.text },
  sectionCount: { fontSize: 12, color: Colors.light.textSecondary },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  historyDot:      { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  historyInfo:     { flex: 1 },
  historyDate:     { fontSize: 13, color: Colors.light.text },
  historyTime:     { fontSize: 11, color: Colors.light.textSecondary, marginTop: 2 },
  historyMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  historyMetaText: { fontSize: 10, color: Colors.light.textSecondary },
  statusPill:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  statusText:      { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});

const rowStyles = StyleSheet.create({
  wrap:    { paddingVertical: 12 },
  top:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.light.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconBoxDone:   { backgroundColor: `${Colors.light.primary}18` },
  textCol:       { flex: 1 },
  label:         { fontSize: 13, color: Colors.light.text },
  description:   { fontSize: 11, color: Colors.light.textSecondary, marginTop: 1 },
  clearBtn:      { padding: 2 },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.primaryDark,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  actionBtnText: { fontSize: 12, color: Colors.light.primaryDark },
  preview:       { marginTop: 10, paddingLeft: 54 },
});