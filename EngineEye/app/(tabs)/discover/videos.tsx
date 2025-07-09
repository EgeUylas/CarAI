import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import VideoPlayer from '@/components/discover/VideoPlayer';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VIDEOS = [
  {
    id: '1',
    uri: require('@/assets/videos/video.mp4'),
    username: 'carmaster',
    description: 'Yeni modifiye projemiz 🚗✨ #modifiye #araba',
    likes: 1234,
    comments: 89,
  },
  {
    id: '2',
    uri: require('@/assets/videos/video2.mp4'),
    username: 'autotuning',
    description: 'Bu sesi dinleyin! 🔥 #exhaust #performance',
    likes: 2567,
    comments: 156,
  },
];

export default function VideosScreen() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEOS}
        renderItem={({ item, index }) => (
          <VideoPlayer
            uri={item.uri}
            username={item.username}
            description={item.description}
            likes={item.likes}
            comments={item.comments}
            isActive={activeVideoIndex === index && isFocused}
          />
        )}
        pagingEnabled
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / height);
          setActiveVideoIndex(index);
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
}); 