import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnBoardingPage2 = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable
        onPress={() => navigation.navigate('OnBoardingPage3')}
        style={styles.circleBackground}
      >
        <Image
          source={require('../assets/images/circle.png')}
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
      </Pressable>
      <View style={styles.mainContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
                 <Image
                        source={require('../assets/images/backarrow.png')}
                        style={{ width: 24, height: 24 }}
                      />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Timer')}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/Time.png')}
              style={styles.image}
            />
          </View>

          <View style={{ alignItems: 'flex-start', paddingHorizontal: s(20) }}>
            <Text style={styles.title}>Cast your Vote For Time</Text>
            <Text style={styles.description}>
              Submit your vote before the deadline don't mis your chance for
              voting
            </Text>
          </View>

          <View style={styles.pagination}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
          </View>
        </View>
      </View>
      <Image
        source={require('../assets/images/Right2.png')}
        style={styles.rightPanelImage}
      />
    </SafeAreaView>
  );
};

export default OnBoardingPage2;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#98DFD5',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(20),
    paddingTop: vs(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //marginBottom: vs(10),
  },
  rightPanelImage: {
    position: 'absolute',
    bottom: vs(17),
    right: 0,
    height: '110%',
    width: s(80),
    resizeMode: 'cover',
    zIndex: 2,
  },
  backArrow: {
    fontSize: ms(24),
    color: '#000',
  },
  skipText: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#333333',
    zIndex: 100,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(15),
  },
  image: {
    width: s(318),
    height: vs(309),
    resizeMode: 'contain',
    marginBottom: vs(10),
  },
  title: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: vs(50),
    width: '75%',
  },
  description: {
    fontSize: ms(14),
    color: '#666666',
    textAlign: 'left',

    width: '79%',
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'start',
    marginTop: vs(5),
    left: s(16),
  },
  activeDot: {
    width: s(8),
    height: vs(8),
    borderRadius: ms(2),
    backgroundColor: '#FFADC4',
    marginHorizontal: s(4),
  },
  inactiveDot: {
    width: s(8),
    height: vs(8),
    borderRadius: ms(2),
    borderWidth: 1,
    borderColor: '#FFADC4',
    marginHorizontal: s(4),
  },
  circleBackground: {
    position: 'absolute',
    bottom: '31%',
    right: '3%',
    width: s(55),
    height: vs(55),
    resizeMode: 'contain',
    zIndex: 4,
  },
});
