import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/theme';
import { useDrawer } from '../contexts/DrawerContext';

type IconName =
  | 'menu'
  | 'home-outline'
  | 'briefcase-outline'
  | 'swap-horizontal-outline'
  | 'cube-outline'
  | 'person-outline';

interface FooterProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const FooterItem = ({ icon, label, onPress, active }: { icon: IconName; label: string; onPress: () => void; active: boolean }) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color={active ? Colors.light.primaryDark : Colors.light.icon} />
    <Text style={[styles.footerText, active && styles.footerTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function Footer({ activeTab = 'home', onTabChange }: FooterProps) {
  const { openDrawer } = useDrawer();
  const router = useRouter();

  const tabs = [
    { icon: 'home-outline' as IconName, label: 'Home', tab: 'home' },
    { icon: 'briefcase-outline' as IconName, label: 'Project', tab: 'project' },
    { icon: 'swap-horizontal-outline' as IconName, label: 'Transaction', tab: 'transaction' },
    { icon: 'cube-outline' as IconName, label: 'Stock', tab: 'stock' },
    { icon: 'person-outline' as IconName, label: 'Profile', tab: 'profile' },
  ];

  const handleTabPress = (tab: string) => {
    onTabChange?.(tab);
    // Future: navigate to tab screens
  };

  return (
    <View style={styles.footer}>
      {tabs.map(({ icon, label, tab }) => (
        <FooterItem
          key={tab}
          icon={icon}
          label={label}
          active={activeTab === tab}
          onPress={() => handleTabPress(tab)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 3,
    color: Colors.light.icon,
  },
  footerTextActive: {
    color: Colors.light.primaryDark,
  },
});

