import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ScreenPage from '@/components/ScreenPage';
import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type ProjectStatus = 'Active' | 'On Hold' | 'Completed';

interface Project {
  id: string;
  name: string;
  totalValue: string;
  status: ProjectStatus;
  initials: string;
  avatarColor: string;
}

const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Skyline Residency',
    totalValue: '48,50,000',
    status: 'Active',
    initials: 'SR',
    avatarColor: Colors.light.primary,
  },
  {
    id: '2',
    name: 'Metro Hub Phase 2',
    totalValue: '1,22,00,000',
    status: 'On Hold',
    initials: 'MH',
    avatarColor: Colors.light.primary,
  },
  {
    id: '3',
    name: 'Green Valley Villa',
    totalValue: '75,00,000',
    status: 'Completed',
    initials: 'GV',
    avatarColor: Colors.light.primary,
  },
];

const statusStyles: Record<ProjectStatus, { bg: string; color: string }> = {
  Active:    { bg: '#e1f5ee', color: '#085041' },
  'On Hold': { bg: '#faeeda', color: '#633806' },
  Completed: { bg: '#e6f1fb', color: '#0c447c' },
};

export default function ProjectsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('projects');

  const renderProjectItem = ({ item }: { item: Project }) => {
    const { bg, color } = statusStyles[item.status];

    return (
      <TouchableOpacity
        style={styles.projectCard}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/screens/projectDetails' as any,
            params: { id: item.id, name: item.name, avatarColor: item.avatarColor },
          })
        }
      >
        {/* Avatar with aggressive rounding */}
        <View style={[styles.avatarBox, { backgroundColor: item.avatarColor }]}>

          <DefaultText style={styles.avatarText}>{item.initials}</DefaultText>
        </View>

        <View style={styles.projectInfo}>
          <DefaultText style={[styles.projectName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </DefaultText>
          <DefaultText style={styles.projectValue}>
            Total Value:{' '}
            <DefaultText style={[styles.projectValueHighlight, { fontFamily: theme.fonts.bold }]}>
              ₹{item.totalValue}
            </DefaultText>
          </DefaultText>
        </View>

        <View style={styles.projectMeta}>
          <View style={[styles.statusPill, { backgroundColor: bg }]}>
            <DefaultText style={[styles.statusText, { color }]}>{item.status}</DefaultText>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={Colors.light.icon} 
            style={{ marginTop: 4 }} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage
              title="Projects"
              onMenuPress={openDrawer} // ✅ Menu on LEFT
              rightAction={            // ✅ + icon on RIGHT
                <TouchableOpacity
                  onPress={() => router.push('/screens/addProject' as any)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                     <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        }
      >

          {/* Body */}
          <View style={styles.body}>
            <FlatList
              data={dummyProjects}
              keyExtractor={(item) => item.id}
              renderItem={renderProjectItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1},
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

  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  /* ✅ FIXED AVATAR STYLE - This should make ALL avatars rounded */
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,           // Slightly higher for better look
    overflow: 'hidden',         // Very important
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  projectInfo: { flex: 1, minWidth: 0 },
  projectName: {
    fontSize: 15,
    color: Colors.light.text,
  },
  projectValue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  projectValueHighlight: {
    color: Colors.light.primaryDark,
    fontSize: 12,
  },

  projectMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});