// src/screens/OnboardingSwiper.tsx
import React from 'react';
import PagerView from 'react-native-pager-view';
import { View, StyleSheet } from 'react-native';

import OnBoardingPage1 from '../screens/OnBoardingPage1';
import OnBoardingPage2 from '../screens/OnBoardingPage2';
import OnBoardingPage3 from '../screens/OnBoardingPage3';


const OnboardingSwiper = () => {
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1">
        <OnBoardingPage1 />
      </View>
      <View key="2">
        <OnBoardingPage2 />
      </View>
      <View key="3">
        <OnBoardingPage3 />
      </View>
      
    </PagerView>
  );
};

export default OnboardingSwiper;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
