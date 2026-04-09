import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomSheetModal from '../components/BottomSheetModal';
import Footer from '../components/Footer';
import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/theme';
import { useDrawer } from '../contexts/DrawerContext';
import { useTheme } from '../providers/ThemeProvider';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Data
  const [user, setUser] = useState({
    name: 'UserName',
    email: 'abc@gmail.com',
    phone: '+91 98765 43210',
    company: 'Abc Constructions',
    role: 'Admin',
  });

  // Bottom Sheet State
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const editSheetRef = React.useRef<any>(null);

  const openEditSheet = () => {
    setEditForm({ ...user });
    setShowEditSheet(true);
    editSheetRef.current?.snapToIndex(0);
  };

  const handleEditInputChange = (field: keyof typeof editForm) => (text: string) => {
    setEditForm((prev) => ({ ...prev, [field]: text }));
  };

  const saveProfile = () => {
    if (!editForm.name || !editForm.email || !editForm.phone) {
      Alert.alert('Error', 'Name, Email and Phone are required');
      return;
    }

    setUser({ ...editForm });
    editSheetRef.current?.close();
    setShowEditSheet(false);

    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
              <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Ionicons name="person-circle-outline" size={24} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Profile</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={80} color="#9ca3af" />
                </View>

                <TouchableOpacity style={styles.editAvatarButton} onPress={openEditSheet}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.userName, { fontFamily: theme.fonts.bold }]}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>

              <TouchableOpacity style={styles.editButton} onPress={openEditSheet}>
                <Ionicons name="create-outline" size={18} color={Colors.light.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon as any} size={24} color={Colors.light.primaryDark} />
                  </View>
                  <Text style={[styles.menuText, { fontFamily: theme.fonts.medium }]}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}

              {/* Logout */}
              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                </View>
                <Text style={[styles.menuText, styles.logoutText, { fontFamily: theme.fonts.medium }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </SafeAreaView>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheetModal ref={editSheetRef} snapPoints={['65%', '80%']}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={editForm.name}
            onChangeText={handleEditInputChange('name')}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={editForm.email}
            onChangeText={handleEditInputChange('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={editForm.phone}
            onChangeText={handleEditInputChange('phone')}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Company Name"
            value={editForm.company}
            onChangeText={handleEditInputChange('company')}
          />

          <TextInput
            style={styles.input}
            placeholder="Role"
            value={editForm.role}
            onChangeText={handleEditInputChange('role')}
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
        </View>
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

  scrollView: { flex: 1 },

  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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

  menuContainer: { paddingHorizontal: 16, paddingBottom: 100 },
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

  // Bottom Sheet Styles
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 1 },
});
