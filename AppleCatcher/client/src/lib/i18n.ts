export type Language = 'ko' | 'en' | 'zh';

export interface Translations {
  ko: TranslationMessages;
  en: TranslationMessages;
  zh: TranslationMessages;
}

export interface TranslationMessages {
  // Game UI
  score: string;
  time: string;
  hint: string;
  hints: string;
  
  // Instructions
  dragInstruction: string;
  touchInstruction: string;
  
  // Game states
  gameReady: string;
  gameOver: string;
  perfectGame: string;
  
  // Buttons
  startGame: string;
  restart: string;
  playAgain: string;
  
  // Leaderboard
  ranking: string;
  daily: string;
  weekly: string;
  monthly: string;
  allTime: string;
  playerName: string;
  noRecords: string;
  
  // Score submission
  submitScore: string;
  enterName: string;
  submit: string;
  cancel: string;
  congratulations: string;
  finalScore: string;
  completionTime: string;
  timeUp: string;
  
  // Game messages
  validSelection: string;
  invalidSelection: string;
  hintUsed: string;
  noHintsLeft: string;
  
  // Units
  seconds: string;
  minutes: string;
  points: string;
}

export const translations: Translations = {
  ko: {
    // Game UI
    score: "점수",
    time: "시간",
    hint: "힌트",
    hints: "힌트",
    
    // Instructions
    dragInstruction: "합이 10이 되는 사과들을 드래그하세요",
    touchInstruction: "터치로 사과들을 선택하세요 (합=10)",
    
    // Game states
    gameReady: "게임 시작 준비완료",
    gameOver: "게임 종료",
    perfectGame: "완벽한 게임!",
    
    // Buttons
    startGame: "게임 시작",
    restart: "다시 시작",
    playAgain: "다시 플레이",
    
    // Leaderboard
    ranking: "랭킹",
    daily: "일간",
    weekly: "주간", 
    monthly: "월간",
    allTime: "전체",
    playerName: "플레이어",
    noRecords: "아직 기록이 없습니다",
    
    // Score submission
    submitScore: "점수 등록",
    enterName: "이름을 입력하세요",
    submit: "등록",
    cancel: "취소",
    congratulations: "축하합니다!",
    finalScore: "최종 점수",
    completionTime: "완료 시간",
    timeUp: "시간 종료!",
    
    // Game messages
    validSelection: "훌륭합니다!",
    invalidSelection: "합이 10이 되지 않습니다",
    hintUsed: "힌트를 사용했습니다",
    noHintsLeft: "힌트가 모두 소진되었습니다",
    
    // Units
    seconds: "초",
    minutes: "분",
    points: "점"
  },
  
  en: {
    // Game UI
    score: "Score",
    time: "Time",
    hint: "Hint",
    hints: "Hints",
    
    // Instructions
    dragInstruction: "Drag apples that sum to 10",
    touchInstruction: "Touch to select apples (sum=10)",
    
    // Game states
    gameReady: "Ready to Start",
    gameOver: "Game Over",
    perfectGame: "Perfect Game!",
    
    // Buttons
    startGame: "Start Game",
    restart: "Restart",
    playAgain: "Play Again",
    
    // Leaderboard
    ranking: "Ranking",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly", 
    allTime: "All Time",
    playerName: "Player",
    noRecords: "No records yet",
    
    // Score submission
    submitScore: "Submit Score",
    enterName: "Enter your name",
    submit: "Submit",
    cancel: "Cancel",
    congratulations: "Congratulations!",
    finalScore: "Final Score",
    completionTime: "Completion Time",
    timeUp: "Time's Up!",
    
    // Game messages
    validSelection: "Great!",
    invalidSelection: "Numbers don't sum to 10",
    hintUsed: "Hint used",
    noHintsLeft: "No hints left",
    
    // Units
    seconds: "sec",
    minutes: "min",
    points: "pts"
  },
  
  zh: {
    // Game UI
    score: "分数",
    time: "时间",
    hint: "提示",
    hints: "提示",
    
    // Instructions
    dragInstruction: "拖拽总和为10的苹果",
    touchInstruction: "触摸选择苹果（总和=10）",
    
    // Game states
    gameReady: "准备开始",
    gameOver: "游戏结束",
    perfectGame: "完美游戏！",
    
    // Buttons
    startGame: "开始游戏",
    restart: "重新开始",
    playAgain: "再次游戏",
    
    // Leaderboard
    ranking: "排行榜",
    daily: "日榜",
    weekly: "周榜",
    monthly: "月榜",
    allTime: "总榜",
    playerName: "玩家",
    noRecords: "暂无记录",
    
    // Score submission
    submitScore: "提交分数",
    enterName: "请输入姓名",
    submit: "提交",
    cancel: "取消",
    congratulations: "恭喜！",
    finalScore: "最终分数",
    completionTime: "完成时间",
    timeUp: "时间到！",
    
    // Game messages
    validSelection: "太棒了！",
    invalidSelection: "数字总和不等于10",
    hintUsed: "已使用提示",
    noHintsLeft: "没有提示了",
    
    // Units
    seconds: "秒",
    minutes: "分",
    points: "分"
  }
};

export function detectLanguage(): Language {
  // Check localStorage first
  const saved = localStorage.getItem('apple-game-language') as Language;
  if (saved && ['ko', 'en', 'zh'].includes(saved)) {
    return saved;
  }
  
  // Detect from browser language
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('zh')) return 'zh';
  return 'en'; // Default to English
}

export function saveLanguage(lang: Language) {
  localStorage.setItem('apple-game-language', lang);
}

export function getTranslation(lang: Language, key: keyof TranslationMessages): string {
  return translations[lang][key] || translations['en'][key] || key;
}