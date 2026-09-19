export type PageSeoOverride = {
  title?: string;
  description?: string;
  keywords?: string;
};

export type SeoSettings = {
  siteUrl: string;
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  ogImage: string;
  pages: Record<string, PageSeoOverride>;
};

export const defaultSeo: SeoSettings = {
  siteUrl: "https://kaunotenisas.lt",
  titleDefault: "Kauno teniso klubas",
  titleTemplate: "%s — Kauno teniso klubas",
  description:
    "Kauno teniso klubas — seniausias teniso klubas Lietuvoje, įkurtas 1924 m. Turnyrai Kaune, nariai, reitingai, galerija ir aktualijos.",
  keywords:
    "Kauno teniso klubas, tenisas Kaunas, KTK, teniso turnyrai Kaunas, teniso klubas Lietuva, Hegelmann turnyras, NEODENTA turnyras, teniso reitingai",
  ogImage: "/images/logo.png",
  pages: {
    "/": {
      title: "Kauno teniso klubas",
      description:
        "Seniausias teniso klubas Lietuvoje nuo 1924 m. Turnyrai, narystė, reitingai ir klubo bendruomenė Kaune.",
      keywords: "Kauno teniso klubas, tenisas Kaunas, KTK",
    },
    "/turnyrai": {
      title: "Turnyrai",
      description: "Kauno teniso klubo turnyrai — registracija, lygos, tvarkaraščiai ir rezultatai.",
      keywords: "teniso turnyrai Kaunas, KTK turnyrai, registracija",
    },
    "/naujienos": {
      title: "Aktualijos",
      description: "Naujienos ir aktualijos iš Kauno teniso klubo.",
    },
    "/reitingai": {
      title: "Reitingai",
      description: "Kauno teniso klubo žaidėjų reitingai ir statistika.",
      keywords: "teniso reitingai Kaunas, KTK reitingai",
    },
    "/zaidejai": {
      title: "Žaidėjai",
      description: "Kauno teniso klubo žaidėjai ir karjeros statistika.",
    },
    "/nariai": {
      title: "Klubo nariai",
      description: "Kauno teniso klubo narių sąrašas.",
    },
    "/naryste": {
      title: "Tapti nariu",
      description: "Kaip tapti Kauno teniso klubo nariu — sąlygos ir kontaktai.",
    },
    "/kontaktai": {
      title: "Kontaktai",
      description: "Kauno teniso klubo kontaktai — adresas Sporto g. 3, Kaunas, el. paštas.",
      keywords: "Kauno teniso klubas kontaktai, Sporto g. 3",
    },
    "/apie": {
      title: "Apie klubą",
      description: "Apie Kauno teniso klubą — istorija nuo 1924 m., bendruomenė ir vertybės.",
    },
    "/istorija": {
      title: "Klubo istorija",
      description: "Kauno teniso klubo istorijos chronologija.",
    },
    "/galerija": {
      title: "Galerija",
      description: "Kauno teniso klubo nuotraukų galerija.",
    },
    "/video": {
      title: "Video",
      description: "Kauno teniso klubo video įrašai.",
    },
    "/spauda": {
      title: "Istorija spaudoje",
      description: "Kauno tenisas spaudoje — archyviniai straipsniai ir publikacijos.",
    },
    "/parama": {
      title: "Parama 2%",
      description: "Skirkite 2% GPM Kauno teniso klubui.",
    },
    "/prisijungti": {
      title: "Prisijungti",
      description: "Prisijunkite prie Kauno teniso klubo paskyros.",
    },
    "/registracija": {
      title: "Svetainės paskyra",
      description: "Sukurkite paskyrą Kauno teniso klubo svetainėje.",
    },
  },
};
