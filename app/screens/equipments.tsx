import ScreenPage from '@/components/ScreenPage';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,

  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Equipment = {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  serialNumber: string;
};

const STATUS_COLORS: Record<Equipment['status'], string> = {
  Available: '#22c55e',
  'In Use': '#3b82f6',
  Maintenance: '#f59e0b',
  Retired: '#ef4444',
};

const dummyEquipments: Equipment[] = [
  { id: '1', name: 'Excavator CAT 320', category: 'Heavy Machinery', status: 'In Use', serialNumber: 'CAT-320-2021-001' },
  { id: '2', name: 'Concrete Mixer', category: 'Mixing Equipment', status: 'Available', serialNumber: 'CMX-450-2020-007' },
  { id: '3', name: 'Tower Crane TC-6', category: 'Lifting Equipment', status: 'In Use', serialNumber: 'TC6-2019-003' },
  { id: '4', name: 'Bulldozer D6T', category: 'Heavy Machinery', status: 'Maintenance', serialNumber: 'D6T-2022-002' },
  { id: '5', name: 'Compactor Roller', category: 'Compaction', status: 'Available', serialNumber: 'CR-88-2021-005' },
  { id: '6', name: 'Welding Machine WM-500', category: 'Workshop Tools', status: 'Available', serialNumber: 'WM500-2023-010' },
  { id: '7', name: 'Boom Lift 60ft', category: 'Lifting Equipment', status: 'Retired', serialNumber: 'BL60-2017-001' },
];

type FormData = {
  name: string;
  serialNumber: string;
  category: string;
  purchaseDate: string;
  lastService: string;
  assignedTo: string;
  location: string;
  notes: string;
};

export default function EquipmentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('equipments');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    serialNumber: '',
    category: '',
    purchaseDate: '',
    lastService: '',
    assignedTo: '',
    location: '',
    notes: '',
  });

  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['50%', '92%'], []);

  const openSheet = useCallback((equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      serialNumber: equipment.serialNumber,
      category: equipment.category,
      purchaseDate: '',
      lastService: '',
      assignedTo: '',
      location: '',
      notes: '',
    });
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedEquipment(null);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocus = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const renderEquipmentItem = useCallback(
    ({ item }: { item: Equipment }) => (
      <TouchableOpacity
        style={styles.equipmentItem}
        onPress={() => openSheet(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Ionicons name="construct-outline" size={22} color={Colors.light.primaryDark} />
        </View>

        <View style={styles.equipmentInfo}>
          <DefaultText style={[styles.equipmentName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </DefaultText >
          <DefaultText  style={styles.equipmentCategory}>{item.category}</DefaultText >
        </View>

        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
          <DefaultText  style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
            {item.status}
          </DefaultText >
        </View>
      </TouchableOpacity>
    ),
    [openSheet, theme]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ✅ SafeAreaView wraps the main content — same structure as contacts.tsx */}
       <ScreenPage
        title="Equipments"
        onMenuPress={openDrawer} // ✅ Menu on LEFT
        rightAction={            // ✅ + icon on RIGHT
          <TouchableOpacity
            onPress={() => router.push('/screens/addEquipment' as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        }
      >

          {/* ✅ Body takes remaining space — footer stays pinned at bottom */}
          <View style={styles.body}>
            <FlatList
              data={dummyEquipments}
              keyExtractor={(item) => item.id}
              renderItem={renderEquipmentItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.showEquipmentButton}
              onPress={() => openSheet(dummyEquipments[0])}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <DefaultText style={styles.showEquipmentButtonText}>Show Equipment</DefaultText >
            </TouchableOpacity>
          </View>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
     </ScreenPage>

      {/* ✅ BottomSheetModal lives OUTSIDE SafeAreaView — same as contacts.tsx */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onClose={() => setSelectedEquipment(null)}
      >
        {selectedEquipment && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIconBox}>
                <Ionicons name="construct-outline" size={26} color={Colors.light.primaryDark} />
              </View>
              <View style={{ flex: 1 }}>
                <DefaultText  style={[styles.sheetEquipmentName, { fontFamily: theme.fonts.bold }]}>
                  {selectedEquipment.name}
                </DefaultText >
                <View style={styles.sheetStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[selectedEquipment.status] }]} />
                  <DefaultText  style={[styles.sheetStatusText, { color: STATUS_COLORS[selectedEquipment.status] }]}>
                    {selectedEquipment.status}
                  </DefaultText >
                </View>
              </View>
              <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView
              style={styles.formScrollView}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              <DefaultText  style={styles.sectionTitle}>Equipment Details</DefaultText >

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Equipment Name</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(t) => handleInputChange('name', t)}
                  onFocus={handleFocus}
                  placeholder="Enter equipment name"
                  placeholderTextColor="#aaa"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Serial Number</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.serialNumber}
                  onChangeText={(t) => handleInputChange('serialNumber', t)}
                  onFocus={handleFocus}
                  placeholder="e.g. CAT-320-2021-001"
                  placeholderTextColor="#aaa"
                  autoCapitalize="characters"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Category</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.category}
                  onChangeText={(t) => handleInputChange('category', t)}
                  onFocus={handleFocus}
                  placeholder="e.g. Heavy Machinery"
                  placeholderTextColor="#aaa"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Purchase Date</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.purchaseDate}
                  onChangeText={(t) => handleInputChange('purchaseDate', t)}
                  onFocus={handleFocus}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Last Service Date</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.lastService}
                  onChangeText={(t) => handleInputChange('lastService', t)}
                  onFocus={handleFocus}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Assigned To</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.assignedTo}
                  onChangeText={(t) => handleInputChange('assignedTo', t)}
                  onFocus={handleFocus}
                  placeholder="Operator or team name"
                  placeholderTextColor="#aaa"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Site / Location</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.location}
                  onChangeText={(t) => handleInputChange('location', t)}
                  onFocus={handleFocus}
                  placeholder="Current site or storage location"
                  placeholderTextColor="#aaa"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Notes</DefaultText >
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={formData.notes}
                  onChangeText={(t) => handleInputChange('notes', t)}
                  onFocus={handleFocus}
                  placeholder="Any remarks, issues or service notes..."
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  console.log('Equipment Saved:', formData);
                  closeSheet();
                }}
                activeOpacity={0.8}
              >
                <DefaultText  style={styles.submitButtonText}>Save Equipment</DefaultText >
              </TouchableOpacity>
            </BottomSheetScrollView>
          </KeyboardAvoidingView>
        )}
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },

  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },

  showEquipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.primaryDark,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  showEquipmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentInfo: { flex: 1 },
  equipmentName: { fontSize: 15, color: Colors.light.text },
  equipmentCategory: { fontSize: 12, color: '#888', marginTop: 2 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  sheetIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sheetEquipmentName: { fontSize: 17, color: Colors.light.text },
  sheetStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  sheetStatusText: { fontSize: 13, fontWeight: '600' },
  closeButton: { padding: 8 },

  formScrollView: { flex: 1 },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  textInput: {
    backgroundColor: Colors.light.inputBg,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  notesInput: {
    
    height: 100, 
    paddingTop: 12,
  },

  submitButton: {
    backgroundColor: Colors.light.primaryDark,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});