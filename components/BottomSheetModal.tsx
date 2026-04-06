import BottomSheet, {
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface BottomSheetModalProps {
  ref: React.RefObject<BottomSheet>;
  snapPoints: string[];
  onClose?: () => void;
  children: React.ReactNode;
  index?: number;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  keyboardBlurBehavior?: 'none' | 'restore';
  android_keyboardInputMode?: 'adjustPan' | 'adjustResize';
}

const BottomSheetModal = React.forwardRef<BottomSheet, BottomSheetModalProps>(
  ({
    snapPoints,
    onClose,
    children,
    index = -1,
    enablePanDownToClose = true,
    enableDynamicSizing = false,
    keyboardBehavior = 'interactive',
    keyboardBlurBehavior = 'restore',
    android_keyboardInputMode = 'adjustPan',
  }, ref) => {
    const theme = useTheme();

    return (
      <BottomSheet
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode={android_keyboardInputMode}
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.sheetContent}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

BottomSheetModal.displayName = 'BottomSheetModal';

const styles = StyleSheet.create({
  bottomSheetBackground: StyleSheet.create({ dummy: { backgroundColor: '#FFFFFF' } }).dummy as any,
  handleIndicator: StyleSheet.create({ dummy: { backgroundColor: '#E5E7EB', width: 40, height: 4 } }).dummy as any,
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});

export default BottomSheetModal;

