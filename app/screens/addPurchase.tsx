// import AuthInput from '@/components/AuthInput';
// import { useToast } from '@/providers/ToastProvider';
// import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import BottomSheetModal from '../../components/BottomSheetModal';
// import Footer from '../../components/Footer';
// import PrimaryButton from '../../components/PrimaryButton';
// import ScreenPage from '../../components/ScreenPage';
// import Colors from '../../constants/theme';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { DefaultText } from '../../providers/ThemeProvider'; // ← Make sure this is imported

// type FormData = {
//   orderDate: string;
//   contactName: string;
//   vehicleType: 'OWN' | 'RENTED' | null;
//   vehicleAmount: string;
//   deliveryDate: string;
//   remarks: string;
// };

// type Material = {
//   id: string;
//   material: string;
//   qty: string;
//   unit: string;
//   rate: string;
//   tax: string;
//   total: string;
// };

// const VEHICLE_TYPES = ['OWN', 'RENTED'] as const;

// export default function AddPurchaseScreen() {
//   const router = useRouter();
//   const { showToast } = useToast();
//   const [activeTab, setActiveTab] = useState('purchase');
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
//   const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
//   const [selectedOrderDate, setSelectedOrderDate] = useState<Date>(new Date());
//   const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date>(new Date());

//   const [formData, setFormData] = useState<FormData>({
//     orderDate: '',
//     contactName: '',
//     vehicleType: null,
//     vehicleAmount: '',
//     deliveryDate: '',
//     remarks: '',
//   });

//   const [materials, setMaterials] = useState<Material[]>([]);

//   // Material Form State
//   const [materialForm, setMaterialForm] = useState({
//     material: '',
//     qty: '',
//     unit: '',
//     rate: '',
//     tax: '',
//   });

//   const materialSheetRef = useRef<any>(null);
//   const materialSnapPoints = useMemo(() => ['70%', '85%'], []);

//   const { errors, validate } = useFormValidation<keyof FormData>({
//     orderDate: { required: true, requiredMessage: 'Order Date is required' },
//     contactName: { required: true, requiredMessage: 'Contact Name is required' },
//     vehicleType: { required: true, requiredMessage: 'Vehicle type is required' },
//     vehicleAmount: { required: false },
//     deliveryDate: { required: true, requiredMessage: 'Delivery Date is required' },
//     remarks: { required: false },
//   });

//   // Auto-fill today's date for Order Date
//   useEffect(() => {
//     const today = new Date();
//     const formattedToday = formatDate(today);
//     setSelectedOrderDate(today);
//     setFormData((prev) => ({ ...prev, orderDate: formattedToday }));
//   }, []);

//   const handleInputChange = (field: keyof FormData) => (text: string) => {
//     setFormData((prev) => ({ ...prev, [field]: text }));
//   };

//   const handleVehicleTypeChange = (type: 'OWN' | 'RENTED') => {
//     setFormData((prev) => ({
//       ...prev,
//       vehicleType: type,
//       vehicleAmount: type === 'OWN' ? '' : prev.vehicleAmount,
//     }));
//   };

//   const handleFocus = (fieldId: string) => setFocusedField(fieldId);
//   const handleBlur = () => setFocusedField(null);

//   // Material Handlers
//   const openMaterialSheet = () => {
//     Keyboard.dismiss();
//     setMaterialForm({ material: '', qty: '', unit: '', rate: '', tax: '' });
//     materialSheetRef.current?.snapToIndex(0);
//   };

//   const handleMaterialInputChange = (field: keyof typeof materialForm) => (text: string) => {
//     setMaterialForm((prev) => ({ ...prev, [field]: text }));
//   };

//   const calculateTotal = () => {
//     const qty = parseFloat(materialForm.qty) || 0;
//     const rate = parseFloat(materialForm.rate) || 0;
//     const tax = parseFloat(materialForm.tax) || 0;
//     return (qty * rate + tax).toFixed(2);
//   };

//   const saveMaterial = () => {
//     if (!materialForm.material || !materialForm.qty || !materialForm.rate) {
//       showToast('Error', 'Material, Quantity and Rate are required', 'error');
//       return;
//     }

//     const newMaterial: Material = {
//       id: Date.now().toString(),
//       material: materialForm.material,
//       qty: materialForm.qty,
//       unit: materialForm.unit || '-',
//       rate: materialForm.rate,
//       tax: materialForm.tax || '0',
//       total: calculateTotal(),
//     };

//     setMaterials((prev) => [...prev, newMaterial]);
//     materialSheetRef.current?.close();
//   };

//   const removeMaterial = (id: string) => {
//     setMaterials((prev) => prev.filter((m) => m.id !== id));
//   };

//   const handleSave = () => {
//     const validatedFormData = {
//       ...formData,
//       vehicleType: formData.vehicleType || 'OWN',
//     };

//     if (!validate(validatedFormData as any)) {
//       showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
//       return;
//     }

//     if (materials.length === 0) {
//       showToast('Error', 'Please add at least one material', 'error');
//       return;
//     }

//     console.log('✅ New Purchase Saved:', { ...formData, materials });
//     showToast('Success', 'Purchase saved successfully!', 'success');

//     setTimeout(() => {
//       router.back();
//     }, 1500);
//   };

//   const handleCancel = () => router.back();

//   const formatDate = (date: Date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleDateChange = (
//     event: DateTimePickerEvent,
//     date?: Date,
//     type: 'order' | 'delivery' = 'order'
//   ) => {
//     if (event.type === 'dismissed') {
//       if (type === 'order') setShowOrderDatePicker(false);
//       else setShowDeliveryDatePicker(false);
//       return;
//     }

//     if (date) {
//       if (type === 'order') {
//         setShowOrderDatePicker(false);
//         setSelectedOrderDate(date);
//         handleInputChange('orderDate')(formatDate(date));
//       } else {
//         setShowDeliveryDatePicker(false);
//         setSelectedDeliveryDate(date);
//         handleInputChange('deliveryDate')(formatDate(date));
//       }
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ScreenPage title="Add Purchase">
//         <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.contentContainer}
//             keyboardShouldPersistTaps="handled"
//           >
//             <DefaultText style={styles.sectionTitle} variant="bold">
//               New Purchase
//             </DefaultText>

//             <View style={styles.formContainer}>
//               {/* Order Date */}
//               <TouchableOpacity onPress={() => setShowOrderDatePicker(true)}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Order Date (DD/MM/YYYY) *"
//                     fieldId="orderDate"
//                     focusedField={focusedField}
//                     value={formData.orderDate}
//                     onChangeText={handleInputChange('orderDate')}
//                     onFocus={() => handleFocus('orderDate')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.orderDate}
//                   />
//                 </View>
//               </TouchableOpacity>

//               {/* Contact Name */}
//               <AuthInput
//                 label="Contact Name *"
//                 fieldId="contactName"
//                 focusedField={focusedField}
//                 value={formData.contactName}
//                 onChangeText={handleInputChange('contactName')}
//                 onFocus={() => handleFocus('contactName')}
//                 onBlur={handleBlur}
//                 error={errors.contactName}
//               />

//               {/* Vehicle Type */}
//               <View style={styles.radioGroupContainer}>
//                 <DefaultText style={styles.radioGroupLabel} variant="bold">
//                   Vehicle Type *
//                 </DefaultText>
//                 <View style={styles.radioOptions}>
//                   {VEHICLE_TYPES.map((type) => {
//                     const isSelected = formData.vehicleType === type;
//                     return (
//                       <TouchableOpacity
//                         key={type}
//                         style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
//                         onPress={() => handleVehicleTypeChange(type)}
//                       >
//                         <View style={styles.radioOuter}>
//                           {isSelected && <View style={styles.radioInner} />}
//                         </View>
//                         <DefaultText style={styles.radioText}>{type}</DefaultText>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               </View>

//               {/* Rent Amount - Show for both OWN and RENTED (as per your original logic) */}
//               {(formData.vehicleType === 'RENTED' || formData.vehicleType === 'OWN') && (
//                 <View style={{ marginTop: 20 }}>
//                   <AuthInput
//                     label="Rent Amount (₹) *"
//                     fieldId="vehicleAmount"
//                     focusedField={focusedField}
//                     value={formData.vehicleAmount}
//                     onChangeText={handleInputChange('vehicleAmount')}
//                     onFocus={() => handleFocus('vehicleAmount')}
//                     onBlur={handleBlur}
//                     inputMode="amount"
//                     keyboardType="numeric"
//                     error={errors.vehicleAmount}
//                   />
//                 </View>
//               )}

//               {/* Delivery Date */}
//               <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Delivery Date (DD/MM/YYYY) *"
//                     fieldId="deliveryDate"
//                     focusedField={focusedField}
//                     value={formData.deliveryDate}
//                     onChangeText={handleInputChange('deliveryDate')}
//                     onFocus={() => handleFocus('deliveryDate')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.deliveryDate}
//                   />
//                 </View>
//               </TouchableOpacity>

//               {/* Remarks */}
//               <View style={{ marginTop: 20 }}>
//                 <AuthInput
//                   label="Remarks"
//                   fieldId="remarks"
//                   focusedField={focusedField}
//                   value={formData.remarks}
//                   onChangeText={handleInputChange('remarks')}
//                   onFocus={() => handleFocus('remarks')}
//                   onBlur={handleBlur}
//                   multiline
//                   numberOfLines={4}
//                   error={errors.remarks}
//                 />
//               </View>

//               {/* Materials Section */}
//               <View style={styles.materialsSection}>
//                 <View style={styles.materialsHeader}>
//                   <DefaultText style={styles.materialsTitle} variant="bold">
//                     Materials ({materials.length})
//                   </DefaultText>
//                   <PrimaryButton onPress={openMaterialSheet} style={styles.addMaterialBtn}>
//                     + Add Material
//                   </PrimaryButton>
//                 </View>

//                 {materials.length > 0 ? (
//                   materials.map((item) => (
//                     <View key={item.id} style={styles.materialCard}>
//                       <View style={styles.materialInfo}>
//                         <DefaultText style={styles.materialName} variant="bold">
//                           {item.material}
//                         </DefaultText>
//                         <DefaultText style={styles.materialDetails}>
//                           {item.qty} {item.unit} × ₹{item.rate}
//                           {item.tax && item.tax !== '0' ? ` + Tax ₹${item.tax}` : ''}
//                         </DefaultText>
//                       </View>
//                       <View style={styles.materialRight}>
//                         <DefaultText style={styles.materialTotal} variant="bold">
//                           ₹{item.total}
//                         </DefaultText>
//                         <TouchableOpacity onPress={() => removeMaterial(item.id)}>
//                           <DefaultText style={styles.removeText}>Remove</DefaultText>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))
//                 ) : (
//                   <DefaultText style={styles.noMaterialsText}>
//                     No materials added yet
//                   </DefaultText>
//                 )}
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         <View style={styles.buttonContainer}>
//           <PrimaryButton onPress={handleCancel} variant="secondary" style={styles.cancelButton}>
//             Cancel
//           </PrimaryButton>
//           <PrimaryButton onPress={handleSave} style={styles.saveButton}>
//             Save Purchase
//           </PrimaryButton>
//         </View>

//         {/* Date Pickers */}
//         {showOrderDatePicker && (
//           <DateTimePicker
//             value={selectedOrderDate}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={(e, d) => handleDateChange(e, d, 'order')}
//             maximumDate={new Date()}
//           />
//         )}
//         {showDeliveryDatePicker && (
//           <DateTimePicker
//             value={selectedDeliveryDate}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={(e, d) => handleDateChange(e, d, 'delivery')}
//           />
//         )}

//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </ScreenPage>

//       {/* Material Bottom Sheet */}
//       <BottomSheetModal ref={materialSheetRef} snapPoints={materialSnapPoints}>
//         <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
//           <DefaultText style={styles.bottomSheetTitle} variant="bold">
//             Add Material
//           </DefaultText>

//           <AuthInput
//             label="Material Name *"
//             fieldId="material"
//             focusedField={focusedField}
//             value={materialForm.material}
//             onChangeText={handleMaterialInputChange('material')}
//             onFocus={() => handleFocus('material')}
//             onBlur={handleBlur}
//           />

//           <View style={styles.row}>
//             <View style={styles.half}>
//               <AuthInput
//                 label="Qty *"
//                 fieldId="qty"
//                 focusedField={focusedField}
//                 value={materialForm.qty}
//                 onChangeText={handleMaterialInputChange('qty')}
//                 onFocus={() => handleFocus('qty')}
//                 onBlur={handleBlur}
//                 inputMode="numeric"
//               />
//             </View>
//             <View style={styles.half}>
//               <AuthInput
//                 label="Unit"
//                 fieldId="unit"
//                 focusedField={focusedField}
//                 value={materialForm.unit}
//                 onChangeText={handleMaterialInputChange('unit')}
//                 onFocus={() => handleFocus('unit')}
//                 onBlur={handleBlur}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.half}>
//               <AuthInput
//                 label="Rate (₹) *"
//                 fieldId="rate"
//                 focusedField={focusedField}
//                 value={materialForm.rate}
//                 onChangeText={handleMaterialInputChange('rate')}
//                 onFocus={() => handleFocus('rate')}
//                 onBlur={handleBlur}
//                 inputMode="amount"
//               />
//             </View>
//             <View style={styles.half}>
//               <AuthInput
//                 label="Tax (₹)"
//                 fieldId="tax"
//                 focusedField={focusedField}
//                 value={materialForm.tax}
//                 onChangeText={handleMaterialInputChange('tax')}
//                 onFocus={() => handleFocus('tax')}
//                 onBlur={handleBlur}
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>

//           <View style={styles.totalRow}>
//             <DefaultText style={styles.totalLabel} variant="bold">
//               Total Amount
//             </DefaultText>
//             <DefaultText style={styles.totalValue} variant="bold">
//               ₹{calculateTotal()}
//             </DefaultText>
//           </View>

//           <PrimaryButton onPress={saveMaterial} style={{ marginTop: 20 }}>
//             Save Material
//           </PrimaryButton>
//         </BottomSheetScrollView>
//       </BottomSheetModal>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: { flex: 1 },
//   contentContainer: { padding: 20, paddingBottom: 140 },
//   formContainer: {
//     backgroundColor: Colors.light.white || '#fff',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderWidth: 1,
//     borderColor: Colors.light.inputBorder || '#e5e7eb',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     marginBottom: 16,
//     // color removed → handled by DefaultText
//   },
//   radioGroupContainer: { marginTop: 16 },
//   radioGroupLabel: {
//     fontSize: 14,
//     marginBottom: 10,
//     // color removed
//   },
//   radioOptions: { flexDirection: 'row', gap: 12 },
//   radioOption: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   radioOptionSelected: {
//     borderColor: Colors.light.primary,
//     backgroundColor: Colors.light.primary + '08',
//   },
//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: Colors.light.primary || '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: Colors.light.primary || '#2563eb',
//   },
//   radioText: {
//     fontSize: 15,
//     // color removed
//   },
//   materialsSection: { marginTop: 24 },
//   materialsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   materialsTitle: {
//     fontSize: 16,
//     // color removed
//   },
//   addMaterialBtn: { paddingHorizontal: 16, paddingVertical: 8 },
//   materialCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#eee',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   materialInfo: { flex: 1 },
//   materialName: {
//     fontSize: 16,
//     // color removed
//   },
//   materialDetails: {
//     fontSize: 13,
//     color: '#666',
//     marginTop: 4,
//   },
//   materialRight: { alignItems: 'flex-end' },
//   materialTotal: {
//     fontSize: 16,
//     color: Colors.light.primary,
//     // variant="bold" will handle weight
//   },
//   removeText: {
//     color: 'red',
//     fontSize: 13,
//     marginTop: 6,
//   },
//   noMaterialsText: {
//     textAlign: 'center',
//     color: '#888',
//     padding: 20,
//   },
//   row: { flexDirection: 'row', gap: 12 },
//   half: { flex: 1 },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#f8fafc',
//     borderRadius: 8,
//   },
//   totalLabel: {
//     fontSize: 15,
//     // color removed
//   },
//   totalValue: {
//     fontSize: 18,
//     color: Colors.light.primary,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     padding: 16,
//   },
//   saveButton: { flex: 1 },
//   cancelButton: { flex: 1 },
//   bottomSheetContent: {
//     paddingTop: 20,
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     marginBottom: 24,
//     textAlign: 'center',
//     // color removed
//   },
// });

import AuthInput from '@/components/AuthInput';
import { useToast } from '@/providers/ToastProvider';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import Loader from '@/components/Loader';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';

type FormData = {
  orderDate: string;
  contactName: string;
  vehicleType: 'OWN' | 'RENTED' | null;
  vehicleAmount: string;
  deliveryDate: string;
  remarks: string;
};

type Material = {
  id: string;
  material: string;
  qty: string;
  unit: string;
  rate: string;
  tax: string;
  total: string;
};

const VEHICLE_TYPES = ['OWN', 'RENTED'] as const;

export default function AddPurchaseScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('purchase');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState<Date>(new Date());
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState<FormData>({
    orderDate: '',
    contactName: '',
    vehicleType: null,
    vehicleAmount: '',
    deliveryDate: '',
    remarks: '',
  });

  const [materials, setMaterials] = useState<Material[]>([]);

  // Material Form State
  const [materialForm, setMaterialForm] = useState({
    material: '',
    qty: '',
    unit: '',
    rate: '',
    tax: '',
  });

  const materialSheetRef = useRef<any>(null);
  const materialSnapPoints = useMemo(() => ['70%', '85%'], []);

  const { errors, validate } = useFormValidation<keyof FormData>({
    orderDate: { required: true, requiredMessage: 'Order Date is required' },
    contactName: { required: true, requiredMessage: 'Contact Name is required' },
    vehicleType: { required: true, requiredMessage: 'Vehicle type is required' },
    vehicleAmount: { required: false },
    deliveryDate: { required: true, requiredMessage: 'Delivery Date is required' },
    remarks: { required: false },
  });

  // Auto-fill today's date for Order Date
  useEffect(() => {
    const today = new Date();
    const formattedToday = formatDate(today);
    setSelectedOrderDate(today);
    setFormData((prev) => ({ ...prev, orderDate: formattedToday }));
  }, []);

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleVehicleTypeChange = (type: 'OWN' | 'RENTED') => {
    setFormData((prev) => ({
      ...prev,
      vehicleType: type,
      vehicleAmount: type === 'OWN' ? '' : prev.vehicleAmount,
    }));
  };

  const handleFocus = (fieldId: string) => setFocusedField(fieldId);
  const handleBlur = () => setFocusedField(null);

  // Material Handlers
  const openMaterialSheet = () => {
    Keyboard.dismiss();
    setMaterialForm({ material: '', qty: '', unit: '', rate: '', tax: '' });
    materialSheetRef.current?.snapToIndex(0);
  };

  const handleMaterialInputChange = (field: keyof typeof materialForm) => (text: string) => {
    setMaterialForm((prev) => ({ ...prev, [field]: text }));
  };

  const calculateTotal = () => {
    const qty = parseFloat(materialForm.qty) || 0;
    const rate = parseFloat(materialForm.rate) || 0;
    const tax = parseFloat(materialForm.tax) || 0;
    return (qty * rate + tax).toFixed(2);
  };

  const saveMaterial = () => {
    if (!materialForm.material || !materialForm.qty || !materialForm.rate) {
      showToast('Error', 'Material, Quantity and Rate are required', 'error');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      material: materialForm.material,
      qty: materialForm.qty,
      unit: materialForm.unit || '-',
      rate: materialForm.rate,
      tax: materialForm.tax || '0',
      total: calculateTotal(),
    };

    setMaterials((prev) => [...prev, newMaterial]);
    materialSheetRef.current?.close();
  };

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    const validatedFormData = {
      ...formData,
      vehicleType: formData.vehicleType || 'OWN',
    };

    if (!validate(validatedFormData as any)) {
      showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
      return;
    }

    if (materials.length === 0) {
      showToast('Error', 'Please add at least one material', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        orderDate: formData.orderDate,
        contactName: formData.contactName,
        vehicleType: formData.vehicleType,
        vehicleAmount: formData.vehicleAmount ? parseFloat(formData.vehicleAmount) : 0,
        deliveryDate: formData.deliveryDate,
        remarks: formData.remarks,
        materials: materials.map((m) => ({
          material: m.material,
          qty: parseFloat(m.qty),
          unit: m.unit,
          rate: parseFloat(m.rate),
          tax: parseFloat(m.tax),
          total: parseFloat(m.total),
        })),
      };

      console.log("🔍 ENDPOINT:", ENDPOINTS.ADD_PURCHASE);
      console.log("📤 Purchase Payload:", payload);

      const response = await postApi(ENDPOINTS.ADD_PURCHASE, payload);

      console.log("📥 Purchase Response:", response);

      if (response.status === "success") {
        showToast(
          "Success",
          response.message || "Purchase added successfully!",
          "success"
        );

        setTimeout(() => {
          router.back();
        }, 800);
      } else {
        showToast(
          "Error",
          response.message || "Failed to add purchase",
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Purchase API Error:", error);
      showToast("Error", "Something went wrong while adding purchase", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => router.back();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date,
    type: 'order' | 'delivery' = 'order'
  ) => {
    if (event.type === 'dismissed') {
      if (type === 'order') setShowOrderDatePicker(false);
      else setShowDeliveryDatePicker(false);
      return;
    }

    if (date) {
      if (type === 'order') {
        setShowOrderDatePicker(false);
        setSelectedOrderDate(date);
        handleInputChange('orderDate')(formatDate(date));
      } else {
        setShowDeliveryDatePicker(false);
        setSelectedDeliveryDate(date);
        handleInputChange('deliveryDate')(formatDate(date));
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add Purchase">
        {isLoading && <Loader />}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <DefaultText style={styles.sectionTitle} variant="bold">
              New Purchase
            </DefaultText>

            <View style={styles.formContainer}>
              {/* Order Date */}
              <TouchableOpacity onPress={() => setShowOrderDatePicker(true)}>
                <View pointerEvents="none">
                  <AuthInput
                    label="Order Date (DD/MM/YYYY) *"
                    fieldId="orderDate"
                    focusedField={focusedField}
                    value={formData.orderDate}
                    onChangeText={handleInputChange('orderDate')}
                    onFocus={() => handleFocus('orderDate')}
                    onBlur={handleBlur}
                    editable={false}
                    error={errors.orderDate}
                  />
                </View>
              </TouchableOpacity>

              {/* Contact Name */}
              <AuthInput
                label="Contact Name *"
                fieldId="contactName"
                focusedField={focusedField}
                value={formData.contactName}
                onChangeText={handleInputChange('contactName')}
                onFocus={() => handleFocus('contactName')}
                onBlur={handleBlur}
                error={errors.contactName}
              />

              {/* Vehicle Type */}
              <View style={styles.radioGroupContainer}>
                <DefaultText style={styles.radioGroupLabel} variant="bold">
                  Vehicle Type *
                </DefaultText>
                <View style={styles.radioOptions}>
                  {VEHICLE_TYPES.map((type) => {
                    const isSelected = formData.vehicleType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
                        onPress={() => handleVehicleTypeChange(type)}
                      >
                        <View style={styles.radioOuter}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <DefaultText style={styles.radioText}>{type}</DefaultText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Vehicle Amount */}
              {(formData.vehicleType === 'RENTED' || formData.vehicleType === 'OWN') && (
                <View style={{ marginTop: 20 }}>
                  <AuthInput
                    label="Rent Amount (₹) *"
                    fieldId="vehicleAmount"
                    focusedField={focusedField}
                    value={formData.vehicleAmount}
                    onChangeText={handleInputChange('vehicleAmount')}
                    onFocus={() => handleFocus('vehicleAmount')}
                    onBlur={handleBlur}
                    inputMode="amount"
                    keyboardType="numeric"
                    error={errors.vehicleAmount}
                  />
                </View>
              )}

              {/* Delivery Date */}
              <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
                <View pointerEvents="none">
                  <AuthInput
                    label="Delivery Date (DD/MM/YYYY) *"
                    fieldId="deliveryDate"
                    focusedField={focusedField}
                    value={formData.deliveryDate}
                    onChangeText={handleInputChange('deliveryDate')}
                    onFocus={() => handleFocus('deliveryDate')}
                    onBlur={handleBlur}
                    editable={false}
                    error={errors.deliveryDate}
                  />
                </View>
              </TouchableOpacity>

              {/* Remarks */}
              <View style={{ marginTop: 20 }}>
                <AuthInput
                  label="Remarks"
                  fieldId="remarks"
                  focusedField={focusedField}
                  value={formData.remarks}
                  onChangeText={handleInputChange('remarks')}
                  onFocus={() => handleFocus('remarks')}
                  onBlur={handleBlur}
                  multiline
                  numberOfLines={4}
                  error={errors.remarks}
                />
              </View>

              {/* Materials Section */}
              <View style={styles.materialsSection}>
                <View style={styles.materialsHeader}>
                  <DefaultText style={styles.materialsTitle} variant="bold">
                    Materials ({materials.length})
                  </DefaultText>
                  <PrimaryButton 
                    onPress={openMaterialSheet} 
                    style={styles.addMaterialBtn}
                    disabled={isLoading}
                  >
                    + Add Material
                  </PrimaryButton>
                </View>

                {materials.length > 0 ? (
                  materials.map((item) => (
                    <View key={item.id} style={styles.materialCard}>
                      <View style={styles.materialInfo}>
                        <DefaultText style={styles.materialName} variant="bold">
                          {item.material}
                        </DefaultText>
                        <DefaultText style={styles.materialDetails}>
                          {item.qty} {item.unit} × ₹{item.rate}
                          {item.tax && item.tax !== '0' ? ` + Tax ₹${item.tax}` : ''}
                        </DefaultText>
                      </View>
                      <View style={styles.materialRight}>
                        <DefaultText style={styles.materialTotal} variant="bold">
                          ₹{item.total}
                        </DefaultText>
                        <TouchableOpacity onPress={() => removeMaterial(item.id)}>
                          <DefaultText style={styles.removeText}>Remove</DefaultText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <DefaultText style={styles.noMaterialsText}>
                    No materials added yet
                  </DefaultText>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            onPress={handleCancel} 
            variant="secondary" 
            style={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={isLoading}
          >
            Save Purchase
          </PrimaryButton>
        </View>

        {/* Date Pickers */}
        {showOrderDatePicker && (
          <DateTimePicker
            value={selectedOrderDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => handleDateChange(e, d, 'order')}
            maximumDate={new Date()}
          />
        )}
        {showDeliveryDatePicker && (
          <DateTimePicker
            value={selectedDeliveryDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => handleDateChange(e, d, 'delivery')}
          />
        )}

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Material Bottom Sheet */}
      <BottomSheetModal ref={materialSheetRef} snapPoints={materialSnapPoints}>
        <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
          <DefaultText style={styles.bottomSheetTitle} variant="bold">
            Add Material
          </DefaultText>

          <AuthInput
            label="Material Name *"
            fieldId="material"
            focusedField={focusedField}
            value={materialForm.material}
            onChangeText={handleMaterialInputChange('material')}
            onFocus={() => handleFocus('material')}
            onBlur={handleBlur}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <AuthInput
                label="Qty *"
                fieldId="qty"
                focusedField={focusedField}
                value={materialForm.qty}
                onChangeText={handleMaterialInputChange('qty')}
                onFocus={() => handleFocus('qty')}
                onBlur={handleBlur}
                inputMode="numeric"
              />
            </View>
            <View style={styles.half}>
              <AuthInput
                label="Unit"
                fieldId="unit"
                focusedField={focusedField}
                value={materialForm.unit}
                onChangeText={handleMaterialInputChange('unit')}
                onFocus={() => handleFocus('unit')}
                onBlur={handleBlur}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <AuthInput
                label="Rate (₹) *"
                fieldId="rate"
                focusedField={focusedField}
                value={materialForm.rate}
                onChangeText={handleMaterialInputChange('rate')}
                onFocus={() => handleFocus('rate')}
                onBlur={handleBlur}
                inputMode="amount"
              />
            </View>
            <View style={styles.half}>
              <AuthInput
                label="Tax (₹)"
                fieldId="tax"
                focusedField={focusedField}
                value={materialForm.tax}
                onChangeText={handleMaterialInputChange('tax')}
                onFocus={() => handleFocus('tax')}
                onBlur={handleBlur}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.totalRow}>
            <DefaultText style={styles.totalLabel} variant="bold">
              Total Amount
            </DefaultText>
            <DefaultText style={styles.totalValue} variant="bold">
              ₹{calculateTotal()}
            </DefaultText>
          </View>

          <PrimaryButton onPress={saveMaterial} style={{ marginTop: 20 }}>
            Save Material
          </PrimaryButton>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 140 },
  formContainer: {
    backgroundColor: Colors.light.white || '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  radioGroupContainer: { marginTop: 16 },
  radioGroupLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  radioOptions: { flexDirection: 'row', gap: 12 },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  radioOptionSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '08',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary || '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary || '#2563eb',
  },
  radioText: {
    fontSize: 15,
  },
  materialsSection: { marginTop: 24 },
  materialsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  materialsTitle: {
    fontSize: 16,
  },
  addMaterialBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  materialCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  materialInfo: { flex: 1 },
  materialName: {
    fontSize: 16,
  },
  materialDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  materialRight: { alignItems: 'flex-end' },
  materialTotal: {
    fontSize: 16,
    color: Colors.light.primary,
  },
  removeText: {
    color: 'red',
    fontSize: 13,
    marginTop: 6,
  },
  noMaterialsText: {
    textAlign: 'center',
    color: '#888',
    padding: 20,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 15,
  },
  totalValue: {
    fontSize: 18,
    color: Colors.light.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  saveButton: { flex: 1 },
  cancelButton: { flex: 1 },
  bottomSheetContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
});