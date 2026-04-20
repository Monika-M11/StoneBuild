// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import ScreenPage from '@/components/ScreenPage';
// import Footer from '../../components/Footer';
// import Colors from '../../constants/theme';
// import { useDrawer } from '../../contexts/DrawerContext';
// import { DefaultText, useTheme } from '../../providers/ThemeProvider';

// export default function ExpenseScreen() {
//   const theme = useTheme();
//   const router = useRouter();
//   const { openDrawer } = useDrawer();
//   const [activeTab, setActiveTab] = useState('expense');

//   const dummyExpenses = [
//     { 
//       id: '1', 
//       date: '08/04/2026', 
//       category: 'Fuel', 
//       amount: '2450', 
//       mode: 'Cash' 
//     },
//     { 
//       id: '2', 
//       date: '07/04/2026', 
//       category: 'Maintenance', 
//       amount: '12500', 
//       mode: 'Bank Transfer' 
//     },
//     { 
//       id: '3', 
//       date: '06/04/2026', 
//       category: 'Salary', 
//       amount: '45000', 
//       mode: 'Bank Transfer' 
//     },
//     { 
//       id: '4', 
//       date: '05/04/2026', 
//       category: 'Travel', 
//       amount: '3200', 
//       mode: 'Cash' 
//     },
//   ];

//   const renderExpenseItem = ({ item }: any) => (
//     <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
//       <View style={styles.iconBox}>
//         <Ionicons name="wallet-outline" size={24} color={Colors.light.primaryDark} />
//       </View>
//       <View style={styles.expenseInfo}>
//         <DefaultText style={[styles.expenseCategory, { fontFamily: theme.fonts.bold }]}>
//           {item.category}
//         </DefaultText>
//         <DefaultText style={styles.expenseDate}>{item.date}</DefaultText>
//       </View>
//       <View style={styles.amountContainer}>
//         <DefaultText style={styles.amount}>₹{item.amount}</DefaultText>
//         <DefaultText style={styles.mode}>{item.mode}</DefaultText>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
     
// <ScreenPage
//         title="Expenses"
//         onMenuPress={openDrawer} // ✅ Menu on LEFT
//         rightAction={            // ✅ + icon on RIGHT
//           <TouchableOpacity
//             onPress={() => router.push('/screens/addExpenses' as any)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity> 
//         }
//       >
//           {/* Body */}
//           <View style={styles.body}>
//             <FlatList
//               data={dummyExpenses}
//               keyExtractor={(item) => item.id}
//               renderItem={renderExpenseItem}
//               contentContainerStyle={styles.listContent}
//               showsVerticalScrollIndicator={false}
//             />
//           </View>
//           <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </ScreenPage>
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
//   headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

//   body: { flex: 1 },
//   listContent: { padding: 16, paddingBottom: 80 },

//   expenseItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   iconBox: {
//     width: 52,
//     height: 52,
//     borderRadius: 12,
//     backgroundColor: Colors.light.primaryDark + '12',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   expenseInfo: { flex: 1 },
//   expenseCategory: { fontSize: 16, color: Colors.light.text },
//   expenseDate: { fontSize: 13, color: '#6b7280', marginTop: 4 },

//   amountContainer: { alignItems: 'flex-end' },
//   amount: { 
//     fontSize: 17, 
//     fontWeight: '600', 
//     color: Colors.light.primaryDark 
//   },
//   mode: { 
//     fontSize: 12, 
//     color: '#888', 
//     marginTop: 2 
//   },
// });


import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import ScreenPage from '@/components/ScreenPage';
import { useToast } from '@/providers/ToastProvider';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Expense = {
  id: string;
  date: string;
  category: string;
  amount: string;
  mode: string;
  // Add more fields from your API if needed
};

export default function ExpenseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('expense');

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600); // 600ms debounce (faster than contacts)

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Expenses Function (Same pattern as Contacts)
  const fetchExpenses = async (
    pageNumber: number,
    isLoadMore = false,
    searchQuery = ''
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setExpenses([]);
        setPage(1);
      }

      const response = await postApi(ENDPOINTS.EXPENSE_LIST, {
        page: pageNumber,
        count: 10,
        search: searchQuery,        // Send search to backend
      });

      const apiData = response?.data;
      const apiList = apiData?.expenses || apiData?.data || []; // Adjust according to your API response

      const mappedList: Expense[] = apiList.map((item: any) => ({
        id: item.id?.toString() || '',
        date: item.date || item.expenseDate || '',
        category: item.category || item.expenseCategory || '',
        amount: item.amount?.toString() || '',
        mode: item.mode || item.paymentMode || '',
      }));

      // Client-side search + sorting (same logic as Contacts)
      const sortedList = mappedList.sort((a, b) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return 0;

        const aCat = a.category.toLowerCase();
        const bCat = b.category.toLowerCase();

        // Priority 1: Starts with
        if (aCat.startsWith(query) && !bCat.startsWith(query)) return -1;
        if (!aCat.startsWith(query) && bCat.startsWith(query)) return 1;

        // Priority 2: Includes
        if (aCat.includes(query) && !bCat.includes(query)) return -1;
        if (!aCat.includes(query) && bCat.includes(query)) return 1;

        return 0;
      });

      if (isLoadMore) {
        setExpenses((prev) => [...prev, ...sortedList]);
      } else {
        setExpenses(sortedList);
      }

      setHasMore(!!apiData?.has_more || !!apiData?.hasMore);
    } catch (err: any) {
      console.error('EXPENSE API ERROR:', err);
      showToast('Error', 'Failed to load expenses', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial Load
  useFocusEffect(
    useCallback(() => {
      fetchExpenses(1, false, '');
    }, [])
  );

  // Search Trigger
  useEffect(() => {
    if (debouncedSearch.length > 0) {
      fetchExpenses(1, false, debouncedSearch);
    } else if (debouncedSearch === '') {
      fetchExpenses(1, false, '');
    }
  }, [debouncedSearch]);

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchExpenses(nextPage, true, debouncedSearch);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name="wallet-outline" size={24} color={Colors.light.primaryDark} />
      </View>
      <View style={styles.expenseInfo}>
        <DefaultText style={[styles.expenseCategory, { fontFamily: theme.fonts.bold }]}>
          {item.category}
        </DefaultText>
        <DefaultText style={styles.expenseDate}>{item.date}</DefaultText>
      </View>
      <View style={styles.amountContainer}>
        <DefaultText style={styles.amount}>₹{item.amount}</DefaultText>
        <DefaultText style={styles.mode}>{item.mode}</DefaultText>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage
        title="Expenses"
        onMenuPress={openDrawer}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/screens/addExpenses' as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add" size={24} color={Colors.light.background} />
          </TouchableOpacity>
        }
      >
        {/* Search Bar - Same as Contacts */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search expenses by category..."
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Body */}
        <View style={styles.body}>
          {loading ? (
            <Loader />
          ) : (
            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id}
              renderItem={renderExpenseItem}
              onEndReached={loadMore}
              onEndReachedThreshold={0.6}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={loadingMore ? <Loader /> : null}
              ListEmptyComponent={
                !loading && expenses.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <DefaultText style={styles.emptyText}>
                      No expenses found
                    </DefaultText>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },

  listContent: {
    padding: 16,
    paddingBottom: 80,
  },

  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  expenseInfo: { flex: 1 },
  expenseCategory: { fontSize: 16, color: Colors.light.text },
  expenseDate: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  amountContainer: { alignItems: 'flex-end' },
  amount: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.primaryDark,
  },
  mode: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
  },
});