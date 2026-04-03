import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/theme';

type IconName = 'menu' | 'home-outline' | 'briefcase-outline' | 'swap-horizontal-outline' | 'cube-outline' | 'person-outline';

interface FooterItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export default function Home() {
  const handleMenuPress = () => {
    console.log('Menu clicked');
  };

  const handleFooterPress = (name: string) => {
    console.log(`${name} pressed`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          {/* Empty view for alignment */}
          <View style={{ width: 26 }} />
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>Home Screen Content</Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <FooterItem icon="home-outline" label="Home" onPress={() => handleFooterPress('Home')} />
          <FooterItem icon="briefcase-outline" label="Project" onPress={() => handleFooterPress('Project')} />
          <FooterItem icon="swap-horizontal-outline" label="Transaction" onPress={() => handleFooterPress('Transaction')} />
          <FooterItem icon="cube-outline" label="Stock" onPress={() => handleFooterPress('Stock')} />
          <FooterItem icon="person-outline" label="Profile" onPress={() => handleFooterPress('Profile')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const FooterItem = ({ icon, label, onPress }: FooterItemProps) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={Colors.icon} />
    <Text style={styles.footerText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.inputBg,
  },
  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'SourceSans3_700Bold',
    color: Colors.primaryDark,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 16,
    fontFamily: 'SourceSans3_400Regular',
    color: Colors.text,
  },
  footer: {
    height: 70,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'SourceSans3_400Regular',
    marginTop: 2,
    color: Colors.primary,
  },
});
