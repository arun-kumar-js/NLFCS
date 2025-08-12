import { StyleSheet, Text, View, Image ,TouchableOpacity} from 'react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnBoardingPage3 = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable
        onPress={() => navigation.navigate('Timer')}
        style={styles.circleBackground}
      >
        <Image
          source={require('../assets/images/Circle2.png')}
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
          <TouchableOpacity onPress={() => navigation.navigate("Timer")}>
                       <Text style={styles.skipText}>Skip</Text>
                     </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/Group.png')}
              style={styles.image}
            />
          </View>

          <View style={{ alignItems: 'flex-start', paddingHorizontal: s(20) }}>
            <Text style={styles.title}>Make your final click</Text>
            <Text style={styles.description}>
              Select your preferred candidates {'\n'}carefully. Once you submit
              your
              {'\n'}
              votes, they cannot be changed!
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
        source={require('../assets/images/right3.png')}
        style={styles.rightPanelImage}
      />
    </SafeAreaView>
  );
};

export default OnBoardingPage3;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFADC4',
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
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(15),
  },
  image: {
    width: s(270),
    height: vs(270),
    resizeMode: 'contain',
    marginBottom: vs(45),
    marginTop: vs(20),
  },
  title: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
    marginBottom: vs(20),

    paddingLeft: 20,
  },
  description: {
    fontSize: ms(14),
    color: '#666666',
    textAlign: 'left',
    paddingLeft: 20,
    fontFamily: 'Montserrat',
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
