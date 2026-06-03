export type Locale =
  | "en"
  | "ja"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "hi"
  | "id"
  | "ko"
  | "zh";

export type Translations = {
  eyebrow: string;
  title: string;
  subtitleBefore: string;
  subtitleAfter: string;
  globalTaps: string;
  tap: string;
  online: (count: string) => string;
  countriesLive: (count: number) => string;
  yourGlobalRank: string;
  tapToClaimRank: string;
  yourCountryRank: string;
  outsideRanking: string;
  tapToCompete: string;
  founderBadge: string;
  badgeFounder: string;
  badgePioneer: string;
  badgeEarlyMember: string;
  badgeChallenger: string;
  joinEarlyToUnlock: string;
  yourTaps: string;
  countryRanking: string;
  noDataYet: string;
  shareJoined: string;
  shareProjectName: string;
  shareWhenBefore: string;
  shareWhenAfter: string;
  shareQuestion: string;
  proofGlobalRank: string;
  proofCountryRank: string;
  proofFounderBadge: string;
  proofGlobalTaps: string;
  shareNow: string;
  copyLink: string;
  copied: string;
  shareTitle: string;
  shareMessageIntro: (total: string) => string;
  shareGlobalRank: (rank: string) => string;
  shareBadge: (badge: string, fraction: string) => string;
  shareCountryRank: (rank: number, country: string) => string;
  countryNames: Record<string, string>;
};

const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  ja: "ja-JP",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  hi: "hi-IN",
  id: "id-ID",
  ko: "ko-KR",
  zh: "zh-CN",
};

const en: Translations = {
  eyebrow: "GLOBAL INTERNET CHALLENGE",
  title: "ONE TRILLION",
  subtitleBefore: "Humanity is trying to press this button ",
  subtitleAfter: " times.",
  globalTaps: "GLOBAL TAPS",
  tap: "TAP",
  online: (count) => `🌍 ${count} online`,
  countriesLive: (count) => `🔥 ${count} countries`,
  yourGlobalRank: "Your Global Rank",
  tapToClaimRank: "Tap to claim your rank",
  yourCountryRank: "Your Country Rank",
  outsideRanking: " · outside ranking",
  tapToCompete: " · tap to compete",
  founderBadge: "Founder Badge",
  badgeFounder: "Founder",
  badgePioneer: "Pioneer",
  badgeEarlyMember: "Early Member",
  badgeChallenger: "Challenger",
  joinEarlyToUnlock: "Join early to unlock",
  yourTaps: "Your Taps",
  countryRanking: "🏆 Country Ranking",
  noDataYet: "No data yet — tap to start.",
  shareJoined: "I joined",
  shareProjectName: "THE TRILLION PROJECT",
  shareWhenBefore: "when there were only ",
  shareWhenAfter: " taps.",
  shareQuestion: "Can humanity reach one trillion?",
  proofGlobalRank: "Global Rank",
  proofCountryRank: "Country Rank",
  proofFounderBadge: "Founder Badge",
  proofGlobalTaps: "Global Taps",
  shareNow: "SHARE NOW",
  copyLink: "COPY LINK",
  copied: "COPIED ✓",
  shareTitle: "ONE TRILLION",
  shareMessageIntro: (total) =>
    `I joined THE TRILLION PROJECT when there were only ${total} taps.`,
  shareGlobalRank: (rank) => `Global rank: #${rank}`,
  shareBadge: (badge, fraction) => `Badge: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Country rank: #${rank} (${country})`,
  countryNames: {
    US: "United States",
    JP: "Japan",
    KR: "Korea",
    CN: "China",
    BR: "Brazil",
    ES: "Spain",
    IN: "India",
    ID: "Indonesia",
    DE: "Germany",
    FR: "France",
    GB: "United Kingdom",
    MX: "Mexico",
    PH: "Philippines",
    VN: "Vietnam",
    TH: "Thailand",
  },
};

const ja: Translations = {
  ...en,
  eyebrow: "世界インターネットチャレンジ",
  subtitleBefore: "人類はこのボタンを",
  subtitleAfter: "回押そうとしています。",
  globalTaps: "世界のタップ数",
  tap: "タップ",
  online: (count) => `🌍 ${count} 人オンライン`,
  countriesLive: (count) => `🔥 ${count} カ国`,
  yourGlobalRank: "あなたの世界ランク",
  tapToClaimRank: "タップしてランクを獲得",
  yourCountryRank: "あなたの国ランク",
  outsideRanking: " · ランキング圏外",
  tapToCompete: " · タップして参加",
  founderBadge: "創設者バッジ",
  badgeFounder: "創設者",
  badgePioneer: "開拓者",
  badgeEarlyMember: "アーリーメンバー",
  badgeChallenger: "チャレンジャー",
  joinEarlyToUnlock: "早めに参加して解除",
  yourTaps: "あなたのタップ数",
  countryRanking: "🏆 国別ランキング",
  noDataYet: "データなし — タップして開始。",
  shareJoined: "参加しました",
  shareProjectName: "ザ・トリリオンプロジェクト",
  shareWhenBefore: "タップ数がわずか ",
  shareWhenAfter: " 回のときに",
  shareQuestion: "人類は1兆に到達できるか？",
  proofGlobalRank: "世界ランク",
  proofCountryRank: "国ランク",
  proofFounderBadge: "創設者バッジ",
  proofGlobalTaps: "世界のタップ数",
  shareNow: "今すぐシェア",
  copyLink: "リンクをコピー",
  copied: "コピーしました ✓",
  shareMessageIntro: (total) =>
    `タップ数がわずか${total}回のときに、ザ・トリリオンプロジェクトに参加しました。`,
  shareGlobalRank: (rank) => `世界ランク: #${rank}`,
  shareBadge: (badge, fraction) => `バッジ: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `国ランク: #${rank} (${country})`,
  countryNames: {
    US: "アメリカ合衆国",
    JP: "日本",
    KR: "韓国",
    CN: "中国",
    BR: "ブラジル",
    ES: "スペイン",
    IN: "インド",
    ID: "インドネシア",
    DE: "ドイツ",
    FR: "フランス",
    GB: "イギリス",
    MX: "メキシコ",
    PH: "フィリピン",
    VN: "ベトナム",
    TH: "タイ",
  },
};

const es: Translations = {
  ...en,
  eyebrow: "DESAFÍO GLOBAL DE INTERNET",
  subtitleBefore: "La humanidad intenta presionar este botón ",
  subtitleAfter: " veces.",
  globalTaps: "TOQUES GLOBALES",
  tap: "TOCAR",
  online: (count) => `🌍 ${count} en línea`,
  countriesLive: (count) => `🔥 ${count} países`,
  yourGlobalRank: "Tu rango global",
  tapToClaimRank: "Toca para reclamar tu rango",
  yourCountryRank: "Tu rango nacional",
  outsideRanking: " · fuera del ranking",
  tapToCompete: " · toca para competir",
  founderBadge: "Insignia de fundador",
  badgeFounder: "Fundador",
  badgePioneer: "Pionero",
  badgeEarlyMember: "Miembro temprano",
  badgeChallenger: "Retador",
  joinEarlyToUnlock: "Únete pronto para desbloquear",
  yourTaps: "Tus toques",
  countryRanking: "🏆 Ranking por país",
  noDataYet: "Sin datos — toca para empezar.",
  shareJoined: "Me uní a",
  shareProjectName: "EL PROYECTO TRILLÓN",
  shareWhenBefore: "cuando solo había ",
  shareWhenAfter: " toques.",
  shareQuestion: "¿Puede la humanidad llegar a un billón?",
  proofGlobalRank: "Rango global",
  proofCountryRank: "Rango nacional",
  proofFounderBadge: "Insignia de fundador",
  proofGlobalTaps: "Toques globales",
  shareNow: "COMPARTIR AHORA",
  copyLink: "COPIAR ENLACE",
  copied: "COPIADO ✓",
  shareMessageIntro: (total) =>
    `Me uní a EL PROYECTO TRILLÓN cuando solo había ${total} toques.`,
  shareGlobalRank: (rank) => `Rango global: #${rank}`,
  shareBadge: (badge, fraction) => `Insignia: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Rango nacional: #${rank} (${country})`,
  countryNames: {
    US: "Estados Unidos",
    JP: "Japón",
    KR: "Corea",
    CN: "China",
    BR: "Brasil",
    ES: "España",
  },
};

const fr: Translations = {
  ...en,
  eyebrow: "DÉFI INTERNET MONDIAL",
  subtitleBefore: "L'humanité essaie d'appuyer sur ce bouton ",
  subtitleAfter: " fois.",
  globalTaps: "APPUIS MONDIAUX",
  tap: "APPUYER",
  online: (count) => `🌍 ${count} en ligne`,
  countriesLive: (count) => `🔥 ${count} pays`,
  yourGlobalRank: "Votre rang mondial",
  tapToClaimRank: "Appuyez pour obtenir votre rang",
  yourCountryRank: "Votre rang national",
  outsideRanking: " · hors du classement",
  tapToCompete: " · appuyez pour participer",
  founderBadge: "Badge fondateur",
  badgeFounder: "Fondateur",
  badgePioneer: "Pionnier",
  badgeEarlyMember: "Membre précoce",
  badgeChallenger: "Challenger",
  joinEarlyToUnlock: "Rejoignez tôt pour débloquer",
  yourTaps: "Vos appuis",
  countryRanking: "🏆 Classement par pays",
  noDataYet: "Pas de données — appuyez pour commencer.",
  shareJoined: "J'ai rejoint",
  shareProjectName: "LE PROJET TRILLION",
  shareWhenBefore: "alors qu'il n'y avait que ",
  shareWhenAfter: " appuis.",
  shareQuestion: "L'humanité peut-elle atteindre un billion ?",
  proofGlobalRank: "Rang mondial",
  proofCountryRank: "Rang national",
  proofFounderBadge: "Badge fondateur",
  proofGlobalTaps: "Appuis mondiaux",
  shareNow: "PARTAGER",
  copyLink: "COPIER LE LIEN",
  copied: "COPIÉ ✓",
  shareMessageIntro: (total) =>
    `J'ai rejoint LE PROJET TRILLION alors qu'il n'y avait que ${total} appuis.`,
  shareGlobalRank: (rank) => `Rang mondial : #${rank}`,
  shareBadge: (badge, fraction) => `Badge : ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Rang national : #${rank} (${country})`,
  countryNames: {
    US: "États-Unis",
    JP: "Japon",
    KR: "Corée",
    CN: "Chine",
    BR: "Brésil",
    ES: "Espagne",
  },
};

const de: Translations = {
  ...en,
  eyebrow: "GLOBALE INTERNET-HERAUSFORDERUNG",
  subtitleBefore: "Die Menschheit versucht, diesen Button ",
  subtitleAfter: " Mal zu drücken.",
  globalTaps: "GLOBALE TAPS",
  tap: "TIPPEN",
  online: (count) => `🌍 ${count} online`,
  countriesLive: (count) => `🔥 ${count} Länder`,
  yourGlobalRank: "Dein globaler Rang",
  tapToClaimRank: "Tippe, um deinen Rang zu sichern",
  yourCountryRank: "Dein Länder-Rang",
  outsideRanking: " · außerhalb des Rankings",
  tapToCompete: " · tippe zum Mitmachen",
  founderBadge: "Gründer-Abzeichen",
  badgeFounder: "Gründer",
  badgePioneer: "Pionier",
  badgeEarlyMember: "Frühes Mitglied",
  badgeChallenger: "Herausforderer",
  joinEarlyToUnlock: "Früh beitreten zum Freischalten",
  yourTaps: "Deine Taps",
  countryRanking: "🏆 Länder-Ranking",
  noDataYet: "Noch keine Daten — tippe zum Starten.",
  shareJoined: "Ich bin beigetreten:",
  shareProjectName: "DAS TRILLION-PROJEKT",
  shareWhenBefore: "als es nur ",
  shareWhenAfter: " Taps gab.",
  shareQuestion: "Schafft die Menschheit eine Billion?",
  proofGlobalRank: "Globaler Rang",
  proofCountryRank: "Länder-Rang",
  proofFounderBadge: "Gründer-Abzeichen",
  proofGlobalTaps: "Globale Taps",
  shareNow: "JETZT TEILEN",
  copyLink: "LINK KOPIEREN",
  copied: "KOPIERT ✓",
  shareMessageIntro: (total) =>
    `Ich bin DAS TRILLION-PROJEKT beigetreten, als es nur ${total} Taps gab.`,
  shareGlobalRank: (rank) => `Globaler Rang: #${rank}`,
  shareBadge: (badge, fraction) => `Abzeichen: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Länder-Rang: #${rank} (${country})`,
  countryNames: {
    US: "Vereinigte Staaten",
    JP: "Japan",
    KR: "Korea",
    CN: "China",
    BR: "Brasilien",
    ES: "Spanien",
  },
};

const pt: Translations = {
  ...en,
  eyebrow: "DESAFIO GLOBAL DA INTERNET",
  subtitleBefore: "A humanidade está tentando apertar este botão ",
  subtitleAfter: " vezes.",
  globalTaps: "TOQUES GLOBAIS",
  tap: "TOCAR",
  online: (count) => `🌍 ${count} online`,
  countriesLive: (count) => `🔥 ${count} países`,
  yourGlobalRank: "Seu ranking global",
  tapToClaimRank: "Toque para garantir seu ranking",
  yourCountryRank: "Seu ranking nacional",
  outsideRanking: " · fora do ranking",
  tapToCompete: " · toque para competir",
  founderBadge: "Emblema de fundador",
  badgeFounder: "Fundador",
  badgePioneer: "Pioneiro",
  badgeEarlyMember: "Membro antecipado",
  badgeChallenger: "Desafiante",
  joinEarlyToUnlock: "Entre cedo para desbloquear",
  yourTaps: "Seus toques",
  countryRanking: "🏆 Ranking por país",
  noDataYet: "Sem dados — toque para começar.",
  shareJoined: "Eu entrei no",
  shareProjectName: "PROJETO TRILHÃO",
  shareWhenBefore: "quando havia apenas ",
  shareWhenAfter: " toques.",
  shareQuestion: "A humanidade consegue chegar a um trilhão?",
  proofGlobalRank: "Ranking global",
  proofCountryRank: "Ranking nacional",
  proofFounderBadge: "Emblema de fundador",
  proofGlobalTaps: "Toques globais",
  shareNow: "COMPARTILHAR AGORA",
  copyLink: "COPIAR LINK",
  copied: "COPIADO ✓",
  shareMessageIntro: (total) =>
    `Eu entrei no PROJETO TRILHÃO quando havia apenas ${total} toques.`,
  shareGlobalRank: (rank) => `Ranking global: #${rank}`,
  shareBadge: (badge, fraction) => `Emblema: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Ranking nacional: #${rank} (${country})`,
  countryNames: {
    US: "Estados Unidos",
    JP: "Japão",
    KR: "Coreia",
    CN: "China",
    BR: "Brasil",
    ES: "Espanha",
  },
};

const hi: Translations = {
  ...en,
  eyebrow: "वैश्विक इंटरनेट चुनौती",
  subtitleBefore: "मानवता इस बटन को ",
  subtitleAfter: " बार दबाने की कोशिश कर रही है।",
  globalTaps: "वैश्विक टैप",
  tap: "टैप",
  online: (count) => `🌍 ${count} ऑनलाइन`,
  countriesLive: (count) => `🔥 ${count} देश`,
  yourGlobalRank: "आपकी वैश्विक रैंक",
  tapToClaimRank: "रैंक पाने के लिए टैप करें",
  yourCountryRank: "आपकी देश रैंक",
  outsideRanking: " · रैंकिंग से बाहर",
  tapToCompete: " · प्रतिस्पर्धा के लिए टैप करें",
  founderBadge: "संस्थापक बैज",
  badgeFounder: "संस्थापक",
  badgePioneer: "अग्रदूत",
  badgeEarlyMember: "प्रारंभिक सदस्य",
  badgeChallenger: "चैलेंजर",
  joinEarlyToUnlock: "अनलॉक करने के लिए जल्दी शामिल हों",
  yourTaps: "आपके टैप",
  countryRanking: "🏆 देश रैंकिंग",
  noDataYet: "अभी कोई डेटा नहीं — शुरू करने के लिए टैप करें।",
  shareJoined: "मैं शामिल हुआ",
  shareProjectName: "द ट्रिलियन प्रोजेक्ट",
  shareWhenBefore: "जब केवल ",
  shareWhenAfter: " टैप थे।",
  shareQuestion: "क्या मानवता एक trillion तक पहुँच सकती है?",
  proofGlobalRank: "वैश्विक रैंक",
  proofCountryRank: "देश रैंक",
  proofFounderBadge: "संस्थापक बैज",
  proofGlobalTaps: "वैश्विक टैप",
  shareNow: "अभी शेयर करें",
  copyLink: "लिंक कॉपी करें",
  copied: "कॉपी हो गया ✓",
  shareMessageIntro: (total) =>
    `जब केवल ${total} टैप थे, तब मैं द ट्रिलियन प्रोजेक्ट में शामिल हुआ।`,
  shareGlobalRank: (rank) => `वैश्विक रैंक: #${rank}`,
  shareBadge: (badge, fraction) => `बैज: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `देश रैंक: #${rank} (${country})`,
  countryNames: {
    US: "संयुक्त राज्य अमेरिका",
    JP: "जापान",
    KR: "कोरिया",
    CN: "चीन",
    BR: "ब्राज़ील",
    ES: "स्पेन",
  },
};

const id: Translations = {
  ...en,
  eyebrow: "TANTANGAN INTERNET GLOBAL",
  subtitleBefore: "Umat manusia mencoba menekan tombol ini ",
  subtitleAfter: " kali.",
  globalTaps: "TAP GLOBAL",
  tap: "TAP",
  online: (count) => `🌍 ${count} online`,
  countriesLive: (count) => `🔥 ${count} negara`,
  yourGlobalRank: "Peringkat globalmu",
  tapToClaimRank: "Tap untuk klaim peringkatmu",
  yourCountryRank: "Peringkat negaramu",
  outsideRanking: " · di luar ranking",
  tapToCompete: " · tap untuk bersaing",
  founderBadge: "Lencana pendiri",
  badgeFounder: "Pendiri",
  badgePioneer: "Perintis",
  badgeEarlyMember: "Anggota awal",
  badgeChallenger: "Penantang",
  joinEarlyToUnlock: "Gabung lebih awal untuk membuka",
  yourTaps: "Tap kamu",
  countryRanking: "🏆 Peringkat negara",
  noDataYet: "Belum ada data — tap untuk mulai.",
  shareJoined: "Saya bergabung dengan",
  shareProjectName: "PROYEK TRILIUN",
  shareWhenBefore: "ketika hanya ada ",
  shareWhenAfter: " tap.",
  shareQuestion: "Bisakah umat manusia mencapai satu triliun?",
  proofGlobalRank: "Peringkat global",
  proofCountryRank: "Peringkat negara",
  proofFounderBadge: "Lencana pendiri",
  proofGlobalTaps: "Tap global",
  shareNow: "BAGIKAN SEKARANG",
  copyLink: "SALIN TAUTAN",
  copied: "TERSALIN ✓",
  shareMessageIntro: (total) =>
    `Saya bergabung dengan PROYEK TRILIUN ketika hanya ada ${total} tap.`,
  shareGlobalRank: (rank) => `Peringkat global: #${rank}`,
  shareBadge: (badge, fraction) => `Lencana: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `Peringkat negara: #${rank} (${country})`,
  countryNames: {
    US: "Amerika Serikat",
    JP: "Jepang",
    KR: "Korea",
    CN: "Tiongkok",
    BR: "Brasil",
    ES: "Spanyol",
  },
};

const ko: Translations = {
  ...en,
  eyebrow: "글로벌 인터넷 챌린지",
  subtitleBefore: "인류는 이 버튼을 ",
  subtitleAfter: "번 누르려 하고 있습니다.",
  globalTaps: "글로벌 탭",
  tap: "탭",
  online: (count) => `🌍 ${count}명 온라인`,
  countriesLive: (count) => `🔥 ${count}개국`,
  yourGlobalRank: "내 글로벌 순위",
  tapToClaimRank: "탭하여 순위 획득",
  yourCountryRank: "내 국가 순위",
  outsideRanking: " · 순위권 밖",
  tapToCompete: " · 탭하여 참여",
  founderBadge: "창립자 배지",
  badgeFounder: "창립자",
  badgePioneer: "개척자",
  badgeEarlyMember: "얼리 멤버",
  badgeChallenger: "챌린저",
  joinEarlyToUnlock: "일찍 참여하여 잠금 해제",
  yourTaps: "내 탭 수",
  countryRanking: "🏆 국가 순위",
  noDataYet: "데이터 없음 — 탭하여 시작하세요.",
  shareJoined: "참여했습니다",
  shareProjectName: "더 트릴리언 프로젝트",
  shareWhenBefore: "탭이 단 ",
  shareWhenAfter: "번뿐이었을 때",
  shareQuestion: "인류는 1조에 도달할 수 있을까요?",
  proofGlobalRank: "글로벌 순위",
  proofCountryRank: "국가 순위",
  proofFounderBadge: "창립자 배지",
  proofGlobalTaps: "글로벌 탭",
  shareNow: "지금 공유",
  copyLink: "링크 복사",
  copied: "복사됨 ✓",
  shareMessageIntro: (total) =>
    `탭이 단 ${total}번뿐이었을 때 더 트릴리언 프로젝트에 참여했습니다.`,
  shareGlobalRank: (rank) => `글로벌 순위: #${rank}`,
  shareBadge: (badge, fraction) => `배지: ${badge}${fraction}`,
  shareCountryRank: (rank, country) => `국가 순위: #${rank} (${country})`,
  countryNames: {
    US: "미국",
    JP: "일본",
    KR: "한국",
    CN: "중국",
    BR: "브라질",
    ES: "스페인",
  },
};

const zh: Translations = {
  ...en,
  eyebrow: "全球互联网挑战",
  subtitleBefore: "人类正在尝试按下这个按钮",
  subtitleAfter: "次。",
  globalTaps: "全球点击",
  tap: "点击",
  online: (count) => `🌍 ${count} 人在线`,
  countriesLive: (count) => `🔥 ${count} 个国家`,
  yourGlobalRank: "你的全球排名",
  tapToClaimRank: "点击获取排名",
  yourCountryRank: "你的国家排名",
  outsideRanking: " · 排名之外",
  tapToCompete: " · 点击参与",
  founderBadge: "创始徽章",
  badgeFounder: "创始者",
  badgePioneer: "先驱",
  badgeEarlyMember: "早期成员",
  badgeChallenger: "挑战者",
  joinEarlyToUnlock: "尽早加入以解锁",
  yourTaps: "你的点击",
  countryRanking: "🏆 国家排名",
  noDataYet: "暂无数据 — 点击开始。",
  shareJoined: "我加入了",
  shareProjectName: "万亿计划",
  shareWhenBefore: "当时全球只有",
  shareWhenAfter: "次点击。",
  shareQuestion: "人类能否达到一万亿？",
  proofGlobalRank: "全球排名",
  proofCountryRank: "国家排名",
  proofFounderBadge: "创始徽章",
  proofGlobalTaps: "全球点击",
  shareNow: "立即分享",
  copyLink: "复制链接",
  copied: "已复制 ✓",
  shareMessageIntro: (total) => `当全球只有${total}次点击时，我加入了万亿计划。`,
  shareGlobalRank: (rank) => `全球排名：#${rank}`,
  shareBadge: (badge, fraction) => `徽章：${badge}${fraction}`,
  shareCountryRank: (rank, country) => `国家排名：#${rank}（${country}）`,
  countryNames: {
    US: "美国",
    JP: "日本",
    KR: "韩国",
    CN: "中国",
    BR: "巴西",
    ES: "西班牙",
  },
};

const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  ja,
  es,
  fr,
  de,
  pt,
  hi,
  id,
  ko,
  zh,
};

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";

  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("hi")) return "hi";
  if (lang.startsWith("id") || lang.startsWith("in")) return "id";
  return "en";
}

export function getTranslations(locale: Locale): Translations {
  return TRANSLATIONS[locale];
}

export function formatNumber(value: number, locale: Locale): string {
  return value.toLocaleString(LOCALE_TAGS[locale]);
}

export function getBadgeLabel(
  rank: number,
  t: Translations
): string {
  if (rank <= 100) return t.badgeFounder;
  if (rank <= 1000) return t.badgePioneer;
  if (rank <= 10000) return t.badgeEarlyMember;
  return t.badgeChallenger;
}

export function getBadgeFraction(rank: number): string {
  if (rank <= 100) return " / 100";
  if (rank <= 1000) return " / 1,000";
  if (rank <= 10000) return " / 10,000";
  return "";
}

export function getLocalizedCountryName(
  code: string,
  t: Translations
): string {
  return t.countryNames[code] ?? code;
}

let cachedLocale: Locale | null = null;

export function subscribeNoop() {
  return () => {};
}

export function getLocaleSnapshot(): Locale {
  if (cachedLocale === null) {
    cachedLocale = detectLocale();
  }
  return cachedLocale;
}

export function getLocaleServerSnapshot(): Locale {
  return "en";
}
