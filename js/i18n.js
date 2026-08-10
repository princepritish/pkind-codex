(function () {
  var STORAGE_KEY = 'pki_lang';
  var supported = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'];

  var langToHtml = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN'
  };

  var translations = {
    en: {
      'nav.home': 'Home',
      'nav.introduction': 'Introduction',
      'nav.work': 'Our Work',
      'nav.contact': 'Contact Us',
      'staff.login': 'Staff Login',
      'intro.title': 'Introduction',
      'intro.body': 'P.K. Industries is a well-known manufacturer, exporter, and supplier. We offer high-quality nozzle filling compound, castable, casting powder, and radex insulation powder. Based in Jharkhand, India, the company is led by Mr. P.K. Gupta (Owner).',
      'intro.cta': 'Read More',
      'why.title': 'Why Us?',
      'why.delivery.title': 'On Time Delivery',
      'why.delivery.body': 'We are known for reliable and convenient on-time deliveries.',
      'why.quality.title': 'Industry Leading Quality',
      'why.quality.body': 'We continuously strive to provide industry-leading quality products to our clients.',
      'why.rd.title': 'Research & Development',
      'why.rd.body': 'We are continuously involved in R&D to meet evolving market demands.',
      'work.title': 'Our Work',
      'work.subtitle': 'We manufacture a host of excellent quality consumables for continuous casting machines.',
      'products.casting.title': 'Casting Powder',
      'products.casting.body': 'Our casting powder quickly forms liquid slag, protects molten steel from oxidation, and supports smooth billet, bloom, and slab casting performance.',
      'products.nfc.title': 'Nozzle Filling Compound',
      'products.nfc.body': 'Our nozzle filling compound is engineered for reliable free opening, high flowability, and stable performance across steel grades and process conditions.',
      'products.castable.title': 'Castable',
      'products.castable.body': 'Our refractory castable is designed for high-temperature wear areas, offering strong integrity, durability, and improved furnace lining life.',
      'products.radex.title': 'Radex',
      'products.radex.body': 'Our ladle covering compound provides excellent insulation and spreadability, reducing heat loss and helping maintain molten steel temperature during casting.',
      'inquiry.title': 'Inquiry',
      'inquiry.subtitle': 'Click the button below and submit the form to get support from our team.',
      'contact.title': 'Contact Us',
      'contact.headOfficeLabel': 'Head Office:',
      'contact.address': 'C 10, Near Industrial Estate Adityapur, Jamshedpur Jharkhand',
      'footer.brand': 'PK INDUSTRIES',
      'footer.brandBody': 'Our team offers up-to-date, sustainable, and trusted products. We are committed to quality, trust, and responsible service.',
      'footer.quickLinks': 'Quick Links',
      'footer.about': 'About Us',
      'footer.whatWeDo': 'What We Do',
      'footer.contact': 'Contact',
      'footer.reachUs': 'Reach Us',
      'footer.contactDetails': 'Contact Details',
      'footer.hours': 'Mon-Sat From 8am till 8pm',
      'footer.copyright': '© 2022 Copyright:'
    },
    hi: {
      'nav.home': 'होम', 'nav.introduction': 'परिचय', 'nav.work': 'हमारा कार्य', 'nav.contact': 'संपर्क करें',
      'staff.login': 'स्टाफ लॉगिन', 'intro.title': 'परिचय',
      'intro.body': 'पी.के. इंडस्ट्रीज एक प्रतिष्ठित निर्माता, निर्यातक और सप्लायर है। हम कास्टिंग पाउडर, नोजल फिलिंग कंपाउंड, कास्टेबल और राडेक्स इंसुलेशन पाउडर प्रदान करते हैं।',
      'intro.cta': 'और पढ़ें', 'why.title': 'हम क्यों?', 'why.delivery.title': 'समय पर डिलीवरी',
      'why.delivery.body': 'हम विश्वसनीय और समय पर डिलीवरी के लिए जाने जाते हैं।',
      'why.quality.title': 'उद्योग-स्तरीय गुणवत्ता', 'why.quality.body': 'हम लगातार उच्च गुणवत्ता वाले उत्पाद देने का प्रयास करते हैं।',
      'why.rd.title': 'अनुसंधान और विकास', 'why.rd.body': 'हम बाजार की नई मांगों को पूरा करने के लिए लगातार R&D करते हैं।',
      'work.title': 'हमारा कार्य', 'work.subtitle': 'हम सतत कास्टिंग मशीनों के लिए उत्कृष्ट गुणवत्ता वाले कंज्यूमेबल्स बनाते हैं।',
      'products.casting.title': 'कास्टिंग पाउडर',
      'products.casting.body': 'हमारा कास्टिंग पाउडर तेजी से स्लैग बनाकर धातु की सुरक्षा करता है और कास्टिंग प्रदर्शन बेहतर करता है।',
      'products.nfc.title': 'नोजल फिलिंग कंपाउंड',
      'products.nfc.body': 'हमारा NFC बेहतर फ्लोएबिलिटी और भरोसेमंद फ्री ओपनिंग प्रदर्शन के लिए डिजाइन किया गया है।',
      'products.castable.title': 'कास्टेबल', 'products.castable.body': 'हमारा कास्टेबल उच्च तापमान क्षेत्रों के लिए मजबूत और टिकाऊ समाधान देता है।',
      'products.radex.title': 'राडेक्स', 'products.radex.body': 'हमारा लैडल कवरिंग कंपाउंड गर्मी हानि कम करता है और तापमान बनाए रखने में मदद करता है।',
      'inquiry.title': 'पूछताछ', 'inquiry.subtitle': 'नीचे बटन पर क्लिक करके फॉर्म जमा करें, हमारी टीम सहायता करेगी।',
      'contact.title': 'संपर्क करें', 'contact.headOfficeLabel': 'मुख्य कार्यालय:',
      'contact.address': 'सी 10, नियर इंडस्ट्रियल एस्टेट आदित्यपुर, जमशेदपुर, झारखंड',
      'footer.brand': 'पीके इंडस्ट्रीज', 'footer.brandBody': 'हमारी टीम भरोसेमंद, टिकाऊ और उच्च गुणवत्ता वाले उत्पाद प्रदान करती है।',
      'footer.quickLinks': 'त्वरित लिंक', 'footer.about': 'हमारे बारे में', 'footer.whatWeDo': 'हम क्या करते हैं', 'footer.contact': 'संपर्क', 'footer.reachUs': 'हम तक पहुंचें',
      'footer.contactDetails': 'संपर्क विवरण', 'footer.hours': 'सोम-शनि सुबह 8 बजे से रात 8 बजे तक', 'footer.copyright': '© 2022 कॉपीराइट:'
    },
    bn: {
      'nav.home': 'হোম', 'nav.introduction': 'পরিচিতি', 'nav.work': 'আমাদের কাজ', 'nav.contact': 'যোগাযোগ',
      'staff.login': 'স্টাফ লগইন', 'intro.title': 'পরিচিতি',
      'intro.body': 'পি.কে. ইন্ডাস্ট্রিজ একটি বিশ্বস্ত প্রস্তুতকারক ও সরবরাহকারী। আমরা কাস্টিং পাউডার, নোজল ফিলিং কম্পাউন্ড, কাস্টেবল এবং রাডেক্স পণ্য সরবরাহ করি।',
      'intro.cta': 'আরও জানুন', 'why.title': 'আমাদের কেন?', 'why.delivery.title': 'সময়মতো ডেলিভারি',
      'why.delivery.body': 'আমরা নির্ভরযোগ্য ও সময়মতো ডেলিভারির জন্য পরিচিত।',
      'why.quality.title': 'শিল্পমানের গুণমান', 'why.quality.body': 'আমরা ধারাবাহিকভাবে উচ্চমানের পণ্য সরবরাহ করি।',
      'why.rd.title': 'গবেষণা ও উন্নয়ন', 'why.rd.body': 'বাজারের চাহিদা পূরণে আমরা নিয়মিত R&D করি।',
      'work.title': 'আমাদের কাজ', 'work.subtitle': 'আমরা কন্টিনিউয়াস কাস্টিং মেশিনের জন্য উৎকৃষ্ট মানের কনজ্যুমেবল তৈরি করি।',
      'products.casting.title': 'কাস্টিং পাউডার', 'products.casting.body': 'আমাদের কাস্টিং পাউডার দ্রুত স্ল্যাগ তৈরি করে এবং কাস্টিং কর্মক্ষমতা উন্নত করে।',
      'products.nfc.title': 'নোজল ফিলিং কম্পাউন্ড', 'products.nfc.body': 'আমাদের NFC উচ্চ ফ্লোয়েবিলিটি এবং নির্ভরযোগ্য ফ্রি ওপেনিং পারফরম্যান্স দেয়।',
      'products.castable.title': 'কাস্টেবল', 'products.castable.body': 'উচ্চ তাপমাত্রায় ব্যবহারের জন্য আমাদের কাস্টেবল টেকসই ও কার্যকর।',
      'products.radex.title': 'রাডেক্স', 'products.radex.body': 'আমাদের লাডল কভারিং কম্পাউন্ড তাপ ক্ষয় কমায় এবং তাপমাত্রা ধরে রাখতে সহায়তা করে।',
      'inquiry.title': 'জিজ্ঞাসা', 'inquiry.subtitle': 'নীচের বোতামে ক্লিক করে ফর্ম জমা দিন, আমরা সহায়তা করব।',
      'contact.title': 'যোগাযোগ করুন', 'contact.headOfficeLabel': 'হেড অফিস:', 'contact.address': 'সি ১০, ইন্ডাস্ট্রিয়াল এরিয়া, আদিত্যপুর, জামশেদপুর, ঝাড়খণ্ড',
      'footer.brand': 'পিকে ইন্ডাস্ট্রিজ', 'footer.brandBody': 'আমরা বিশ্বস্ত, টেকসই এবং উচ্চমানের পণ্য সরবরাহে প্রতিশ্রুতিবদ্ধ।',
      'footer.quickLinks': 'দ্রুত লিংক', 'footer.about': 'আমাদের সম্পর্কে', 'footer.whatWeDo': 'আমরা কী করি', 'footer.contact': 'যোগাযোগ', 'footer.reachUs': 'আমাদের কাছে পৌঁছান',
      'footer.contactDetails': 'যোগাযোগের বিবরণ', 'footer.hours': 'সোম-শনি সকাল ৮টা থেকে রাত ৮টা', 'footer.copyright': '© ২০২২ কপিরাইট:'
    },
    ta: {
      'nav.home': 'முகப்பு', 'nav.introduction': 'அறிமுகம்', 'nav.work': 'எங்கள் வேலை', 'nav.contact': 'தொடர்பு',
      'staff.login': 'பணியாளர் உள்நுழைவு', 'intro.title': 'அறிமுகம்',
      'intro.body': 'பி.கே. இண்டஸ்ட்ரீஸ் நம்பகமான உற்பத்தியாளர். நாங்கள் காஸ்டிங் பவுடர், நுழல் ஃபில்லிங் கம்பவுண்ட், காஸ்டபிள் மற்றும் ராடெக்ஸ் தயாரிக்கிறோம்.',
      'intro.cta': 'மேலும் படிக்க', 'why.title': 'எங்களை ஏன்?', 'why.delivery.title': 'நேரத்துக்கு சரியான விநியோகம்',
      'why.delivery.body': 'நாங்கள் நம்பகமான மற்றும் நேரடி விநியோகத்திற்காக அறியப்படுகிறோம்.',
      'why.quality.title': 'தொழில்துறை தரம்', 'why.quality.body': 'எங்கள் வாடிக்கையாளர்களுக்கு உயர்தர தயாரிப்புகளை தொடர்ந்து வழங்குகிறோம்.',
      'why.rd.title': 'ஆராய்ச்சி மற்றும் மேம்பாடு', 'why.rd.body': 'புதிய சந்தை தேவைகளுக்காக தொடர்ந்து R&D செய்கிறோம்.',
      'work.title': 'எங்கள் வேலை', 'work.subtitle': 'தொடர்ச்சியான காஸ்டிங் இயந்திரங்களுக்கு உயர்தர நுகர்பொருட்களை தயாரிக்கிறோம்.',
      'products.casting.title': 'காஸ்டிங் பவுடர்', 'products.casting.body': 'எங்கள் காஸ்டிங் பவுடர் ஸ்லாக் உருவாக்கி உலோகத்தை பாதுகாக்கிறது.',
      'products.nfc.title': 'நுழல் ஃபில்லிங் கம்பவுண்ட்', 'products.nfc.body': 'எங்கள் NFC நல்ல ஓட்டப்பண்பு மற்றும் நம்பகமான செயல்திறன் வழங்குகிறது.',
      'products.castable.title': 'காஸ்டபிள்', 'products.castable.body': 'அதிக வெப்பநிலைக்கான உறுதியான மற்றும் நீடித்த காஸ்டபிள் தீர்வு.',
      'products.radex.title': 'ராடெக்ஸ்', 'products.radex.body': 'வெப்ப இழப்பை குறைத்து எஃகு வெப்பநிலையை பேண உதவுகிறது.',
      'inquiry.title': 'விசாரணை', 'inquiry.subtitle': 'கீழே உள்ள பொத்தானை அழுத்தி படிவத்தை சமர்ப்பிக்கவும்.',
      'contact.title': 'எங்களை தொடர்புகொள்ள', 'contact.headOfficeLabel': 'முதன்மை அலுவலகம்:', 'contact.address': 'சி 10, அருகில் தொழிற்பேட்டை, ஆதித்யபூர், ஜம்ஷெட்பூர், ஜார்கண்ட்',
      'footer.brand': 'பிகே இண்டஸ்ட்ரீஸ்', 'footer.brandBody': 'நம்பகமான மற்றும் தரமான தயாரிப்புகளை வழங்க எங்கள் குழு உறுதியாக உள்ளது.',
      'footer.quickLinks': 'விரைவு இணைப்புகள்', 'footer.about': 'எங்களை பற்றி', 'footer.whatWeDo': 'நாங்கள் என்ன செய்கிறோம்', 'footer.contact': 'தொடர்பு', 'footer.reachUs': 'எங்களை அணுக',
      'footer.contactDetails': 'தொடர்பு விவரங்கள்', 'footer.hours': 'திங்கள்-சனி காலை 8 முதல் இரவு 8 வரை', 'footer.copyright': '© 2022 பதிப்புரிமை:'
    },
    te: {
      'nav.home': 'హోమ్', 'nav.introduction': 'పరిచయం', 'nav.work': 'మా పని', 'nav.contact': 'సంప్రదించండి',
      'staff.login': 'స్టాఫ్ లాగిన్', 'intro.title': 'పరిచయం',
      'intro.body': 'పి.కె. ఇండస్ట్రీస్ విశ్వసనీయ తయారీదారు. మేము కాస్టింగ్ పౌడర్, నోజిల్ ఫిల్లింగ్ కంపౌండ్, కాస్టబుల్ మరియు రాడెక్స్ ఉత్పత్తులు అందిస్తాము.',
      'intro.cta': 'ఇంకా చదవండి', 'why.title': 'మమ్మల్ని ఎందుకు?', 'why.delivery.title': 'సమయానికి డెలివరీ',
      'why.delivery.body': 'మేము సమయపాలనతో డెలివరీకి ప్రసిద్ధి.',
      'why.quality.title': 'ఉత్తమ నాణ్యత', 'why.quality.body': 'మేము ఎల్లప్పుడూ అత్యుత్తమ నాణ్యత ఉత్పత్తులు అందిస్తాము.',
      'why.rd.title': 'పరిశోధన & అభివృద్ధి', 'why.rd.body': 'మార్కెట్ అవసరాల కోసం నిరంతరం R&D చేస్తుంటాము.',
      'work.title': 'మా పని', 'work.subtitle': 'కాంటిన్యూయస్ కాస్టింగ్ మెషీన్ల కోసం ఉన్నత నాణ్యత ఉత్పత్తులు తయారు చేస్తాము.',
      'products.casting.title': 'కాస్టింగ్ పౌడర్', 'products.casting.body': 'మా కాస్టింగ్ పౌడర్ స్లాగ్‌ను త్వరగా రూపొందించి పనితీరును మెరుగుపరుస్తుంది.',
      'products.nfc.title': 'నోజిల్ ఫిల్లింగ్ కంపౌండ్', 'products.nfc.body': 'మా NFC అద్భుతమైన ప్రవాహ సామర్థ్యం మరియు విశ్వసనీయ పనితీరును అందిస్తుంది.',
      'products.castable.title': 'కాస్టబుల్', 'products.castable.body': 'అధిక ఉష్ణోగ్రత ప్రాంతాలకు మా కాస్టబుల్ దృఢమైన పరిష్కారం.',
      'products.radex.title': 'రాడెక్స్', 'products.radex.body': 'మా లాడిల్ కవరింగ్ కంపౌండ్ వేడి నష్టాన్ని తగ్గిస్తుంది.',
      'inquiry.title': 'అడగండి', 'inquiry.subtitle': 'క్రింద ఉన్న బటన్ నొక్కి ఫారమ్ సమర్పించండి.',
      'contact.title': 'సంప్రదించండి', 'contact.headOfficeLabel': 'ప్రధాన కార్యాలయం:', 'contact.address': 'సి 10, ఇండస్ట్రియల్ ఏరియా సమీపంలో, ఆదిత్యపూర్, జంషెడ్‌పూర్, జార్ఖండ్',
      'footer.brand': 'పికే ఇండస్ట్రీస్', 'footer.brandBody': 'మేము నమ్మకమైన మరియు నాణ్యమైన ఉత్పత్తులకు కట్టుబడి ఉన్నాము.',
      'footer.quickLinks': 'త్వరిత లింకులు', 'footer.about': 'మా గురించి', 'footer.whatWeDo': 'మేము ఏమి చేస్తాము', 'footer.contact': 'సంప్రదించండి', 'footer.reachUs': 'మమ్మల్ని చేరుకోండి',
      'footer.contactDetails': 'సంప్రదింపు వివరాలు', 'footer.hours': 'సోమ-శని ఉదయం 8 నుంచి రాత్రి 8 వరకు', 'footer.copyright': '© 2022 కాపీరైట్:'
    },
    mr: {
      'nav.home': 'मुख्यपृष्ठ', 'nav.introduction': 'परिचय', 'nav.work': 'आमचे काम', 'nav.contact': 'संपर्क',
      'staff.login': 'स्टाफ लॉगिन', 'intro.title': 'परिचय',
      'intro.body': 'पी.के. इंडस्ट्रीज हा विश्वासार्ह निर्माता आहे. आम्ही कास्टिंग पावडर, नोजल फिलिंग कंपाउंड, कास्टेबल आणि राडेक्स उत्पादने पुरवतो.',
      'intro.cta': 'अधिक वाचा', 'why.title': 'आम्हीच का?', 'why.delivery.title': 'वेळेवर डिलिव्हरी',
      'why.delivery.body': 'आम्ही वेळेवर आणि विश्वासार्ह डिलिव्हरीसाठी ओळखले जातो.',
      'why.quality.title': 'उद्योगातील दर्जेदार गुणवत्ता', 'why.quality.body': 'आम्ही सातत्याने उच्च दर्जाची उत्पादने देतो.',
      'why.rd.title': 'संशोधन आणि विकास', 'why.rd.body': 'बाजारातील नव्या गरजांसाठी आम्ही सतत R&D करतो.',
      'work.title': 'आमचे काम', 'work.subtitle': 'कंटिन्युअस कास्टिंग मशीनसाठी आम्ही उत्कृष्ट दर्जाचे कंझ्युमेबल्स तयार करतो.',
      'products.casting.title': 'कास्टिंग पावडर', 'products.casting.body': 'आमची कास्टिंग पावडर स्लॅग त्वरीत तयार करून कास्टिंग कार्यक्षमता वाढवते.',
      'products.nfc.title': 'नोजल फिलिंग कंपाउंड', 'products.nfc.body': 'आमचे NFC उत्तम फ्लोअॅबिलिटी आणि विश्वासार्ह कामगिरी देते.',
      'products.castable.title': 'कास्टेबल', 'products.castable.body': 'उच्च तापमानासाठी आमचे कास्टेबल मजबूत आणि टिकाऊ आहे.',
      'products.radex.title': 'राडेक्स', 'products.radex.body': 'आमचे लॅडल कव्हरिंग कंपाउंड उष्णतेचा अपव्यय कमी करते.',
      'inquiry.title': 'चौकशी', 'inquiry.subtitle': 'खालील बटणावर क्लिक करून फॉर्म सबमिट करा.',
      'contact.title': 'संपर्क करा', 'contact.headOfficeLabel': 'मुख्य कार्यालय:', 'contact.address': 'सी 10, इंडस्ट्रियल एस्टेटजवळ, आदित्यपूर, जमशेदपूर, झारखंड',
      'footer.brand': 'पीके इंडस्ट्रीज', 'footer.brandBody': 'आमची टीम विश्वासार्ह आणि उच्च दर्जाची उत्पादने देण्यासाठी वचनबद्ध आहे.',
      'footer.quickLinks': 'द्रुत दुवे', 'footer.about': 'आमच्याबद्दल', 'footer.whatWeDo': 'आम्ही काय करतो', 'footer.contact': 'संपर्क', 'footer.reachUs': 'आमच्यापर्यंत पोहोचा',
      'footer.contactDetails': 'संपर्क तपशील', 'footer.hours': 'सोम-शनि सकाळी 8 ते रात्री 8', 'footer.copyright': '© 2022 सर्वाधिकार:'
    },
    gu: {
      'nav.home': 'હોમ', 'nav.introduction': 'પરિચય', 'nav.work': 'અમારું કામ', 'nav.contact': 'સંપર્ક કરો',
      'staff.login': 'સ્ટાફ લોગિન', 'intro.title': 'પરિચય',
      'intro.body': 'પી.કે. ઇન્ડસ્ટ્રીઝ વિશ્વસનીય ઉત્પાદક છે. અમે કાસ્ટિંગ પાઉડર, નોઝલ ફિલિંગ કમ્પાઉન્ડ, કાસ્ટેબલ અને રાડેક્સ ઉત્પાદનો આપીએ છીએ.',
      'intro.cta': 'વધુ વાંચો', 'why.title': 'અમને કેમ પસંદ કરો?', 'why.delivery.title': 'સમયસર ડિલિવરી',
      'why.delivery.body': 'અમે વિશ્વસનીય અને સમયસર ડિલિવરી માટે જાણીતા છીએ.',
      'why.quality.title': 'ઉદ્યોગ-સ્તરની ગુણવત્તા', 'why.quality.body': 'અમે સતત ઉચ્ચ ગુણવત્તાવાળા ઉત્પાદનો આપીએ છીએ.',
      'why.rd.title': 'શોધ અને વિકાસ', 'why.rd.body': 'બજારની માંગ માટે અમે સતત R&D કરીએ છીએ.',
      'work.title': 'અમારું કામ', 'work.subtitle': 'કન્ટિન્યુઅસ કાસ્ટિંગ મશીનો માટે ઉત્તમ ગુણવત્તાના કન્સ્યુમેબલ્સ બનાવીએ છીએ.',
      'products.casting.title': 'કાસ્ટિંગ પાઉડર', 'products.casting.body': 'અમારો કાસ્ટિંગ પાઉડર ઝડપી સ્લેગ બનાવે છે અને કામગીરી સુધારે છે.',
      'products.nfc.title': 'નોઝલ ફિલિંગ કમ્પાઉન્ડ', 'products.nfc.body': 'અમારું NFC સારો ફ્લો અને વિશ્વસનીય પ્રદર્શન આપે છે.',
      'products.castable.title': 'કાસ્ટેબલ', 'products.castable.body': 'ઉચ્ચ તાપમાને ઉપયોગ માટે મજબૂત અને ટકાઉ ઉકેલ.',
      'products.radex.title': 'રાડેક્સ', 'products.radex.body': 'અમારું લેડલ કવરિંગ કમ્પાઉન્ડ ગરમીનું નુકસાન ઓછું કરે છે.',
      'inquiry.title': 'પૂછપરછ', 'inquiry.subtitle': 'નીચે બટન ક્લિક કરીને ફોર્મ સબમિટ કરો.',
      'contact.title': 'સંપર્ક કરો', 'contact.headOfficeLabel': 'મુખ્ય કચેરી:', 'contact.address': 'સી 10, ઇન્ડસ્ટ્રીયલ એસ્ટેટ પાસે, આદિત્યપુર, જામશેદપુર, ઝારખંડ',
      'footer.brand': 'પીકે ઇન્ડસ્ટ્રીઝ', 'footer.brandBody': 'અમારી ટીમ વિશ્વસનીય અને ગુણવત્તાયુક્ત ઉત્પાદનો માટે પ્રતિબદ્ધ છે.',
      'footer.quickLinks': 'ઝડપી લિંક્સ', 'footer.about': 'અમારા વિશે', 'footer.whatWeDo': 'અમે શું કરીએ છીએ', 'footer.contact': 'સંપર્ક', 'footer.reachUs': 'અમને પહોંચો',
      'footer.contactDetails': 'સંપર્ક વિગતો', 'footer.hours': 'સોમ-શનિ સવારે 8 થી રાતે 8', 'footer.copyright': '© 2022 કૉપિરાઇટ:'
    },
    kn: {
      'nav.home': 'ಮುಖಪುಟ', 'nav.introduction': 'ಪರಿಚಯ', 'nav.work': 'ನಮ್ಮ ಕೆಲಸ', 'nav.contact': 'ಸಂಪರ್ಕಿಸಿ',
      'staff.login': 'ಸ್ಟಾಫ್ ಲಾಗಿನ್', 'intro.title': 'ಪರಿಚಯ',
      'intro.body': 'ಪಿ.ಕೆ. ಇಂಡಸ್ಟ್ರೀಸ್ ವಿಶ್ವಾಸಾರ್ಹ ತಯಾರಕ. ನಾವು ಕಾಸ್ಟಿಂಗ್ ಪೌಡರ್, ನೋಜಲ್ ಫಿಲ್ಲಿಂಗ್ ಕಾಂಪೌಂಡ್, ಕ್ಯಾಸ್ಟಬಲ್ ಮತ್ತು ರಾಡೆಕ್ಸ್ ಉತ್ಪನ್ನಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.',
      'intro.cta': 'ಇನ್ನಷ್ಟು ಓದಿ', 'why.title': 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?', 'why.delivery.title': 'ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ವಿತರಣೆ',
      'why.delivery.body': 'ನಾವು ಸಮಯಪಾಲನೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ವಿತರಣೆಗೆ ಪ್ರಸಿದ್ಧ.',
      'why.quality.title': 'ಉದ್ಯಮ ಮಟ್ಟದ ಗುಣಮಟ್ಟ', 'why.quality.body': 'ನಾವು ನಿರಂತರವಾಗಿ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳನ್ನು ನೀಡುತ್ತೇವೆ.',
      'why.rd.title': 'ಶೋಧನೆ ಮತ್ತು ಅಭಿವೃದ್ಧಿ', 'why.rd.body': 'ಬಜಾರದ ಬೇಡಿಕೆಗೆ ತಕ್ಕಂತೆ ನಾವು R&D ಮಾಡುತ್ತೇವೆ.',
      'work.title': 'ನಮ್ಮ ಕೆಲಸ', 'work.subtitle': 'ಕಂಟಿನ್ಯೂಅಸ್ ಕಾಸ್ಟಿಂಗ್ ಯಂತ್ರಗಳಿಗಾಗಿ ಉನ್ನತ ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳನ್ನು ತಯಾರಿಸುತ್ತೇವೆ.',
      'products.casting.title': 'ಕಾಸ್ಟಿಂಗ್ ಪೌಡರ್', 'products.casting.body': 'ನಮ್ಮ ಕಾಸ್ಟಿಂಗ್ ಪೌಡರ್ ತ್ವರಿತವಾಗಿ ಸ್ಲ್ಯಾಗ್ ರಚಿಸಿ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      'products.nfc.title': 'ನೋಜಲ್ ಫಿಲ್ಲಿಂಗ್ ಕಾಂಪೌಂಡ್', 'products.nfc.body': 'ನಮ್ಮ NFC ಉತ್ತಮ ಪ್ರವಾಹ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಕಾರ್ಯಕ್ಷಮತೆ ನೀಡುತ್ತದೆ.',
      'products.castable.title': 'ಕಾಸ್ಟಬಲ್', 'products.castable.body': 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಪ್ರದೇಶಗಳಿಗೆ ಬಲವಾದ ಮತ್ತು ದೀರ್ಘಕಾಲಿಕ ಪರಿಹಾರ.',
      'products.radex.title': 'ರಾಡೆಕ್ಸ್', 'products.radex.body': 'ನಮ್ಮ ಲ್ಯಾಡಲ್ ಕವರ್ ಕಾಂಪೌಂಡ್ ತಾಪಹಾನಿ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
      'inquiry.title': 'ವಿಚಾರಣೆ', 'inquiry.subtitle': 'ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿ.',
      'contact.title': 'ಸಂಪರ್ಕಿಸಿ', 'contact.headOfficeLabel': 'ಮುಖ್ಯ ಕಚೇರಿ:', 'contact.address': 'ಸಿ 10, ಇಂಡಸ್ಟ್ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಹತ್ತಿರ, ಆದಿತ್ಯಪುರ, ಜಂಶೆಡ್ಪುರ, ಜಾರ್ಖಂಡ್',
      'footer.brand': 'ಪಿಕೆ ಇಂಡಸ್ಟ್ರೀಸ್', 'footer.brandBody': 'ನಾವು ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳಿಗೆ ಬದ್ಧರಾಗಿದ್ದೇವೆ.',
      'footer.quickLinks': 'ವೇಗದ ಲಿಂಕ್‌ಗಳು', 'footer.about': 'ನಮ್ಮ ಬಗ್ಗೆ', 'footer.whatWeDo': 'ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ', 'footer.contact': 'ಸಂಪರ್ಕ', 'footer.reachUs': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      'footer.contactDetails': 'ಸಂಪರ್ಕ ವಿವರಗಳು', 'footer.hours': 'ಸೋಮ-ಶನಿ ಬೆಳಗ್ಗೆ 8 ರಿಂದ ರಾತ್ರಿ 8', 'footer.copyright': '© 2022 ಪ್ರತಿಕೃತಿಹಕ್ಕು:'
    },
    ml: {
      'nav.home': 'ഹോം', 'nav.introduction': 'പരിചയം', 'nav.work': 'ഞങ്ങളുടെ ജോലി', 'nav.contact': 'ബന്ധപ്പെടുക',
      'staff.login': 'സ്റ്റാഫ് ലോഗിൻ', 'intro.title': 'പരിചയം',
      'intro.body': 'പി.കെ. ഇൻഡസ്ട്രീസ് വിശ്വസനീയ നിർമ്മാതാവാണ്. കാസ്റ്റിംഗ് പൗഡർ, നോസിൽ ഫില്ലിംഗ് കമ്പൗണ്ട്, കാസ്റ്റബിള്‍, റാഡെക്സ് ഉൽപ്പന്നങ്ങൾ ഞങ്ങൾ നൽകുന്നു.',
      'intro.cta': 'കൂടുതൽ വായിക്കുക', 'why.title': 'എന്തുകൊണ്ട് ഞങ്ങൾ?', 'why.delivery.title': 'സമയബന്ധിത ഡെലിവറി',
      'why.delivery.body': 'സമയത്ത് വിശ്വസനീയമായി ഡെലിവറി ചെയ്യുന്നതിൽ ഞങ്ങൾ പ്രശസ്തരാണ്.',
      'why.quality.title': 'ഉന്നത ഗുണമേന്മ', 'why.quality.body': 'ഞങ്ങൾ സ്ഥിരമായി ഉയർന്ന നിലവാരത്തിലുള്ള ഉൽപ്പന്നങ്ങൾ നൽകുന്നു.',
      'why.rd.title': 'ഗവേഷണവും വികസനവും', 'why.rd.body': 'പുതിയ വിപണി ആവശ്യങ്ങൾക്കായി ഞങ്ങൾ R&D തുടരുന്നു.',
      'work.title': 'ഞങ്ങളുടെ ജോലി', 'work.subtitle': 'കണ്ടിന്യുവസ് കാസ്റ്റിംഗ് മെഷീനുകൾക്കായി മികച്ച ഗുണമേന്മയുള്ള ഉൽപ്പന്നങ്ങൾ നിർമ്മിക്കുന്നു.',
      'products.casting.title': 'കാസ്റ്റിംഗ് പൗഡർ', 'products.casting.body': 'ഞങ്ങളുടെ കാസ്റ്റിംഗ് പൗഡർ വേഗത്തിൽ സ്ലാഗ് രൂപപ്പെടുത്തി പ്രവർത്തനം മെച്ചപ്പെടുത്തുന്നു.',
      'products.nfc.title': 'നോസിൽ ഫില്ലിംഗ് കമ്പൗണ്ട്', 'products.nfc.body': 'ഞങ്ങളുടെ NFC മികച്ച ഫ്ലോയും വിശ്വസനീയ പ്രകടനവും നൽകുന്നു.',
      'products.castable.title': 'കാസ്റ്റബിള്‍', 'products.castable.body': 'ഉയർന്ന താപനില പ്രദേശങ്ങൾക്ക് ദൃഢവും ദീർഘായുസ്സുള്ള പരിഹാരം.',
      'products.radex.title': 'റാഡെക്സ്', 'products.radex.body': 'ഞങ്ങളുടെ ലാഡിൽ കവർിംഗ് കമ്പൗണ്ട് ചൂട് നഷ്ടം കുറയ്ക്കുന്നു.',
      'inquiry.title': 'ചോദ്യം', 'inquiry.subtitle': 'താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ഫോം സമർപ്പിക്കുക.',
      'contact.title': 'ബന്ധപ്പെടുക', 'contact.headOfficeLabel': 'മുഖ്യ ഓഫീസ്:', 'contact.address': 'സി 10, ഇൻഡസ്ട്രിയൽ എസ്റ്റേറ്റിന് സമീപം, ആദിത്യപൂർ, ജംഷെഡ്പൂർ, ജാർഖണ്ഡ്',
      'footer.brand': 'പി.കെ ഇൻഡസ്ട്രീസ്', 'footer.brandBody': 'വിശ്വസനീയവും ഗുണമേന്മയുള്ള ഉൽപ്പന്നങ്ങൾ നൽകാൻ ഞങ്ങളുടെ ടീം പ്രതിബദ്ധമാണ്.',
      'footer.quickLinks': 'വേഗ ലിങ്കുകൾ', 'footer.about': 'ഞങ്ങളേക്കുറിച്ച്', 'footer.whatWeDo': 'ഞങ്ങൾ ചെയ്യുന്നത്', 'footer.contact': 'ബന്ധപ്പെടുക', 'footer.reachUs': 'ഞങ്ങളെ സമീപിക്കുക',
      'footer.contactDetails': 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ', 'footer.hours': 'തിങ്കൾ-ശനി രാവിലെ 8 മുതൽ രാത്രി 8 വരെ', 'footer.copyright': '© 2022 പകർപ്പവകാശം:'
    },
    pa: {
      'nav.home': 'ਮੁੱਖ ਪੰਨਾ', 'nav.introduction': 'ਜਾਣ-ਪਛਾਣ', 'nav.work': 'ਸਾਡਾ ਕੰਮ', 'nav.contact': 'ਸੰਪਰਕ ਕਰੋ',
      'staff.login': 'ਸਟਾਫ ਲੌਗਇਨ', 'intro.title': 'ਜਾਣ-ਪਛਾਣ',
      'intro.body': 'ਪੀ.ਕੇ. ਇੰਡਸਟ੍ਰੀਜ਼ ਇੱਕ ਭਰੋਸੇਯੋਗ ਨਿਰਮਾਤਾ ਹੈ। ਅਸੀਂ ਕਾਸਟਿੰਗ ਪਾਊਡਰ, ਨੋਜ਼ਲ ਫਿਲਿੰਗ ਕੰਪਾਊਂਡ, ਕਾਸਟੇਬਲ ਅਤੇ ਰੈਡੈਕਸ ਉਤਪਾਦ ਮੁਹੱਈਆ ਕਰਦੇ ਹਾਂ।',
      'intro.cta': 'ਹੋਰ ਪੜ੍ਹੋ', 'why.title': 'ਸਾਨੂੰ ਕਿਉਂ ਚੁਣੋ?', 'why.delivery.title': 'ਸਮੇਂ ਸਿਰ ਡਿਲਿਵਰੀ',
      'why.delivery.body': 'ਅਸੀਂ ਭਰੋਸੇਯੋਗ ਅਤੇ ਸਮੇਂ ਸਿਰ ਡਿਲਿਵਰੀ ਲਈ ਜਾਣੇ ਜਾਂਦੇ ਹਾਂ।',
      'why.quality.title': 'ਉੱਚ ਗੁਣਵੱਤਾ', 'why.quality.body': 'ਅਸੀਂ ਲਗਾਤਾਰ ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੇ ਉਤਪਾਦ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ।',
      'why.rd.title': 'ਖੋਜ ਅਤੇ ਵਿਕਾਸ', 'why.rd.body': 'ਬਾਜ਼ਾਰ ਦੀਆਂ ਲੋੜਾਂ ਲਈ ਅਸੀਂ ਨਿਰੰਤਰ R&D ਕਰਦੇ ਹਾਂ।',
      'work.title': 'ਸਾਡਾ ਕੰਮ', 'work.subtitle': 'ਕੰਟੀਨਿਊਅਸ ਕਾਸਟਿੰਗ ਮਸ਼ੀਨਾਂ ਲਈ ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੇ ਉਤਪਾਦ ਬਣਾਉਂਦੇ ਹਾਂ।',
      'products.casting.title': 'ਕਾਸਟਿੰਗ ਪਾਊਡਰ', 'products.casting.body': 'ਸਾਡਾ ਕਾਸਟਿੰਗ ਪਾਊਡਰ ਤੇਜ਼ੀ ਨਾਲ ਸਲੈਗ ਬਣਾਕੇ ਪ੍ਰਦਰਸ਼ਨ ਸੁਧਾਰਦਾ ਹੈ।',
      'products.nfc.title': 'ਨੋਜ਼ਲ ਫਿਲਿੰਗ ਕੰਪਾਊਂਡ', 'products.nfc.body': 'ਸਾਡਾ NFC ਵਧੀਆ ਫਲੋ ਅਤੇ ਭਰੋਸੇਯੋਗ ਪ੍ਰਦਰਸ਼ਨ ਦਿੰਦਾ ਹੈ।',
      'products.castable.title': 'ਕਾਸਟੇਬਲ', 'products.castable.body': 'ਉੱਚ ਤਾਪਮਾਨ ਲਈ ਮਜ਼ਬੂਤ ਅਤੇ ਟਿਕਾਊ ਹੱਲ।',
      'products.radex.title': 'ਰੈਡੈਕਸ', 'products.radex.body': 'ਸਾਡਾ ਲੈਡਲ ਕਵਰਿੰਗ ਕੰਪਾਊਂਡ ਤਾਪ ਘਾਟ ਘਟਾਉਂਦਾ ਹੈ।',
      'inquiry.title': 'ਪੜਤਾਲ', 'inquiry.subtitle': 'ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਫਾਰਮ ਭਰੋ।',
      'contact.title': 'ਸੰਪਰਕ ਕਰੋ', 'contact.headOfficeLabel': 'ਮੁੱਖ ਦਫ਼ਤਰ:', 'contact.address': 'ਸੀ 10, ਇੰਡਸਟ੍ਰੀਅਲ ਏਰੀਆ ਨੇੜੇ, ਆਦਿਤਯਾਪੁਰ, ਜਮਸ਼ੇਦਪੁਰ, ਝਾਰਖੰਡ',
      'footer.brand': 'ਪੀਕੇ ਇੰਡਸਟ੍ਰੀਜ਼', 'footer.brandBody': 'ਸਾਡੀ ਟੀਮ ਭਰੋਸੇਯੋਗ ਅਤੇ ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੇ ਉਤਪਾਦਾਂ ਲਈ ਵਚਨਬੱਧ ਹੈ।',
      'footer.quickLinks': 'ਤੁਰੰਤ ਲਿੰਕ', 'footer.about': 'ਸਾਡੇ ਬਾਰੇ', 'footer.whatWeDo': 'ਅਸੀਂ ਕੀ ਕਰਦੇ ਹਾਂ', 'footer.contact': 'ਸੰਪਰਕ', 'footer.reachUs': 'ਸਾਡੇ ਤੱਕ ਪਹੁੰਚੋ',
      'footer.contactDetails': 'ਸੰਪਰਕ ਵੇਰਵੇ', 'footer.hours': 'ਸੋਮ-ਸ਼ਨੀ ਸਵੇਰੇ 8 ਤੋਂ ਰਾਤ 8 ਵਜੇ ਤੱਕ', 'footer.copyright': '© 2022 ਕਾਪੀਰਾਈਟ:'
    }
  };

  var heroLines = {
    en: ['HIGH PERFORMANCE REFRACTORY SOLUTIONS', 'PRECISION ENGINEERED FOR STEELMAKING', 'TRUSTED QUALITY. FASTER DELIVERY.'],
    hi: ['उच्च प्रदर्शन रिफ्रैक्टरी समाधान', 'स्टील निर्माण के लिए प्रिसीजन इंजीनियरिंग', 'विश्वसनीय गुणवत्ता, तेज डिलीवरी'],
    bn: ['উচ্চ কর্মক্ষম রিফ্র্যাক্টরি সমাধান', 'স্টিল উৎপাদনের জন্য নিখুঁত ইঞ্জিনিয়ারিং', 'বিশ্বস্ত মান, দ্রুত ডেলিভারি'],
    ta: ['உயர் செயல்திறன் ரிஃப்ராக்டரி தீர்வுகள்', 'இரும்பு உற்பத்திக்கான துல்லிய பொறியியல்', 'நம்பகமான தரம், வேகமான விநியோகம்'],
    te: ['అధిక పనితీరు రిఫ్రాక్టరీ పరిష్కారాలు', 'స్టీల్ తయారీకి ఖచ్చితమైన ఇంజినీరింగ్', 'నమ్మకమైన నాణ్యత, వేగవంతమైన డెలివరీ'],
    mr: ['उच्च कार्यक्षमता रिफ्रॅक्टरी उपाय', 'स्टीलमेकिंगसाठी अचूक अभियांत्रिकी', 'विश्वासार्ह गुणवत्ता, जलद डिलिव्हरी'],
    gu: ['ઉચ્ચ પ્રદર્શન રિફ્રેક્ટરી સોલ્યુશન્સ', 'સ્ટીલમેકિંગ માટે પ્રિસિઝન એન્જિનિયરિંગ', 'વિશ્વસનીય ગુણવત્તા, ઝડપી ડિલિવરી'],
    kn: ['ಉನ್ನತ ಕಾರ್ಯಕ್ಷಮತೆಯ ರಿಫ್ರ್ಯಾಕ್ಟರಿ ಪರಿಹಾರಗಳು', 'ಉಕ್ಕು ತಯಾರಿಕೆಗೆ ನಿಖರ ಇಂಜಿನಿಯರಿಂಗ್', 'ವಿಶ್ವಾಸಾರ್ಹ ಗುಣಮಟ್ಟ, ವೇಗದ ವಿತರಣೆ'],
    ml: ['ഉയർന്ന പ്രകടന റിഫ്രാക്ടറി പരിഹാരങ്ങൾ', 'സ്റ്റീൽ നിർമ്മാണത്തിന് കൃത്യതയുള്ള എഞ്ചിനീയറിംഗ്', 'വിശ്വാസയോഗ്യ ഗുണമേന്മ, വേഗത്തിലുള്ള ഡെലിവറി'],
    pa: ['ਉੱਚ ਪ੍ਰਦਰਸ਼ਨ ਰਿਫ੍ਰੈਕਟਰੀ ਹੱਲ', 'ਸਟੀਲ ਬਣਾਉਣ ਲਈ ਪ੍ਰਿਸੀਜ਼ਨ ਇੰਜੀਨੀਅਰਿੰਗ', 'ਭਰੋਸੇਮੰਦ ਗੁਣਵੱਤਾ, ਤੇਜ਼ ਡਿਲਿਵਰੀ']
  };

  var currentLang = 'en';

  function resolveText(lang, key) {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return (translations.en && translations.en[key]) || '';
  }

  function applyLanguage(lang) {
    if (supported.indexOf(lang) === -1) {
      lang = 'en';
    }

    currentLang = lang;
    document.documentElement.setAttribute('lang', langToHtml[lang] || 'en-IN');

    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      var text = resolveText(lang, key);
      if (text) {
        node.textContent = text;
      }
    });

    var selector = document.getElementById('langSwitcher');
    if (selector) {
      selector.value = lang;
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_err) {}

    window.dispatchEvent(new CustomEvent('pki:languageChanged', { detail: { lang: lang } }));
  }

  function pickInitialLanguage() {
    var saved = 'en';
    try {
      saved = localStorage.getItem(STORAGE_KEY) || '';
    } catch (_err) {}

    if (supported.indexOf(saved) !== -1) {
      return saved;
    }

    var browser = ((navigator.language || 'en').split('-')[0] || 'en').toLowerCase();
    return supported.indexOf(browser) !== -1 ? browser : 'en';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var selector = document.getElementById('langSwitcher');
    if (selector) {
      selector.addEventListener('change', function (e) {
        applyLanguage(e.target.value);
      });
    }

    applyLanguage(pickInitialLanguage());
  });

  window.PKI_I18N = {
    getCurrentLanguage: function () { return currentLang; },
    getHeroLines: function () { return heroLines[currentLang] || heroLines.en; }
  };
})();
