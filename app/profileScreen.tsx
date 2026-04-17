import { removeToken } from '@/auth/authStorage';
import AuthInput from '@/components/AuthInput';
import ScreenPage from '@/components/ScreenPage';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '../components/BottomSheetModal';
import Footer from '../components/Footer';
import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/theme';
import { useDrawer } from '../contexts/DrawerContext';
import { DefaultText, useTheme } from '../providers/ThemeProvider';
import { useToast } from '../providers/ToastProvider';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { showToast } = useToast(); // disabled - ToastProvider not working

  const [activeTab, setActiveTab] = useState('profile');

  const [user, setUser] = useState({
    name: 'UserName',
    email: 'abc@gmail.com',
    phone: '+91 98765 43210',
    company: 'Abc Constructions',
    role: 'Admin',
  });

  const [editForm, setEditForm] = useState({ ...user });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const editSheetRef = useRef<any>(null);
  const blurTimeoutRef = useRef<any>(null);

  const openEditSheet = () => {
    setEditForm({ ...user });
    editSheetRef.current?.snapToIndex(0);
  };

  const handleEditInputChange = (field: keyof typeof editForm) => (text: string) => {
    setEditForm((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = useCallback((fieldId: string) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setFocusedField(fieldId);
    editSheetRef.current?.snapToIndex(1);
  }, []);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setFocusedField(null);
      editSheetRef.current?.snapToIndex(0);
    }, 150);
  }, []);

  const saveProfile = () => {
    if (!editForm.name || !editForm.email || !editForm.phone) {
      
       showToast('Error', 'Name, Email and Phone are required', 'error');
      return;
    }
    setUser({ ...editForm });
    editSheetRef.current?.close();
    
     showToast('Success', 'Profile updated successfully!','success');
  };

  // const handleLogout = () => {
  //   Alert.alert('Logout', 'Are you sure you want to logout?', [
  //     { text: 'Cancel', style: 'cancel' },
  //     {
  //       text: 'Logout',
  //       style: 'destructive',
  //       onPress: () => router.replace('/login'),
  //     },
  //   ]);
  // };

  const handleLogout = async () => {
  await removeToken();
  console.log("Logged-out Successfully")
  router.replace('/login');
  
};


  const menuItems = [
    { id: '1', title: 'User Details', icon: 'person-outline' },
    { id: '2', title: 'Company Details', icon: 'business-outline' },
    { id: '3', title: 'Change Password', icon: 'key-outline' },
    { id: '4', title: 'Access Management', icon: 'shield-checkmark-outline' },
    { id: '5', title: 'Terms and Conditions', icon: 'document-text-outline' },
    { id: '6', title: 'Support', icon: 'help-circle-outline' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Profile" onMenuPress={openDrawer}>
       

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={80} color="#9ca3af" />
              </View>
              <TouchableOpacity 
                style={styles.editAvatarButton} 
                onPress={openEditSheet}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <DefaultText  style={[styles.userName, { fontFamily: theme.fonts.bold }]}>
              {user.name}
            </DefaultText >
            <DefaultText  style={styles.userRole}>{user.role}</DefaultText >
            <DefaultText  style={styles.userEmail}>{user.email}</DefaultText >
            <DefaultText  style={styles.userPhone}>{user.phone}</DefaultText >

            <TouchableOpacity style={styles.editButton} onPress={openEditSheet}>
              <Ionicons name="create-outline" size={18} color={Colors.light.primary} />
              <DefaultText  style={styles.editButtonText}>Edit Profile</DefaultText >
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.title === 'Change Password') {
                    router.push('/screens/changePassword');
                  } else if (item.title === 'Support') {
                    router.push('/screens/support');
                  } else if (item.title === 'Terms and Conditions') {
                    router.push('/screens/termsAndConditions');
                  }
                }}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={Colors.light.primaryDark} />
                </View>
                <DefaultText style={[styles.menuText, { fontFamily: theme.fonts.medium }]}>
                  {item.title}
                </DefaultText >
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              </View>
              <DefaultText 
                style={[styles.menuText, styles.logoutText, { fontFamily: theme.fonts.medium }]}
              >
                Logout
              </DefaultText >
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheetModal ref={editSheetRef} snapPoints={['65%', '92%']}>
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <DefaultText  style={styles.bottomSheetTitle}>Edit Profile</DefaultText >

          <AuthInput
            label="Full Name"
            fieldId="name"
            focusedField={focusedField}
            value={editForm.name}
            onChangeText={handleEditInputChange('name')}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            inputMode="default"
          />

          <AuthInput
            label="Email Address"
            fieldId="email"
            focusedField={focusedField}
            value={editForm.email}
            onChangeText={handleEditInputChange('email')}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            inputMode="email"
          />

          <AuthInput
            label="Phone Number"
            fieldId="phone"
            focusedField={focusedField}
            value={editForm.phone}
            onChangeText={handleEditInputChange('phone')}
            onFocus={() => handleFocus('phone')}
            onBlur={handleBlur}
            inputMode="numeric"
          />

          <AuthInput
            label="Company Name"
            fieldId="company"
            focusedField={focusedField}
            value={editForm.company}
            onChangeText={handleEditInputChange('company')}
            onFocus={() => handleFocus('company')}
            onBlur={handleBlur}
            inputMode="default"
          />

          <AuthInput
            label="Role"
            fieldId="role"
            focusedField={focusedField}
            value={editForm.role}
            onChangeText={handleEditInputChange('role')}
            onFocus={() => handleFocus('role')}
            onBlur={handleBlur}
            inputMode="default"
          />

          <View style={styles.buttonRow}>
            <PrimaryButton
              onPress={() => editSheetRef.current?.close()}
              variant="secondary"
              style={styles.cancelBtn}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton onPress={saveProfile} style={styles.saveBtn}>
              Save Changes
            </PrimaryButton>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },

  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: 12,
    paddingTop: 20,
  },

  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: Colors.light.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: { fontSize: 22, color: Colors.light.text, marginBottom: 4 },
  userRole: { fontSize: 15, color: Colors.light.primary, marginBottom: 8 },
  userEmail: { fontSize: 15, color: '#6b7280', marginBottom: 4 },
  userPhone: { fontSize: 15, color: '#6b7280' },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 30,
  },
  editButtonText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 15,
  },

  menuContainer: { paddingHorizontal: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  menuIconContainer: { width: 40, alignItems: 'center' },
  menuText: { flex: 1, fontSize: 16, color: Colors.light.text, marginLeft: 8 },
  logoutItem: { marginTop: 20 },
  logoutText: { color: '#ef4444' },

  bottomSheetContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.light.text,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 1 },
});