
export interface WordData {
  id: string;
  word: string;
  pronunciation: string;
  chineseDefinition: string;
  partOfSpeech: string;
  category: string;
  frequency: string;
  textbook: string;
  examples: string[];
}

export const wordData: WordData[] = [
  {
    id: "1",
    word: "happy",
    pronunciation: "/ˈhæpi/",
    chineseDefinition: "快乐的",
    partOfSpeech: "adjective",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I am happy today.", "They had a happy celebration."],
  },
  {
    id: "2",
    word: "eat",
    pronunciation: "/iːt/",
    chineseDefinition: "吃",
    partOfSpeech: "verb",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I eat breakfast every morning.", "Let's eat dinner together."],
  },
  {
    id: "3",
    word: "book",
    pronunciation: "/bʊk/",
    chineseDefinition: "书",
    partOfSpeech: "noun",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I read a book.", "She bought a new book."],
  },
  {
    id: "4",
    word: "big",
    pronunciation: "/bɪɡ/",
    chineseDefinition: "大的",
    partOfSpeech: "adjective",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["That's a big house.", "He has a big smile."],
  },
  {
    id: "5",
    word: "run",
    pronunciation: "/rʌn/",
    chineseDefinition: "跑",
    partOfSpeech: "verb",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["He can run very fast.", "They run every morning."],
  },
  {
    id: "6",
    word: "beautiful",
    pronunciation: "/ˈbjuːtəfəl/",
    chineseDefinition: "美丽的",
    partOfSpeech: "adjective",
    category: "高考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["The sunset is beautiful.", "She has a beautiful smile."],
  },
  {
    id: "7",
    word: "computer",
    pronunciation: "/kəmˈpjuːtər/",
    chineseDefinition: "电脑",
    partOfSpeech: "noun",
    category: "Technology",
    frequency: "high",
    textbook: "Modern English",
    examples: ["I work on my computer.", "The computer is broken."],
  },
  {
    id: "8",
    word: "write",
    pronunciation: "/raɪt/",
    chineseDefinition: "写",
    partOfSpeech: "verb",
    category: "高考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I write in my diary every day.", "She writes beautiful stories."],
  },
  {
    id: "9",
    word: "friend",
    pronunciation: "/frend/",
    chineseDefinition: "朋友",
    partOfSpeech: "noun",
    category: "Basic",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["She is my best friend.", "I made a new friend today."],
  },
  {
    id: "10",
    word: "small",
    pronunciation: "/smɔːl/",
    chineseDefinition: "小的",
    partOfSpeech: "adjective",
    category: "高考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["It's a small world.", "I live in a small apartment."],
  },
  {
    id: "11",
    word: "phone",
    pronunciation: "/fəʊn/",
    chineseDefinition: "电话",
    partOfSpeech: "noun",
    category: "Technology",
    frequency: "high",
    textbook: "Modern English",
    examples: ["My phone is ringing.", "I need a new phone."],
  },
  {
    id: "12",
    word: "learn",
    pronunciation: "/lɜːn/",
    chineseDefinition: "学习",
    partOfSpeech: "verb",
    category: "Education",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I want to learn English.", "They learn quickly."],
  },
  {
    id: "13",
    word: "family",
    pronunciation: "/ˈfæmɪli/",
    chineseDefinition: "家庭",
    partOfSpeech: "noun",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I love my family.", "We are a happy family."],
  },
  {
    id: "14",
    word: "sleep",
    pronunciation: "/sliːp/",
    chineseDefinition: "睡觉",
    partOfSpeech: "verb",
    category: "高考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I need to sleep.", "The baby is sleeping."],
  },
  {
    id: "15",
    word: "food",
    pronunciation: "/fuːd/",
    chineseDefinition: "食物",
    partOfSpeech: "noun",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["The food is delicious.", "I love Chinese food."],
  },
  {
    id: "16",
    word: "play",
    pronunciation: "/pleɪ/",
    chineseDefinition: "玩",
    partOfSpeech: "verb",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["Children love to play.", "Let's play a game."],
  },
  {
    id: "17",
    word: "weather",
    pronunciation: "/ˈweðər/",
    chineseDefinition: "天气",
    partOfSpeech: "noun",
    category: "Nature",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["The weather is nice today.", "I check the weather forecast."],
  },
  {
    id: "18",
    word: "study",
    pronunciation: "/ˈstʌdi/",
    chineseDefinition: "学习",
    partOfSpeech: "verb",
    category: "Education",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I study English every day.", "She studies hard."],
  },
  {
    id: "19",
    word: "time",
    pronunciation: "/taɪm/",
    chineseDefinition: "时间",
    partOfSpeech: "noun",
    category: "中考",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["What time is it?", "I have no time."],
  },
  {
    id: "20",
    word: "water",
    pronunciation: "/ˈwɔːtər/",
    chineseDefinition: "水",
    partOfSpeech: "noun",
    category: "Nature",
    frequency: "high",
    textbook: "Beginner English",
    examples: ["I drink water every day.", "The water is clean."],
  }
];
