// import Colors from '@/constants/theme';
// import { useTheme } from '@/providers/ThemeProvider';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Footer from '../../components/Footer';

// export default function ReportsScreen() {
//   const theme = useTheme();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('reports');

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <Ionicons name="bar-chart-outline" size={20} color={Colors.light.primaryDark} />
//             <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Reports</Text>
//           </View>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* BODY */}
//         <View style={styles.body}>
//           <Text style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>
//             Reports Page
//           </Text>
//         </View>

//         {/* FOOTER */}
//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, backgroundColor: Colors.light.inputBg },
//   header: {
//     height: 64, paddingHorizontal: 16, backgroundColor: Colors.light.background,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     elevation: 3, shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
//   },
//   headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   headerTitle: { fontSize: 20, color: Colors.light.primaryDark },
//   body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   bodyText: { fontSize: 16, color: Colors.light.text },
// });

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
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

export default function ReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('reports');

  const reportCards = [
    {
      id: '1',
      title: 'Project Summary Report',
      icon: 'bar-chart-outline',
      subtitle: 'Overall project performance',
      color: Colors.light.primary,
    },
    {
      id: '2',
      title: 'Expense Report',
      icon: 'cash-outline',
      subtitle: 'Daily / Monthly Expenses',
      color: '#f59e0b',
    },
    {
      id: '3',
      title: 'Labor Attendance Report',
      icon: 'people-outline',
      subtitle: 'Worker attendance & wages',
      color: '#10b981',
    },
    {
      id: '4',
      title: 'Material Usage Report',
      icon: 'cube-outline',
      subtitle: 'Material consumption tracking',
      color: '#8b5cf6',
    },
  ];

  const handleCardPress = (title: string) => {
    // TODO: Navigate to specific report screen later
    console.log(`Opening ${title}`);
    // Example: router.push(`/reports/${title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
     
  <ScreenPage
        title="Reports"
        onMenuPress={openDrawer} // ✅ Menu on LEFT
        rightAction={            // ✅ + icon on RIGHT
          <TouchableOpacity
            onPress={() => router.push('/screens/' as any)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        }
      >
          {/* BODY - Cards */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.body}>
              <DefaultText  style={styles.sectionTitle}>Available Reports</DefaultText >

              {reportCards.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={styles.reportCard}
                  onPress={() => handleCardPress(report.title)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconContainer, { backgroundColor: report.color + '15' }]}>
                    <Ionicons name={report.icon as any} size={32} color={report.color} />
                  </View>

                  <View style={styles.cardContent}>
                    <DefaultText style={styles.reportTitle}>{report.title}</DefaultText >
                    <DefaultText  style={styles.reportSubtitle}>{report.subtitle}</DefaultText >
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* FOOTER */}
          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
       </ScreenPage>
     
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },

  // Header
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

  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: 80 },

  body: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  reportTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },

  reportSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
