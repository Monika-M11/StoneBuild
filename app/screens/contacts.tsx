// import Colors from '@/constants/theme';
// import { useTheme } from '@/providers/ThemeProvider';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Footer from '../../components/Footer';

// export default function ContactsScreen() {
//   const [activeTab, setActiveTab] = useState<string>('contacts');
//   const theme = useTheme();
//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <Ionicons name="people-outline" size={20} color={Colors.light.primaryDark} />
//             <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Contacts</Text>
//           </View>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* BODY */}
//         <View style={styles.body}>
//           <Text style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>Contacts Screen Content</Text>
//         </View>

//         {/* FOOTER */}
//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, backgroundColor: Colors.light.inputBg },
//   header: {
//     height: 64, paddingHorizontal: 16, backgroundColor: Colors.light.background,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     elevation: 3, shadowColor: Colors.light.text,
//     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84,
//   },
//   headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   headerTitle: { fontSize: 20, color: Colors.light.primaryDark },
//   body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   bodyText: { fontSize: 16, color: Colors.light.text },
// });

import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';


type Contact = {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
};

const dummyContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', status: 'Online' },
  { id: '2', name: 'Bob Smith', status: 'Away' },
  { id: '3', name: 'Carol Williams', status: 'Busy' },
  { id: '4', name: 'David Brown', status: 'Online' },
  { id: '5', name: 'Emma Davis', status: 'Offline' },
];

export default function ContactsScreen() {
  const [activeTab, setActiveTab] = useState<string>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');

  const theme = useTheme();
  const router = useRouter();

  const bottomSheetRef = useRef<any>(null);

  const snapPoints = useMemo(() => ['25%', '90%'], []);

  const openMessageSheet = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setMessage('');
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const closeMessageSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedContact(null);
    setMessage('');
  }, []);

  const sendMessage = useCallback(() => {
    if (!message.trim() || !selectedContact) return;
    console.log(`Message to ${selectedContact.name}: ${message}`);
    setMessage('');
  }, [message, selectedContact]);

  const renderContactItem = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => openMessageSheet(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </Text>
          {item.status && <Text style={styles.contactStatus}>{item.status}</Text>}
        </View>
        <TouchableOpacity style={styles.msgButton} onPress={() => openMessageSheet(item)}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.light.primaryDark} />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [openMessageSheet, theme]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Ionicons name="people-outline" size={20} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Contacts</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          {/* CONTACT LIST */}
          <View style={styles.body}>
            <FlatList
              data={dummyContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onClose={() => setSelectedContact(null)}
        >
          {selectedContact && (
            <>
              {/* Sheet Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetAvatarContainer}>
                  <View style={styles.sheetAvatarPlaceholder}>
                    <Text style={styles.sheetAvatarText}>
                      {selectedContact.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetContactName, { fontFamily: theme.fonts.bold }]}>
                    {selectedContact.name}
                  </Text>
                  <Text style={styles.sheetStatus}>Messaging...</Text>
                </View>
                <TouchableOpacity onPress={closeMessageSheet} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              {/* Messages Area */}
              <BottomSheetFlatList
                data={[]}
                ListHeaderComponent={
                  <Text style={styles.placeholderText}>
                    Start chatting with {selectedContact.name}
                  </Text>
                }
                renderItem={null}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
              />

              {/* Input Area */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.inputContainer}
              >
                <View style={styles.inputWrapper}>
                  <BottomSheetTextInput
                    style={[styles.input, { fontFamily: theme.fonts.regular }]}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors.light.text + '80'}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!message.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={22}
                      color={message.trim() ? Colors.light.primaryDark : '#ccc'}
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </>
          )}
        </BottomSheetModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },
  header: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },
  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },

  contactItem: {
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
  avatarContainer: { marginRight: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primaryDark + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: Colors.light.primaryDark },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, color: Colors.light.text },
  contactStatus: { fontSize: 13, color: '#666', marginTop: 2 },
  msgButton: { padding: 8 },

  bottomSheetBackground: StyleSheet.create({ dummy: { backgroundColor: '#FFFFFF' } }).dummy as any,
  handleIndicator: StyleSheet.create({ dummy: { backgroundColor: '#E5E7EB', width: 40, height: 4 } }).dummy as any,

  // Rounded corners moved here + overflow hidden for clean look
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',           // Important for clean corners
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sheetAvatarContainer: { marginRight: 12 },
  sheetAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primaryDark + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetAvatarText: { fontSize: 22, fontWeight: '700', color: Colors.light.primaryDark },
  sheetContactName: { fontSize: 18, color: Colors.light.text },
  sheetStatus: { fontSize: 14, color: '#666' },
  closeButton: { marginLeft: 'auto', padding: 8 },

  messagesContainer: { flexGrow: 1, paddingVertical: 16 },
  placeholderText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    padding: 20,
  },

  inputContainer: { paddingBottom: 16, backgroundColor: '#fff' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    paddingVertical: 8,
    color: Colors.light.text,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryDark + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#f0f0f0' },
});