import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { auth } from '../firebase-config'; // Import your firebase config
import Icon from 'react-native-vector-icons/FontAwesome'; // Example icon library, adjust as needed

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const images = [
  require('../assets/splash1.jpg'),
  require('../assets/splash2.jpg'),
  require('../assets/splash3.jpg'),
  require('../assets/splash3a.jpg'),
];

export default function ImageGallery({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      swiperRef.current.scrollBy(1, true);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const checkAuthState = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating delay for 1 second
    const user = auth.currentUser;
    if (user) {
      navigation.replace('PinVerification');
    }
  };

  useEffect(() => {
    // Hide skip button when on the last slide
    if (currentIndex === images.length - 1) {
      navigation.setOptions({
        headerRight: () => null, // Hide skip button in navigation header
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [currentIndex, navigation]);

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        showsButtons={false} // Remove the default navigation buttons
        loop={false}
        paginationStyle={{ bottom: 40 }} // Adjust pagination style if needed
        dotStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', width: 10, height: 10 }} // Optional: Customize pagination dots
        activeDotStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: 10, height: 10 }} // Optional: Customize active dot
        onIndexChanged={(index) => setCurrentIndex(index)}
      >
        {images.map((image, index) => (
          <View style={styles.slide} key={index}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </Swiper>
      <View style={styles.skipContainer}>
        {currentIndex !== images.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      {currentIndex === images.length - 1 && (
        <TouchableOpacity style={styles.finishButton} onPress={handleNext}>
          <Icon name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 0, // Top margin for the entire component
  },
  slide: {
    width: screenWidth,
    height: screenHeight, // Use screen height to expand to full screen
    justifyContent: 'flex-start', // Align image to the top
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Use cover to fill the image in the slide
  },
  skipContainer: {
    position: 'absolute',
    top: 45, // Adjust top position as needed
    right: 20,
    zIndex: 10, // Ensure Skip button appears above the swiper
  },
  skipButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
  },
  skipButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  finishButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});
