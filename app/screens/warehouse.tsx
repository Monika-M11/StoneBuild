import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import ScreenPage from '@/components/ScreenPage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Warehouse = {
  id: string;
  name: string;
  location: string;
  incharge: string;
};

export default function WarehouseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('warehouse');
const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

  // const dummyWarehouses = [
  //   { id: '1', name: 'Main Warehouse - Coimbatore', location: 'Coimbatore', incharge: 'Ramesh Kumar' },
  //   { id: '2', name: 'North Zone Warehouse', location: 'Chennai', incharge: 'Priya Sharma' },
  //   { id: '3', name: 'South Storage Yard', location: 'Madurai', incharge: 'Karthik Raj' },
  // ];

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500); // same delay as contact list

  return () => clearTimeout(timer);
}, [searchQuery]);

useEffect(() => {
  fetchWarehouses(1, false, debouncedSearch);
}, [debouncedSearch]);
  const renderWarehouseItem = ({ item }: any) => (
    <TouchableOpacity style={styles.warehouseItem} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name="business-outline" size={24} color={Colors.light.primaryDark} />
      </View>
      <View style={styles.warehouseInfo}>
        <DefaultText 
          style={[styles.warehouseName, { fontFamily: theme.fonts.bold }]}
        >
          {item.name}
        </DefaultText>
        <DefaultText style={styles.warehouseLocation}>
          {item.location}
        </DefaultText>
        <DefaultText style={styles.warehouseIncharge}>
          Incharge: {item.incharge}
        </DefaultText>
      </View>
    </TouchableOpacity>
  );

  const fetchWarehouses = async (
  pageNumber: number,
  isLoadMore = false,
  search = ''
) => {
  try {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setWarehouses([]);
      setPage(1);
    }

    const response = await postApi(ENDPOINTS.WAREHOUSE_LIST, {
      page: pageNumber,
      count: 10,
      search: search,
    });

    const apiData = response?.data;
    const apiList = apiData?.warehouses || [];

   const mappedList: Warehouse[] = apiList.map((item: any) => ({
  id: item.id.toString(),
  name: item.warehouseName,
  location: item.location,
  incharge: item.inchargeName,
}));

    // ✅ FIXED SORT LOGIC
    const query = search.trim().toLowerCase();

    const getPriority = (name: string) => {
      const n = name.trim().toLowerCase();

      if (!query) return 3;
      if (n.startsWith(query)) return 1;
      if (n.includes(query)) return 2;
      return 3;
    };

    const sortedList = mappedList.sort((a, b) => 
  getPriority(a.name) - getPriority(b.name)
);

    if (isLoadMore) {
      setWarehouses((prev) => [...prev, ...sortedList]);
    } else {
      setWarehouses(sortedList);
    }

    setHasMore(!!apiData?.has_more);
  } catch (err) {
    console.log('WAREHOUSE API ERROR:', err);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};
useFocusEffect(
  useCallback(() => {
    fetchWarehouses(1, false, '');
  }, [])
);

const loadMore = () => {
  if (loading || loadingMore || !hasMore) return;

  const nextPage = page + 1;
  setPage(nextPage);

  fetchWarehouses(nextPage, true, debouncedSearch);
};

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <ScreenPage
        title="Warehouse"
        onMenuPress={openDrawer} // ✅ Menu on LEFT
        rightAction={            // ✅ + icon on RIGHT
          <TouchableOpacity
            onPress={() => router.push('/screens/addWarehouse' as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add" size={24} color={Colors.light.background} />
          </TouchableOpacity>
        }
      >
  <View style={styles.searchContainer}>
  <Ionicons
    name="search"
    size={18}
    color="#6b7280"
    style={{ marginRight: 6 }}
  />

  <TextInput
    placeholder="Search warehouse..."
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
          {/* Body */}
          <View style={styles.body}>
  {loading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={Colors.light.primaryDark} />
    </View>
  ) : (
    <FlatList
      data={warehouses}
      keyExtractor={(item) => item.id}
      renderItem={renderWarehouseItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            size="small"
            color={Colors.light.primaryDark}
            style={{ marginVertical: 16 }}
          />
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
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

  warehouseItem: {
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
  warehouseInfo: { flex: 1 },
  warehouseName: { fontSize: 16, color: Colors.light.text },
  warehouseLocation: { fontSize: 13, color: '#2563eb', marginTop: 2 },
  warehouseIncharge: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  loaderContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
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
},
});