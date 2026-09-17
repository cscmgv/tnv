// Comprehensive Tamil Nadu District, Taluk, Panchayat & Pincode data for all 38 districts.
// Structure: District -> Taluk -> Panchayats / Towns / Areas -> 6-digit postal pincodes.

export interface AreaInfo {
  name: string;
  pincode: string;
}

export interface TalukInfo {
  name: string;
  defaultPincode: string;
  panchayats: AreaInfo[];
}

export const TAMIL_NADU_GEO: Record<string, Record<string, { defaultPincode: string; panchayats: AreaInfo[] }>> = {
  Ariyalur: {
    Ariyalur: {
      defaultPincode: "621704",
      panchayats: [
        { name: "Ariyalur Town", pincode: "621704" },
        { name: "Kallankurichi", pincode: "621705" },
        { name: "Keelapalur", pincode: "621707" },
        { name: "Thirumanur", pincode: "621715" },
        { name: "Vilankudi", pincode: "621704" },
        { name: "Rayampuram", pincode: "621714" },
        { name: "Nagappamampatti", pincode: "621704" },
        { name: "Alagiyamanavalam", pincode: "621715" },
        { name: "Sennivanam", pincode: "621715" },
        { name: "Elandaikudam", pincode: "621851" },
      ],
    },
    Sendurai: {
      defaultPincode: "621714",
      panchayats: [
        { name: "Sendurai Town", pincode: "621714" },
        { name: "Asaveerankudikadu", pincode: "621719" },
        { name: "Kulumur", pincode: "621714" },
        { name: "Maruvathur", pincode: "621710" },
        { name: "Nakkambadi", pincode: "621714" },
        { name: "Palayam", pincode: "621714" },
        { name: "Ponparappi", pincode: "621710" },
        { name: "Sirukadambur", pincode: "621714" },
        { name: "Thular", pincode: "621714" },
      ],
    },
    Udayarpalayam: {
      defaultPincode: "621804",
      panchayats: [
        { name: "Udayarpalayam Town", pincode: "621804" },
        { name: "Jayankondam", pincode: "621802" },
        { name: "T.Palur", pincode: "621212" },
        { name: "Varadarajanpettai", pincode: "621805" },
        { name: "Gangaikonda Cholapuram", pincode: "621901" },
        { name: "Meensurutti", pincode: "621207" },
        { name: "Vikkiramangalam", pincode: "621701" },
        { name: "Kadambur", pincode: "621804" },
        { name: "Suthamalli", pincode: "621804" },
      ],
    },
    Andimadam: {
      defaultPincode: "621801",
      panchayats: [
        { name: "Andimadam Town", pincode: "621801" },
        { name: "Kallathur", pincode: "621803" },
        { name: "Kattathur", pincode: "621801" },
        { name: "Kavarapalayam", pincode: "621801" },
        { name: "Marudur", pincode: "621801" },
        { name: "Periyakrishnapuram", pincode: "621805" },
        { name: "Siluvacheri", pincode: "621801" },
        { name: "Variyankaval", pincode: "621806" },
      ],
    },
  },

  Chengalpattu: {
    Chengalpattu: {
      defaultPincode: "603001",
      panchayats: [
        { name: "Chengalpattu Town", pincode: "603001" },
        { name: "Melamaiyur", pincode: "603003" },
        { name: "Alapakkam", pincode: "603003" },
        { name: "Vallam", pincode: "603002" },
        { name: "Singaperumal Koil", pincode: "603204" },
        { name: "Maraimalai Nagar", pincode: "603209" },
        { name: "Paranur", pincode: "603002" },
        { name: "Guduvancheri", pincode: "603202" },
        { name: "Urapakkam", pincode: "603210" },
        { name: "Potheri", pincode: "603203" },
        { name: "Kattankulathur", pincode: "603203" },
      ],
    },
    Tambaram: {
      defaultPincode: "600045",
      panchayats: [
        { name: "Tambaram East", pincode: "600059" },
        { name: "Tambaram West", pincode: "600045" },
        { name: "Selaiyur", pincode: "600073" },
        { name: "Camp Road", pincode: "600073" },
        { name: "Perungalathur", pincode: "600063" },
        { name: "Peerkankaranai", pincode: "600063" },
        { name: "Mudichur", pincode: "600048" },
        { name: "Chitlapakkam", pincode: "600064" },
        { name: "Madambakkam", pincode: "600126" },
        { name: "Sembakkam", pincode: "600073" },
      ],
    },
    Pallavaram: {
      defaultPincode: "600043",
      panchayats: [
        { name: "Pallavaram", pincode: "600043" },
        { name: "Chromepet", pincode: "600044" },
        { name: "Hasthinapuram", pincode: "600064" },
        { name: "Keelkattalai", pincode: "600117" },
        { name: "Nemilichery", pincode: "600044" },
        { name: "Radha Nagar", pincode: "600044" },
        { name: "Zamin Pallavaram", pincode: "600043" },
        { name: "Old Pallavaram", pincode: "600117" },
      ],
    },
    Vandalur: {
      defaultPincode: "600048",
      panchayats: [
        { name: "Vandalur Town", pincode: "600048" },
        { name: "Otteri", pincode: "600048" },
        { name: "Kolapakkam", pincode: "600048" },
        { name: "Nedungundram", pincode: "600127" },
        { name: "Mambakkam", pincode: "600127" },
        { name: "Kandigai", pincode: "600127" },
        { name: "Kayarambedu", pincode: "603202" },
      ],
    },
    Thiruporur: {
      defaultPincode: "603110",
      panchayats: [
        { name: "Thiruporur Town", pincode: "603110" },
        { name: "Kelambakkam", pincode: "603103" },
        { name: "Siruseri (SIPCOT)", pincode: "603103" },
        { name: "Navalur", pincode: "600130" },
        { name: "Padur", pincode: "603103" },
        { name: "Kalavakkam", pincode: "603110" },
        { name: "Illalur", pincode: "603110" },
        { name: "Nemmeli", pincode: "603104" },
        { name: "Muttukadu", pincode: "603112" },
        { name: "Kovalam", pincode: "603112" },
      ],
    },
    Tirukalukundram: {
      defaultPincode: "603109",
      panchayats: [
        { name: "Tirukalukundram Town", pincode: "603109" },
        { name: "Mamallapuram (Mahabalipuram)", pincode: "603104" },
        { name: "Sadras", pincode: "603102" },
        { name: "Kalpakkam", pincode: "603102" },
        { name: "Pudupattinam", pincode: "603102" },
        { name: "Anupuram", pincode: "603127" },
        { name: "Neikuppi", pincode: "603102" },
      ],
    },
    Madurantakam: {
      defaultPincode: "603306",
      panchayats: [
        { name: "Madurantakam Town", pincode: "603306" },
        { name: "Acharapakkam", pincode: "603301" },
        { name: "Karunguzhi", pincode: "603303" },
        { name: "Padalam", pincode: "603308" },
        { name: "Kadalur", pincode: "603305" },
        { name: "Orathi", pincode: "603307" },
        { name: "Vedanthangal", pincode: "603314" },
      ],
    },
    Cheyyur: {
      defaultPincode: "603302",
      panchayats: [
        { name: "Cheyyur Town", pincode: "603302" },
        { name: "Lathur", pincode: "603312" },
        { name: "Pavunjur", pincode: "603312" },
        { name: "Chithamur", pincode: "603313" },
        { name: "Idaikkazhinadu", pincode: "603304" },
        { name: "Chunampet", pincode: "603401" },
        { name: "Mugaiyur", pincode: "603305" },
      ],
    },
  },

  Chennai: {
    Egmore: {
      defaultPincode: "600008",
      panchayats: [
        { name: "Egmore", pincode: "600008" },
        { name: "Chetpet", pincode: "600031" },
        { name: "Kilpauk", pincode: "600010" },
        { name: "Pudupet", pincode: "600002" },
        { name: "Chintadripet", pincode: "600002" },
      ],
    },
    Mylapore: {
      defaultPincode: "600004",
      panchayats: [
        { name: "Mylapore", pincode: "600004" },
        { name: "Mandaveli", pincode: "600028" },
        { name: "Raja Annamalaipuram (RA Puram)", pincode: "600028" },
        { name: "Santhome", pincode: "600004" },
        { name: "Alwarpet", pincode: "600018" },
        { name: "Gopalapuram", pincode: "600086" },
      ],
    },
    Guindy: {
      defaultPincode: "600032",
      panchayats: [
        { name: "Guindy Industrial Estate", pincode: "600032" },
        { name: "Saidapet", pincode: "600015" },
        { name: "Ekkatuthangal", pincode: "600032" },
        { name: "Kotturpuram", pincode: "600085" },
        { name: "Adyar", pincode: "600020" },
        { name: "Besant Nagar", pincode: "600090" },
        { name: "Thiruvanmiyur", pincode: "600041" },
      ],
    },
    Velachery: {
      defaultPincode: "600042",
      panchayats: [
        { name: "Velachery", pincode: "600042" },
        { name: "Taramani", pincode: "600113" },
        { name: "Madipakkam", pincode: "600091" },
        { name: "Puzhuthivakkam", pincode: "600091" },
        { name: "Adambakkam", pincode: "600088" },
      ],
    },
    Sholinganallur: {
      defaultPincode: "600119",
      panchayats: [
        { name: "Sholinganallur", pincode: "600119" },
        { name: "Perungudi", pincode: "600096" },
        { name: "Thoraipakkam", pincode: "600097" },
        { name: "Palavakkam", pincode: "600041" },
        { name: "Kottivakkam", pincode: "600041" },
        { name: "Injambakkam", pincode: "600115" },
        { name: "Neelankarai", pincode: "600115" },
        { name: "Akkarai", pincode: "600119" },
        { name: "Uthandi", pincode: "600119" },
        { name: "Semmancheri", pincode: "600119" },
      ],
    },
    Mambalam: {
      defaultPincode: "600033",
      panchayats: [
        { name: "West Mambalam", pincode: "600033" },
        { name: "T. Nagar", pincode: "600017" },
        { name: "Kodambakkam", pincode: "600024" },
        { name: "Ashok Nagar", pincode: "600083" },
        { name: "K.K. Nagar", pincode: "600078" },
        { name: "Vadapalani", pincode: "600026" },
      ],
    },
    Aminjikarai: {
      defaultPincode: "600029",
      panchayats: [
        { name: "Aminjikarai", pincode: "600029" },
        { name: "Anna Nagar East", pincode: "600102" },
        { name: "Anna Nagar West", pincode: "600040" },
        { name: "Shenoy Nagar", pincode: "600030" },
        { name: "Arumbakkam", pincode: "600106" },
        { name: "Koyambedu", pincode: "600107" },
      ],
    },
    Ayanavaram: {
      defaultPincode: "600023",
      panchayats: [
        { name: "Ayanavaram", pincode: "600023" },
        { name: "Villivakkam", pincode: "600049" },
        { name: "Kolathur", pincode: "600099" },
        { name: "Peravallur", pincode: "600082" },
        { name: "ICF Colony", pincode: "600038" },
      ],
    },
    Purasawalkam: {
      defaultPincode: "600084",
      panchayats: [
        { name: "Purasawalkam", pincode: "600084" },
        { name: "Kellys", pincode: "600010" },
        { name: "Vepery", pincode: "600007" },
        { name: "Perambur", pincode: "600011" },
        { name: "Otteri", pincode: "600012" },
        { name: "Pattalam", pincode: "600012" },
      ],
    },
    Tondiarpet: {
      defaultPincode: "600081",
      panchayats: [
        { name: "Tondiarpet", pincode: "600081" },
        { name: "Royapuram", pincode: "600013" },
        { name: "Washermanpet", pincode: "600021" },
        { name: "Old Washermanpet", pincode: "600021" },
        { name: "George Town", pincode: "600001" },
        { name: "Parrys", pincode: "600001" },
        { name: "Harbour Area", pincode: "600001" },
        { name: "Sowcarpet", pincode: "600079" },
        { name: "Seven Wells", pincode: "600001" },
        { name: "Korukkupet", pincode: "600021" },
      ],
    },
    Thiruvottiyur: {
      defaultPincode: "600019",
      panchayats: [
        { name: "Thiruvottiyur", pincode: "600019" },
        { name: "Tollgate", pincode: "600019" },
        { name: "Ennore", pincode: "600057" },
        { name: "Ernavoor", pincode: "600057" },
        { name: "Wimco Nagar", pincode: "600057" },
        { name: "Kathivakkam", pincode: "600057" },
      ],
    },
    Madhavaram: {
      defaultPincode: "600060",
      panchayats: [
        { name: "Madhavaram", pincode: "600060" },
        { name: "Madhavaram Milk Colony", pincode: "600051" },
        { name: "Puzhal", pincode: "600066" },
        { name: "Manali", pincode: "600068" },
        { name: "Manali New Town", pincode: "600103" },
        { name: "Mathur", pincode: "600068" },
        { name: "Kodungaiyur", pincode: "600118" },
      ],
    },
    Ambattur: {
      defaultPincode: "600053",
      panchayats: [
        { name: "Ambattur OT", pincode: "600053" },
        { name: "Ambattur Industrial Estate", pincode: "600058" },
        { name: "Mogappair East", pincode: "600037" },
        { name: "Mogappair West", pincode: "600037" },
        { name: "Padi", pincode: "600050" },
        { name: "Korattur", pincode: "600080" },
        { name: "Mannurpet", pincode: "600050" },
      ],
    },
    Maduravoyal: {
      defaultPincode: "600095",
      panchayats: [
        { name: "Maduravoyal", pincode: "600095" },
        { name: "Alapakkam", pincode: "600116" },
        { name: "Porur", pincode: "600116" },
        { name: "Valasaravakkam", pincode: "600087" },
        { name: "Virugambakkam", pincode: "600092" },
        { name: "Ramapuram", pincode: "600089" },
        { name: "Nolambur", pincode: "600095" },
        { name: "Vanagaram", pincode: "600095" },
      ],
    },
    Alandur: {
      defaultPincode: "600016",
      panchayats: [
        { name: "Alandur", pincode: "600016" },
        { name: "Nanganallur", pincode: "600061" },
        { name: "Pazhavanthangal", pincode: "600114" },
        { name: "St. Thomas Mount", pincode: "600016" },
        { name: "Meenambakkam", pincode: "600027" },
        { name: "Moovarasanpet", pincode: "600091" },
      ],
    },
  },

  Coimbatore: {
    "Coimbatore North": {
      defaultPincode: "641043",
      panchayats: [
        { name: "RS Puram", pincode: "641002" },
        { name: "Saibaba Colony", pincode: "641011" },
        { name: "Ganapathy", pincode: "641006" },
        { name: "Kavundampalayam", pincode: "641030" },
        { name: "Thudiyalur", pincode: "641034" },
        { name: "Saravanampatti", pincode: "641035" },
        { name: "Vellakinar", pincode: "641029" },
        { name: "Veerakeralam", pincode: "641007" },
      ],
    },
    "Coimbatore South": {
      defaultPincode: "641001",
      panchayats: [
        { name: "Town Hall", pincode: "641001" },
        { name: "Gandhipuram", pincode: "641012" },
        { name: "Ramanathapuram", pincode: "641045" },
        { name: "Singanallur", pincode: "641005" },
        { name: "Ondipudur", pincode: "641016" },
        { name: "Ukkadam", pincode: "641001" },
        { name: "Kuniyamuthur", pincode: "641008" },
        { name: "Sundarapuram", pincode: "641024" },
        { name: "Peelamedu", pincode: "641004" },
      ],
    },
    Pollachi: {
      defaultPincode: "642001",
      panchayats: [
        { name: "Pollachi Town", pincode: "642001" },
        { name: "Achipatti", pincode: "642002" },
        { name: "Makkinampatti", pincode: "642003" },
        { name: "Suleeswaranpatti", pincode: "642006" },
        { name: "Samathur", pincode: "642123" },
        { name: "Negamam", pincode: "642120" },
        { name: "Zamin Uthukuli", pincode: "642004" },
      ],
    },
    Mettupalayam: {
      defaultPincode: "641301",
      panchayats: [
        { name: "Mettupalayam Town", pincode: "641301" },
        { name: "Karamadai", pincode: "641104" },
        { name: "Sirumugai", pincode: "641302" },
        { name: "Bellikuppam", pincode: "641305" },
        { name: "Odanthurai", pincode: "641301" },
        { name: "Marudur", pincode: "641301" },
      ],
    },
    Sulur: {
      defaultPincode: "641402",
      panchayats: [
        { name: "Sulur Town", pincode: "641402" },
        { name: "Kannampalayam", pincode: "641402" },
        { name: "Irugur", pincode: "641103" },
        { name: "Pallapalayam", pincode: "641103" },
        { name: "Neelambur", pincode: "641062" },
        { name: "Kalangal", pincode: "641402" },
        { name: "Sultanpet", pincode: "641669" },
      ],
    },
    Annur: {
      defaultPincode: "641653",
      panchayats: [
        { name: "Annur Town", pincode: "641653" },
        { name: "Kariyampalayam", pincode: "641653" },
        { name: "Kunnathur", pincode: "641653" },
        { name: "Masagoundanchettipalayam", pincode: "641653" },
        { name: "Pogalur", pincode: "641653" },
      ],
    },
    Valparai: {
      defaultPincode: "642127",
      panchayats: [
        { name: "Valparai Town", pincode: "642127" },
        { name: "Sholayar Dam", pincode: "642125" },
        { name: "Mudis", pincode: "642117" },
        { name: "Rotikadai", pincode: "642127" },
        { name: "Iyerpadi", pincode: "642108" },
      ],
    },
    Kinathukadavu: {
      defaultPincode: "642109",
      panchayats: [
        { name: "Kinathukadavu Town", pincode: "642109" },
        { name: "Kothavadi", pincode: "642109" },
        { name: "Nallattipalayam", pincode: "642109" },
        { name: "Kappalankarai", pincode: "642120" },
        { name: "Arasampalayam", pincode: "642109" },
      ],
    },
    Madukkarai: {
      defaultPincode: "641105",
      panchayats: [
        { name: "Madukkarai Town", pincode: "641105" },
        { name: "Kurichi", pincode: "641024" },
        { name: "Ettimadai", pincode: "641112" },
        { name: "Chettipalayam", pincode: "641201" },
        { name: "Malumichampatti", pincode: "641050" },
        { name: "Othakkalmandapam", pincode: "641032" },
      ],
    },
    Perur: {
      defaultPincode: "641010",
      panchayats: [
        { name: "Perur Town", pincode: "641010" },
        { name: "Thondamuthur", pincode: "641109" },
        { name: "Vedapatti", pincode: "641007" },
        { name: "Dhaliyur", pincode: "641109" },
        { name: "Alanthurai", pincode: "641101" },
        { name: "Pooluvapatti", pincode: "641101" },
        { name: "Thenkarai", pincode: "641101" },
      ],
    },
    Anaimalai: {
      defaultPincode: "642104",
      panchayats: [
        { name: "Anaimalai Town", pincode: "642104" },
        { name: "Sethumadai", pincode: "642133" },
        { name: "Kottur-Malayandipatnam", pincode: "642114" },
        { name: "Vettaikaranpudur", pincode: "642129" },
        { name: "Odayakulam", pincode: "642129" },
      ],
    },
  },

  Cuddalore: {
    Cuddalore: {
      defaultPincode: "607001",
      panchayats: [
        { name: "Cuddalore Town (OT)", pincode: "607003" },
        { name: "Cuddalore Port", pincode: "607003" },
        { name: "Nellikuppam", pincode: "607105" },
        { name: "Thiruvandipuram", pincode: "607401" },
        { name: "Kondur", pincode: "607002" },
        { name: "Thirupapuliyur", pincode: "607002" },
        { name: "Pachankuppam", pincode: "607003" },
      ],
    },
    Panruti: {
      defaultPincode: "607106",
      panchayats: [
        { name: "Panruti Town", pincode: "607106" },
        { name: "Thiruvathigai", pincode: "607106" },
        { name: "Kandarakkottai", pincode: "607205" },
        { name: "Marungur", pincode: "607103" },
        { name: "Semmedu", pincode: "607106" },
        { name: "Vegakollai", pincode: "607302" },
      ],
    },
    Chidambaram: {
      defaultPincode: "608001",
      panchayats: [
        { name: "Chidambaram Town", pincode: "608001" },
        { name: "Annamalai Nagar", pincode: "608002" },
        { name: "Killai", pincode: "608102" },
        { name: "Pichavaram", pincode: "608102" },
        { name: "Parangipettai (Porto Novo)", pincode: "608502" },
        { name: "B.Mutlur", pincode: "608501" },
      ],
    },
    Vriddhachalam: {
      defaultPincode: "606001",
      panchayats: [
        { name: "Vriddhachalam Town", pincode: "606001" },
        { name: "Pennadam", pincode: "606105" },
        { name: "Mangalampet", pincode: "606104" },
        { name: "Karnatham", pincode: "606104" },
        { name: "Aladi", pincode: "606115" },
      ],
    },
    Kurinjipadi: {
      defaultPincode: "607302",
      panchayats: [
        { name: "Kurinjipadi Town", pincode: "607302" },
        { name: "Vadalur", pincode: "607303" },
        { name: "Kullanchavadi", pincode: "607301" },
        { name: "Neyveli Township", pincode: "607801" },
        { name: "Indira Nagar", pincode: "607801" },
      ],
    },
    Tittakudi: {
      defaultPincode: "606106",
      panchayats: [
        { name: "Tittakudi Town", pincode: "606106" },
        { name: "Avinangudi", pincode: "606112" },
        { name: "Pennadam Road", pincode: "606105" },
        { name: "Mangalur", pincode: "606108" },
      ],
    },
    Kattumannarkoil: {
      defaultPincode: "608301",
      panchayats: [
        { name: "Kattumannarkoil Town", pincode: "608301" },
        { name: "Lalpet", pincode: "608305" },
        { name: "Srimushnam", pincode: "608703" },
        { name: "Veeranam Lake Area", pincode: "608301" },
      ],
    },
    Bhuvanagiri: {
      defaultPincode: "608601",
      panchayats: [
        { name: "Bhuvanagiri Town", pincode: "608601" },
        { name: "Melbhuvanagiri", pincode: "608601" },
        { name: "Sethiathoppu", pincode: "608702" },
        { name: "Pinnalur", pincode: "608704" },
      ],
    },
  },

  Dharmapuri: {
    Dharmapuri: {
      defaultPincode: "636701",
      panchayats: [
        { name: "Dharmapuri Town", pincode: "636701" },
        { name: "Adhiyamankottai", pincode: "636807" },
        { name: "Matlampatti", pincode: "635205" },
        { name: "Settikarai", pincode: "636704" },
        { name: "Vennampatti", pincode: "636705" },
      ],
    },
    Harur: {
      defaultPincode: "636903",
      panchayats: [
        { name: "Harur Town", pincode: "636903" },
        { name: "Morappur", pincode: "635305" },
        { name: "Theerthamalai", pincode: "636906" },
        { name: "Doddampatti", pincode: "636903" },
      ],
    },
    Palacode: {
      defaultPincode: "636808",
      panchayats: [
        { name: "Palacode Town", pincode: "636808" },
        { name: "Marandahalli", pincode: "636806" },
        { name: "Karimangalam", pincode: "635111" },
        { name: "Papparapatti", pincode: "636809" },
      ],
    },
    Pennagaram: {
      defaultPincode: "636810",
      panchayats: [
        { name: "Pennagaram Town", pincode: "636810" },
        { name: "Hogenakkal", pincode: "636810" },
        { name: "Eriyur", pincode: "636810" },
        { name: "Perumpalai", pincode: "636811" },
      ],
    },
    Pappireddipatti: {
      defaultPincode: "636905",
      panchayats: [
        { name: "Pappireddipatti Town", pincode: "636905" },
        { name: "Kadathur", pincode: "635303" },
        { name: "B.Mallapuram", pincode: "635301" },
        { name: "Menasi", pincode: "636904" },
      ],
    },
  },

  Dindigul: {
    Dindigul: {
      defaultPincode: "624001",
      panchayats: [
        { name: "Dindigul Town", pincode: "624001" },
        { name: "Chettinaickenpatti", pincode: "624004" },
        { name: "Begambur", pincode: "624002" },
        { name: "Sirumalai", pincode: "624003" },
        { name: "Thadicombu", pincode: "624709" },
        { name: "Agraharam", pincode: "624001" },
      ],
    },
    Palani: {
      defaultPincode: "624601",
      panchayats: [
        { name: "Palani Town", pincode: "624601" },
        { name: "Ayakudi", pincode: "624613" },
        { name: "Balasamudram", pincode: "624610" },
        { name: "Neikarapatti", pincode: "624618" },
        { name: "Keeranur", pincode: "624617" },
      ],
    },
    Oddanchatram: {
      defaultPincode: "624619",
      panchayats: [
        { name: "Oddanchatram Town", pincode: "624619" },
        { name: "Kallimanthayam", pincode: "624616" },
        { name: "Virupachi", pincode: "624614" },
        { name: "Ambilikai", pincode: "624612" },
      ],
    },
    Kodaikanal: {
      defaultPincode: "624101",
      panchayats: [
        { name: "Kodaikanal Town", pincode: "624101" },
        { name: "Pannikadu", pincode: "624210" },
        { name: "Poombarai", pincode: "624103" },
        { name: "Mannavanur", pincode: "624103" },
        { name: "Vilpatti", pincode: "624101" },
      ],
    },
    Natham: {
      defaultPincode: "624401",
      panchayats: [
        { name: "Natham Town", pincode: "624401" },
        { name: "Sendurai", pincode: "624403" },
        { name: "Uluppagudi", pincode: "624401" },
        { name: "Sirugudi", pincode: "624401" },
      ],
    },
    Nilakottai: {
      defaultPincode: "624208",
      panchayats: [
        { name: "Nilakottai Town", pincode: "624208" },
        { name: "Batlagundu", pincode: "624202" },
        { name: "Ammainaickanur", pincode: "624201" },
        { name: "Sevugampatti", pincode: "624211" },
      ],
    },
    Vedasandur: {
      defaultPincode: "624710",
      panchayats: [
        { name: "Vedasandur Town", pincode: "624710" },
        { name: "Eriodu", pincode: "624702" },
        { name: "Vadamadurai", pincode: "624802" },
        { name: "Gujiliamparai", pincode: "624703" },
      ],
    },
  },

  Erode: {
    Erode: {
      defaultPincode: "638001",
      panchayats: [
        { name: "Erode Town", pincode: "638001" },
        { name: "Surampatti", pincode: "638009" },
        { name: "Veerappanchatram", pincode: "638004" },
        { name: "Kasipalayam", pincode: "638009" },
        { name: "Thindal", pincode: "638012" },
        { name: "Brahmana Periya Agraharam", pincode: "638005" },
      ],
    },
    Gobichettipalayam: {
      defaultPincode: "638452",
      panchayats: [
        { name: "Gobichettipalayam Town", pincode: "638452" },
        { name: "Kugalur", pincode: "638455" },
        { name: "Lakkampatti", pincode: "638453" },
        { name: "Kallipatti", pincode: "638505" },
        { name: "Nambiyur", pincode: "638458" },
      ],
    },
    Bhavani: {
      defaultPincode: "638301",
      panchayats: [
        { name: "Bhavani Town", pincode: "638301" },
        { name: "Komarapalayam Road", pincode: "638301" },
        { name: "Kalingarayanpalayam", pincode: "638301" },
        { name: "Ammapettai", pincode: "638311" },
        { name: "Salangapalayam", pincode: "638455" },
      ],
    },
    Perundurai: {
      defaultPincode: "638052",
      panchayats: [
        { name: "Perundurai Town", pincode: "638052" },
        { name: "SIPCOT Perundurai", pincode: "638052" },
        { name: "Kanjikovil", pincode: "638116" },
        { name: "Chennimalai", pincode: "638051" },
        { name: "Pethampalayam", pincode: "638116" },
      ],
    },
    Sathyamangalam: {
      defaultPincode: "638401",
      panchayats: [
        { name: "Sathyamangalam Town", pincode: "638401" },
        { name: "Bhavanisagar", pincode: "638451" },
        { name: "Bannari", pincode: "638401" },
        { name: "Punjai Puliyampatti", pincode: "638459" },
        { name: "Sirumugai Road", pincode: "638401" },
      ],
    },
    Anthiyur: {
      defaultPincode: "638501",
      panchayats: [
        { name: "Anthiyur Town", pincode: "638501" },
        { name: "Burgur", pincode: "638501" },
        { name: "Athani", pincode: "638502" },
        { name: "Appakudal", pincode: "638315" },
      ],
    },
  },

  Kallakurichi: {
    Kallakurichi: {
      defaultPincode: "606202",
      panchayats: [
        { name: "Kallakurichi Town", pincode: "606202" },
        { name: "Embalam", pincode: "606202" },
        { name: "Indili", pincode: "606202" },
        { name: "Moongilthuraipattu", pincode: "605702" },
        { name: "Malaikottalam", pincode: "606202" },
      ],
    },
    Sankarapuram: {
      defaultPincode: "606401",
      panchayats: [
        { name: "Sankarapuram Town", pincode: "606401" },
        { name: "Rishivandiyam", pincode: "606205" },
        { name: "Devapandalam", pincode: "606402" },
        { name: "Pudur", pincode: "606401" },
      ],
    },
    Ulundurpet: {
      defaultPincode: "606107",
      panchayats: [
        { name: "Ulundurpet Town", pincode: "606107" },
        { name: "Elavanasurkottai", pincode: "607202" },
        { name: "Mangalampettai Road", pincode: "606107" },
        { name: "Sendamangalam", pincode: "607204" },
      ],
    },
    Chinnaselam: {
      defaultPincode: "606201",
      panchayats: [
        { name: "Chinnaselam Town", pincode: "606201" },
        { name: "Kachirayapalayam", pincode: "606207" },
        { name: "Koogaiyur", pincode: "606301" },
      ],
    },
    Tirukoilur: {
      defaultPincode: "605757",
      panchayats: [
        { name: "Tirukoilur Town", pincode: "605757" },
        { name: "Arakandanallur", pincode: "605752" },
        { name: "Manalurpet", pincode: "605754" },
        { name: "Mugaiyur", pincode: "605755" },
      ],
    },
  },

  Kancheepuram: {
    Kancheepuram: {
      defaultPincode: "631501",
      panchayats: [
        { name: "Kancheepuram Town", pincode: "631501" },
        { name: "Orikkai", pincode: "631502" },
        { name: "Sevilimedu", pincode: "631502" },
        { name: "Thenambakkam", pincode: "631601" },
        { name: "Damal", pincode: "631551" },
      ],
    },
    Sriperumbudur: {
      defaultPincode: "602105",
      panchayats: [
        { name: "Sriperumbudur Town", pincode: "602105" },
        { name: "Sunguvarchatram", pincode: "602106" },
        { name: "Irungattukottai (SIPCOT)", pincode: "602117" },
        { name: "Oragadam", pincode: "602105" },
        { name: "Pillaipakkam", pincode: "602105" },
        { name: "Mambakkam", pincode: "602105" },
      ],
    },
    Kundrathur: {
      defaultPincode: "600069",
      panchayats: [
        { name: "Kundrathur Town", pincode: "600069" },
        { name: "Mangadu", pincode: "600122" },
        { name: "Kovur", pincode: "600128" },
        { name: "Thirumudivakkam", pincode: "600044" },
        { name: "Somangalam", pincode: "602109" },
        { name: "Gerugambakkam", pincode: "600128" },
      ],
    },
    Uthiramerur: {
      defaultPincode: "603406",
      panchayats: [
        { name: "Uthiramerur Town", pincode: "603406" },
        { name: "Manampathy", pincode: "603403" },
        { name: "Kaliampoondi", pincode: "603406" },
        { name: "Kattankulam", pincode: "603406" },
      ],
    },
    Walajabad: {
      defaultPincode: "631605",
      panchayats: [
        { name: "Walajabad Town", pincode: "631605" },
        { name: "Ayyampettai", pincode: "631601" },
        { name: "Thenneri", pincode: "631604" },
        { name: "Ekanapuram", pincode: "631553" },
      ],
    },
  },

  Kanyakumari: {
    Agasteeswaram: {
      defaultPincode: "629701",
      panchayats: [
        { name: "Kanyakumari Town", pincode: "629702" },
        { name: "Nagercoil City", pincode: "629001" },
        { name: "Agasteeswaram", pincode: "629701" },
        { name: "Suchindram", pincode: "629704" },
        { name: "Kottaram", pincode: "629703" },
        { name: "Marungoor", pincode: "629402" },
      ],
    },
    Thovalai: {
      defaultPincode: "629302",
      panchayats: [
        { name: "Thovalai Town", pincode: "629302" },
        { name: "Boothapandi", pincode: "629852" },
        { name: "Aralvaimozhi", pincode: "629301" },
        { name: "Asambu", pincode: "629851" },
      ],
    },
    Kalkulam: {
      defaultPincode: "629175",
      panchayats: [
        { name: "Thuckalay", pincode: "629175" },
        { name: "Padmanabhapuram", pincode: "629175" },
        { name: "Colachel", pincode: "629251" },
        { name: "Eranniel", pincode: "629802" },
        { name: "Thingalnagar", pincode: "629802" },
      ],
    },
    Vilavancode: {
      defaultPincode: "629163",
      panchayats: [
        { name: "Kuzhithurai", pincode: "629163" },
        { name: "Marthandam", pincode: "629165" },
        { name: "Arumanai", pincode: "629151" },
        { name: "Pacode", pincode: "629168" },
      ],
    },
    Killiyoor: {
      defaultPincode: "629171",
      panchayats: [
        { name: "Killiyoor Town", pincode: "629171" },
        { name: "Karungal", pincode: "629157" },
        { name: "Pudukadai", pincode: "629171" },
        { name: "Kizhkulam", pincode: "629193" },
      ],
    },
  },

  Madurai: {
    "Madurai North": {
      defaultPincode: "625002",
      panchayats: [
        { name: "Goripalayam", pincode: "625002" },
        { name: "Tallakulam", pincode: "625002" },
        { name: "Koodal Nagar", pincode: "625018" },
        { name: "Anaiyur", pincode: "625017" },
        { name: "Alagarkoil Road", pincode: "625002" },
      ],
    },
    "Madurai South": {
      defaultPincode: "625001",
      panchayats: [
        { name: "Meenakshi Temple Area", pincode: "625001" },
        { name: "South Gate", pincode: "625001" },
        { name: "Villapuram", pincode: "625012" },
        { name: "Avaniyapuram", pincode: "625012" },
        { name: "Jaihindpuram", pincode: "625011" },
      ],
    },
    Thiruparankundram: {
      defaultPincode: "625005",
      panchayats: [
        { name: "Thiruparankundram Town", pincode: "625005" },
        { name: "Pasumalai", pincode: "625004" },
        { name: "Thirunagar", pincode: "625006" },
        { name: "Harveypatti", pincode: "625005" },
        { name: "Thanakkankulam", pincode: "625006" },
      ],
    },
    Melur: {
      defaultPincode: "625106",
      panchayats: [
        { name: "Melur Town", pincode: "625106" },
        { name: "Kottampatti", pincode: "625103" },
        { name: "Vellalur", pincode: "625109" },
        { name: "Navinipatti", pincode: "625106" },
      ],
    },
    Thirumangalam: {
      defaultPincode: "625706",
      panchayats: [
        { name: "Thirumangalam Town", pincode: "625706" },
        { name: "Kalligudi", pincode: "625701" },
        { name: "Kappalur", pincode: "625008" },
        { name: "Checkanurani", pincode: "625514" },
      ],
    },
    Usilampatti: {
      defaultPincode: "625532",
      panchayats: [
        { name: "Usilampatti Town", pincode: "625532" },
        { name: "Sedapatti", pincode: "625527" },
        { name: "Valandur", pincode: "625532" },
      ],
    },
    Vadipatti: {
      defaultPincode: "625218",
      panchayats: [
        { name: "Vadipatti Town", pincode: "625218" },
        { name: "Sholavandan", pincode: "625214" },
        { name: "Alanganallur", pincode: "625501" },
        { name: "Palamedu", pincode: "625503" },
      ],
    },
  },

  Salem: {
    Salem: {
      defaultPincode: "636001",
      panchayats: [
        { name: "Salem Town", pincode: "636001" },
        { name: "Shevapet", pincode: "636002" },
        { name: "Hasthampatti", pincode: "636007" },
        { name: "Suramangalam (Junction)", pincode: "636005" },
        { name: "Ammapet", pincode: "636003" },
        { name: "Alagapuram", pincode: "636016" },
        { name: "Fairlands", pincode: "636016" },
        { name: "Kandhampatty", pincode: "636005" },
      ],
    },
    Attur: {
      defaultPincode: "636102",
      panchayats: [
        { name: "Attur Town", pincode: "636102" },
        { name: "Narasingapuram", pincode: "636108" },
        { name: "Thalaivasal", pincode: "636112" },
        { name: "Mallur", pincode: "636203" },
      ],
    },
    Mettur: {
      defaultPincode: "636401",
      panchayats: [
        { name: "Mettur Dam", pincode: "636401" },
        { name: "Kolathur", pincode: "636303" },
        { name: "Mecheri", pincode: "636453" },
        { name: "P.N. Patti", pincode: "636456" },
      ],
    },
    Omalur: {
      defaultPincode: "636455",
      panchayats: [
        { name: "Omalur Town", pincode: "636455" },
        { name: "Tharamangalam", pincode: "636502" },
        { name: "Kadayampatti", pincode: "636351" },
        { name: "Danishpet", pincode: "636354" },
      ],
    },
    Sankari: {
      defaultPincode: "637301",
      panchayats: [
        { name: "Sankari Town", pincode: "637301" },
        { name: "Edappadi", pincode: "637101" },
        { name: "Poolampatti", pincode: "637107" },
        { name: "Konganapuram", pincode: "637102" },
      ],
    },
  },

  Tiruchirappalli: {
    "Tiruchirappalli East": {
      defaultPincode: "620008",
      panchayats: [
        { name: "Palakkarai", pincode: "620001" },
        { name: "Tharanallur", pincode: "620008" },
        { name: "Ponmalai (Golden Rock)", pincode: "620004" },
        { name: "Kallukuzhi", pincode: "620020" },
      ],
    },
    "Tiruchirappalli West": {
      defaultPincode: "620001",
      panchayats: [
        { name: "Cantonment", pincode: "620001" },
        { name: "Thillai Nagar", pincode: "620018" },
        { name: "Woraiyur", pincode: "620003" },
        { name: "K.K. Nagar", pincode: "620021" },
      ],
    },
    Srirangam: {
      defaultPincode: "620006",
      panchayats: [
        { name: "Srirangam Temple Town", pincode: "620006" },
        { name: "Thiruvanaikoil", pincode: "620005" },
        { name: "Manachanallur", pincode: "621005" },
        { name: "Samayapuram", pincode: "621112" },
        { name: "Tolgate", pincode: "621216" },
      ],
    },
    Tiruverumbur: {
      defaultPincode: "620013",
      panchayats: [
        { name: "Tiruverumbur Town", pincode: "620013" },
        { name: "BHEL Township", pincode: "620014" },
        { name: "Kattur", pincode: "620019" },
        { name: "Thuvakudi", pincode: "620015" },
        { name: "NIT Trichy", pincode: "620015" },
      ],
    },
    Lalgudi: {
      defaultPincode: "621601",
      panchayats: [
        { name: "Lalgudi Town", pincode: "621601" },
        { name: "Pullambadi", pincode: "621711" },
        { name: "Poovalur", pincode: "621712" },
      ],
    },
    Musiri: {
      defaultPincode: "621211",
      panchayats: [
        { name: "Musiri Town", pincode: "621211" },
        { name: "Thottiyam", pincode: "621215" },
        { name: "Kattuputhur", pincode: "621207" },
      ],
    },
    Manapparai: {
      defaultPincode: "621306",
      panchayats: [
        { name: "Manapparai Town", pincode: "621306" },
        { name: "Marungapuri", pincode: "621314" },
        { name: "Vaiyampatti", pincode: "621315" },
      ],
    },
    Thuraiyur: {
      defaultPincode: "621010",
      panchayats: [
        { name: "Thuraiyur Town", pincode: "621010" },
        { name: "Uppiliapuram", pincode: "621111" },
        { name: "Sobanapuram", pincode: "621011" },
      ],
    },
  },

  Tirunelveli: {
    Tirunelveli: {
      defaultPincode: "627001",
      panchayats: [
        { name: "Tirunelveli Town", pincode: "627006" },
        { name: "Tirunelveli Junction", pincode: "627001" },
        { name: "Palayamkottai", pincode: "627002" },
        { name: "Melapalayam", pincode: "627005" },
        { name: "Thatchanallur", pincode: "627358" },
      ],
    },
    Ambasamudram: {
      defaultPincode: "627401",
      panchayats: [
        { name: "Ambasamudram Town", pincode: "627401" },
        { name: "Kallidaikurichi", pincode: "627416" },
        { name: "Vikramasingapuram", pincode: "627425" },
        { name: "Manimuthar", pincode: "627421" },
        { name: "Cheranmahadevi", pincode: "627414" },
      ],
    },
    Nanguneri: {
      defaultPincode: "627108",
      panchayats: [
        { name: "Nanguneri Town", pincode: "627108" },
        { name: "Kalakkad", pincode: "627501" },
        { name: "Moolaikaraipatti", pincode: "627354" },
      ],
    },
    Radhapuram: {
      defaultPincode: "627111",
      panchayats: [
        { name: "Radhapuram Town", pincode: "627111" },
        { name: "Vallioor", pincode: "627117" },
        { name: "Panagudi", pincode: "627109" },
        { name: "Kudankulam", pincode: "627106" },
        { name: "Thisayanvilai", pincode: "627657" },
      ],
    },
  },

  Tiruvallur: {
    Tiruvallur: {
      defaultPincode: "602001",
      panchayats: [
        { name: "Tiruvallur Town", pincode: "602001" },
        { name: "Manavala Nagar", pincode: "602002" },
        { name: "Ikkadu", pincode: "602021" },
        { name: "Sevvapet", pincode: "602025" },
      ],
    },
    Avadi: {
      defaultPincode: "600054",
      panchayats: [
        { name: "Avadi", pincode: "600054" },
        { name: "Pattabiram", pincode: "600072" },
        { name: "Thirumullaivoyal", pincode: "600062" },
        { name: "Mittanamalli", pincode: "600055" },
      ],
    },
    Poonamallee: {
      defaultPincode: "600056",
      panchayats: [
        { name: "Poonamallee Town", pincode: "600056" },
        { name: "Kumananchavadi", pincode: "600056" },
        { name: "Thiruverkadu", pincode: "600077" },
        { name: "Sennerkuppam", pincode: "600056" },
      ],
    },
    Ponneri: {
      defaultPincode: "601204",
      panchayats: [
        { name: "Ponneri Town", pincode: "601204" },
        { name: "Minjur", pincode: "601203" },
        { name: "Medur", pincode: "601201" },
        { name: "Arani (Tiruvallur)", pincode: "601101" },
      ],
    },
    Gummidipoondi: {
      defaultPincode: "601201",
      panchayats: [
        { name: "Gummidipoondi Town", pincode: "601201" },
        { name: "SIPCOT Gummidipoondi", pincode: "601201" },
        { name: "Kaveripettai", pincode: "601206" },
      ],
    },
    Tiruttani: {
      defaultPincode: "631209",
      panchayats: [
        { name: "Tiruttani Town", pincode: "631209" },
        { name: "Arakkonam Road", pincode: "631209" },
        { name: "Pallipattu", pincode: "631207" },
        { name: "R.K. Pet", pincode: "631303" },
      ],
    },
  },

  Tiruvannamalai: {
    Tiruvannamalai: {
      defaultPincode: "606601",
      panchayats: [
        { name: "Tiruvannamalai Town", pincode: "606601" },
        { name: "Girivalam Path Area", pincode: "606603" },
        { name: "Vengikkal", pincode: "606604" },
        { name: "Kilpennathur", pincode: "604601" },
        { name: "Thandarampattu", pincode: "606707" },
      ],
    },
    Arani: {
      defaultPincode: "632301",
      panchayats: [
        { name: "Arani Town", pincode: "632301" },
        { name: "Devikapuram", pincode: "606902" },
        { name: "Sevvoor", pincode: "632316" },
      ],
    },
    Cheyyar: {
      defaultPincode: "604407",
      panchayats: [
        { name: "Cheyyar (Tiruvathipuram)", pincode: "604407" },
        { name: "SIPCOT Cheyyar", pincode: "604407" },
        { name: "Vembakkam", pincode: "604410" },
        { name: "Anakkavoor", pincode: "604401" },
      ],
    },
    Polur: {
      defaultPincode: "606803",
      panchayats: [
        { name: "Polur Town", pincode: "606803" },
        { name: "Kalasapakkam", pincode: "606751" },
        { name: "Chetpet", pincode: "606801" },
        { name: "Padavedu", pincode: "606905" },
      ],
    },
    Chengam: {
      defaultPincode: "606701",
      panchayats: [
        { name: "Chengam Town", pincode: "606701" },
        { name: "Melchengam", pincode: "606703" },
        { name: "Pachal", pincode: "606704" },
      ],
    },
    Vandavasi: {
      defaultPincode: "604408",
      panchayats: [
        { name: "Vandavasi Town", pincode: "604408" },
        { name: "Thellar", pincode: "604406" },
        { name: "Marudadu", pincode: "604405" },
      ],
    },
  },

  Vellore: {
    Vellore: {
      defaultPincode: "632001",
      panchayats: [
        { name: "Vellore Fort Area", pincode: "632004" },
        { name: "Bagayam", pincode: "632002" },
        { name: "Sathuvachari", pincode: "632009" },
        { name: "Thorapadi", pincode: "632002" },
        { name: "Salavanpet", pincode: "632001" },
      ],
    },
    Katpadi: {
      defaultPincode: "632007",
      panchayats: [
        { name: "Katpadi", pincode: "632007" },
        { name: "VIT Campus Area", pincode: "632014" },
        { name: "Dharapadavedu", pincode: "632007" },
        { name: "Thiruvalam", pincode: "632515" },
        { name: "Senur", pincode: "632006" },
      ],
    },
    Gudiyatham: {
      defaultPincode: "632602",
      panchayats: [
        { name: "Gudiyatham Town", pincode: "632602" },
        { name: "Nellorepet", pincode: "632602" },
        { name: "Pernambut", pincode: "635810" },
        { name: "Valathur", pincode: "635813" },
      ],
    },
    Anaicut: {
      defaultPincode: "632101",
      panchayats: [
        { name: "Anaicut Town", pincode: "632101" },
        { name: "Pallikonda", pincode: "635809" },
        { name: "Odugathur", pincode: "632103" },
        { name: "Poigai", pincode: "632114" },
      ],
    },
  },

  Viluppuram: {
    Viluppuram: {
      defaultPincode: "605602",
      panchayats: [
        { name: "Viluppuram Town", pincode: "605602" },
        { name: "Valavanur", pincode: "605108" },
        { name: "Vikravandi", pincode: "605652" },
        { name: "Kandachipuram", pincode: "605701" },
        { name: "Thiruvennainallur", pincode: "607203" },
        { name: "Salamedu", pincode: "605401" },
      ],
    },
    Tindivanam: {
      defaultPincode: "604001",
      panchayats: [
        { name: "Tindivanam Town", pincode: "604001" },
        { name: "Marakkanam", pincode: "604303" },
        { name: "Brammadesam", pincode: "604301" },
        { name: "Acharapakkam Border", pincode: "604001" },
      ],
    },
    Gingee: {
      defaultPincode: "604202",
      panchayats: [
        { name: "Gingee Town", pincode: "604202" },
        { name: "Ananthapuram", pincode: "605201" },
        { name: "Melmalayanur", pincode: "604204" },
        { name: "Avalurpet", pincode: "604201" },
      ],
    },
    Vanur: {
      defaultPincode: "605109",
      panchayats: [
        { name: "Vanur Town", pincode: "605109" },
        { name: "Auroville Area", pincode: "605101" },
        { name: "Kiliyanur", pincode: "604102" },
        { name: "Moratandi", pincode: "605101" },
      ],
    },
  },

  Virudhunagar: {
    Virudhunagar: {
      defaultPincode: "626001",
      panchayats: [
        { name: "Virudhunagar Town", pincode: "626001" },
        { name: "Amathur", pincode: "626005" },
        { name: "Rosalpatti", pincode: "626001" },
        { name: "Kooraikundu", pincode: "626001" },
      ],
    },
    Sivakasi: {
      defaultPincode: "626123",
      panchayats: [
        { name: "Sivakasi Town", pincode: "626123" },
        { name: "Thiruthangal", pincode: "626130" },
        { name: "Vembakottai", pincode: "626131" },
        { name: "Sithurajapuram", pincode: "626123" },
      ],
    },
    Rajapalayam: {
      defaultPincode: "626117",
      panchayats: [
        { name: "Rajapalayam Town", pincode: "626117" },
        { name: "Chettiarpatti", pincode: "626122" },
        { name: "Sundarapandiam", pincode: "626126" },
        { name: "Seithur", pincode: "626121" },
      ],
    },
    Srivilliputhur: {
      defaultPincode: "626125",
      panchayats: [
        { name: "Srivilliputhur Town", pincode: "626125" },
        { name: "Watrap", pincode: "626132" },
        { name: "Mamsapuram", pincode: "626110" },
        { name: "Koomapatti", pincode: "626133" },
      ],
    },
    Aruppukkottai: {
      defaultPincode: "626101",
      panchayats: [
        { name: "Aruppukkottai Town", pincode: "626101" },
        { name: "Palayampatti", pincode: "626112" },
        { name: "Pandalgudi", pincode: "626113" },
        { name: "Kariapatti", pincode: "626106" },
        { name: "Tiruchuli", pincode: "626129" },
      ],
    },
    Sattur: {
      defaultPincode: "626203",
      panchayats: [
        { name: "Sattur Town", pincode: "626203" },
        { name: "Elayirampannai", pincode: "626201" },
        { name: "Nalli", pincode: "626203" },
      ],
    },
  },

  Karur: {
    Karur: {
      defaultPincode: "639001",
      panchayats: [
        { name: "Karur Town", pincode: "639001" },
        { name: "Inam Karur", pincode: "639002" },
        { name: "Thanthoni", pincode: "639005" },
        { name: "Sanapiratti", pincode: "639004" },
        { name: "Andankoil", pincode: "639002" },
        { name: "Manmangalam", pincode: "639006" },
        { name: "Pugalur", pincode: "639113" },
      ],
    },
    Kulithalai: {
      defaultPincode: "639107",
      panchayats: [
        { name: "Kulithalai Town", pincode: "639107" },
        { name: "Krishnarayapuram", pincode: "639102" },
        { name: "Nangavaram", pincode: "639110" },
        { name: "Marudur", pincode: "639107" },
      ],
    },
    Aravakurichi: {
      defaultPincode: "639201",
      panchayats: [
        { name: "Aravakurichi Town", pincode: "639201" },
        { name: "Pallapatti", pincode: "639205" },
        { name: "K.Paramathi", pincode: "639111" },
        { name: "Chinnadharapuram", pincode: "639202" },
      ],
    },
  },

  Krishnagiri: {
    Krishnagiri: {
      defaultPincode: "635001",
      panchayats: [
        { name: "Krishnagiri Town", pincode: "635001" },
        { name: "Kaveripattinam", pincode: "635112" },
        { name: "Bargur", pincode: "635104" },
        { name: "Kundarapalli", pincode: "635115" },
      ],
    },
    Hosur: {
      defaultPincode: "635109",
      panchayats: [
        { name: "Hosur Town", pincode: "635109" },
        { name: "SIPCOT Hosur", pincode: "635126" },
        { name: "Bagalur", pincode: "635103" },
        { name: "Mathigiri", pincode: "635110" },
        { name: "Zuzuvadi", pincode: "635126" },
        { name: "Mookandapalli", pincode: "635126" },
      ],
    },
    Denkanikottai: {
      defaultPincode: "635107",
      panchayats: [
        { name: "Denkanikottai Town", pincode: "635107" },
        { name: "Thalli", pincode: "635118" },
        { name: "Kelamangalam", pincode: "635113" },
        { name: "Anchetty", pincode: "636815" },
      ],
    },
    Pochampalli: {
      defaultPincode: "635206",
      panchayats: [
        { name: "Pochampalli Town", pincode: "635206" },
        { name: "Barur", pincode: "635201" },
        { name: "Nagarasampatti", pincode: "635204" },
      ],
    },
    Uthangarai: {
      defaultPincode: "635207",
      panchayats: [
        { name: "Uthangarai Town", pincode: "635207" },
        { name: "Singarapettai", pincode: "635307" },
        { name: "Kallavi", pincode: "635304" },
      ],
    },
  },

  Mayiladuthurai: {
    Mayiladuthurai: {
      defaultPincode: "609001",
      panchayats: [
        { name: "Mayiladuthurai Town", pincode: "609001" },
        { name: "Koorainadu", pincode: "609002" },
        { name: "Manalmedu", pincode: "609202" },
        { name: "Kuthalam", pincode: "609801" },
        { name: "Komal", pincode: "609805" },
      ],
    },
    Sirkazhi: {
      defaultPincode: "609110",
      panchayats: [
        { name: "Sirkazhi Town", pincode: "609110" },
        { name: "Vaitheeswarankoil", pincode: "609117" },
        { name: "Thirumullaivasal", pincode: "609113" },
        { name: "Poompuhar", pincode: "609105" },
        { name: "Tharangambadi", pincode: "609313" },
      ],
    },
  },

  Nagapattinam: {
    Nagapattinam: {
      defaultPincode: "611001",
      panchayats: [
        { name: "Nagapattinam Town", pincode: "611001" },
        { name: "Nagore", pincode: "611002" },
        { name: "Velankanni", pincode: "611111" },
        { name: "Sikkal", pincode: "611108" },
      ],
    },
    Kilvelur: {
      defaultPincode: "611104",
      panchayats: [
        { name: "Kilvelur Town", pincode: "611104" },
        { name: "Thirukkuvalai", pincode: "610205" },
        { name: "Kizhvenmani", pincode: "611104" },
      ],
    },
    Vedaranyam: {
      defaultPincode: "614810",
      panchayats: [
        { name: "Vedaranyam Town", pincode: "614810" },
        { name: "Kodiakkarai (Point Calimere)", pincode: "614807" },
        { name: "Voimedu", pincode: "614714" },
        { name: "Thalaignayiru", pincode: "614712" },
      ],
    },
  },

  Namakkal: {
    Namakkal: {
      defaultPincode: "637001",
      panchayats: [
        { name: "Namakkal Town", pincode: "637001" },
        { name: "Sendamangalam", pincode: "637409" },
        { name: "Mohanur", pincode: "637015" },
        { name: "Kolli Hills (Semmedu)", pincode: "637411" },
      ],
    },
    Tiruchengode: {
      defaultPincode: "637211",
      panchayats: [
        { name: "Tiruchengode Town", pincode: "637211" },
        { name: "Mallasamudram", pincode: "637503" },
        { name: "Sankari Road Area", pincode: "637211" },
        { name: "Pallipalayam", pincode: "638006" },
      ],
    },
    Rasipuram: {
      defaultPincode: "637408",
      panchayats: [
        { name: "Rasipuram Town", pincode: "637408" },
        { name: "Vennandur", pincode: "637505" },
        { name: "Pillanallur", pincode: "637403" },
      ],
    },
    "Paramathi Velur": {
      defaultPincode: "638182",
      panchayats: [
        { name: "Paramathi", pincode: "637207" },
        { name: "Velur Town", pincode: "638182" },
        { name: "Pothanur", pincode: "638181" },
        { name: "Pandamangalam", pincode: "637208" },
      ],
    },
  },

  Nilgiris: {
    "Udhagamandalam (Ooty)": {
      defaultPincode: "643001",
      panchayats: [
        { name: "Ooty Town", pincode: "643001" },
        { name: "Fernhill", pincode: "643004" },
        { name: "Lovedale", pincode: "643003" },
        { name: "Ketti", pincode: "643215" },
        { name: "Kundah", pincode: "643219" },
      ],
    },
    Coonoor: {
      defaultPincode: "643101",
      panchayats: [
        { name: "Coonoor Town", pincode: "643101" },
        { name: "Aravankadu", pincode: "643202" },
        { name: "Wellington", pincode: "643231" },
        { name: "Hubbathalai", pincode: "643202" },
      ],
    },
    Kotagiri: {
      defaultPincode: "643217",
      panchayats: [
        { name: "Kotagiri Town", pincode: "643217" },
        { name: "Kodanad", pincode: "643217" },
        { name: "Nedugula", pincode: "643217" },
      ],
    },
    Gudalur: {
      defaultPincode: "643212",
      panchayats: [
        { name: "Gudalur Town", pincode: "643212" },
        { name: "Pandalur", pincode: "643233" },
        { name: "Devala", pincode: "643270" },
        { name: "Nelliyalam", pincode: "643224" },
      ],
    },
  },

  Perambalur: {
    Perambalur: {
      defaultPincode: "621212",
      panchayats: [
        { name: "Perambalur Town", pincode: "621212" },
        { name: "Elambalur", pincode: "621212" },
        { name: "Kurumbalur", pincode: "621107" },
        { name: "Erumaipatti", pincode: "621212" },
      ],
    },
    Kunnam: {
      defaultPincode: "621708",
      panchayats: [
        { name: "Kunnam Town", pincode: "621708" },
        { name: "Labbaikudikadu", pincode: "621108" },
        { name: "Alathur", pincode: "621216" },
        { name: "Chettikulam", pincode: "621104" },
      ],
    },
    Veppanthattai: {
      defaultPincode: "621116",
      panchayats: [
        { name: "Veppanthattai Town", pincode: "621116" },
        { name: "Poolambadi", pincode: "621110" },
        { name: "Valikandapuram", pincode: "621115" },
        { name: "Arumbavur", pincode: "621103" },
      ],
    },
  },

  Pudukkottai: {
    Pudukkottai: {
      defaultPincode: "622001",
      panchayats: [
        { name: "Pudukkottai Town", pincode: "622001" },
        { name: "Machuvadi", pincode: "622004" },
        { name: "Gandarvakottai", pincode: "613301" },
        { name: "Thirumayam", pincode: "622507" },
      ],
    },
    Aranthangi: {
      defaultPincode: "614616",
      panchayats: [
        { name: "Aranthangi Town", pincode: "614616" },
        { name: "Avudayarkoil", pincode: "614618" },
        { name: "Manamelkudi", pincode: "614620" },
        { name: "Kottaipattinam", pincode: "614619" },
      ],
    },
    Alangudi: {
      defaultPincode: "622301",
      panchayats: [
        { name: "Alangudi Town", pincode: "622301" },
        { name: "Karambakudi", pincode: "622302" },
        { name: "Vadakadu", pincode: "622304" },
      ],
    },
    Iluppur: {
      defaultPincode: "622102",
      panchayats: [
        { name: "Iluppur Town", pincode: "622102" },
        { name: "Viralimalai", pincode: "621316" },
        { name: "Keeranur", pincode: "622502" },
        { name: "Ponnamaravathi", pincode: "622407" },
      ],
    },
  },

  Ramanathapuram: {
    Ramanathapuram: {
      defaultPincode: "623501",
      panchayats: [
        { name: "Ramanathapuram Town", pincode: "623501" },
        { name: "Rameswaram Island", pincode: "623526" },
        { name: "Dhanushkodi", pincode: "623526" },
        { name: "Mandapam", pincode: "623518" },
        { name: "Kilakarai", pincode: "623517" },
      ],
    },
    Paramakudi: {
      defaultPincode: "623707",
      panchayats: [
        { name: "Paramakudi Town", pincode: "623707" },
        { name: "Emaneswaram", pincode: "623701" },
        { name: "Nainarkoil", pincode: "623705" },
        { name: "Abiramam", pincode: "623601" },
      ],
    },
    Thiruvadanai: {
      defaultPincode: "623525",
      panchayats: [
        { name: "Thiruvadanai Town", pincode: "623525" },
        { name: "R.S. Mangalam", pincode: "623525" },
        { name: "Tondi", pincode: "623409" },
      ],
    },
    Mudukulathur: {
      defaultPincode: "623704",
      panchayats: [
        { name: "Mudukulathur Town", pincode: "623704" },
        { name: "Kamuthi", pincode: "623603" },
        { name: "Kadaladi", pincode: "623703" },
        { name: "Sayalgudi", pincode: "623120" },
      ],
    },
  },

  Ranipet: {
    Ranipet: {
      defaultPincode: "632401",
      panchayats: [
        { name: "Ranipet Town", pincode: "632401" },
        { name: "Walajah (Walajapet)", pincode: "632513" },
        { name: "Arcot", pincode: "632503" },
        { name: "SIPCOT Ranipet", pincode: "632403" },
        { name: "Melvisharam", pincode: "632509" },
      ],
    },
    Arakkonam: {
      defaultPincode: "631001",
      panchayats: [
        { name: "Arakkonam Town", pincode: "631001" },
        { name: "Nemili", pincode: "631051" },
        { name: "Panapakkam", pincode: "631052" },
        { name: "Kaveripakkam", pincode: "632508" },
      ],
    },
    Sholinghur: {
      defaultPincode: "631102",
      panchayats: [
        { name: "Sholinghur Town", pincode: "631102" },
        { name: "Banavaram", pincode: "632505" },
        { name: "Kalavai", pincode: "632506" },
        { name: "Timiri", pincode: "632512" },
      ],
    },
  },

  Sivaganga: {
    Sivaganga: {
      defaultPincode: "630561",
      panchayats: [
        { name: "Sivaganga Town", pincode: "630561" },
        { name: "Manamadurai", pincode: "630606" },
        { name: "Ilayangudi", pincode: "630702" },
        { name: "Tiruppuvanam", pincode: "630611" },
        { name: "Kalaiyarkoil", pincode: "630551" },
      ],
    },
    Karaikudi: {
      defaultPincode: "630001",
      panchayats: [
        { name: "Karaikudi Town", pincode: "630001" },
        { name: "Kottaiyur", pincode: "630106" },
        { name: "Kandanur", pincode: "630104" },
        { name: "Kanadukathan", pincode: "630103" },
        { name: "Pallathur", pincode: "630107" },
        { name: "Devakottai", pincode: "630302" },
        { name: "Tirupathur (Sivaganga)", pincode: "630211" },
        { name: "Singampunari", pincode: "630502" },
      ],
    },
  },

  Tenkasi: {
    Tenkasi: {
      defaultPincode: "627811",
      panchayats: [
        { name: "Tenkasi Town", pincode: "627811" },
        { name: "Courtallam", pincode: "627802" },
        { name: "Ilanji", pincode: "627805" },
        { name: "Surandai", pincode: "627859" },
        { name: "Pavoorchatram", pincode: "627808" },
      ],
    },
    Sankarankovil: {
      defaultPincode: "627756",
      panchayats: [
        { name: "Sankarankovil Town", pincode: "627756" },
        { name: "Thiruvengadam", pincode: "627719" },
        { name: "Karivalamvandanallur", pincode: "627753" },
        { name: "Alangulam", pincode: "627851" },
      ],
    },
    Kadayanallur: {
      defaultPincode: "627751",
      panchayats: [
        { name: "Kadayanallur Town", pincode: "627751" },
        { name: "Sengottai", pincode: "627809" },
        { name: "Sivagiri", pincode: "627757" },
        { name: "Vasudevanallur", pincode: "627758" },
        { name: "Puliyangudi", pincode: "627855" },
      ],
    },
  },

  Thanjavur: {
    Thanjavur: {
      defaultPincode: "613001",
      panchayats: [
        { name: "Thanjavur City", pincode: "613001" },
        { name: "Vallam", pincode: "613403" },
        { name: "Medical College Area", pincode: "613004" },
        { name: "Budalur", pincode: "613602" },
        { name: "Thiruvaiyaru", pincode: "613204" },
      ],
    },
    Kumbakonam: {
      defaultPincode: "612001",
      panchayats: [
        { name: "Kumbakonam Town", pincode: "612001" },
        { name: "Dharasuram", pincode: "612702" },
        { name: "Swamimalai", pincode: "612302" },
        { name: "Thiruvidaimarudur", pincode: "612104" },
        { name: "Thirunageswaram", pincode: "612204" },
        { name: "Papanasam", pincode: "614205" },
        { name: "Ayyampet", pincode: "614201" },
      ],
    },
    Pattukkottai: {
      defaultPincode: "614601",
      panchayats: [
        { name: "Pattukkottai Town", pincode: "614601" },
        { name: "Peravurani", pincode: "614804" },
        { name: "Adirampattinam", pincode: "614701" },
        { name: "Madukkur", pincode: "614903" },
        { name: "Orathanadu", pincode: "614625" },
      ],
    },
  },

  Theni: {
    Theni: {
      defaultPincode: "625531",
      panchayats: [
        { name: "Theni Allinagaram", pincode: "625531" },
        { name: "Bodinayakanur", pincode: "625513" },
        { name: "Periyakulam", pincode: "625601" },
        { name: "Uthamapalayam", pincode: "625533" },
        { name: "Cumbum", pincode: "625516" },
        { name: "Chinnamanur", pincode: "625515" },
        { name: "Andipatti", pincode: "625512" },
        { name: "Gudalur (Theni)", pincode: "625518" },
      ],
    },
  },

  Thoothukudi: {
    Thoothukudi: {
      defaultPincode: "628001",
      panchayats: [
        { name: "Thoothukudi City", pincode: "628001" },
        { name: "Muthiahpuram", pincode: "628005" },
        { name: "Spicnagar", pincode: "628005" },
        { name: "Tiruchendur", pincode: "628215" },
        { name: "Kovilpatti", pincode: "628501" },
        { name: "Srivaikuntam", pincode: "628601" },
        { name: "Eral", pincode: "628801" },
        { name: "Kayathar", pincode: "628952" },
        { name: "Ottapidaram", pincode: "628401" },
        { name: "Ettayapuram", pincode: "628902" },
        { name: "Vilathikulam", pincode: "628907" },
        { name: "Sathankulam", pincode: "628704" },
      ],
    },
  },

  Tirupathur: {
    Tirupathur: {
      defaultPincode: "635601",
      panchayats: [
        { name: "Tirupathur Town", pincode: "635601" },
        { name: "Jolarpet", pincode: "635851" },
        { name: "Natrampalli", pincode: "635852" },
        { name: "Yelagiri Hills", pincode: "635853" },
        { name: "Vaniyambadi", pincode: "635751" },
        { name: "Ambur", pincode: "635802" },
        { name: "Alangayam", pincode: "635701" },
      ],
    },
  },

  Tiruppur: {
    Tiruppur: {
      defaultPincode: "641601",
      panchayats: [
        { name: "Tiruppur Town", pincode: "641601" },
        { name: "Avinashi", pincode: "641654" },
        { name: "Palladam", pincode: "641664" },
        { name: "Dharapuram", pincode: "638656" },
        { name: "Kangeyam", pincode: "638701" },
        { name: "Udumalaipettai", pincode: "642126" },
        { name: "Madathukulam", pincode: "642113" },
        { name: "Uthukuli", pincode: "638751" },
        { name: "Vellakoil", pincode: "638111" },
      ],
    },
  },

  Tiruvarur: {
    Tiruvarur: {
      defaultPincode: "610001",
      panchayats: [
        { name: "Tiruvarur Town", pincode: "610001" },
        { name: "Mannargudi", pincode: "614001" },
        { name: "Thiruthuraipoondi", pincode: "614713" },
        { name: "Nannilam", pincode: "610105" },
        { name: "Kodavasal", pincode: "612601" },
        { name: "Needamangalam", pincode: "614404" },
        { name: "Valangaiman", pincode: "612804" },
        { name: "Koothanallur", pincode: "614101" },
        { name: "Muthupet", pincode: "614704" },
      ],
    },
  },
};

/**
 * Returns available Taluks for a given District.
 * If district has specific taluks configured, returns them;
 * otherwise returns a fallback array.
 */
export function getTaluksForDistrict(district: string): string[] {
  if (!district) return [];
  const districtData = TAMIL_NADU_GEO[district];
  if (districtData) {
    return Object.keys(districtData).sort();
  }
  return [district];
}

/**
 * Returns available Panchayats / Areas for a given District and Taluk.
 */
export function getPanchayatsForTaluk(district: string, taluk: string): AreaInfo[] {
  if (!district || !taluk) return [];
  const districtData = TAMIL_NADU_GEO[district];
  if (!districtData) return [];
  const talukData = districtData[taluk];
  if (!talukData) return [];
  return talukData.panchayats || [];
}

/**
 * Returns the default 6-digit postal pincode for a given District and Taluk.
 */
export function getDefaultPincodeForTaluk(district: string, taluk: string): string | null {
  if (!district || !taluk) return null;
  const districtData = TAMIL_NADU_GEO[district];
  if (!districtData) return null;
  const talukData = districtData[taluk];
  if (!talukData) return null;
  return talukData.defaultPincode || null;
}
