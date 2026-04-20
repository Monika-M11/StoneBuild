// import { useRouter } from 'expo-router';
// import React, { useCallback, useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   View,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { useToast } from '@/providers/ToastProvider';
// import AuthInput from '../../components/AuthInput';
// import Footer from '../../components/Footer';
// import PrimaryButton from '../../components/PrimaryButton';
// import ScreenPage from '../../components/ScreenPage';
// import Colors from '../../constants/theme';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { DefaultText } from '../../providers/ThemeProvider'; // ← Added this

// type FormData = {
//   name: string;
//   brand: string;
//   model: string;
//   totalCount: string;
// };

// export default function AddEquipmentScreen() {
//   const router = useRouter();
//   const { showToast } = useToast();
//   const [activeTab, setActiveTab] = useState('equipments');

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     brand: '',
//     model: '',
//     totalCount: '',
//   });

//   const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   const { errors, validate } = useFormValidation<keyof FormData>({
//     name: { required: true, requiredMessage: 'Name is required' },
//     brand: { required: true, requiredMessage: 'Brand is required' },
//     model: { required: true, requiredMessage: 'Model is required' },
//     totalCount: {
//       required: true,
//       requiredMessage: 'Total count is required',
//       min: 1,
//       minMessage: 'Total count must be at least 1'
//     },
//   });

//   const handleInputChange = (field: keyof FormData) => (text: string) => {
//     setFormData((prev) => ({ ...prev, [field]: text }));
//   };

//   const handleTotalCountChange = (text: string) => {
//     handleInputChange('totalCount')(text);

//     const parsed = parseInt(text, 10);

//     if (!text || isNaN(parsed) || parsed < 1) {
//       setSerialNumbers([]);
//       return;
//     }

//     const count = Math.max(0, parsed);

//     setSerialNumbers((prev) => {
//       if (count > prev.length) {
//         return [...prev, ...Array(count - prev.length).fill('')];
//       } else {
//         return prev.slice(0, count);
//       }
//     });
//   };

//   const handleSerialNumberChange = (index: number, value: string) => {
//     setSerialNumbers((prev) => {
//       const updated = [...prev];
//       updated[index] = value;
//       return updated;
//     });
//   };

//   const handleFocus = useCallback((fieldId: string) => setFocusedField(fieldId), []);
//   const handleBlur = useCallback(() => setFocusedField(null), []);

//   const handleSave = () => {
//     if (!validate(formData)) {
//       showToast('Validation Error','Please fix the errors highlighted below','error');
//       return;
//     }

//     const payload = {
//       brand: formData.brand,
//       model: formData.model,
//       name: formData.name,
//       totalCount: formData.totalCount,
//       serialNumbers: serialNumbers,
//     };

//     console.log('✅ New Equipment Saved:', payload);
//      showToast('Success', 'Equipments added successfully!', 'success');

//   // ✅ Navigate back after toast is visible
//   setTimeout(() => {
//     router.back();
//   }, 1500); // adjust timing if needed
// };

   

//   const handleCancel = () => router.back();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ScreenPage title="New Equipment">
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.contentContainer}
//             keyboardShouldPersistTaps="handled"
//           >

//             <DefaultText style={styles.sectionTitle} variant="bold">
//                             New Equipments
//                           </DefaultText>
//             <View style={styles.formCard}>
//               <AuthInput
//                 label="Name *"
//                 fieldId="name"
//                 focusedField={focusedField}
//                 value={formData.name}
//                 onChangeText={handleInputChange('name')}
//                 onFocus={() => handleFocus('name')}
//                 onBlur={handleBlur}
//                 inputMode="default"
//                 error={errors.name}
//                 placeholder="Enter Name"
//               />

//               <AuthInput
//                 label="Brand *"
//                 fieldId="brand"
//                 focusedField={focusedField}
//                 value={formData.brand}
//                 onChangeText={handleInputChange('brand')}
//                 onFocus={() => handleFocus('brand')}
//                 onBlur={handleBlur}
//                 inputMode="default"
//                 error={errors.brand}
//                 placeholder="Enter Brand"
//               />

//               <AuthInput
//                 label="Model *"
//                 fieldId="model"
//                 focusedField={focusedField}
//                 value={formData.model}
//                 onChangeText={handleInputChange('model')}
//                 onFocus={() => handleFocus('model')}
//                 onBlur={handleBlur}
//                 inputMode="alphanumeric"
//                 error={errors.model}
//                 placeholder="Enter Model"
//               />

//               <AuthInput
//                 label="Total Count *"
//                 fieldId="totalCount"
//                 focusedField={focusedField}
//                 value={formData.totalCount}
//                 onChangeText={handleTotalCountChange}
//                 onFocus={() => handleFocus('totalCount')}
//                 onBlur={handleBlur}
//                 inputMode="wholeNumber"
//                 error={errors.totalCount}
//                 placeholder="Enter Total Count"
//               />
//             </View>

//             {/* Dynamic Serial Number Fields */}
//             {serialNumbers.length > 0 && (
//               <View style={styles.serialSection}>
//                 <DefaultText style={styles.serialSectionTitle} variant="bold">
//                   Serial Numbers
//                 </DefaultText>
//                 <DefaultText style={styles.serialSectionSubtitle}>
//                   Enter the serial number for each unit
//                 </DefaultText>

//                 <View style={styles.serialCard}>
//                   {serialNumbers.map((serial, index) => (
//                     <AuthInput
//                       key={`serial-${index}`}
//                       label={`Unit ${index + 1} Serial Number`}
//                       fieldId={`serial-${index}`}
//                       focusedField={focusedField}
//                       value={serial}
//                       onChangeText={(value) => handleSerialNumberChange(index, value)}
//                       onFocus={() => handleFocus(`serial-${index}`)}
//                       onBlur={handleBlur}
//                       inputMode="alphanumeric"
//                     />
//                   ))}
//                 </View>
//               </View>
//             )}
//           </ScrollView>
//         </KeyboardAvoidingView>

//         <View style={styles.fixedButtonContainer}>
//           <PrimaryButton onPress={handleCancel} variant="secondary" style={styles.fixedCancelButton}>
//             Cancel
//           </PrimaryButton>
//           <PrimaryButton onPress={handleSave} style={styles.fixedSaveButton}>
//             Save Equipment
//           </PrimaryButton>
//         </View>

//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </ScreenPage>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingBottom: 120,
//     paddingHorizontal: 12,
//     paddingTop: 20,
//     gap: 16,
//   },
//   formCard: {
    
//     backgroundColor: Colors.light.white || '#fff', 
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderWidth: 1,
//     borderColor: Colors.light.inputBorder || '#e5e7eb',
//     width: '100%',
//   },
//    sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 5,
//   },

//   // Serial number section
//   serialSection: {
//     width: '100%',
//   },
//   serialSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 4,
//     paddingHorizontal: 4,
//   },
//   serialSectionSubtitle: {
//     fontSize: 13,
//     color: '#888',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   serialCard: {
//     backgroundColor:Colors.light.white || '#fff',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderWidth: 1,
//     borderColor: Colors.light.inputBorder || '#e5e7eb',
//     width: '100%',
//   },

//   fixedButtonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 16,
    
//   },
//   fixedSaveButton: { flex: 1 },
//   fixedCancelButton: { flex: 1 },
// });


//API INTEGRATION
import { postApi } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import Loader from "@/components/Loader";
import { useToast } from "@/providers/ToastProvider";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthInput from "../../components/AuthInput";
import Footer from "../../components/Footer";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenPage from "../../components/ScreenPage";
import Colors from "../../constants/theme";
import { useFormValidation } from "../../hooks/useFormValidation";
import { DefaultText } from "../../providers/ThemeProvider";

type FormData = {
  name: string;
  brand: string;
  model: string;
  totalCount: string;
};

export default function AddEquipmentScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("equipments");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    brand: "",
    model: "",
    totalCount: "",
  });

  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { errors, validate } = useFormValidation<keyof FormData>({
    name: { required: true, requiredMessage: "Name is required" },
    brand: { required: true, requiredMessage: "Brand is required" },
    model: { required: true, requiredMessage: "Model is required" },
    totalCount: {
      required: true,
      requiredMessage: "Total count is required",
      min: 1,
      minMessage: "Total count must be at least 1",
    },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleTotalCountChange = (text: string) => {
    handleInputChange("totalCount")(text);

    const parsed = parseInt(text, 10);
    if (!text || isNaN(parsed) || parsed < 1) {
      setSerialNumbers([]);
      return;
    }

    const count = Math.max(0, parsed);
    setSerialNumbers((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill("")];
      } else {
        return prev.slice(0, count);
      }
    });
  };

  const handleSerialNumberChange = (index: number, value: string) => {
    setSerialNumbers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleFocus = useCallback(
    (fieldId: string) => setFocusedField(fieldId),
    []
  );
  const handleBlur = useCallback(() => setFocusedField(null), []);

  const handleSave = async () => {
    if (!validate(formData)) {
      showToast("Validation Error", "Please fix the errors highlighted below", "error");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        totalCount: parseInt(formData.totalCount, 10), // Convert to number
        serialNumbers: serialNumbers.filter(sn => sn.trim() !== ""), // Optional: filter empty serials
      };

      console.log("🔍 ENDPOINT:", ENDPOINTS.ADDEQUIPMENT); // Make sure this endpoint exists
      console.log("📤 Equipment Payload:", payload);

      const response = await postApi(ENDPOINTS.ADDEQUIPMENT, payload);

      console.log("📥 Equipment Response:", response);

      if (response.status === "success") {
        showToast(
          "Success",
          response.message || "Equipment added successfully!",
          "success"
        );

        setTimeout(() => {
          router.back();
        }, 800);
      } else {
        showToast(
          "Error",
          response.message || "Failed to add equipment",
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Equipment API Error:", error);
      showToast("Error", "Something went wrong while adding equipment", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="New Equipment">
        {isLoading && <Loader />}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <DefaultText style={styles.sectionTitle} variant="bold">
              New Equipments
            </DefaultText>

            <View style={styles.formCard}>
              <AuthInput
                label="Name *"
                fieldId="name"
                focusedField={focusedField}
                value={formData.name}
                onChangeText={handleInputChange("name")}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.name}
                placeholder="Enter Name"
              />
              <AuthInput
                label="Brand *"
                fieldId="brand"
                focusedField={focusedField}
                value={formData.brand}
                onChangeText={handleInputChange("brand")}
                onFocus={() => handleFocus("brand")}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.brand}
                placeholder="Enter Brand"
              />
              <AuthInput
                label="Model *"
                fieldId="model"
                focusedField={focusedField}
                value={formData.model}
                onChangeText={handleInputChange("model")}
                onFocus={() => handleFocus("model")}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.model}
                placeholder="Enter Model"
              />
              <AuthInput
                label="Total Count *"
                fieldId="totalCount"
                focusedField={focusedField}
                value={formData.totalCount}
                onChangeText={handleTotalCountChange}
                onFocus={() => handleFocus("totalCount")}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.totalCount}
                placeholder="Enter Total Count"
              />
            </View>

            {/* Dynamic Serial Number Fields */}
            {serialNumbers.length > 0 && (
              <View style={styles.serialSection}>
                <DefaultText style={styles.serialSectionTitle} variant="bold">
                  Serial Numbers
                </DefaultText>
                <DefaultText style={styles.serialSectionSubtitle}>
                  Enter the serial number for each unit
                </DefaultText>
                <View style={styles.serialCard}>
                  {serialNumbers.map((serial, index) => (
                    <AuthInput
                      key={`serial-${index}`}
                      label={`Unit ${index + 1} Serial Number`}
                      fieldId={`serial-${index}`}
                      focusedField={focusedField}
                      value={serial}
                      onChangeText={(value) => handleSerialNumberChange(index, value)}
                      onFocus={() => handleFocus(`serial-${index}`)}
                      onBlur={handleBlur}
                      inputMode="alphanumeric"
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.fixedButtonContainer}>
          <PrimaryButton
            onPress={handleCancel}
            variant="secondary"
            style={styles.fixedCancelButton}
            disabled={isLoading}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            onPress={handleSave}
            style={styles.fixedSaveButton}
            disabled={isLoading}
          >
            Save Equipment
          </PrimaryButton>
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 12,
    gap: 16,
  },
  formCard: {
    backgroundColor: Colors.light.white || "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || "#e5e7eb",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 5,
  },
  serialSection: {
    width: "100%",
  },
  serialSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  serialSectionSubtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  serialCard: {
    backgroundColor: Colors.light.white || "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || "#e5e7eb",
    width: "100%",
  },
  fixedButtonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fixedSaveButton: { flex: 1 },
  fixedCancelButton: { flex: 1 },
});