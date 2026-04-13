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
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Material = {
  id: string;
  name: string;
  hsn: string;
  shortCode: string;
  printingName: string;
  gst: string;
  cess: string;
  category?: string;
  unitType?: string;
  stockQty?: string;
  unitPrice?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Reorder';
};

const STATUS_COLORS: Record<string, string> = {
  'In Stock': '#22c55e',
  'Low Stock': '#f59e0b',
  'Out of Stock': '#ef4444',
  Reorder: '#3b82f6',
};

const dummyMaterials: Material[] = [
  { 
    id: '1', 
    name: 'Cement OPC 53 Grade', 
    hsn: '252329',
    shortCode: 'CEM53',
    printingName: 'OPC 53 Grade Cement',
    gst: '18',
    cess: '0',
    category: 'Cement',
    unitType: 'Bag',
    stockQty: '245',
    unitPrice: '380',
    status: 'In Stock'
  },
  { 
    id: '2', 
    name: 'TMT Steel Fe500 16mm', 
    hsn: '721420',
    shortCode: 'TMT16',
    printingName: 'Fe500 TMT Bar 16mm',
    gst: '18',
    cess: '0',
    category: 'Steel',
    unitType: 'Ton',
    stockQty: '12.5',
    unitPrice: '58000',
    status: 'Low Stock'
  },
  { 
    id: '3', 
    name: 'Red Bricks Standard', 
    hsn: '690410',
    shortCode: 'BRKRED',
    printingName: 'Standard Red Clay Bricks',
    gst: '12',
    cess: '0',
    category: 'Bricks',
    unitType: '1000',
    stockQty: '8',
    unitPrice: '4500',
    status: 'In Stock'
  },
  { 
    id: '4', 
    name: 'Electrical MS Conduit 25mm', 
    hsn: '730630',
    shortCode: 'MSC25',
    printingName: 'MS Conduit Pipe 25mm',
    gst: '18',
    cess: '0',
    category: 'Electrical',
    unitType: 'Meter',
    stockQty: '0',
    unitPrice: '85',
    status: 'Out of Stock'
  },
];

type FormData = {
  name: string;
  category: string;
  supplier: string;
  unitType: string;
  currentStock: string;
  unitPrice: string;
  reorderLevel: string;
  location: string;
  notes: string;
};

export default function MaterialsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    supplier: '',
    unitType: '',
    currentStock: '',
    unitPrice: '',
    reorderLevel: '',
    location: '',
    notes: '',
  });

  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['50%', '92%'], []);

  const openSheet = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setFormData({
      name: material.name,
      category: material.category ?? '',
      unitType: material.unitType ?? '',
      currentStock: material.stockQty ?? '',
      unitPrice: material.unitPrice ?? '',
      supplier: '',
      reorderLevel: '',
      location: '',
      notes: '',
    });
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedMaterial(null);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocus = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const renderMaterialItem = useCallback(
    ({ item }: { item: Material }) => (
      <TouchableOpacity
        style={styles.materialItem}
        onPress={() => openSheet(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Ionicons name="layers-outline" size={22} color={Colors.light.primaryDark} />
        </View>

        <View style={styles.materialInfo}>
          <DefaultText style={[styles.materialName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </DefaultText >
          <DefaultText  style={styles.materialShort}>{item.shortCode} | {item.printingName}</DefaultText >
          <DefaultText  style={styles.materialTax}>GST: {item.gst}% | HSN: {item.hsn}</DefaultText >
        </View>

        <View style={styles.statusBadge}>
          <DefaultText  style={styles.statusText}>{item.cess}% Cess</DefaultText >
        </View>
      </TouchableOpacity>
    ),
    [openSheet, theme]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={openDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Ionicons name="layers-outline" size={20} color={Colors.light.primaryDark} />
              <DefaultText  style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
                Materials
              </DefaultText >
            </View>
            <TouchableOpacity
              onPress={() => router.push('/screens/addMaterial' as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <FlatList
              data={dummyMaterials}
              keyExtractor={(item) => item.id}
              renderItem={renderMaterialItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </SafeAreaView>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onClose={() => setSelectedMaterial(null)}
      >
        {selectedMaterial && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIconBox}>
                <Ionicons name="layers-outline" size={26} color={Colors.light.primaryDark} />
              </View>
              <View style={{ flex: 1 }}>
                <DefaultText style={[styles.sheetMaterialName, { fontFamily: theme.fonts.bold }]}>
                  {selectedMaterial.name}
                </DefaultText >
                <View style={styles.sheetStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[selectedMaterial.status ?? ''] }]} />
                  <DefaultText  style={[styles.sheetStatusText, { color: STATUS_COLORS[selectedMaterial.status ?? ''] }]}>  
                    {selectedMaterial.status ?? 'Unknown'}
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
              <DefaultText style={styles.sectionTitle}>Material Details</DefaultText >

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Material Name</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(t) => handleInputChange('name', t)}
                  onFocus={handleFocus}
                  placeholder="Enter material name"
                  placeholderTextColor="#aaa"
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Category</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.category}
                  onChangeText={(t) => handleInputChange('category', t)}
                  onFocus={handleFocus}
                  placeholder="Material category"
                  placeholderTextColor="#aaa"
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText style={styles.label}>Current Stock</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.currentStock}
                  onChangeText={(t) => handleInputChange('currentStock', t)}
                  onFocus={handleFocus}
                  placeholder="Current stock quantity"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText style={styles.label}>Unit Price (₹)</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.unitPrice}
                  onChangeText={(t) => handleInputChange('unitPrice', t)}
                  onFocus={handleFocus}
                  placeholder="Unit price"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Supplier</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.supplier}
                  onChangeText={(t) => handleInputChange('supplier', t)}
                  onFocus={handleFocus}
                  placeholder="Material supplier name"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Reorder Level</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.reorderLevel}
                  onChangeText={(t) => handleInputChange('reorderLevel', t)}
                  onFocus={handleFocus}
                  placeholder="Minimum stock level"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Location</DefaultText >
                <TextInput
                  style={styles.textInput}
                  value={formData.location}
                  onChangeText={(t) => handleInputChange('location', t)}
                  onFocus={handleFocus}
                  placeholder="Warehouse/Storage location"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <DefaultText  style={styles.label}>Notes</DefaultText >
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={formData.notes}
                  onChangeText={(t) => handleInputChange('notes', t)}
                  onFocus={handleFocus}
                  placeholder="Quality notes, expiry, special instructions..."
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  console.log('Material Updated:', formData);
                  closeSheet();
                }}
                activeOpacity={0.8}
              >
                <DefaultText  style={styles.submitButtonText}>Update Material</DefaultText >
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

  materialItem: {
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
  materialInfo: { flex: 1 },
  materialName: { fontSize: 15, color: Colors.light.text },
  materialShort: { fontSize: 12, color: '#2563eb', marginTop: 2, fontWeight: '500' },
  materialTax: { fontSize: 11, color: '#6b7280', marginTop: 1 },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryDark + '10',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primaryDark,
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
  sheetMaterialName: { fontSize: 17, color: Colors.light.text },
  sheetStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4,
  },
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
