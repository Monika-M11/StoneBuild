import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetModalProps {
  snapPoints?: string[];
  onClose?: () => void;
  children: React.ReactNode;
}

const BottomSheetModal = React.forwardRef<any, BottomSheetModalProps>(
  (props, ref) => {
    const { snapPoints = ['50%', '92%'], onClose, children } = props;

    // bottomInset 
    const insets = useSafeAreaInsets();

    //Grey backdrop
    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        // Lifts above nav
        bottomInset={insets.bottom}
        backdropComponent={renderBackdrop}
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        style={styles.sheetShadow}
      >
        <View style={styles.sheetContent}>
          {children}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: { backgroundColor: '#FFFFFF' } as ViewStyle,
  handleIndicator: {
    backgroundColor: '#E5E7EB',
    width: 40,
    height: 4,
  } as ViewStyle,
  sheetContent: {
    flex: 1,
    overflow: 'auto',
  },
  // Optional: keeps shadow visible when sheet is floating above nav bar
  sheetShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  } as ViewStyle,
});

export default BottomSheetModal;
