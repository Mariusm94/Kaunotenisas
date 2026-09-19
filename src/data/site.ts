export const club = {
  name: "Kauno teniso klubas",
  shortName: "KTK",
  founded: 1924,
  foundedDate: "1924 m. vasario 9 d.",
  email: "mariusm94@gmail.com",
  phone: "",
  facebook: "https://www.facebook.com/p/KTK-Kauno-Teniso-Klubas-100072480433206/",
  address: "Sporto g. 3, Kaunas, LT-44221",
  company: "Asociacija Kauno teniso klubas",
  code: "193225921",
  bank: "SWEDBANK AB",
  iban: "LT14 7300 0100 8989 4069",
  founders: ["K. Blažys", "B. Navickienė", "V. Žadeika"],
  foundersGenitive: "K. Blažio, B. Navickienės ir V. Žadeikos",
};

export const stats = [
  {
    value: "100+",
    label: "metų",
    text: "Seniausias teniso klubas Lietuvoje, kurio istorija siekia daugiau kaip šimtmetį.",
  },
  {
    value: "250+",
    label: "turnyrų",
    text: "Per savo istoriją klubas surengė daugiau kaip 250 teniso turnyrų.",
  },
  {
    value: "3500+",
    label: "apdovanojimų",
    text: "Kauno teniso klubas išdalino daugiau kaip 3500 apdovanojimų.",
  },
  {
    value: "90+",
    label: "narių",
    text: "Bendruomenė, kuri žaidžia, varžosi ir švenčia tenisą visus metus.",
  },
];

export const nav = [
  {
    label: "Klubas",
    href: "/apie",
    children: [
      { label: "Apie klubą", href: "/apie" },
      { label: "Istorija", href: "/istorija" },
      { label: "Nariai", href: "/nariai" },
      { label: "Tapti nariu", href: "/naryste" },
      { label: "Istorija spaudoje", href: "/spauda" },
      { label: "Parama 2%", href: "/parama" },
    ],
  },
  { label: "Turnyrai", href: "/turnyrai" },
  { label: "Aktualijos", href: "/naujienos" },
  {
    label: "Galerija",
    href: "/galerija",
    children: [
      { label: "Nuotraukos", href: "/galerija" },
      { label: "Video", href: "/video" },
    ],
  },
  { label: "Reitingai", href: "/reitingai" },
  { label: "Žaidėjai", href: "/zaidejai" },
  { label: "Kontaktai", href: "/kontaktai" },
];

export const sponsors = [
  { name: "Hegelmann Group", src: "/images/sponsors/hegelmann.png", href: "https://hegelmann.lt/" },
  { name: "Neodenta", src: "/images/sponsors/neodenta.png", href: "https://neodenta.lt/" },
  { name: "Moxy Hotels", src: "/images/sponsors/moxy.png", href: "https://www.marriott.com/en-us/hotels/kunox-moxy-kaunas-center/overview/" },
  { name: "Granini", src: "/images/sponsors/granini.png", href: "https://www.granini.lt/" },
  { name: "Ąžuolas Resort", src: "/images/sponsors/azuolas.png", href: "https://azuolasresort.lt/" },
  { name: "Verona", src: "/images/sponsors/verona.jpg", href: "https://www.verona.lt/" },
  { name: "Top Sport", src: "/images/sponsors/topsport.jpg", href: "https://topsport.lt/" },
  { name: "Sveikatos sprendimai", src: "/images/sponsors/sveikata.jpg", href: "https://sveikatossprendimai.lt/" },
  { name: "Hermis", src: "/images/sponsors/hermis.jpg", href: "https://hermis.lt/" },
  { name: "Olympic Casino", src: "/images/sponsors/casino.jpg", href: "https://topsport.lt/" },
  { name: "Dana", src: "/images/sponsors/dana.jpg", href: "https://www.dana.lt/" },
  { name: "Termopalas", src: "/images/sponsors/termopalas.png", href: "https://www.termopalas.lt/" },
];

export const board = [
  { name: "Alfredas Rimidis", role: "Valdybos narys" },
  { name: "Eitvydė Helmienė", role: "Valdybos narė" },
  { name: "Aidas Valiukevičius", role: "Valdybos narys" },
];
