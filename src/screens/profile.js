import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';

const profile = () => {
  const user = useSelector(state => state.userData?.otpVerificationResponse?.[0]);
  const navigation = useNavigation();
  console.log(user)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.card}>
        {user?.image && (
          <Image
            source={{ uri: `https://spider.org.in/nlfcs/uploads/${user?.image}` }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>IC Number: </Text>
          {user?.ic_number}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Mobile: </Text>
          {user?.mobile}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Gender: </Text>
          {user?.gender}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Address: </Text>
          {user?.address}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Post Code: </Text>
          {user?.post_code}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>State: </Text>
          {user?.state}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Region ID: </Text>
          {user?.region_id}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#7555CE',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    alignSelf: 'stretch',
    backgroundColor: '#f9f9fc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  label: {
    color: '#888',
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});