import Colors from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawer } from '../contexts/DrawerContext';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.72;

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'contacts',   label: 'Contacts',   icon: 'people-outline' },
  { id: 'ledger',     label: 'Ledger',     icon: 'book-outline' },
  { id: 'warehouse',  label: 'Warehouse',  icon: 'business-outline' },
  { id: 'equipments', label: 'Equipments', icon: 'construct-outline' },
  { id: 'payment',    label: 'Payment',    icon: 'card-outline' },
  { id: 'receipt',    label: 'Receipt',    icon: 'receipt-outline' },
  { id: 'expense',    label: 'Expense',    icon: 'wallet-outline' },
  { id: 'reports',    label: 'Reports',    icon: 'bar-chart-outline' },
  { id: 'materials',  label: 'Materials',  icon: 'layers-outline' },
  { id: 'purchase',   label: 'Purchase',   icon: 'cart-outline' },
];

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  onMenuPress: (id: string) => void;
  activeMenu?: string;
}

export default function SideDrawer({
  visible,
  onClose,
  onMenuPress,
  activeMenu,
}: SideDrawerProps) {
  const insets = useSafeAreaInsets();
  const { openDrawer } = useDrawer();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const previewTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Swipe right-to-left to close gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dx < -10 && Math.abs(gestureState.dy) < 30,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -60 || gestureState.vx < -0.5) {
          onClose();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  // Swipe left-to-right to open gesture
  const openPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !visible && gestureState.dx > 10 && Math.abs(gestureState.dy) < 30,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          previewTranslateX.setValue(Math.min(gestureState.dx, DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 60 || gestureState.vx > 0.5) {
          openDrawer();
        } else {
          Animated.spring(previewTranslateX, {
            toValue: -DRAWER_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Open gesture preview layer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: previewTranslateX }],
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 16,
          },
        ]}
        {...openPanResponder.panHandlers}
      />

      {/* Dim overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 16,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* App brand strip */}
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="flash" size={18} color="#fff" />
          </View>
          <Text style={styles.brandText}>Stonebuild</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu items */}
        {MENU_ITEMS.map((item, index) => {
          const isActive = activeMenu === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => {
                onMenuPress(item.id);
                onClose();
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Ionicons
                  name={item.icon as any}
                  size={19}
                  color={isActive ? '#fff' : Colors.light.icon}
                />
              </View>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    paddingHorizontal: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 18,
    color: Colors.light.primaryDark,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.inputBorder + '33',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: Colors.light.primaryDark,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.light.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuLabel: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 15,
    color: Colors.light.text,
    letterSpacing: 0.1,
  },
  menuLabelActive: {
    color: '#fff',
    fontFamily: 'SourceSans3_700Bold',
  },
});
