import React, { useEffect, useState, useRef } from 'react';
import RNFS from 'react-native-fs';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  Linking,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import {
  checkAndRequestCameraPermission,
  checkCameraPermission,
} from '../permission/CameraPermissionHandler';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import {
  extractNumbersFromImage,
  formatExtractedNumbers,
  testMLKitIntegration,
} from '../utils/ocrHelperRN';

const CameraScreen = ({ route, navigation }) => {
  const { icNumber: icParam } = route?.params || {};
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedNumbers, setExtractedNumbers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [icNumber, setIcNumber] = useState();
  const rawicnumber = extractedNumbers[0]

 
  const devices = useCameraDevices();

  const device =
    devices.back ||
    (devices && Object.values(devices).find(d => d && d.position === 'back'));
  const cameraRef = useRef(null);

  console.log('Camera devices:', devices);
  console.log('Back device:', device);
  console.log('Has permission:', hasPermission);
  console.log(
    'Available device positions:',
    devices
      ? Object.keys(devices).map(key => ({
          key,
          position: devices[key]?.position,
        }))
      : 'No devices',
  );

  useEffect(() => {
    // Request camera permission using react-native-permissions on mount
    const requestCameraPermission = async () => {
      try {
        const result = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA
        );

        if (result === RESULTS.GRANTED) {
          console.log('Camera permission granted');
          setHasPermission(true);
        } else if (result === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Blocked',
            'Camera permission is permanently denied. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => openSettings(),
              },
            ]
          );
          setHasPermission(false);
        } else {
          console.log('Camera permission denied or unavailable');
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
      }
      // Optionally still check MLKit integration
      try {
        const mlKitAvailable = await testMLKitIntegration();
        console.log('ML Kit integration test result:', mlKitAvailable);
      } catch (error) {
        console.error('Error testing MLKit integration:', error);
      }
    };
    requestCameraPermission();
    if (icParam) {
      setIcNumber(icParam);
      console.log('IC Number from params:', icParam);
    }
  }, []);

  // Debug device detection
  useEffect(() => {
    if (devices && Object.keys(devices).length > 0) {
      console.log('Devices detected:', Object.keys(devices));
      console.log('Device details:', devices);
    }
  }, [devices]);

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        console.log('Photo taken:', photo.path);
        // Save to app's temporary cache directory
        const tempPath = `${RNFS.CachesDirectoryPath}/IC_${Date.now()}.jpg`;
        await RNFS.copyFile(photo.path, tempPath);
        console.log('📂 Saved to temp storage:', tempPath);
        let fileUri = tempPath.startsWith('file://') ? tempPath : `file://${tempPath}`;
        // Ensure the URI is in correct format (file:///...) and file exists
        if (!fileUri.startsWith('file:///')) {
          fileUri = fileUri.replace('file://', 'file:///');
        }
        const exists = await RNFS.exists(fileUri.replace('file://', ''));
        if (!exists) {
          console.error("❌ Temp file does not exist at", fileUri);
          Alert.alert('Error', 'Temporary image file not found.');
          setIsProcessing(false);
          return;
        }
        setCapturedImage(fileUri);
        await processImageForNumbers(fileUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImageForNumbers = async imagePath => {
    try {
      console.log('Starting image processing for IC number extraction...');
      console.log('Image path:', imagePath);
      // Sanitize the image path before calling OCR
      const safePath = imagePath.trim().replace(/ /g, '%20');
      const result = await extractNumbersFromImage(safePath);

      console.log('OCR processing result:', result);

      if (result.success) {
        const formattedNumbers = formatExtractedNumbers(result.numbers);
        setExtractedNumbers(formattedNumbers);

        const extractedIC = formattedNumbers?.[0] || '';
        const normalize = str =>
          typeof str === 'string' || typeof str === 'number'
            ? str.toString().replace(/\D/g, '').trim().normalize('NFKC')
            : '';
        const icFromParam = icParam || icNumber;
        const cleanedExtractedIC = normalize(extractedIC);
        const cleanedIcWithoutDashes = normalize(icFromParam);

        console.log('Extracted IC:', cleanedExtractedIC);
        console.log('IC from Params:', cleanedIcWithoutDashes);

        if (!cleanedIcWithoutDashes || !cleanedExtractedIC) {
          Alert.alert('Error', 'Missing IC number for comparison.');
          return;
        }
console.log(cleanedExtractedIC);
        if (cleanedExtractedIC === cleanedIcWithoutDashes) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('✅ IC Matched. Proceeding...', ToastAndroid.SHORT);
          } else {
            Alert.alert('✅ IC Matched', 'Proceeding...');
          }
          setTimeout(() => {
            navigation.navigate('MobileNumVerify', {
              icNumber: cleanedExtractedIC,
            });
          }, 2000);
        } else {
          console.log('❌ IC Mismatch');
          //Alert.alert('Mismatch', 'IC number does not match. Please try again.');
          setCapturedImage(null); // Show retake button by reverting to camera view
          setExtractedNumbers([]);
        }
      } else {
        Alert.alert('Error', 'Failed to extract numbers from the image.');
      }
    } catch (error) {
      //console.error('Error processing image:', error);
     // Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };
   

  const toggleCamera = () => {
    setIsActive(!isActive);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setExtractedNumbers([]);
  };

  const getNumberLabel = (index, number) => {
    const labels = ['Ic Number'];
    return labels[index] || `Number ${index + 1}`;
  };

  // Handle Submit: compare IC numbers and navigate or alert
  const handleSubmit = () => {
    const normalize = str =>
      typeof str === 'string' || typeof str === 'number'
        ? str.toString().replace(/\D/g, '').trim().normalize('NFKC')
        : '';

    const extractedRaw = extractedNumbers?.[0];
    if (!extractedRaw) {
      Alert.alert('Error', 'No IC number extracted from image.');
      return;
    }

    const extractedIC = normalize(extractedRaw);
    const paramIC = normalize(icParam || icNumber);

    console.log('Extracted IC:', extractedIC);
    console.log('Param IC:', paramIC);
//console.log('OCR processing result:', result.number[0]);
    if (!paramIC) {
      Alert.alert('Error', 'IC number from params is missing.');
      return;
    }

    if (extractedIC === paramIC) {
      navigation.navigate('MobileNumberVerify', { icNumber: extractedIC });
    } else {
      Alert.alert('Mismatch', 'IC number does not match. Please try again.');
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await checkAndRequestCameraPermission();
      console.log('Camera permission granted:', granted);
      setHasPermission(granted);
    } catch (error) {
      console.error('Error requesting permission:', error);
      setHasPermission(false);
    }
  };


  const retryCamera = () => {
    setHasPermission(false);
    setTimeout(() => {
      requestPermission();
    }, 100);
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.text}>
            Camera permission is required to use this feature.
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 10, backgroundColor: '#FF9500' }]}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.buttonText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.text}>
            {hasPermission
              ? 'No camera device found. Please check your device.'
              : 'Loading camera...'}
          </Text>
          {hasPermission && devices && (
            <>
              <Text style={styles.subText}>
                Available devices: {Object.keys(devices).join(', ')}
              </Text>
              <Text style={styles.subText}>
                Device details:{' '}
                {JSON.stringify(
                  Object.keys(devices).map(key => ({
                    key,
                    position: devices[key]?.position,
                    name: devices[key]?.name,
                  })),
                )}
              </Text>
              <TouchableOpacity style={styles.button} onPress={retryCamera}>
                <Text style={styles.buttonText}>Retry Camera</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {capturedImage ? (
        // Show captured image and extracted numbers
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.capturedImage}
          />

          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>IC Number Extracted:</Text>
            {extractedNumbers.length > 0 ? (
              <View style={styles.icNumberContainer}>
                <Text style={styles.icNumberLabel}>12-Digit IC Number:</Text>
                <Text style={styles.icNumberText}>
                  {extractedNumbers[0]
                    .toString()
                    .replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3')}
                </Text>
                <Text style={styles.icNumberRaw}>
                  Raw: {extractedNumbers[0]}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.imageControls}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          
          </View>
        </View>
      ) : (
        // Show camera view
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            photo={true}
          />

          {/* Camera Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isProcessing && styles.disabledButton,
              ]}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleCamera}
            >
              <Text style={styles.toggleButtonText}>
                {isActive ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <View style={styles.processingOverlay}>
              <Text style={styles.processingText}>Processing image...</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ccc',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  toggleButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  capturedImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  numbersContainer: {
    gap: 12,
  },
  numberItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  numberLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  icNumberContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    alignItems: 'center',
  },
  icNumberLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  icNumberText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  icNumberRaw: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  numberText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  noNumbersText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  imageControls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  retakeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6A00BF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CameraScreen;
