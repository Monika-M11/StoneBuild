import Colors from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDrawer } from '../contexts/DrawerContext';

type IconName =
  | 'menu'
  | 'home-outline'
  | 'briefcase-outline'
  | 'swap-horizontal-outline'
  | 'cube-outline'
  | 'person-outline';

interface FooterItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
}

export default function Home() {
  const { openDrawer } = useDrawer();
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleMenuPress = (id: string) => {
    setActiveMenu(id);
    console.log(`Navigating to: ${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={openDrawer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          <View style={{ width: 26 }} />
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            {activeMenu ? `Viewing: ${activeMenu}` : 'Home Screen Content'}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <FooterItem
            icon="home-outline"
            label="Home"
            active={activeTab === 'home'}
            onPress={() => setActiveTab('home')}
          />
          <FooterItem
            icon="briefcase-outline"
            label="Project"
            active={activeTab === 'project'}
            onPress={() => setActiveTab('project')}
          />
          <FooterItem
            icon="swap-horizontal-outline"
            label="Transaction"
            active={activeTab === 'transaction'}
            onPress={() => setActiveTab('transaction')}
          />
          <FooterItem
            icon="cube-outline"
            label="Stock"
            active={activeTab === 'stock'}
            onPress={() => setActiveTab('stock')}
          />
          <FooterItem
            icon="person-outline"
            label="Profile"
            active={activeTab === 'profile'}
            onPress={() => setActiveTab('profile')}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

const FooterItem = ({ icon, label, onPress, active }: FooterItemProps) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons
      name={icon}
      size={22}
      color={active ? Colors.light.primaryDark : Colors.light.icon}
    />
    <Text style={[styles.footerText, active && styles.footerTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.inputBg,
  },
  header: {
    height: 70,
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'SourceSans3_700Bold',
    color: Colors.light.primaryDark,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 16,
    fontFamily: 'SourceSans3_400Regular',
    color: Colors.light.text,
  },
  footer: {
    height: 70,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.light.inputBorder,
  },
  footerItem: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'SourceSans3_400Regular',
    marginTop: 3,
    color: Colors.light.icon,
  },
  footerTextActive: {
    color: Colors.light.primaryDark,
    fontFamily: 'SourceSans3_700Bold',
  },
});
