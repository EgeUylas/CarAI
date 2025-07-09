import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  uri: any;
  username: string;
  description: string;
  likes: number;
  comments: number;
  isActive: boolean;
}

export default function VideoPlayer({ uri, username, description, likes, comments, isActive }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={togglePlayPause} style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={uri}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isActive}
          isMuted={!isActive}
        />
      </Pressable>

      <View style={styles.overlay}>
        <View style={styles.rightControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleLike}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={32} color={isLiked ? "#ff2d55" : "white"} />
            <Text style={styles.controlText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="chatbubble-outline" size={32} color="white" />
            <Text style={styles.controlText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="share-social-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height - 49,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  rightControls: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  controlText: {
    color: 'white',
    marginTop: 4,
  },
  bottomOverlay: {
    marginBottom: 20,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: 'white',
    fontSize: 14,
    maxWidth: '80%',
  },
}); 