import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth, db } from '../../../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getDoc
} from 'firebase/firestore';

interface ForumPost {
  id: string;
  userId: string;
  userEmail: string;
  username?: string;
  title: string;
  content: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  createdAt: any;
  likes: string[];
  saves: string[];
  comments: ForumComment[];
}

interface ForumComment {
  id: string;
  userId: string;
  userEmail: string;
  username?: string;
  content: string;
  createdAt: any;
  likes: string[];
}

export default function ForumScreen() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    carBrand: '',
    carModel: '',
    carYear: ''
  });
  const [commentText, setCommentText] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  useEffect(() => {
    // Set up real-time listener for posts
    const postsQuery = query(
      collection(db, 'forumPosts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsList: ForumPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsList.push({ 
          ...data, 
          id: doc.id,
          createdAt: data.createdAt,
          comments: data.comments || [],
          likes: data.likes || [],
          saves: data.saves || []
        } as ForumPost);
      });
      setPosts(postsList);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error getting posts:', error);
      Alert.alert('Hata', 'Forum gönderileri yüklenirken bir hata oluştu.');
      setLoading(false);
      setRefreshing(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Refresh is automatic due to the snapshot listener
  };

  const handleAddPost = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      if (!newPost.title.trim() || !newPost.content.trim()) {
        Alert.alert('Hata', 'Lütfen başlık ve içerik alanlarını doldurun.');
        return;
      }

      // Get user data to get username
      let username = 'Anonim';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        if (userData && userData.username) {
          username = userData.username;
        }
      } catch (error) {
        console.error('Error getting username:', error);
        // Continue with anonymous username
      }

      const postData = {
        userId: user.uid,
        userEmail: user.email,
        username: username,
        title: newPost.title,
        content: newPost.content,
        carBrand: newPost.carBrand,
        carModel: newPost.carModel,
        carYear: newPost.carYear,
        createdAt: serverTimestamp(),
        likes: [],
        saves: [],
        comments: []
      };

      console.log('Attempting to add post:', postData);
      await addDoc(collection(db, 'forumPosts'), postData);
      setModalVisible(false);
      setNewPost({ title: '', content: '', carBrand: '', carModel: '', carYear: '' });
      Alert.alert('Başarılı', 'Forum gönderisi eklendi.');
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Hata', 'Gönderi eklenirken bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleAddComment = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      if (!commentText.trim()) {
        Alert.alert('Hata', 'Lütfen bir yorum yazın.');
        return;
      }

      // Get user data to get username
      let username = 'Anonim';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        if (userData && userData.username) {
          username = userData.username;
        }
      } catch (error) {
        console.error('Error getting username:', error);
        // Continue with anonymous username
      }

      const comment: ForumComment = {
        id: Math.random().toString(),
        userId: user.uid,
        userEmail: user.email || '',
        username: username,
        content: commentText,
        createdAt: serverTimestamp(),
        likes: []
      };

      console.log('Attempting to add comment:', comment);
      const postRef = doc(db, 'forumPosts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Hata', 'Yorum eklenirken bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      const postRef = doc(db, 'forumPosts', postId);
      const post = posts.find(p => p.id === postId);
      
      if (post?.likes.includes(user.uid)) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      const postRef = doc(db, 'forumPosts', postId);
      const post = posts.find(p => p.id === postId);
      
      if (post?.saves.includes(user.uid)) {
        await updateDoc(postRef, {
          saves: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          saves: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forum</Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Canlı</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Canlı</Text>
        </View>
      </View>
      
      {posts.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={50} color="#4ECDC4" />
          <Text style={styles.emptyText}>Henüz hiç gönderi yok.</Text>
          <Text style={styles.emptySubText}>İlk gönderinizi oluşturmak için + düğmesine basın.</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4ECDC4"]}
              tintColor="#4ECDC4"
            />
          }
        >
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    <Feather name="user" size={24} color="#4ECDC4" />
                  </View>
                  <View>
                    <Text style={styles.username}>@{post.username || 'anonim'}</Text>
                    <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                  </View>
                </View>
                {(post.carBrand || post.carModel || post.carYear) && (
                  <View style={styles.carInfo}>
                    <Feather name="truck" size={16} color="#4ECDC4" />
                    <Text style={styles.carInfoText}>
                      {[post.carBrand, post.carModel, post.carYear].filter(Boolean).join(' ')}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleLikePost(post.id)}
                >
                  <Feather 
                    name={post.likes.includes(auth.currentUser?.uid || '') ? "heart" : "heart"}
                    size={20} 
                    color={post.likes.includes(auth.currentUser?.uid || '') ? "#FF6B6B" : "#666"} 
                  />
                  <Text style={[styles.actionText, post.likes.includes(auth.currentUser?.uid || '') && styles.actionTextActive]}>
                    {post.likes.length}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setSelectedPost(post)}
                >
                  <Feather name="message-circle" size={20} color="#666" />
                  <Text style={styles.actionText}>{post.comments.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSavePost(post.id)}
                >
                  <Feather 
                    name={post.saves.includes(auth.currentUser?.uid || '') ? "bookmark" : "bookmark"}
                    size={20} 
                    color={post.saves.includes(auth.currentUser?.uid || '') ? "#4ECDC4" : "#666"} 
                  />
                  <Text style={[styles.actionText, post.saves.includes(auth.currentUser?.uid || '') && styles.actionTextActive]}>
                    {post.saves.length}
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedPost?.id === post.id && (
                <View style={styles.commentsSection}>
                  {post.comments.map((comment, index) => (
                    <View key={index} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <View style={styles.commentUserInfo}>
                          <View style={styles.commentAvatar}>
                            <Feather name="user" size={16} color="#4ECDC4" />
                          </View>
                          <Text style={styles.commentUsername}>@{comment.username || 'anonim'}</Text>
                        </View>
                        <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                      </View>
                      <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                  ))}

                  <View style={styles.addCommentSection}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Yanıtınızı yazın..."
                      placeholderTextColor="#666"
                      value={commentText}
                      onChangeText={setCommentText}
                      multiline
                    />
                    <TouchableOpacity
                      style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                      onPress={() => handleAddComment(post.id)}
                      disabled={!commentText.trim()}
                    >
                      <Feather name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Forum Gönderisi</Text>

            <TextInput
              style={styles.input}
              placeholder="Başlık"
              placeholderTextColor="#666"
              value={newPost.title}
              onChangeText={(text) => setNewPost({...newPost, title: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Araç Markası (Opsiyonel)"
              placeholderTextColor="#666"
              value={newPost.carBrand}
              onChangeText={(text) => setNewPost({...newPost, carBrand: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Araç Modeli (Opsiyonel)"
              placeholderTextColor="#666"
              value={newPost.carModel}
              onChangeText={(text) => setNewPost({...newPost, carModel: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Araç Yılı (Opsiyonel)"
              placeholderTextColor="#666"
              value={newPost.carYear}
              onChangeText={(text) => setNewPost({...newPost, carYear: text})}
            />

            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="İçerik"
              placeholderTextColor="#666"
              value={newPost.content}
              onChangeText={(text) => setNewPost({...newPost, content: text})}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddPost}
              >
                <Text style={styles.buttonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141F27',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  postCard: {
    backgroundColor: '#1a252f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#243240',
  },
  postHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#666',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243240',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  carInfoText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#243240',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#666',
    marginLeft: 6,
    fontSize: 14,
  },
  actionTextActive: {
    color: '#4ECDC4',
  },
  commentsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#243240',
    paddingTop: 16,
  },
  commentCard: {
    backgroundColor: '#243240',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a252f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentUsername: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  commentContent: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#243240',
    borderRadius: 20,
    padding: 8,
  },
  commentInput: {
    flex: 1,
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#243240',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4ECDC4',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1a252f',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#243240',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#FFF',
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#1a252f',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#243240',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginRight: 6,
  },
  onlineText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
}); 