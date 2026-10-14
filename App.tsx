import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAdStore } from './src/store/useAdStore';

export default function App() {
  const {
    images,
    addImage,
    removeImage,
    businessName,
    setBusinessName,
    offerText,
    setOfferText,
  } = useAdStore();

  const handlePickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'You can select up to 3 photos maximum.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 3 - images.length,
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      result.assets.forEach((asset) => {
        if (asset.uri) {
          addImage(asset.uri);
        }
      });
    }
  };

  const handleStartGeneration = () => {
    if (images.length < 3) {
      Alert.alert('Photos Missing', 'Please upload 3 photos to create your video ad.');
      return;
    }
    if (!businessName.trim() || !offerText.trim()) {
      Alert.alert('Details Missing', 'Please enter your business name and offer details.');
      return;
    }

    Alert.alert(
      'Ready for Step 3',
      'Images and details are ready! Next, we will render the video with FFmpeg.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>AI Ad Creator</Text>
        <Text style={styles.headerSubtitle}>
          Upload 3 product photos and generate a 10-second vertical video ad.
        </Text>

        {/* 3 Photo Slots */}
        <View style={styles.slotsContainer}>
          {[0, 1, 2].map((index) => {
            const imageUri = images[index];
            return (
              <View key={index} style={styles.slot}>
                {imageUri ? (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.deleteBadge}
                      onPress={() => removeImage(index)}>
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.emptySlot}
                    onPress={handlePickImage}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.slotLabel}>Photo {index + 1}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Business / Brand Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Royal Footwear or Cafe 99"
            placeholderTextColor="#888"
            value={businessName}
            onChangeText={setBusinessName}
          />

          <Text style={styles.inputLabel}>Offer / Campaign Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Diwali Sale 40% OFF on all items!"
            placeholderTextColor="#888"
            multiline
            numberOfLines={3}
            value={offerText}
            onChangeText={setOfferText}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            images.length === 3 ? styles.ctaActive : styles.ctaDisabled,
          ]}
          onPress={handleStartGeneration}>
          <Text style={styles.ctaText}>
            {images.length === 3
              ? '✨ Generate AI Video Ad'
              : `Select ${3 - images.length} More Photo${3 - images.length > 1 ? 's' : ''}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scroll: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
    lineHeight: 20,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  slot: {
    width: '31%',
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  plusIcon: {
    fontSize: 28,
    color: '#38BDF8',
    fontWeight: '300',
  },
  slotLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 18,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaActive: {
    backgroundColor: '#0284C7',
  },
  ctaDisabled: {
    backgroundColor: '#334155',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});