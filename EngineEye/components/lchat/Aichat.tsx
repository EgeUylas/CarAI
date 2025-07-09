import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  KeyboardEvent,
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { sendMessageToGemini, formatMessagesForGemini } from '../../services/geminiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const { width } = Dimensions.get('window');

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    setIsMenuOpen(!isMenuOpen);

    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsLoading(true);
      
      try {
        // API'ye istek at, geçmiş mesajları kullanmadan doğrudan soru gönderimi
        const response = await sendMessageToGemini(newMessage.text);
        
        if (response.success) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: response.data,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          // Hata durumunda kullanıcıya bildir
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Üzgünüm, şu anda yanıt verirken sorun yaşıyorum. Lütfen birazdan tekrar deneyin veya farklı bir soru sorun.",
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
          console.error("API Error:", response.error);
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        // Klavyeyi kapat
        Keyboard.dismiss();
  
        // Son mesaja scroll
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage('');
    toggleMenu();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Feather name="cpu" size={20} color="#4ECDC4" />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.aiMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {item.isUser && (
        <View style={styles.avatarContainer}>
          <Feather name="user" size={20} color="#4ECDC4" />
        </View>
      )}
    </View>
  );

  const renderChatHistory = () => (
    <View style={styles.chatHistoryContainer}>
      <View style={styles.chatHistoryHeader}>
        <Text style={styles.chatHistoryTitle}>Sohbet Geçmişi</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Feather name="x" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Yeni Sohbet Butonu */}
      <TouchableOpacity 
        style={styles.newChatButton} 
        onPress={startNewChat}
      >
        <Feather name="plus-circle" size={20} color="#4ECDC4" />
        <Text style={styles.newChatText}>Yeni Sohbet</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.chatHistoryList}>
        {messages.length > 0 && [1, 2, 3].map((num) => (
          <TouchableOpacity key={num} style={styles.chatHistoryItem}>
            <Feather name="message-circle" size={20} color="#4ECDC4" />
            <Text style={styles.chatHistoryText}>Geçmiş Sohbet {num}</Text>
            <Text style={styles.chatHistoryDate}>
              {new Date().toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
        {messages.length === 0 && (
          <View style={styles.emptyHistory}>
            <Feather name="message-square" size={40} color="#4ECDC4" />
            <Text style={styles.emptyHistoryText}>Henüz sohbet geçmişi yok</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Menü Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Feather name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Asistan</Text>
      </View>

      {/* Yan Menü */}
      <Animated.View
        style={[
          styles.menu,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        {renderChatHistory()}
      </Animated.View>

      {/* Chat Alanı */}
      <View style={[
        styles.chatContainer,
        isKeyboardVisible && Platform.OS === 'android' && { paddingBottom: keyboardHeight }
      ]}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Feather name="cpu" size={60} color="#4ECDC4" />
            <Text style={styles.welcomeTitle}>EngineEye AI Asistan</Text>
            <Text style={styles.welcomeText}>
              Merhaba! Araç bakımı, sorunlar veya herhangi bir konuda sorularınızı cevaplayabilirim.
            </Text>
            <View style={styles.suggestedQuestions}>
              <TouchableOpacity 
                style={styles.suggestedQuestion}
                onPress={() => {
                  setMessage("Motor yağını ne sıklıkta değiştirmeliyim?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
              >
                <Text style={styles.suggestedQuestionText}>Motor yağını ne sıklıkta değiştirmeliyim?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestedQuestion}
                onPress={() => {
                  setMessage("Arabamın yakıt tüketimini nasıl düşürebilirim?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
              >
                <Text style={styles.suggestedQuestionText}>Arabamın yakıt tüketimini nasıl düşürebilirim?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestedQuestion}
                onPress={() => {
                  setMessage("Araç bakımında dikkat etmem gereken önemli noktalar nelerdir?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
              >
                <Text style={styles.suggestedQuestionText}>Araç bakımında dikkat etmem gereken önemli noktalar nelerdir?</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messagesList,
              { paddingBottom: isKeyboardVisible ? 80 : 30 }
            ]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4ECDC4" />
            <Text style={styles.loadingText}>AI düşünüyor...</Text>
          </View>
        )}

        <View style={[
          styles.inputContainer,
          Platform.OS === 'ios' && isKeyboardVisible && { paddingBottom: 10 }
        ]}>
          <TextInput
            style={styles.input}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            onPress={handleSendMessage} 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Feather 
                name="send" 
                size={20} 
                color={message.trim() ? "#FFF" : "#999"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a252f',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  menuButton: {
    padding: 5,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#1a252f',
    width: width * 0.8,
    height: '100%',
    zIndex: 10,
  },
  chatHistoryContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  chatHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3540',
  },
  chatHistoryTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  chatHistoryList: {
    padding: 15,
  },
  chatHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#243240',
    borderRadius: 10,
    marginBottom: 10,
  },
  chatHistoryText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  chatHistoryDate: {
    color: '#999',
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 30,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a252f',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 20,
  },
  userMessageBubble: {
    backgroundColor: '#4ECDC4',
    borderBottomRightRadius: 5,
  },
  aiMessageBubble: {
    backgroundColor: '#2a3540',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFF',
  },
  aiMessageText: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderTopColor: '#1a252f',
    backgroundColor: '#141F27',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#1a252f',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#FFF',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#1a252f',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a252f',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  newChatText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a3540',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyHistoryText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  suggestedQuestions: {
    width: '100%',
  },
  suggestedQuestion: {
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#243240',
  },
  suggestedQuestionText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 37, 47, 0.7)',
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 50,
  },
  loadingText: {
    color: '#4ECDC4',
    marginLeft: 10,
    fontSize: 14,
  },
});
