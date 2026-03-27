/**
 * JalPravah — Jal-Sahayak AI Voice Agent
 *
 * Uses Vapi.ai for real-time voice calling with regional Indian language support.
 * Falls back to text-based guidance when voice is unavailable (low connectivity).
 *
 * Supported languages: Hindi, English, Marathi, Tamil, Telugu,
 * Bengali, Gujarati, Kannada, Malayalam, Punjabi
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', vapiLang: 'en-IN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', vapiLang: 'hi-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', vapiLang: 'mr-IN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', vapiLang: 'ta-IN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', vapiLang: 'te-IN' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', vapiLang: 'bn-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', vapiLang: 'gu-IN' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', vapiLang: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', vapiLang: 'ml-IN' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', vapiLang: 'pa-IN' },
];

// Situation-based guidance scripts (factual, step-by-step)
export const GUIDANCE_SCRIPTS = {
  trapped: {
    en: [
      'Stay calm. Do not panic.',
      'Move to the highest point in your building — roof or upper floor.',
      'Do not try to swim through floodwater. It may have hidden currents.',
      'Signal rescuers using a bright cloth, torch, or whistle.',
      'Your SOS has been sent. Rescue team ETA is approximately 15 minutes.',
      'Keep your phone charged. Stay on the line.',
    ],
    hi: [
      'शांत रहें। घबराएं नहीं।',
      'अपनी इमारत की सबसे ऊंची जगह पर जाएं — छत या ऊपरी मंजिल।',
      'बाढ़ के पानी में तैरने की कोशिश न करें। इसमें छुपी धाराएं हो सकती हैं।',
      'चमकीले कपड़े, टॉर्च या सीटी से बचाव दल को संकेत दें।',
      'आपका SOS भेज दिया गया है। बचाव दल लगभग 15 मिनट में पहुंचेगा।',
      'अपना फोन चार्ज रखें। लाइन पर बने रहें।',
    ],
    mr: [
      'शांत राहा. घाबरू नका.',
      'तुमच्या इमारतीच्या सर्वात उंच ठिकाणी जा — छत किंवा वरचा मजला.',
      'पुराच्या पाण्यात पोहण्याचा प्रयत्न करू नका.',
      'चमकदार कापड, टॉर्च किंवा शिट्टीने बचाव पथकाला संकेत द्या.',
      'तुमचा SOS पाठवला गेला आहे. बचाव पथक सुमारे 15 मिनिटांत येईल.',
    ],
  },
  medical: {
    en: [
      'Stay still. Do not move the injured person unnecessarily.',
      'If conscious, keep them warm and calm.',
      'Apply pressure to any bleeding wounds with a clean cloth.',
      'Do not give food or water if they are unconscious.',
      'Medical aid team has been alerted with your triage information.',
      'Call 108 for ambulance if you can reach them.',
    ],
    hi: [
      'स्थिर रहें। घायल व्यक्ति को अनावश्यक रूप से न हिलाएं।',
      'यदि होश में हैं, तो उन्हें गर्म और शांत रखें।',
      'किसी भी खून बहने वाले घाव पर साफ कपड़े से दबाव डालें।',
      'बेहोश होने पर खाना या पानी न दें।',
      'आपकी ट्राइएज जानकारी के साथ चिकित्सा दल को सतर्क किया गया है।',
    ],
    mr: [
      'स्थिर राहा. जखमी व्यक्तीला अनावश्यकपणे हलवू नका.',
      'जर शुद्धीत असतील तर त्यांना उबदार आणि शांत ठेवा.',
      'रक्तस्त्राव होणाऱ्या जखमांवर स्वच्छ कापडाने दाब द्या.',
      'बेशुद्ध असल्यास अन्न किंवा पाणी देऊ नका.',
    ],
  },
  evacuation: {
    en: [
      'Prepare to evacuate immediately.',
      'Take only essentials: ID, medicines, phone, water.',
      'Do not use elevators. Use stairs only.',
      'Follow the green evacuation route markers.',
      'Nearest safe spot: Andheri Sports Complex — 0.5km.',
      'Walk in groups. Do not separate.',
    ],
    hi: [
      'तुरंत निकासी के लिए तैयार हों।',
      'केवल जरूरी चीजें लें: पहचान पत्र, दवाइयां, फोन, पानी।',
      'लिफ्ट का उपयोग न करें। केवल सीढ़ियों का उपयोग करें।',
      'हरे निकासी मार्ग के संकेतों का पालन करें।',
      'निकटतम सुरक्षित स्थान: अंधेरी स्पोर्ट्स कॉम्प्लेक्स — 0.5 किमी।',
    ],
    mr: [
      'ताबडतोब बाहेर पडण्यासाठी तयार व्हा.',
      'फक्त आवश्यक गोष्टी घ्या: ओळखपत्र, औषधे, फोन, पाणी.',
      'लिफ्ट वापरू नका. फक्त जिना वापरा.',
      'हिरव्या निर्वासन मार्गाच्या खुणांचे अनुसरण करा.',
    ],
  },
  food_water: {
    en: [
      'Stay in place. Relief teams are on their way.',
      'Ration any remaining water — drink small amounts frequently.',
      'Do not drink floodwater under any circumstances.',
      'Signal your location from a window or rooftop.',
      'Relief camp at BKC Convention Centre is open — 2.1km away.',
    ],
    hi: [
      'जगह पर रहें। राहत दल रास्ते में है।',
      'बचे हुए पानी को राशन करें — थोड़ा-थोड़ा पीते रहें।',
      'किसी भी परिस्थिति में बाढ़ का पानी न पिएं।',
      'खिड़की या छत से अपना स्थान संकेत करें।',
    ],
    mr: [
      'जागी राहा. मदत पथक येत आहे.',
      'उरलेले पाणी जपून वापरा — थोडे थोडे प्या.',
      'कोणत्याही परिस्थितीत पुराचे पाणी पिऊ नका.',
    ],
  },
  electricity: {
    en: [
      'Do not touch any electrical switches or wires.',
      'Stay away from flooded areas near electrical panels.',
      'Turn off the main power switch if safe to do so.',
      'BEST helpline: 1912 — report the outage.',
      'Do not use candles near flammable materials.',
    ],
    hi: [
      'किसी भी बिजली के स्विच या तार को न छुएं।',
      'बिजली पैनल के पास बाढ़ वाले क्षेत्रों से दूर रहें।',
      'यदि सुरक्षित हो तो मुख्य बिजली स्विच बंद करें।',
      'BEST हेल्पलाइन: 1912 — बिजली कटौती की रिपोर्ट करें।',
    ],
    mr: [
      'कोणत्याही विद्युत स्विच किंवा तारांना स्पर्श करू नका.',
      'विद्युत पॅनेलजवळील पूरग्रस्त भागांपासून दूर राहा.',
      'सुरक्षित असल्यास मुख्य वीज स्विच बंद करा.',
    ],
  },
  rescue: {
    en: [
      'Stay visible. Wave a bright cloth from your location.',
      'Use a whistle or bang on metal to make noise.',
      'Your GPS coordinates have been shared with rescue teams.',
      'NDRF team is being dispatched to your ward.',
      'Do not attempt self-rescue in deep water.',
      'Stay together if in a group.',
    ],
    hi: [
      'दिखाई दें। अपनी जगह से चमकीला कपड़ा हिलाएं।',
      'सीटी बजाएं या धातु पर ठोकें।',
      'आपके GPS निर्देशांक बचाव दल के साथ साझा किए गए हैं।',
      'NDRF टीम आपके वार्ड में भेजी जा रही है।',
    ],
    mr: [
      'दिसत राहा. तुमच्या ठिकाणाहून चमकदार कापड हलवा.',
      'शिट्टी वाजवा किंवा धातूवर ठोका.',
      'तुमचे GPS निर्देशांक बचाव पथकाशी शेअर केले गेले आहेत.',
    ],
  },
};

export function getGuidance(emergencyType, langCode) {
  const script = GUIDANCE_SCRIPTS[emergencyType];
  if (!script) return GUIDANCE_SCRIPTS.trapped[langCode] || GUIDANCE_SCRIPTS.trapped.en;
  return script[langCode] || script.en;
}
