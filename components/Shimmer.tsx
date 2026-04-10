import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTheme } from '../providers/ThemeProvider';

export default function Shimmer() {
  const theme = useTheme();

  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.inputBorder}
      highlightColor={theme.colors.inputBg}
    >
      <View style={{ padding: 16 }}>
        
        {/* Title */}
        <View style={{ width: '60%', height: 20, borderRadius: 6 }} />

        {/* Space */}
        <View style={{ height: 10 }} />

        {/* Card */}
        <View style={{ width: '100%', height: 120, borderRadius: 12 }} />

        {/* Space */}
        <View style={{ height: 10 }} />

        {/* Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '48%', height: 80, borderRadius: 10 }} />
          <View style={{ width: '48%', height: 80, borderRadius: 10 }} />
        </View>

      </View>
    </SkeletonPlaceholder>
  );
}