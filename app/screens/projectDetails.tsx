import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

// Tab Placeholders (unchanged)
function PartyTab() {
  return (
    <View style={tabStyles.center}>
      <Ionicons name="people-outline" size={48} color={Colors.light.primaryDark + '40'} />
      <DefaultText style={tabStyles.title}>Party</DefaultText>
      <DefaultText style={tabStyles.sub}>Party list will appear here</DefaultText>
    </View>
  );
}

function TransactionTab() {
  return (
    <View style={tabStyles.center}>
      <Ionicons name="swap-horizontal-outline" size={48} color={Colors.light.primaryDark + '40'} />
      <DefaultText style={tabStyles.title}>Transaction</DefaultText>
      <DefaultText style={tabStyles.sub}>Transaction records will appear here</DefaultText>
    </View>
  );
}

function SiteTab() {
  return (
    <View style={tabStyles.center}>
      <Ionicons name="location-outline" size={48} color={Colors.light.primaryDark + '40'} />
      <DefaultText style={tabStyles.title}>Site</DefaultText>
      <DefaultText style={tabStyles.sub}>Site details will appear here</DefaultText>
    </View>
  );
}

function TaskTab() {
  return (
    <View style={tabStyles.center}>
      <Ionicons name="checkmark-circle-outline" size={48} color={Colors.light.primaryDark + '40'} />
      <DefaultText style={tabStyles.title}>Task</DefaultText>
      <DefaultText style={tabStyles.sub}>Task list will appear here</DefaultText>
    </View>
  );
}

function AttendanceTab() {
  return (
    <View style={tabStyles.center}>
      <Ionicons name="calendar-outline" size={48} color={Colors.light.primaryDark + '40'} />
      <DefaultText style={tabStyles.title}>Attendance</DefaultText>
      <DefaultText style={tabStyles.sub}>Attendance records will appear here</DefaultText>
    </View>
  );
}

type TabKey = 'party' | 'transaction' | 'site' | 'task' | 'attendance';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'party',       label: 'Party'      },
  { key: 'transaction', label: 'Transaction'},
  { key: 'site',        label: 'Site'       },
  { key: 'task',        label: 'Task'       },
  { key: 'attendance',  label: 'Attendance' },
];

const TAB_COMPONENTS: Record<TabKey, React.FC> = {
  party:       PartyTab,
  transaction: TransactionTab,
  site:        SiteTab,
  task:        TaskTab,
  attendance:  AttendanceTab,
};

export default function ProjectDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id, name, avatarColor = '#3C467B' } = useLocalSearchParams<{
    id: string;
    name: string;
    avatarColor: string;
  }>();

  const [activeTab, setActiveTab] = useState<TabKey>('party');
  const [footerTab, setFooterTab] = useState('projects');

  const ActiveContent = TAB_COMPONENTS[activeTab];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* Header - Only this part should be dark blue */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>

              <DefaultText
                style={[styles.projectName, { fontFamily: theme.fonts.bold }]}
                numberOfLines={1}
              >
                {name ?? 'Project'}
              </DefaultText>

              {/* <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="thumbs-up-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="notifications-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
                </TouchableOpacity>
              </View> */}
            </View>

            {/* Tab Bar */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBar}
            >
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.7}
                >
                  <DefaultText
                    style={[
                      styles.tabLabel,
                      activeTab === tab.key && styles.tabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </DefaultText>
                  {activeTab === tab.key && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Body - White / Light background */}
          <View style={styles.body}>
            <ActiveContent />
          </View>

          <Footer activeTab={footerTab} onTabChange={setFooterTab} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.light.background   // ← Fixed: Now white
  },
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.inputBg 
  },

  // Dark header only
  header: {
    backgroundColor: Colors.light.primaryDark,
    paddingTop: 15,
    paddingBottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingBottom: 10,
    gap: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    // backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectName: {
    flex: 1,
    fontSize: 17,
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#fff',
  },

  body: { flex: 1, backgroundColor: Colors.light.background },
});

// Tab placeholder styles
const tabStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.primaryDark,
    marginTop: 8,
  },
  sub: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});