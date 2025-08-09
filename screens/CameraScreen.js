import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import MlkitOcr from 'react-native-mlkit-ocr';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
  const device = useCameraDevice('back');
  const [photo, setPhoto] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  let cameraRef = null;

  // 📸 Take a picture & run OCR
  const takePhoto = async (camera) => {
    try {
      const picture = await camera.takePhoto();
      setPhoto(picture);

      const imagePath = picture.path.startsWith('file://') ? picture.path : 'file://' + picture.path;

      // 🔍 Run OCR
      setLoading(true);
      const result = await MlkitOcr.detectFromUri(imagePath);
      setLoading(false);

      if (result.length > 0) {
        const detectedText = result.map(block => block.text).join(' ');
        setOcrText(detectedText);
      } else {
        setOcrText('');
        Alert.alert('No text detected', 'Please retake the photo.');
      }
    } catch (err) {
      console.error('Error taking photo or running OCR:', err);
      Alert.alert('Error', 'Something went wrong while capturing or reading the image.');
    }
  };

  // 🔍 Search for scanned item in AsyncStorage
  const goToDetails = async () => {
    try {
      const scannedId = ocrText.trim().toUpperCase();
      if (!scannedId) {
        Alert.alert('No ID detected', 'Please retake the picture or type the ID manually.');
        return;
      }

      const storedData = await AsyncStorage.getItem('ITEM_LIST');
      const parsed = storedData ? JSON.parse(storedData) : [];

      if (parsed[scannedId]) {
        navigation.navigate('Details', { serial: scannedId, data: parsed[scannedId] });
        setPhoto(null);
        setOcrText('');
      } else {
        Alert.alert('Item not found', `No item found for Serial: ${scannedId}`);
      }
    } catch (error) {
      console.error('Error checking AsyncStorage:', error);
      Alert.alert('Error', 'Something went wrong while checking the database.');
    }
  };

  if (device == null) return <Text>Loading Camera...</Text>;

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: 'file://' + photo.path }} style={styles.preview} />

          {/* Overlay for better readability */}
          <View style={styles.overlay}>
            {loading ? (
              <Text style={styles.loadingText}>Processing OCR...</Text>
            ) : (
              <>
                <Text style={styles.label}>Detected ID:</Text>
                <TextInput
                  style={styles.input}
                  value={ocrText}
                  onChangeText={setOcrText}
                  placeholder="No text found"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.actionButton, styles.retakeButton]} onPress={() => setPhoto(null)}>
                    <Text style={styles.buttonText}>🔄 Retake</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.detailsButton]} onPress={goToDetails}>
                    <Text style={styles.buttonText}>📄 Go to Details</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
          ref={(ref) => (cameraRef = ref)}
        />
      )}

      {/* Floating capture button */}
      {!photo && (
        <TouchableOpacity style={styles.captureButton} onPress={() => takePhoto(cameraRef)}>
          <Text style={styles.captureText}>📸</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  // 📸 PREVIEW AREA
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width: '100%', height: '100%', resizeMode: 'contain' },

  // 🌑 OVERLAY FOR TEXT/INPUT
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  label: { color: '#fff', fontSize: 16, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },

  // 🟢 ACTION BUTTONS (Retake + Details)
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  retakeButton: { backgroundColor: '#FF5252' },
  detailsButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // 📸 BIG CAPTURE BUTTON
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  captureText: { fontSize: 32 },

  loadingText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});
