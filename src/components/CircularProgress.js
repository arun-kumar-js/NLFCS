import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CircularProgress = ({
  size = 250,
  width = 14,
  fill = 0,
  tintColor = '#8e2de2',
  backgroundColor = '#e6e6fa',
  children,
}) => {
  // Ensure fill is between 0 and 100
  const progress = Math.max(0, Math.min(100, fill));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: width,
            borderColor: backgroundColor,
            backgroundColor: 'transparent',
          },
        ]}
      />

      {/* Simple progress indicator */}
      <View
        style={[
          styles.progressIndicator,
          {
            width: size - width * 2,
            height: size - width * 2,
            borderRadius: (size - width * 2) / 2,
            backgroundColor: tintColor,
            opacity: progress / 100,
          },
        ]}
      />

      {/* Content */}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressIndicator: {
    position: 'absolute',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgress;
