import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/theme';

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

const FooterItem = ({ 
  icon, 
  label, 
  onPress, 
  active 
}: { 
  icon: IconName; 
  label: string; 
  onPress: () => void; 
  active: boolean 
}) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons 
      name={icon} 
      size={24} 
      color={active ? Colors.light.background : Colors.light.icon} 
    />
    <Text style={[styles.footerText, active && styles.footerTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Footer({ activeTab = 'home', onTabChange }: FooterProps) {
  const router = useRouter();

  const tabs = [
    { 
      icon: 'home-outline' as IconName, 
      label: 'Home', 
      tab: 'home',
      path: '/home' 
    },
    { 
      icon: 'briefcase-outline' as IconName, 
      label: 'Project', 
      tab: 'project',
      path: '/screens/Projects' 
    },
    { 
      icon: 'swap-horizontal-outline' as IconName, 
      label: 'Transaction', 
      tab: 'transaction',
      path: '/transaction' 
    },
    { 
      icon: 'cube-outline' as IconName, 
      label: 'Stock', 
      tab: 'stock',
      path: '/stock' 
    },
    { 
      icon: 'person-outline' as IconName, 
      label: 'Profile', 
      tab: 'profile',
      path: '/profileScreen'          // Change to '/screens/profile' if needed
    },
  ];

  const handleTabPress = (tab: string, path: string) => {
    onTabChange?.(tab);
    router.push(path as any);
  };

  return (
    <View style={styles.footer}>
      {tabs.map(({ icon, label, tab, path }) => (
        <FooterItem
          key={tab}
          icon={icon}
          label={label}
          active={activeTab === tab}
          onPress={() => handleTabPress(tab, path)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 70,
    // backgroundColor: Colors.light.background,
     backgroundColor: Colors.light.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',        // Light border like in image
    // NO shadow / elevation
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 10,
    marginTop: 4,
    color: Colors.light.icon,
    fontWeight: '500',
  },
  footerTextActive: {
    // color: Colors.light.primaryDark,
    color: Colors.light.background,
    fontWeight: '600',
  },
});