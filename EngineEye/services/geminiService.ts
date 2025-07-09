import axios from 'axios';
//axios kütüphanesi ile api'ye istek gönderiyoruz

// API key'i doğrudan kodun içine gömülmesi güvenlik açısından uygun değil,
// ama geliştirme aşamasında bu şekilde kullanabilirsiniz.
// Prodüksiyona geçerken .env dosyası veya güvenli bir depolama yöntemi kullanılmalıdır.
const API_KEY = 'AIzaSyAwJZkL0JYnvKTLhGUEuw3It3ehYoLhy9Y';

// Ücretsiz planda kullanılabilecek model isimleri
const MODELS = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_PRO_VISION: 'gemini-pro-vision',
  GEMINI_1_0_PRO: 'gemini-1.0-pro',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash'
};

// Ücretsiz üyelikte daha çok desteklenen bir model seçiyoruz
const SELECTED_MODEL = MODELS.GEMINI_1_5_FLASH;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${SELECTED_MODEL}:generateContent`;

// Araç asistanı olarak davranması için sistem mesajı
const SYSTEM_PROMPT = 'Araç bakımı, araç sorunları, motor bilgisi ve otomobiller hakkında uzman bir asistansın. Kullanıcıya araçlarıyla ilgili her konuda yardımcı olman gerekiyor. Yanıtların bilgilendirici, kapsamlı ve teknik olsun, ama aynı zamanda sıradan bir araç sahibinin anlayabileceği şekilde basit bir dille açıkla. Türkçe yanıt ver.';

/**
 * Kullanılabilir modelleri listeler
 */
export const listModels = async () => {
  try {
    console.log("Listing available models...");
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    console.log("Available models:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error("Error listing models:", error.response?.data || error.message);
    return null;
  }
};

/**
 * Gemini API'ye mesaj gönderip yanıt alır
 * @param prompt Kullanıcının gönderdiği mesaj
 * @returns Gemini'nin yanıtı
 */
export const sendMessageToGemini = async (prompt: string) => {
  try {
    console.log("Sending request to Gemini API...");
    console.log(`Using model: ${SELECTED_MODEL}`);
    console.log("Using URL:", API_URL);
    
    // Gemini API'nin istek formatı - API versiyonuna göre basitleştirilmiş format
    const requestBody = {
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nKullanıcının sorusu: ${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    console.log("Request payload:", JSON.stringify(requestBody, null, 2));

    // API isteği
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      requestBody
    );

    console.log("API response received:", JSON.stringify(response.data, null, 2));

    // Yanıtı parse et
    if (response.data.candidates && response.data.candidates.length > 0) {
      const textResponse = response.data.candidates[0].content.parts[0].text;
      return { success: true, data: textResponse };
    } else {
      return { success: false, error: "Yanıt alınamadı" };
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    // Farklı modeli dene
    if (error.response?.data?.error?.message?.includes('not found')) {
      console.log('Model bulunamadı, diğer modeli deniyoruz...');
      return tryAnotherModel(prompt);
    }
    
    return { 
      success: false, 
      error: error.response?.data?.error?.message || "API isteği sırasında bir hata oluştu" 
    };
  }
};

/**
 * Birinci model başarısız olursa başka bir model dene
 */
const tryAnotherModel = async (prompt: string) => {
  try {
    // Eğer ilk model gemini-1.5-flash ise, ikinci olarak gemini-1.0-pro dene
    const backupModel = SELECTED_MODEL === MODELS.GEMINI_1_5_FLASH ? MODELS.GEMINI_1_0_PRO : MODELS.GEMINI_PRO;
    const backupUrl = `https://generativelanguage.googleapis.com/v1/models/${backupModel}:generateContent`;
    
    console.log(`Trying backup model: ${backupModel}`);
    
    const requestBody = {
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nKullanıcının sorusu: ${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    const response = await axios.post(
      `${backupUrl}?key=${API_KEY}`,
      requestBody
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      const textResponse = response.data.candidates[0].content.parts[0].text;
      return { success: true, data: textResponse };
    } else {
      return { success: false, error: "Yedek model ile de yanıt alınamadı" };
    }
  } catch (error: any) {
    console.error('Backup model error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: "Hiçbir model yanıt vermedi. API keye bağlı modellerin doğru seçildiğinden emin olun."
    };
  }
};

/**
 * Gemini API ile konuşma geçmişi formatına çevirir
 * @param messages Mesajların listesi
 * @returns Gemini API formatında mesaj geçmişi
 */
export const formatMessagesForGemini = (messages: Array<{text: string, isUser: boolean}>) => {
  return messages.map(msg => ({
    role: msg.isUser ? "user" : "model",
    parts: [{ text: msg.text }]
  }));
}; 