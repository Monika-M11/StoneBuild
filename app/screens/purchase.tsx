// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import ScreenPage from '@/components/ScreenPage';
// import Footer from '../../components/Footer';
// import Colors from '../../constants/theme';
// import { useDrawer } from '../../contexts/DrawerContext';
// import { useTheme } from '../../providers/ThemeProvider';

// export default function PurchaseScreen() {
//   const theme = useTheme();
//   const router = useRouter();
//   const { openDrawer } = useDrawer();
//   const [activeTab, setActiveTab] = useState('purchase');

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//        <ScreenPage
//         title="Purchase"
//         onMenuPress={openDrawer} // ✅ Menu on LEFT
//         rightAction={            // ✅ + icon on RIGHT
//           <TouchableOpacity
//             onPress={() => router.push('/screens/addPurchase' as any)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity>
//         }
//       >


//           {/* BODY */}
//           <View style={styles.body}>
//             <Text style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>
//               Purchase Page
//             </Text>
//           </View>

//           {/* FOOTER */}
//           <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//         </ScreenPage>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, backgroundColor: Colors.light.inputBg },

//   header: {
//     height: 70,
//     paddingHorizontal: 16,
//     backgroundColor: Colors.light.background,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//   },
//   headerCenter: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   headerTitle: { 
//     fontSize: 20, 
//     color: Colors.light.primaryDark 
//   },

//   body: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   bodyText: { 
//     fontSize: 16, 
//     color: Colors.light.text 
//   },
// });


import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ScreenPage from '@/components/ScreenPage';
import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Purchase = {
  id: string;
  supplier: string;
  date: string;
  amount: string;
};

export default function PurchaseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('purchase');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 📡 fetch on search change
  useEffect(() => {
    fetchPurchases(debouncedSearch);
  }, [debouncedSearch]);

  const fetchPurchases = async (search = '') => {
    try {
      setLoading(true);

      const response = await postApi(ENDPOINTS.PURCHASE_LIST, {
        page: 1,
        count: 10,
        search,
      });

      const apiList = response?.data?.purchases || [];

      const mapped: Purchase[] = apiList.map((item: any) => ({
        id: item.id?.toString(),
        supplier: item.contactName || '',
        date: item.orderDate || '',
        amount: `₹ ${item.totalAmount || 0}`,
      }));

      setPurchases(mapped);
    } catch (error) {
      console.log('PURCHASE API ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Purchase }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="cart-outline" size={22} color={Colors.light.primaryDark} />
      </View>

      <View style={{ flex: 1 }}>
        <DefaultText style={[styles.title, { fontFamily: theme.fonts.bold }]}>
          {item.supplier}
        </DefaultText>

        <DefaultText style={styles.subtitle}>
          Date: {item.date}
        </DefaultText>

        <DefaultText style={styles.amount}>
          {item.amount}
        </DefaultText>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage
        title="Purchase"
        onMenuPress={openDrawer}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/screens/addPurchase' as any)}
          >
            <Ionicons name="add" size={24} color={Colors.light.background} />
          </TouchableOpacity>
        }
      >
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6b7280" />

          <TextInput
            placeholder="Search purchase..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
          />

          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* LIST */}
        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.light.primaryDark} />
          ) : (
            <FlatList
              data={purchases}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 42,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
  },

  listContent: {
    padding: 16,
    paddingBottom: 80,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    color: Colors.light.text,
  },

  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primaryDark,
    marginTop: 4,
  },
});