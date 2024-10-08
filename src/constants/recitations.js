export const HAFS_AN_ASIM = "hafs-an-asim";
export const COMPLETED_RECITATIONS = "full-holy-quran";
export const VARIOUS_RECITATIONS = "various-recitations";

const recitations = [
  {
    arabicName: "المصحف الكامل",
    englishName: "Full Holy Quran",
    slug: COMPLETED_RECITATIONS,
  },
  {
    arabicName: "التلاوات المنوعة",
    englishName: "Various Recitations",
    slug: VARIOUS_RECITATIONS,
  },
  {
    _id: "669f4a8fcce5f4e81b4d4238",
    arabicName: "حفص عن عاصم",
    englishName: "Hafs An Asim",
    slug: "hafs-an-asim",
  },
  {
    _id: "669f4a90cce5f4e81b4d423c",
    arabicName: "إسحاق الوراق وإدريس الحداد عن خلف البزار",
    englishName: "Ishaq al-Waraq and Idris al-Haddad from behind Al-Bazr",
    slug: "ishaq-al-waraq-and-idris-al-haddad-from-behind-al-bazr",
  },
  {
    _id: "669f4a91cce5f4e81b4d4245",
    arabicName: "أبي الحارث عن الكسائي",
    englishName: "Abi al-Harith an Al-Kisai",
    slug: "abi-al-harith-an-al-kisai",
  },
  {
    _id: "669f4a91cce5f4e81b4d4247",
    arabicName: "الدوري عن أبي عمرو",
    englishName: "Ad-Duri an Abu Amr",
    slug: "ad-duri-an-abu-amr",
  },
  {
    _id: "669f4a91cce5f4e81b4d4249",
    arabicName: "الدوري عن الكسائي",
    englishName: "Ad-Duri an Al-Kisai",
    slug: "ad-duri-an-al-kisai",
  },
  {
    _id: "669f4a91cce5f4e81b4d424b",
    arabicName: "البزي عن ابن كثير",
    englishName: "Al-Bazzi an Ibn Kathir",
    slug: "al-bazzi-an-ibn-kathir",
  },
  {
    _id: "669f4a92cce5f4e81b4d424d",
    arabicName: "البزي وقنبل عن ابن كثير",
    englishName: "Al-Bazzi wa Qunbul an Ibn Kathir",
    slug: "al-bazzi-wa-qunbul-an-ibn-kathir",
  },
  {
    _id: "669f4a92cce5f4e81b4d424f",
    arabicName: "السوسي عن أبي عمرو",
    englishName: "As-Susi an Abu Amr",
    slug: "as-susi-an-abu-amr",
  },
  {
    _id: "669f4a92cce5f4e81b4d4251",
    arabicName: "حفص عن عاصم من طريق الطيبة",
    englishName: "Hafs an Asim min Tariq al-Tayyibah",
    slug: "hafs-an-asim-min-tariq-al-tayyibah",
  },
  {
    _id: "669f4a92cce5f4e81b4d4253",
    arabicName: "هشام عن ابن عامر",
    englishName: "Hisham an Ibn Amir",
    slug: "hisham-an-ibn-amir",
  },
  {
    _id: "669f4a92cce5f4e81b4d4255",
    arabicName: "ابن ذكوان عن ابن عامر",
    englishName: "Ibn Dhakwan an Ibn Amir",
    slug: "ibn-dhakwan-an-ibn-amir",
  },
  {
    _id: "669f4a93cce5f4e81b4d4257",
    arabicName: "ابن جماز عن أبي جعفر",
    englishName: "Ibn Jamaz an Abu Jaafar",
    slug: "ibn-jamaz-an-abu-jaafar",
  },
  {
    _id: "669f4a93cce5f4e81b4d4259",
    arabicName: "ابن وردان عن أبي جعفر",
    englishName: "Ibn Wardan an Abu Jafar",
    slug: "ibn-wardan-an-abu-jafar",
  },
  {
    _id: "669f4a93cce5f4e81b4d425b",
    arabicName: "ابن وردان وابن جماز من طريق الدرة",
    englishName: "Ibn Wardan wa Ibn Jammaz min Tariq al-Durrah",
    slug: "ibn-wardan-wa-ibn-jammaz-min-tariq-al-durrah",
  },
  {
    _id: "669f4a93cce5f4e81b4d425d",
    arabicName: "ورش عن نافع من طريق الأزرق",
    englishName: "warsh an Nafi min Traiq al-Azraq",
    slug: "warsh-an-nafi-min-traiq-al-azraq",
  },
  {
    _id: "669f4a93cce5f4e81b4d425f",
    arabicName: "خلاد عن حمزة",
    englishName: "Khalaad an Hamzah",
    slug: "khalaad-an-hamzah",
  },
  {
    _id: "669f4a94cce5f4e81b4d4261",
    arabicName: "خلف عن حمزة",
    englishName: "Khalaf an Hamzah",
    slug: "khalaf-an-hamzah",
  },
  {
    _id: "669f4a94cce5f4e81b4d4263",
    arabicName: "قالون عن نافع",
    englishName: "Qalun an Nafi",
    slug: "qalun-an-nafi",
  },
  {
    _id: "669f4a94cce5f4e81b4d4265",
    arabicName: "قنبل عن ابن كثير",
    englishName: "Qunbul an Ibn Kathir",
    slug: "qunbul-an-ibn-kathir",
  },
  {
    _id: "669f4a94cce5f4e81b4d4267",
    arabicName: "روح عن يعقوب الحضرمي",
    englishName: "Ruuh an Yaqub al-Hadrami",
    slug: "ruuh-an-yaqub-al-hadrami",
  },
  {
    _id: "669f4a94cce5f4e81b4d4269",
    arabicName: "رويس عن يعقوب الحضرمي",
    englishName: "Ruways an Yaqub al-Hadrami",
    slug: "ruways-an-yaqub-al-hadrami",
  },
  {
    _id: "669f4a95cce5f4e81b4d426b",
    arabicName: "شعبة عن عاصم",
    englishName: "Shubah an Asim",
    slug: "shubah-an-asim",
  },
  {
    _id: "669f4a95cce5f4e81b4d426d",
    arabicName: "ورش عن نافع",
    englishName: "Warsh an Nafi",
    slug: "warsh-an-nafi",
  },
  {
    _id: "669f4a95cce5f4e81b4d426f",
    arabicName: "ورش عن نافع من طريق الاصبهاني",
    englishName: "Warsh an Nafi min Tariq al-Asbahani",
    slug: "warsh-an-nafi-min-tariq-al-asbahani",
  },
];

export default recitations;
