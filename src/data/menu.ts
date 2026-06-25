export type MenuItem = {
  code?: string;
  name: string;
  desc?: string;
  price: string;
  veg?: boolean;
  options?: string[];
};

export type MenuSection = {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  color: "green" | "gold" | "red";
  items: MenuItem[];
};

export const menu: MenuSection[] = [
  {
    id: "banh-mi",
    title: "Vietnamesiska baguetter",
    color: "gold",
    note: "Alla baguetter serveras med gurka, picklade grönsaker, koriander, chili, soja, rostad lök och 5 spice-sås.",
    items: [
      { code: "B1", name: "Banh Mi Xa Xiu 🐷", desc: "Med grillad bbq-fläsk.", price: "129 kr" },
      { code: "B2", name: "Bamboo House Special 🐷", desc: "Vietnamesisk korv, marinerad fläsk och leverpastej.", price: "129 kr" },
      { code: "B3", name: "Banh Mi Ga", desc: "Kyckling marinerad med citrongräs.", price: "129 kr" },
      { code: "B4", name: "Banh Mi Thit Bo", desc: "Grillad entrecôte och sesam.", price: "129 kr" },
      { code: "B5", name: "Banh Mi Chay", desc: "Bräserad tofu.", price: "129 kr", veg: true },
    ],
  },
  {
    id: "nudelsoppa-nudlar",
    title: "Nudelsoppa & Nudlar",
    color: "green",
    items: [
      {
        code: "6",
        name: "Risnudelsallad (🌱)",
        desc: "Färska risnudlar med valfri protein, gurka, picklade grönsaker, sallad, örter, chili och böngroddar. Toppas med jordnötter, rostad lök och dressing.",
        price: "145 kr",
        options: ["Fläsk", "Kyckling", "Biff", "Tofu"],
      },
      {
        code: "7",
        name: "Pho Bo (Nudelsoppa)",
        desc: "Nudelsoppa med flankstek och vietnamesisk fläskkorv. Serveras med dipsås och färska örter.",
        price: "149 kr",
      },
      {
        code: "8",
        name: "Pho Xao Deluxe",
        desc: "Wokade risnudlar med ägg, böngroddar, morötter och salladslök. Serveras med lime och jordnötter.",
        price: "149 kr",
        options: ["Kyckling", "Räkor"],
      },
    ],

  },
  {
    id: "korean-fried-chicken",
    title: "Korean Fried",
    color: "red",
    note: "Friterat på koreanskt vis serveras med ris, picklad rättika, chili-gurka och rödkåls-slaw. Välj protein och sås: Gochujang eller Soja-ingefärasås.",
    items: [
      { name: "Chicken 🍗", price: "129 kr" },
      { name: "Prawns 🦐", price: "139 kr" },
      { name: "Tofu", price: "129 kr", veg: true },
    ],

  },
  {
    id: "koreanska-ratter",
    title: "Koreanska rätter",
    color: "gold",
    items: [
      { code: "9", name: "Bibimbap", desc: "Ris, banchan, 64°C ägg, chilisås. (Ost +10 kr)", price: "135 kr", options: ["Bugogi Entrecote", "Buldak Kyckling", "Tofu"] },
      { code: "10", name: "Kimchi Fried Rice", desc: "Koreansk stekt ris med kimchi och ägg.", price: "135 kr", options: ["Bugogi Entrecote", "Buldak Kyckling", "Tofu"] },
      { code: "11", name: "Japchae", desc: "Sötpotatis-nudlar med sesam, soja, banchan och chilisås.", price: "135 kr", options: ["Bugogi Entrecote", "Buldak Kyckling", "Tofu"] },

      {
        code: "12",
        name: "Dosirak (Mix)",
        desc: "2 st Gimmari (sjögräsrulle), ris med bulgogi entrecôte, banchan och 2 st koreansk friterad kyckling.",
        price: "169 kr",
      },
      {
        code: "12V",
        name: "Veggie Dosirak (Mix)",
        desc: "2 st Gimmari (sjögräsrulle), ris med gochujang-tofu, banchan och 2 st koreansk friterad tofu.",
        price: "169 kr",
        veg: true,
      },
    ],
  },
  {
    id: "tillbehor",
    title: "Smårätter",
    color: "green",
    items: [
      { code: "S1", name: "Cha Gio, 3 st", desc: "Friterade hemlagade vårrullar med räkor, kycklingfärs och grönsaker. Serveras med sallad och dipsås.", price: "79 kr" },
      { code: "S2", name: "Cha Gio Chay, 9 st", desc: "Friterade vegetariska vårrullar med sweetchilisås.", price: "69 kr", veg: true },
      { code: "S3", name: "Sommarrullar, 2 st 🐷", desc: "Färska sommarrullar med bbq-fläsk, sallad, gurka, picklade grönsaker, koriander och mynta. Med jordnötssås.", price: "79 kr" },
      { code: "S4", name: "Gimmari, 6 st", desc: "Friterad sjögräsrulle med sötpotatis-nudlar och kimchi. Serveras med dipsås.", price: "89 kr" },
      { code: "S5", name: "Tteokbokki (🌱)", desc: "Rispasta med gochujang chilisås och banchan. (Ost +10 kr). Välj: Bulgogi entrecôte 139 / Buldak kyckling / Tofu.", price: "från 60 kr" },
    ],
  },
  {
    id: "drycker",
    title: "Drycker",
    color: "red",
    items: [
      { name: "Ca Phe Sua Da", desc: "Vietnamesiskt iskaffe med sötad kondenserad mjölk.", price: "45 kr" },
      { name: "Yuzu Lemonade", desc: "Frisk lemonad med japansk yuzu-citrus.", price: "59 kr" },
      { name: "Klassisk Boba Tea", desc: "Mjölkte med tapioka-pärlor.", price: "59 kr" },
      { name: "Matcha Tea", desc: "Japanskt grönt matcha-te.", price: "59 kr" },
      { name: "Taro Tea", desc: "Krämigt te med taro-rot.", price: "45 kr" },
      { name: "Läsk 33 cl", price: "20 kr" },
      { name: "Läsk 1,5 L", price: "40 kr" },
    ],
  },
];
