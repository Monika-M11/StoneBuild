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


type FormData = {
  name: string;
  // contactName: string;
  incharge_number: string;
  address: string;
  pincode: string;
};

export default function AddWarehouseScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("warehouses");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    // contactName: '',
    incharge_number: "",
    address: "",
    pincode: "",
  });
  const { showToast } = useToast();

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { errors, validate } = useFormValidation<keyof FormData>({
    name: { required: true, requiredMessage: "Warehouse name is required" },
    // contactName: {
    //   required: true,
    //   requiredMessage: 'Contact name is required'
    // },
    incharge_number: {
      required: true,
      requiredMessage: "Incharge number is required",
    },
    address: {
      required: true,
      requiredMessage: "Address is required",
    },
    pincode: {
      required: true,
      requiredMessage: "Pincode is required",
      minLength: 6,
      minLengthMessage: "Pincode must be 6 digits",
    },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = useCallback(
    (fieldId: string) => setFocusedField(fieldId),
    [],
  );
  const handleBlur = useCallback(() => setFocusedField(null), []);

  const handleSave = async () => {
    if (!validate(formData)) {
     
      showToast('Validation Error','Please fix the errors highlighted below','error');
      return;
    }
    setIsLoading(true);
    try {
      console.log("🔍 ENDPOINT:", ENDPOINTS.ADDWAREHOUSE);

      const payload = {
        warehouseName: formData.name,

        inchargeNumber: formData.incharge_number,
        address: formData.address,
        pincode: formData.pincode,
      };

      console.log("📤 Warehouse Payload:", payload);

      const response = await postApi(ENDPOINTS.ADDWAREHOUSE, payload);

      console.log("📥 Warehouse Response:", response);

      if (response.status === "success") {
        showToast(
          "Success",
          response.message || "Warehouse added successfully!",
          "success",
        );

        setTimeout(() => {
          router.back();
        }, 800); // slight delay so user sees toast
      } else {
        showToast(
          "Error",
          response.message || "Failed to add warehouse",
          "error",
        );
      }
    } catch (error: any) {
      console.error("❌ Warehouse API Error:", error);
      showToast('Error','Something went wrong');
    } finally {
      setIsLoading(false); // ← stop loader always
    }
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="New Warehouse">
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
            <View style={styles.formCard}>
              <AuthInput
                label="Warehouse Name *"
                fieldId="name"
                focusedField={focusedField}
                value={formData.name}
                onChangeText={handleInputChange("name")}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.name}
                placeholder = 'Enter Warehoouse Name'
              />

              <AuthInput
                label="Incharge Number *"
                fieldId="incharge_number"
                focusedField={focusedField}
                value={formData.incharge_number}
                onChangeText={handleInputChange("incharge_number")}
                onFocus={() => handleFocus("incharge_number")}
                onBlur={handleBlur}
                inputMode="phone"
                error={errors.incharge_number}
                placeholder="Enter Incharge Number"
              />

              <AuthInput
                label="Address *"
                fieldId="address"
                focusedField={focusedField}
                value={formData.address}
                onChangeText={handleInputChange("address")}
                onFocus={() => handleFocus("address")}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.address}
                placeholder="Enter Address"
              />

              <AuthInput
                label="Pincode *"
                fieldId="pincode"
                focusedField={focusedField}
                value={formData.pincode}
                onChangeText={handleInputChange("pincode")}
                onFocus={() => handleFocus("pincode")}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.pincode}
                placeholder="Enter Pincode"
              />
            </View>
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
          <PrimaryButton onPress={handleSave} style={styles.fixedSaveButton}>
            Save Warehouse
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
  paddingTop: 16, // 👈 add this
  paddingBottom: 120,
  paddingHorizontal: 12,
},
  formCard: {
     backgroundColor: Colors.light.white || '#fff', 
     borderRadius: 16,
    
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
   
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
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
