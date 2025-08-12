import { Camera } from 'react-native-vision-camera';
import { Alert, Linking } from 'react-native';

export const checkCameraPermission = async () => {
  try {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    console.log('Current camera permission status:', cameraPermission);

    // Handle all possible permission statuses
    const authorizedStatuses = ['authorized', 'granted', 'limited'];
    const isAuthorized = authorizedStatuses.includes(cameraPermission);
    console.log(
      'Is camera authorized:',
      isAuthorized,
      'Status:',
      cameraPermission,
    );

    return isAuthorized;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

export const checkAndRequestCameraPermission = async () => {
  try {
    let cameraPermission = await Camera.getCameraPermissionStatus();
    console.log('Initial camera permission status:', cameraPermission);

    if (cameraPermission === 'not-determined') {
      cameraPermission = await Camera.requestCameraPermission();
      console.log('After requesting camera permission:', cameraPermission);
    }

    if (cameraPermission === 'denied') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to use this feature. Would you like to open settings to enable it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    if (cameraPermission === 'restricted') {
      Alert.alert(
        'Permission Restricted',
        'Camera access is restricted on this device.',
      );
      return false;
    }

    // Handle all possible permission statuses
    const authorizedStatuses = ['authorized', 'granted', 'limited'];
    const isAuthorized = authorizedStatuses.includes(cameraPermission);
    console.log(
      'Final permission check - Is authorized:',
      isAuthorized,
      'Status:',
      cameraPermission,
    );
    return isAuthorized;
  } catch (error) {
    console.error('Error checking/requesting camera permission:', error);
    return false;
  }
};
