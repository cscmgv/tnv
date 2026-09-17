// Tamil Nadu Panchayats, Municipalities, and Postal Pincodes mapped by Assembly Constituency.
// Supports auto-fetching Panchayat / Area and Pincode based on District & Assembly Constituency.

export interface AreaInfo {
  name: string;
  pincode: string;
}

export const PANCHAYATS_BY_CONSTITUENCY: Record<string, AreaInfo[]> = {
  // --- Ariyalur ---
  "Ariyalur": [
    { name: "Ariyalur Town", pincode: "621704" },
    { name: "Sendurai", pincode: "621714" },
    { name: "Thirumanur", pincode: "621715" },
    { name: "Kallankurichi", pincode: "621705" },
    { name: "Vilankudi", pincode: "621704" },
    { name: "Keelapalur", pincode: "621707" },
    { name: "Nagappamampatti", pincode: "621704" },
    { name: "Rayampuram", pincode: "621714" },
  ],
  "Jayankondam": [
    { name: "Jayankondam Town", pincode: "621802" },
    { name: "T.Palur", pincode: "621212" },
    { name: "Udayarpalayam", pincode: "621804" },
    { name: "Andimadam", pincode: "621801" },
    { name: "Varadarajanpettai", pincode: "621805" },
    { name: "Gangaikonda Cholapuram", pincode: "621901" },
    { name: "Vikkiramangalam", pincode: "621701" },
    { name: "Meensurutti", pincode: "621207" },
  ],

  // --- Chengalpattu ---
  "Chengalpattu": [
    { name: "Chengalpattu Town", pincode: "603001" },
    { name: "Melamaiyur", pincode: "603003" },
    { name: "Singaperumal Koil", pincode: "603204" },
    { name: "Maraimalai Nagar", pincode: "603209" },
    { name: "Alapakkam", pincode: "603003" },
    { name: "Vallam", pincode: "603002" },
    { name: "Paranur", pincode: "603002" },
  ],
  "Cheyyur": [
    { name: "Cheyyur", pincode: "603302" },
    { name: "Lathur", pincode: "603312" },
    { name: "Pavunjur", pincode: "603312" },
    { name: "Chithamur", pincode: "603313" },
    { name: "Idaikkazhinadu", pincode: "603304" },
    { name: "Chunampet", pincode: "603401" },
  ],
  "Madurantakam": [
    { name: "Madurantakam Town", pincode: "603306" },
    { name: "Acharapakkam", pincode: "603301" },
    { name: "Karunguzhi", pincode: "603303" },
    { name: "Kadalur", pincode: "603305" },
    { name: "Padalam", pincode: "603308" },
  ],
  "Pallavaram": [
    { name: "Pallavaram", pincode: "600043" },
    { name: "Chromepet", pincode: "600044" },
    { name: "Hasthinapuram", pincode: "600064" },
    { name: "Keelkattalai", pincode: "600117" },
    { name: "Zamin Pallavaram", pincode: "600043" },
    { name: "Pammal", pincode: "600075" },
    { name: "Anakaputhur", pincode: "600070" },
    { name: "Pozhichalur", pincode: "600074" },
    { name: "Tirusulam", pincode: "600043" },
  ],
  "Sholinganallur": [
    { name: "Sholinganallur", pincode: "600119" },
    { name: "Perungudi", pincode: "600096" },
    { name: "Thoraipakkam", pincode: "600097" },
    { name: "Medavakkam", pincode: "600100" },
    { name: "Madipakkam", pincode: "600091" },
    { name: "Pallikaranai", pincode: "600100" },
    { name: "Kovilambakkam", pincode: "600129" },
    { name: "Semmancheri", pincode: "600119" },
    { name: "Injambakkam", pincode: "600115" },
    { name: "Neelankarai", pincode: "600115" },
    { name: "Akkarai", pincode: "600119" },
  ],
  "Tambaram": [
    { name: "Tambaram West", pincode: "600045" },
    { name: "Tambaram East", pincode: "600059" },
    { name: "Selaiyur", pincode: "600073" },
    { name: "Chitlapakkam", pincode: "600064" },
    { name: "Sembakkam", pincode: "600073" },
    { name: "Peerkankaranai", pincode: "600063" },
    { name: "Perungalathur", pincode: "600063" },
    { name: "Mudichur", pincode: "600048" },
  ],
  "Thiruporur": [
    { name: "Thiruporur", pincode: "603110" },
    { name: "Kelambakkam", pincode: "603103" },
    { name: "Navalur", pincode: "600130" },
    { name: "Siruseri", pincode: "603103" },
    { name: "Padur", pincode: "603103" },
    { name: "Muttukadu", pincode: "603112" },
    { name: "Kovalam", pincode: "603112" },
    { name: "Mahabalipuram (Mamallapuram)", pincode: "603104" },
    { name: "Manamai", pincode: "603102" },
  ],

  // --- Chennai ---
  "Anna Nagar": [
    { name: "Anna Nagar East", pincode: "600102" },
    { name: "Anna Nagar West", pincode: "600040" },
    { name: "Shenoy Nagar", pincode: "600030" },
    { name: "Aminjikarai", pincode: "600029" },
    { name: "Arumbakkam", pincode: "600106" },
  ],
  "Chepauk-Thiruvallikeni": [
    { name: "Chepauk", pincode: "600005" },
    { name: "Triplicane", pincode: "600005" },
    { name: "Chintadripet", pincode: "600002" },
    { name: "Pudupet", pincode: "600002" },
  ],
  "Dr. Radhakrishnan Nagar": [
    { name: "Old Washermanpet", pincode: "600021" },
    { name: "Korukkupet", pincode: "600021" },
    { name: "Tondiarpet", pincode: "600081" },
  ],
  "Egmore": [
    { name: "Egmore", pincode: "600008" },
    { name: "Purasawalkam", pincode: "600084" },
    { name: "Kilpauk", pincode: "600010" },
    { name: "Chetpet", pincode: "600031" },
  ],
  "Harbour": [
    { name: "Parrys / George Town", pincode: "600001" },
    { name: "Sowcarpet", pincode: "600079" },
    { name: "Broadway", pincode: "600108" },
    { name: "Mannady", pincode: "600001" },
  ],
  "Kolathur": [
    { name: "Kolathur", pincode: "600099" },
    { name: "Peravallur", pincode: "600082" },
    { name: "G.K.M Colony", pincode: "600082" },
    { name: "Retteri", pincode: "600099" },
  ],
  "Mylapore": [
    { name: "Mylapore", pincode: "600004" },
    { name: "Mandaveli", pincode: "600028" },
    { name: "Alwarpet", pincode: "600018" },
    { name: "Santhome", pincode: "600004" },
    { name: "R.A. Puram", pincode: "600028" },
  ],
  "Perambur": [
    { name: "Perambur", pincode: "600011" },
    { name: "Sembium", pincode: "600011" },
    { name: "Vyasarpadi", pincode: "600039" },
  ],
  "Royapuram": [
    { name: "Royapuram", pincode: "600013" },
    { name: "Kasimedu", pincode: "600013" },
    { name: "Kaladipet", pincode: "600019" },
  ],
  "Saidapet": [
    { name: "Saidapet", pincode: "600015" },
    { name: "Guindy", pincode: "600032" },
    { name: "West Mambalam", pincode: "600033" },
    { name: "Kotturpuram", pincode: "600085" },
  ],
  "Thiru Vi Ka Nagar": [
    { name: "Perambur Barracks", pincode: "600012" },
    { name: "Otteri", pincode: "600012" },
    { name: "Pattalam", pincode: "600012" },
    { name: "Pulianthope", pincode: "600012" },
  ],
  "Thiyagarayanagar": [
    { name: "T. Nagar", pincode: "600017" },
    { name: "Pondy Bazaar", pincode: "600017" },
    { name: "Ashok Nagar", pincode: "600083" },
    { name: "Kodambakkam", pincode: "600024" },
  ],
  "Thousand Lights": [
    { name: "Thousand Lights", pincode: "600006" },
    { name: "Gopalapuram", pincode: "600086" },
    { name: "Nungambakkam", pincode: "600034" },
    { name: "Teynampet", pincode: "600018" },
  ],
  "Velachery": [
    { name: "Velachery", pincode: "600042" },
    { name: "Adyar", pincode: "600020" },
    { name: "Besant Nagar", pincode: "600090" },
    { name: "Thiruvanmiyur", pincode: "600041" },
    { name: "Taramani", pincode: "600113" },
  ],
  "Villivakkam": [
    { name: "Villivakkam", pincode: "600049" },
    { name: "Konnur", pincode: "600023" },
    { name: "Ayanavaram", pincode: "600023" },
    { name: "ICF Colony", pincode: "600038" },
  ],
  "Virugambakkam": [
    { name: "Virugambakkam", pincode: "600092" },
    { name: "Saligramam", pincode: "600093" },
    { name: "K.K. Nagar", pincode: "600078" },
    { name: "Vadapalani", pincode: "600026" },
    { name: "Koyambedu", pincode: "600107" },
    { name: "Nesapakkam", pincode: "600078" },
  ],

  // --- Coimbatore ---
  "Coimbatore North": [
    { name: "Coimbatore North", pincode: "641030" },
    { name: "Ganapathy", pincode: "641006" },
    { name: "Saravanampatti", pincode: "641035" },
    { name: "Sivanandha Colony", pincode: "641012" },
    { name: "Tatabad", pincode: "641012" },
  ],
  "Coimbatore South": [
    { name: "Town Hall", pincode: "641001" },
    { name: "R.S. Puram", pincode: "641002" },
    { name: "Ukkadam", pincode: "641001" },
    { name: "Race Course", pincode: "641018" },
    { name: "Gopalapuram", pincode: "641018" },
  ],
  "Kavundampalayam": [
    { name: "Kavundampalayam", pincode: "641030" },
    { name: "Thudiyalur", pincode: "641034" },
    { name: "Vellakinar", pincode: "641029" },
    { name: "Idikarai", pincode: "641022" },
    { name: "Narasimhanaickenpalayam", pincode: "641031" },
  ],
  "Kinathukadavu": [
    { name: "Kinathukadavu Town", pincode: "642109" },
    { name: "Kovilpalayam", pincode: "642110" },
    { name: "Vadachithur", pincode: "642120" },
    { name: "Othakkalmandapam", pincode: "641032" },
    { name: "Chettipalayam", pincode: "641201" },
    { name: "Malumichampatti", pincode: "641021" },
  ],
  "Mettupalayam": [
    { name: "Mettupalayam Town", pincode: "641301" },
    { name: "Karamadai", pincode: "641104" },
    { name: "Sirumugai", pincode: "641302" },
    { name: "Bellikuppam", pincode: "641305" },
  ],
  "Pollachi": [
    { name: "Pollachi Town", pincode: "642001" },
    { name: "Achipatti", pincode: "642002" },
    { name: "Suleeswaranpatti", pincode: "642006" },
    { name: "Zamin Uthukuli", pincode: "642004" },
    { name: "Anaimalai", pincode: "642104" },
  ],
  "Singanallur": [
    { name: "Singanallur", pincode: "641005" },
    { name: "Ramanathapuram", pincode: "641045" },
    { name: "Ondipudur", pincode: "641016" },
    { name: "Varadharajapuram", pincode: "641015" },
    { name: "Sowripalayam", pincode: "641028" },
  ],
  "Sulur": [
    { name: "Sulur Town", pincode: "641402" },
    { name: "Kannampalayam", pincode: "641402" },
    { name: "Irugur", pincode: "641103" },
    { name: "Pallapalayam", pincode: "641103" },
    { name: "Karumathampatti", pincode: "641659" },
    { name: "Arasur", pincode: "641407" },
  ],
  "Thondamuthur": [
    { name: "Thondamuthur", pincode: "641109" },
    { name: "Vadavalli", pincode: "641041" },
    { name: "Veerakeralam", pincode: "641007" },
    { name: "Kalveerampalayam", pincode: "641046" },
    { name: "Perur", pincode: "641010" },
    { name: "Kuniyamuthur", pincode: "641008" },
    { name: "Sundakkamuthur", pincode: "641010" },
    { name: "Alandurai", pincode: "641101" },
  ],
  "Valparai": [
    { name: "Valparai Town", pincode: "642127" },
    { name: "Sholayar Dam", pincode: "642125" },
    { name: "Mudis", pincode: "642117" },
    { name: "Cinchona", pincode: "642106" },
    { name: "Kottur", pincode: "642114" },
  ],

  // --- Cuddalore ---
  "Bhuvanagiri": [
    { name: "Bhuvanagiri Town", pincode: "608601" },
    { name: "Sethiathoppu", pincode: "608702" },
    { name: "Melbhuvanagiri", pincode: "608601" },
    { name: "Keerapalayam", pincode: "608602" },
  ],
  "Chidambaram": [
    { name: "Chidambaram Town", pincode: "608001" },
    { name: "Annamalai Nagar", pincode: "608002" },
    { name: "Portonovo (Parangipettai)", pincode: "608502" },
    { name: "Killai", pincode: "608102" },
  ],
  "Cuddalore": [
    { name: "Cuddalore Old Town", pincode: "607003" },
    { name: "Cuddalore New Town (Thirupapuliyur)", pincode: "607002" },
    { name: "Cuddalore Port", pincode: "607003" },
    { name: "Nellikuppam", pincode: "607105" },
  ],
  "Kattumannarkoil": [
    { name: "Kattumannarkoil Town", pincode: "608301" },
    { name: "Srimushnam", pincode: "608703" },
    { name: "Lalpet", pincode: "608303" },
    { name: "Kumaratchi", pincode: "608302" },
  ],
  "Kurinjipadi": [
    { name: "Kurinjipadi Town", pincode: "607302" },
    { name: "Vadalur", pincode: "607303" },
    { name: "Kullanchavadi", pincode: "607901" },
    { name: "Alapakkam", pincode: "608801" },
  ],
  "Neyveli": [
    { name: "Neyveli Township Block 1-30", pincode: "607801" },
    { name: "Neyveli Thermal", pincode: "607807" },
    { name: "Mandarakuppam", pincode: "607802" },
    { name: "Indira Nagar Neyveli", pincode: "607801" },
  ],
  "Panruti": [
    { name: "Panruti Town", pincode: "607106" },
    { name: "Thorapadi", pincode: "607108" },
    { name: "Kandrakottai", pincode: "607205" },
    { name: "Marungur", pincode: "607103" },
  ],
  "Tittakudi": [
    { name: "Tittakudi Town", pincode: "606106" },
    { name: "Pennadam", pincode: "606105" },
    { name: "Mangalur", pincode: "606108" },
    { name: "Avinangudi", pincode: "606112" },
  ],
  "Vriddhachalam": [
    { name: "Vriddhachalam Town", pincode: "606001" },
    { name: "Kammapuram", pincode: "606103" },
    { name: "Karuveppilankurichi", pincode: "606110" },
    { name: "Rajendrapatnam", pincode: "608703" },
  ],

  // --- Dharmapuri ---
  "Dharmapuri": [
    { name: "Dharmapuri Town", pincode: "636701" },
    { name: "Matlampatti", pincode: "635205" },
    { name: "Nallampalli", pincode: "636807" },
    { name: "Thoppur", pincode: "636352" },
  ],
  "Harur": [
    { name: "Harur Town", pincode: "636903" },
    { name: "Morappur", pincode: "635305" },
    { name: "Kambainallur", pincode: "635202" },
    { name: "Theerthamalai", pincode: "636906" },
  ],
  "Palacode": [
    { name: "Palacode Town", pincode: "636808" },
    { name: "Marandahalli", pincode: "636806" },
    { name: "Karimangalam", pincode: "635111" },
    { name: "Jakarpatty", pincode: "635205" },
  ],
  "Pappireddipatti": [
    { name: "Pappireddipatti", pincode: "636905" },
    { name: "B-Mallapuram", pincode: "635301" },
    { name: "Kadathur", pincode: "635303" },
    { name: "Menasi", pincode: "636904" },
  ],
  "Pennagaram": [
    { name: "Pennagaram Town", pincode: "636810" },
    { name: "Hogenakkal", pincode: "636810" },
    { name: "Eriyur", pincode: "636810" },
    { name: "Perumpalai", pincode: "636811" },
  ],

  // --- Dindigul ---
  "Athoor": [
    { name: "Athoor Town", pincode: "624701" },
    { name: "Sithayankottai", pincode: "624708" },
    { name: "Chinnalapatti", pincode: "624301" },
    { name: "Sempatty", pincode: "624707" },
    { name: "Kannivadi", pincode: "624705" },
  ],
  "Dindigul": [
    { name: "Dindigul City", pincode: "624001" },
    { name: "Begambur", pincode: "624002" },
    { name: "Nagal Nagar", pincode: "624003" },
    { name: "Chettinaickenpatti", pincode: "624004" },
    { name: "Seelapadi", pincode: "624005" },
  ],
  "Natham": [
    { name: "Natham Town", pincode: "624401" },
    { name: "Sendurai", pincode: "624403" },
    { name: "Sirugudi", pincode: "624404" },
    { name: "Sanarpatti", pincode: "624304" },
  ],
  "Nilakottai": [
    { name: "Nilakottai Town", pincode: "624208" },
    { name: "Batlagundu (Vathalagundu)", pincode: "624202" },
    { name: "Ammainaickanur", pincode: "624201" },
    { name: "Sevugampatti", pincode: "624211" },
  ],
  "Oddanchatram": [
    { name: "Oddanchatram Town", pincode: "624619" },
    { name: "Thoppampatti", pincode: "624617" },
    { name: "Kallimandayam", pincode: "624616" },
    { name: "Reddiarchatram", pincode: "624622" },
  ],
  "Palani": [
    { name: "Palani Town", pincode: "624601" },
    { name: "Ayakudi", pincode: "624613" },
    { name: "Balasamudram", pincode: "624610" },
    { name: "Neikarapatti", pincode: "624618" },
    { name: "Keeranur", pincode: "624614" },
  ],
  "Vedasandur": [
    { name: "Vedasandur Town", pincode: "624710" },
    { name: "Eriodu", pincode: "624702" },
    { name: "Guziliamparai", pincode: "624703" },
    { name: "Vadamadurai", pincode: "624802" },
  ],

  // --- Erode ---
  "Anthiyur": [
    { name: "Anthiyur Town", pincode: "638501" },
    { name: "Appakudal", pincode: "638315" },
    { name: "Bargur Hills", pincode: "638501" },
    { name: "Athani", pincode: "638502" },
  ],
  "Bhavani": [
    { name: "Bhavani Town", pincode: "638301" },
    { name: "Komarapalayam Road", pincode: "638301" },
    { name: "Ammapettai", pincode: "638311" },
    { name: "Salangapalayam", pincode: "638455" },
  ],
  "Bhavanisagar": [
    { name: "Bhavanisagar Town", pincode: "638451" },
    { name: "Sathyamangalam", pincode: "638401" },
    { name: "Punjai Puliampatti", pincode: "638459" },
    { name: "Sirumugai Road", pincode: "638451" },
    { name: "Talavadi", pincode: "638461" },
  ],
  "Erode East": [
    { name: "Erode Town", pincode: "638001" },
    { name: "Karungalpalayam", pincode: "638003" },
    { name: "Brough Road", pincode: "638001" },
    { name: "Railway Colony", pincode: "638002" },
  ],
  "Erode West": [
    { name: "Perundurai Road", pincode: "638011" },
    { name: "Thindal", pincode: "638012" },
    { name: "Surampatti", pincode: "638009" },
    { name: "Villarasampatti", pincode: "638107" },
    { name: "Solar", pincode: "638002" },
  ],
  "Gobichettipalayam": [
    { name: "Gobichettipalayam Town", pincode: "638452" },
    { name: "Nambiyur", pincode: "638458" },
    { name: "Lakkampatti", pincode: "638313" },
    { name: "Kugalur", pincode: "638313" },
    { name: "Pariyoor", pincode: "638476" },
  ],
  "Modakkurichi": [
    { name: "Modakkurichi Town", pincode: "638104" },
    { name: "Kodumudi", pincode: "638151" },
    { name: "Avalpoondurai", pincode: "638115" },
    { name: "Sivagiri", pincode: "638109" },
    { name: "Kanjikovil", pincode: "638116" },
    { name: "Pasur", pincode: "638154" },
  ],
  "Perundurai": [
    { name: "Perundurai Town", pincode: "638052" },
    { name: "SIPCOT Perundurai", pincode: "638052" },
    { name: "Chennimalai", pincode: "638051" },
    { name: "Vijayamangalam", pincode: "638056" },
    { name: "Uthukuli Road", pincode: "638052" },
  ],

  // --- Madurai ---
  "Madurai Central": [
    { name: "Madurai City", pincode: "625001" },
    { name: "Simmakkal", pincode: "625001" },
    { name: "Goripalayam", pincode: "625002" },
    { name: "Periyar Bus Stand", pincode: "625001" },
  ],
  "Madurai East": [
    { name: "Othakadai", pincode: "625107" },
    { name: "Alagar Kovil Road", pincode: "625104" },
    { name: "Appanthirupathi", pincode: "625301" },
    { name: "Karuppayurani", pincode: "625020" },
  ],
  "Madurai North": [
    { name: "Sellur", pincode: "625002" },
    { name: "Koodal Nagar", pincode: "625018" },
    { name: "Tallakulam", pincode: "625002" },
    { name: "K.K. Nagar Madurai", pincode: "625020" },
    { name: "Anna Nagar Madurai", pincode: "625020" },
  ],
  "Madurai South": [
    { name: "South Gate", pincode: "625001" },
    { name: "Villapuram", pincode: "625012" },
    { name: "Avaniapuram", pincode: "625012" },
    { name: "Jaihindpuram", pincode: "625011" },
  ],
  "Madurai West": [
    { name: "Ponmeni", pincode: "625016" },
    { name: "Kochadai", pincode: "625016" },
    { name: "Arapalayam", pincode: "625016" },
    { name: "Kalavasal", pincode: "625016" },
    { name: "Koodal Alagar", pincode: "625001" },
  ],
  "Melur": [
    { name: "Melur Town", pincode: "625106" },
    { name: "Kottampatti", pincode: "625103" },
    { name: "Vellalur", pincode: "625109" },
    { name: "Therkutheru", pincode: "625122" },
  ],
  "Sholavandan": [
    { name: "Sholavandan Town", pincode: "625214" },
    { name: "Vadipatti", pincode: "625218" },
    { name: "Alanganallur", pincode: "625501" },
    { name: "Palamedu", pincode: "625503" },
  ],
  "Thirumangalam": [
    { name: "Thirumangalam Town", pincode: "625706" },
    { name: "T.Kallupatti", pincode: "625702" },
    { name: "Kappalur", pincode: "625008" },
    { name: "Kallikudi", pincode: "625701" },
  ],
  "Thiruparankundram": [
    { name: "Thiruparankundram Town", pincode: "625005" },
    { name: "Harveypatti", pincode: "625005" },
    { name: "Thirunagar", pincode: "625006" },
    { name: "Pasumalai", pincode: "625004" },
    { name: "Vilangudi", pincode: "625018" },
  ],
  "Usilampatti": [
    { name: "Usilampatti Town", pincode: "625532" },
    { name: "Sedapatti", pincode: "625527" },
    { name: "Chekkanurani", pincode: "625514" },
    { name: "Valandur", pincode: "625532" },
  ],

  // --- Salem ---
  "Salem North": [
    { name: "Alagapuram", pincode: "636016" },
    { name: "Hasthampatti", pincode: "636007" },
    { name: "Kannankurichi", pincode: "636008" },
    { name: "Fairlands", pincode: "636016" },
  ],
  "Salem South": [
    { name: "Annathanapatti", pincode: "636002" },
    { name: "Dadagapatty", pincode: "636006" },
    { name: "Shevapet", pincode: "636002" },
    { name: "Gugai", pincode: "636006" },
  ],
  "Salem West": [
    { name: "Suramangalam", pincode: "636005" },
    { name: "Junction Salem", pincode: "636005" },
    { name: "Kandhampatty", pincode: "636005" },
    { name: "Sivathapuram", pincode: "636307" },
  ],
  "Attur": [
    { name: "Attur Town", pincode: "636102" },
    { name: "Narasingapuram", pincode: "636108" },
    { name: "Peddanayakkanpalayam", pincode: "636109" },
    { name: "Mallur", pincode: "636203" },
  ],
  "Mettur": [
    { name: "Mettur Dam", pincode: "636401" },
    { name: "Mecheri", pincode: "636453" },
    { name: "Kolathur Salem", pincode: "636303" },
    { name: "P.N. Patti", pincode: "636456" },
  ],
  "Omalur": [
    { name: "Omalur Town", pincode: "636455" },
    { name: "Tharamangalam", pincode: "636502" },
    { name: "Karuppur", pincode: "636012" },
    { name: "Kadayampatti", pincode: "636351" },
  ],
  "Edappadi": [
    { name: "Edappadi Town", pincode: "637101" },
    { name: "Jalakandapuram", pincode: "636501" },
    { name: "Poolampatti", pincode: "637107" },
    { name: "Konganapuram", pincode: "637102" },
    { name: "Avaniperur", pincode: "637101" },
  ],
  "Sankari": [
    { name: "Sankari Town", pincode: "637301" },
    { name: "Magudanchavadi", pincode: "637103" },
    { name: "Thevur", pincode: "637104" },
    { name: "Arasiramani", pincode: "637101" },
  ],
  "Yercaud": [
    { name: "Yercaud Town", pincode: "636601" },
    { name: "Valapadi", pincode: "636115" },
    { name: "Ayothiyapattinam", pincode: "636103" },
    { name: "Kuppanur", pincode: "636122" },
  ],

  // --- Tiruchirappalli ---
  "Tiruchirappalli East": [
    { name: "Palakkarai", pincode: "620001" },
    { name: "Gandhi Market", pincode: "620008" },
    { name: "Tharanallur", pincode: "620008" },
    { name: "Ponmalai (Golden Rock)", pincode: "620004" },
  ],
  "Tiruchirappalli West": [
    { name: "Thillai Nagar", pincode: "620018" },
    { name: "Cantonment", pincode: "620001" },
    { name: "Woraiyur", pincode: "620003" },
    { name: "K.K. Nagar Trichy", pincode: "620021" },
    { name: "Crawford", pincode: "620012" },
  ],
  "Srirangam": [
    { name: "Srirangam Town", pincode: "620006" },
    { name: "Thiruvanaikoil", pincode: "620005" },
    { name: "Manikandam", pincode: "620012" },
    { name: "Somarasampettai", pincode: "620102" },
    { name: "Andanallur", pincode: "639101" },
  ],
  "Thiruverumbur": [
    { name: "Thiruverumbur Town", pincode: "620013" },
    { name: "Kattur", pincode: "620019" },
    { name: "BHEL Township", pincode: "620014" },
    { name: "Kailash Nagar", pincode: "620019" },
    { name: "Thuvakudi", pincode: "620015" },
  ],
  "Manachanallur": [
    { name: "Manachanallur Town", pincode: "621005" },
    { name: "Samayapuram", pincode: "621112" },
    { name: "Tolgate", pincode: "621216" },
    { name: "Siruganur", pincode: "621105" },
  ],
  "Musiri": [
    { name: "Musiri Town", pincode: "621211" },
    { name: "Thottiyam", pincode: "621215" },
    { name: "Kattuputhur", pincode: "621207" },
    { name: "Valavanthi", pincode: "621211" },
  ],
  "Lalgudi": [
    { name: "Lalgudi Town", pincode: "621601" },
    { name: "Pullambadi", pincode: "621711" },
    { name: "Poovalur", pincode: "621712" },
    { name: "Kallakudi", pincode: "621651" },
  ],
  "Manapparai": [
    { name: "Manapparai Town", pincode: "621306" },
    { name: "Marungapuri", pincode: "621310" },
    { name: "Vaiyampatti", pincode: "621315" },
    { name: "Ponnampatti", pincode: "621314" },
  ],
  "Thuraiyur": [
    { name: "Thuraiyur Town", pincode: "621010" },
    { name: "Uppiliapuram", pincode: "621111" },
    { name: "Sobanapuram", pincode: "621011" },
    { name: "B. Mettur", pincode: "621003" },
  ],

  // --- Tirunelveli ---
  "Tirunelveli": [
    { name: "Tirunelveli Town", pincode: "627006" },
    { name: "Tirunelveli Junction", pincode: "627001" },
    { name: "Palayamkottai", pincode: "627002" },
    { name: "Melapalayam", pincode: "627005" },
    { name: "Vannarpettai", pincode: "627003" },
  ],
  "Palayamkottai": [
    { name: "Palayamkottai Town", pincode: "627002" },
    { name: "Santhi Nagar", pincode: "627002" },
    { name: "Rahmath Nagar", pincode: "627011" },
    { name: "Perumalpuram", pincode: "627007" },
  ],
  "Ambasamudram": [
    { name: "Ambasamudram Town", pincode: "627401" },
    { name: "Kallidaikurichi", pincode: "627416" },
    { name: "Manimuthar", pincode: "627421" },
    { name: "Cheranmahadevi", pincode: "627414" },
    { name: "Vikramasingapuram", pincode: "627425" },
  ],
  "Nanguneri": [
    { name: "Nanguneri Town", pincode: "627108" },
    { name: "Kalakkad", pincode: "627501" },
    { name: "Moolaikkaraipatti", pincode: "627354" },
    { name: "Eruvadi", pincode: "627103" },
  ],
  "Radhapuram": [
    { name: "Radhapuram Town", pincode: "627111" },
    { name: "Vallioor", pincode: "627117" },
    { name: "Kudankulam", pincode: "627106" },
    { name: "Tisayanvilai", pincode: "627657" },
    { name: "Panagudi", pincode: "627109" },
  ],

  // --- Tiruppur ---
  "Tiruppur North": [
    { name: "Tiruppur North", pincode: "641602" },
    { name: "Anupparpalayam", pincode: "641652" },
    { name: "15 Velampalayam", pincode: "641652" },
    { name: "Mangalam Road", pincode: "641604" },
  ],
  "Tiruppur South": [
    { name: "Tiruppur South", pincode: "641604" },
    { name: "Nallur", pincode: "641606" },
    { name: "Veerapandi", pincode: "641605" },
    { name: "Kallikadu", pincode: "641605" },
  ],
  "Avinashi": [
    { name: "Avinashi Town", pincode: "641654" },
    { name: "Sevur", pincode: "641655" },
    { name: "Thirumuruganpoondi", pincode: "641652" },
    { name: "Thekkalur", pincode: "641654" },
  ],
  "Dharapuram": [
    { name: "Dharapuram Town", pincode: "638656" },
    { name: "Kundadam", pincode: "638702" },
    { name: "Mulanur", pincode: "638106" },
    { name: "Alangiyam", pincode: "638657" },
  ],
  "Kangayam": [
    { name: "Kangayam Town", pincode: "638701" },
    { name: "Vellakoil", pincode: "638111" },
    { name: "Uthukuli", pincode: "638751" },
    { name: "Sivanmalai", pincode: "638701" },
  ],
  "Palladam": [
    { name: "Palladam Town", pincode: "641664" },
    { name: "Pongalur", pincode: "641667" },
    { name: "Samanthurai", pincode: "641664" },
    { name: "Karanampettai", pincode: "641658" },
  ],
  "Udumalaipettai": [
    { name: "Udumalaipettai Town", pincode: "642126" },
    { name: "Madathukulam", pincode: "642113" },
    { name: "Kaniyur", pincode: "642203" },
    { name: "Gudimangalam", pincode: "642201" },
  ],
  "Madathukulam": [
    { name: "Madathukulam Town", pincode: "642113" },
    { name: "Komaralingam", pincode: "642204" },
    { name: "Samarayapatti", pincode: "642204" },
    { name: "Kaniyur", pincode: "642203" },
  ],

  // --- Tiruvallur ---
  "Tiruvallur": [
    { name: "Tiruvallur Town", pincode: "602001" },
    { name: "Poonga Nagar", pincode: "602001" },
    { name: "Manavala Nagar", pincode: "602002" },
    { name: "Ikkadu", pincode: "602021" },
    { name: "Perambakkam", pincode: "631402" },
  ],
  "Avadi": [
    { name: "Avadi Town", pincode: "600054" },
    { name: "Pattabiram", pincode: "600072" },
    { name: "Thirumullaivoyal", pincode: "600062" },
    { name: "Kovilpathagai", pincode: "600062" },
  ],
  "Ambattur": [
    { name: "Ambattur OT", pincode: "600053" },
    { name: "Ambattur Estate", pincode: "600058" },
    { name: "Mogappair", pincode: "600037" },
    { name: "Padi", pincode: "600050" },
    { name: "Korattur", pincode: "600080" },
  ],
  "Madavaram": [
    { name: "Madavaram", pincode: "600060" },
    { name: "Puzhal", pincode: "600066" },
    { name: "Manali", pincode: "600068" },
    { name: "Mathur", pincode: "600068" },
  ],
  "Ponneri": [
    { name: "Ponneri Town", pincode: "601204" },
    { name: "Minjur", pincode: "601203" },
    { name: "Sholavaram", pincode: "600067" },
    { name: "Arani Ponneri", pincode: "601101" },
  ],
  "Poonamallee": [
    { name: "Poonamallee Town", pincode: "600056" },
    { name: "Thiruverkadu", pincode: "600077" },
    { name: "Mangadu", pincode: "600122" },
    { name: "Kattupakkam", pincode: "600056" },
    { name: "Iyyappanthangal", pincode: "600056" },
  ],
  "Tiruttani": [
    { name: "Tiruttani Town", pincode: "631209" },
    { name: "R.K. Pet", pincode: "631303" },
    { name: "Pallipattu", pincode: "631207" },
    { name: "Podaturpet", pincode: "631208" },
  ],
  "Gummidipoondi": [
    { name: "Gummidipoondi Town", pincode: "601201" },
    { name: "SIPCOT Gummidipoondi", pincode: "601201" },
    { name: "Kavarapettai", pincode: "601206" },
    { name: "Sunnambukulam", pincode: "601201" },
  ],

  // --- Vellore ---
  "Vellore": [
    { name: "Vellore Fort Area", pincode: "632004" },
    { name: "Katpadi Road", pincode: "632004" },
    { name: "Bagayam", pincode: "632002" },
    { name: "Thorapadi", pincode: "632002" },
    { name: "Sathuvachari", pincode: "632009" },
  ],
  "Katpadi": [
    { name: "Katpadi Town", pincode: "632007" },
    { name: "VIT Campus", pincode: "632014" },
    { name: "Gandhinagar Vellore", pincode: "632006" },
    { name: "Konavattam", pincode: "632013" },
    { name: "Senur", pincode: "632006" },
  ],
  "Anaikattu": [
    { name: "Anaikattu Town", pincode: "632101" },
    { name: "Pallikonda", pincode: "635807" },
    { name: "Odugathur", pincode: "632103" },
    { name: "Madhanur", pincode: "635804" },
  ],
  "Kilvaithinankuppam": [
    { name: "K.V. Kuppam", pincode: "632201" },
    { name: "Vaduganthangal", pincode: "632204" },
    { name: "Latheri", pincode: "632202" },
  ],
  "Gudiyattam": [
    { name: "Gudiyattam Town", pincode: "632602" },
    { name: "Nellorepet", pincode: "632602" },
    { name: "Pernambut", pincode: "635810" },
    { name: "Valathur", pincode: "635813" },
  ],

  // --- Thanjavur ---
  "Thanjavur": [
    { name: "Thanjavur Town", pincode: "613001" },
    { name: "Medical College Area", pincode: "613004" },
    { name: "Vallam", pincode: "613403" },
    { name: "Karanthai", pincode: "613002" },
    { name: "Punnainallur Mariamman", pincode: "613501" },
  ],
  "Kumbakonam": [
    { name: "Kumbakonam Town", pincode: "612001" },
    { name: "Dharasuram", pincode: "612702" },
    { name: "Swamimalai", pincode: "612302" },
    { name: "Cholapuram", pincode: "612501" },
  ],
  "Papanasam": [
    { name: "Papanasam Town", pincode: "614205" },
    { name: "Ayyampettai", pincode: "614201" },
    { name: "Ammapettai Thanjavur", pincode: "614401" },
    { name: "Chakkarapalli", pincode: "614211" },
  ],
  "Thiruvaiyaru": [
    { name: "Thiruvaiyaru Town", pincode: "613204" },
    { name: "Budalur", pincode: "613602" },
    { name: "Kandiyur", pincode: "613202" },
    { name: "Thirukattupalli", pincode: "613104" },
  ],
  "Pattukkottai": [
    { name: "Pattukkottai Town", pincode: "614601" },
    { name: "Madukkur", pincode: "614903" },
    { name: "Adirampattinam", pincode: "614701" },
    { name: "Mallipattinam", pincode: "614723" },
  ],
  "Peravurani": [
    { name: "Peravurani Town", pincode: "614804" },
    { name: "Sethubavachatram", pincode: "614802" },
    { name: "Kuruvikkarambai", pincode: "614802" },
  ],
  "Orathanadu": [
    { name: "Orathanadu Town", pincode: "614625" },
    { name: "Thelungankudikadu", pincode: "614625" },
    { name: "Pinnaiyur", pincode: "614902" },
  ],
  "Thiruvidaimarudur": [
    { name: "Thiruvidaimarudur Town", pincode: "612104" },
    { name: "Aduthurai", pincode: "612101" },
    { name: "Nachiyarkoil", pincode: "612602" },
    { name: "Thiruppanandal", pincode: "612504" },
  ],

  // --- Kancheepuram ---
  "Kancheepuram": [
    { name: "Kancheepuram Town", pincode: "631501" },
    { name: "Orikkai", pincode: "631502" },
    { name: "Sevilimedu", pincode: "631502" },
    { name: "Walajabad", pincode: "631605" },
  ],
  "Sriperumbudur": [
    { name: "Sriperumbudur Town", pincode: "602105" },
    { name: "Sunguvarchatram", pincode: "602106" },
    { name: "Irungattukottai", pincode: "602117" },
    { name: "Vallakkottai", pincode: "602105" },
  ],
  "Uthiramerur": [
    { name: "Uthiramerur Town", pincode: "603406" },
    { name: "Salavakkam", pincode: "603107" },
    { name: "Manampathy", pincode: "603403" },
  ],
  "Alandur": [
    { name: "Alandur", pincode: "600016" },
    { name: "Nanganallur", pincode: "600061" },
    { name: "Adambakkam", pincode: "600088" },
    { name: "St. Thomas Mount", pincode: "600016" },
    { name: "Pazhavanthangal", pincode: "600114" },
  ],

  // --- Kanyakumari ---
  "Nagercoil": [
    { name: "Nagercoil Town", pincode: "629001" },
    { name: "Kottar", pincode: "629002" },
    { name: "Vadasery", pincode: "629001" },
    { name: "Asaripallam", pincode: "629201" },
    { name: "Suchindram", pincode: "629704" },
  ],
  "Kanniyakumari": [
    { name: "Kanyakumari Town", pincode: "629702" },
    { name: "Agastheeswaram", pincode: "629701" },
    { name: "Kottaram", pincode: "629703" },
    { name: "Anjugramam", pincode: "629401" },
    { name: "Mylaudy", pincode: "629403" },
  ],
  "Colachel": [
    { name: "Colachel Town", pincode: "629251" },
    { name: "Thingalnagar", pincode: "629802" },
    { name: "Monday Market", pincode: "629802" },
    { name: "Mandaikadu", pincode: "629252" },
    { name: "Reethapuram", pincode: "629159" },
  ],
  "Padmanabhapuram": [
    { name: "Thuckalay", pincode: "629175" },
    { name: "Padmanabhapuram", pincode: "629175" },
    { name: "Kulasekharam", pincode: "629161" },
    { name: "Thiruvattar", pincode: "629177" },
  ],
  "Vilavancode": [
    { name: "Kuzhithurai", pincode: "629163" },
    { name: "Marthandam", pincode: "629165" },
    { name: "Kaliyakkavilai", pincode: "629153" },
    { name: "Pacode", pincode: "629168" },
  ],
  "Killiyoor": [
    { name: "Killiyoor", pincode: "629171" },
    { name: "Karungal", pincode: "629157" },
    { name: "Keezhkulam", pincode: "629193" },
    { name: "Palapallam", pincode: "629159" },
  ],

  // --- Karur ---
  "Karur": [
    { name: "Karur Town", pincode: "639001" },
    { name: "Thanthoni", pincode: "639005" },
    { name: "Inam Karur", pincode: "639002" },
    { name: "Vengamedu", pincode: "639006" },
    { name: "Pasupathipalayam", pincode: "639004" },
  ],
  "Aravakurichi": [
    { name: "Aravakurichi Town", pincode: "639201" },
    { name: "Pallapatti", pincode: "639205" },
    { name: "K.Paramathi", pincode: "639111" },
    { name: "Chinnadharapuram", pincode: "639202" },
  ],
  "Krishnarayapuram": [
    { name: "Krishnarayapuram Town", pincode: "639102" },
    { name: "Mayanur", pincode: "639108" },
    { name: "Kadavur", pincode: "621311" },
    { name: "Tharagampatti", pincode: "621311" },
  ],
  "Kulithalai": [
    { name: "Kulithalai Town", pincode: "639104" },
    { name: "Marudur", pincode: "639107" },
    { name: "Nangavaram", pincode: "639110" },
    { name: "Thogaimalai", pincode: "621313" },
  ],

  // --- Krishnagiri ---
  "Krishnagiri": [
    { name: "Krishnagiri Town", pincode: "635001" },
    { name: "Kaveripattinam", pincode: "635112" },
    { name: "Kattiganapalli", pincode: "635002" },
    { name: "Kundarapalli", pincode: "635115" },
  ],
  "Hosur": [
    { name: "Hosur Town", pincode: "635109" },
    { name: "Bagalur", pincode: "635103" },
    { name: "Mathigiri", pincode: "635110" },
    { name: "Zuzuvadi", pincode: "635126" },
    { name: "SIPCOT Hosur", pincode: "635126" },
  ],
  "Bargur": [
    { name: "Bargur Town", pincode: "635104" },
    { name: "Jegadevi", pincode: "635201" },
    { name: "Kandikuppam", pincode: "635108" },
    { name: "Pochampalli", pincode: "635206" },
  ],
  "Thalli": [
    { name: "Thalli Town", pincode: "635118" },
    { name: "Denkanikottai", pincode: "635107" },
    { name: "Anchetty", pincode: "636815" },
    { name: "Kelamangalam", pincode: "635113" },
  ],
  "Uthangarai": [
    { name: "Uthangarai Town", pincode: "635207" },
    { name: "Singarapettai", pincode: "635307" },
    { name: "Samalpatti", pincode: "635306" },
    { name: "Kallavi", pincode: "635304" },
  ],
  "Veppanahalli": [
    { name: "Veppanahalli Town", pincode: "635121" },
    { name: "Rayakottai", pincode: "635116" },
    { name: "Kelamangalam North", pincode: "635113" },
    { name: "Berigai", pincode: "635105" },
  ],

  // --- Mayiladuthurai ---
  "Mayiladuthurai": [
    { name: "Mayiladuthurai Town", pincode: "609001" },
    { name: "Kuthalam", pincode: "609801" },
    { name: "Manganallur", pincode: "609404" },
    { name: "Manalmedu", pincode: "609202" },
    { name: "Koranad", pincode: "609001" },
  ],
  "Poompuhar": [
    { name: "Poompuhar", pincode: "609105" },
    { name: "Sembanarkoil", pincode: "609309" },
    { name: "Tharangambadi (Tranquebar)", pincode: "609313" },
    { name: "Tirukkadaiyur", pincode: "609311" },
  ],
  "Sirkazhi": [
    { name: "Sirkazhi Town", pincode: "609110" },
    { name: "Vaitheeswarankoil", pincode: "609117" },
    { name: "Kollidam", pincode: "609102" },
    { name: "Pazhaiyar", pincode: "609102" },
    { name: "Thirumullaivasal", pincode: "609113" },
  ],

  // --- Nagapattinam ---
  "Nagapattinam": [
    { name: "Nagapattinam Town", pincode: "611001" },
    { name: "Velankanni", pincode: "611111" },
    { name: "Nagore", pincode: "611002" },
    { name: "Thirumarugal", pincode: "609702" },
  ],
  "Kilvelur": [
    { name: "Kilvelur Town", pincode: "611104" },
    { name: "Thirukuvalai", pincode: "610205" },
    { name: "Keelaiyur", pincode: "611103" },
  ],
  "Vedaranyam": [
    { name: "Vedaranyam Town", pincode: "614810" },
    { name: "Point Calimere (Kodiakkarai)", pincode: "614807" },
    { name: "Thalainayar", pincode: "614712" },
    { name: "Voimedu", pincode: "614714" },
  ],

  // --- Namakkal ---
  "Namakkal": [
    { name: "Namakkal Town", pincode: "637001" },
    { name: "Mohanur", pincode: "637015" },
    { name: "Erumapatti", pincode: "637013" },
    { name: "Sendamangalam Road", pincode: "637001" },
    { name: "Vellore Namakkal", pincode: "637207" },
  ],
  "Rasipuram": [
    { name: "Rasipuram Town", pincode: "637408" },
    { name: "Pillanallur", pincode: "637403" },
    { name: "Namagiripettai", pincode: "637406" },
    { name: "Vennandur", pincode: "637505" },
  ],
  "Tiruchengodu": [
    { name: "Tiruchengodu Town", pincode: "637211" },
    { name: "Mallasamudram", pincode: "637503" },
    { name: "Elachipalayam", pincode: "637202" },
    { name: "Devanankurichi", pincode: "637209" },
  ],
  "Kumarapalayam": [
    { name: "Kumarapalayam Town", pincode: "638183" },
    { name: "Pallipalayam", pincode: "638006" },
    { name: "Padaiveedu", pincode: "637303" },
    { name: "Alampalayam", pincode: "638008" },
  ],
  "Paramathi-Velur": [
    { name: "Paramathi", pincode: "637207" },
    { name: "Velur Town", pincode: "638182" },
    { name: "Pothanur", pincode: "638181" },
    { name: "Pandamangalam", pincode: "637208" },
    { name: "Kabilarmalai", pincode: "637204" },
  ],
  "Sendamangalam": [
    { name: "Sendamangalam Town", pincode: "637409" },
    { name: "Kolli Hills (Semmedu)", pincode: "637411" },
    { name: "Kalappanaickenpatti", pincode: "637404" },
  ],

  // --- Nilgiris ---
  "Udhagamandalam": [
    { name: "Ooty Town", pincode: "643001" },
    { name: "Fernhill", pincode: "643004" },
    { name: "Lovedale", pincode: "643003" },
    { name: "Ketti", pincode: "643215" },
  ],
  "Coonoor": [
    { name: "Coonoor Town", pincode: "643101" },
    { name: "Wellington", pincode: "643231" },
    { name: "Aruvankadu", pincode: "643202" },
    { name: "Kotagiri Road", pincode: "643101" },
  ],
  "Gudalur": [
    { name: "Gudalur Town", pincode: "643212" },
    { name: "Pandalur", pincode: "643233" },
    { name: "Devala", pincode: "643270" },
    { name: "Nelliyalam", pincode: "643271" },
  ],

  // --- Perambalur ---
  "Perambalur": [
    { name: "Perambalur Town", pincode: "621212" },
    { name: "Kurumbalur", pincode: "621107" },
    { name: "Arumbavur", pincode: "621103" },
    { name: "Veppanthattai", pincode: "621116" },
    { name: "Poolambadi", pincode: "621110" },
    { name: "Alathur", pincode: "621313" },
  ],

  // --- Pudukkottai ---
  "Pudukkottai": [
    { name: "Pudukkottai Town", pincode: "622001" },
    { name: "Alangudi Road", pincode: "622003" },
    { name: "Machuvadi", pincode: "622004" },
    { name: "Namanasamudram", pincode: "622422" },
  ],
  "Alangudi": [
    { name: "Alangudi Town", pincode: "622301" },
    { name: "Karambakkudi", pincode: "622302" },
    { name: "Vadakadu", pincode: "622304" },
    { name: "Kottaipattinam", pincode: "614619" },
  ],
  "Aranthangi": [
    { name: "Aranthangi Town", pincode: "614616" },
    { name: "Avudaiyarkoil", pincode: "614618" },
    { name: "Manamelkudi", pincode: "614620" },
    { name: "Nagudi", pincode: "614617" },
  ],
  "Gandharvakottai": [
    { name: "Gandharvakottai Town", pincode: "613301" },
    { name: "Kallakottai", pincode: "613301" },
    { name: "Punalpadi", pincode: "613301" },
  ],
  "Thirumayam": [
    { name: "Thirumayam Town", pincode: "622507" },
    { name: "Arimalam", pincode: "622201" },
    { name: "Kadiyapatti", pincode: "622505" },
    { name: "Panayapatti", pincode: "622402" },
  ],
  "Viralimalai": [
    { name: "Viralimalai Town", pincode: "621316" },
    { name: "Iluppur", pincode: "622102" },
    { name: "Annavasal", pincode: "622101" },
    { name: "Mathur Pudukkottai", pincode: "622515" },
  ],

  // --- Ramanathapuram ---
  "Ramanathapuram": [
    { name: "Ramanathapuram Town", pincode: "623501" },
    { name: "Rameswaram", pincode: "623526" },
    { name: "Mandapam", pincode: "623518" },
    { name: "Devipattinam", pincode: "623514" },
    { name: "Pamban", pincode: "623521" },
    { name: "Uchipuli", pincode: "623534" },
  ],
  "Mudukulathur": [
    { name: "Mudukulathur Town", pincode: "623704" },
    { name: "Kamuthi", pincode: "623603" },
    { name: "Sayalgudi", pincode: "623120" },
    { name: "Kadaladi", pincode: "623703" },
  ],
  "Paramakudi": [
    { name: "Paramakudi Town", pincode: "623707" },
    { name: "Nainarkoil", pincode: "623705" },
    { name: "Emaneswaram", pincode: "623701" },
    { name: "Bogalur", pincode: "623527" },
  ],
  "Tiruvadanai": [
    { name: "Tiruvadanai Town", pincode: "623407" },
    { name: "RS Mangalam", pincode: "623525" },
    { name: "Thondi", pincode: "623409" },
    { name: "SP Pattinam", pincode: "623406" },
  ],

  // --- Ranipet ---
  "Ranipet": [
    { name: "Ranipet Town", pincode: "632401" },
    { name: "Walajapet", pincode: "632513" },
    { name: "SIPCOT Ranipet", pincode: "632403" },
    { name: "Ammoor", pincode: "632501" },
  ],
  "Arcot": [
    { name: "Arcot Town", pincode: "632503" },
    { name: "Timiri", pincode: "632512" },
    { name: "Melvisharam", pincode: "632509" },
    { name: "Vilapakkam", pincode: "632521" },
  ],
  "Arakkonam": [
    { name: "Arakkonam Town", pincode: "631001" },
    { name: "INS Rajali Area", pincode: "631006" },
    { name: "Thakkolam", pincode: "631151" },
    { name: "Nemili", pincode: "631051" },
  ],
  "Sholinghur": [
    { name: "Sholinghur Town", pincode: "631102" },
    { name: "Kaveripakkam", pincode: "632508" },
    { name: "Panapakkam", pincode: "631052" },
    { name: "Banavaram", pincode: "632505" },
  ],

  // --- Sivaganga ---
  "Sivaganga": [
    { name: "Sivaganga Town", pincode: "630561" },
    { name: "Kalayarkoil", pincode: "630551" },
    { name: "Manamadurai Road", pincode: "630561" },
    { name: "Paiyur", pincode: "630561" },
  ],
  "Karaikudi": [
    { name: "Karaikudi Town", pincode: "630001" },
    { name: "Kottaiyur", pincode: "630106" },
    { name: "Kandanur", pincode: "630104" },
    { name: "Puduvayal", pincode: "630108" },
    { name: "Devakottai Road", pincode: "630005" },
    { name: "Kanadukathan", pincode: "630103" },
  ],
  "Manamadurai": [
    { name: "Manamadurai Town", pincode: "630606" },
    { name: "Thirupuvanam", pincode: "630611" },
    { name: "Ilayangudi", pincode: "630702" },
  ],
  "Tiruppattur Sivaganga": [
    { name: "Tiruppattur Town", pincode: "630211" },
    { name: "Singampunari", pincode: "630502" },
    { name: "Nerkuppai", pincode: "630405" },
    { name: "Pillayarpatti", pincode: "630207" },
  ],

  // --- Tenkasi ---
  "Tenkasi": [
    { name: "Tenkasi Town", pincode: "627811" },
    { name: "Courtallam", pincode: "627802" },
    { name: "Ilanji", pincode: "627805" },
    { name: "Surandai", pincode: "627859" },
    { name: "Shenkottai Road", pincode: "627811" },
  ],
  "Alangulam": [
    { name: "Alangulam Town", pincode: "627851" },
    { name: "Pavoorchatram", pincode: "627808" },
    { name: "Netthur", pincode: "627854" },
    { name: "Pappankulam", pincode: "627806" },
  ],
  "Kadayanallur": [
    { name: "Kadayanallur Town", pincode: "627751" },
    { name: "Chockampatti", pincode: "627765" },
    { name: "Puliangudi", pincode: "627855" },
    { name: "Rayagiri", pincode: "627764" },
  ],
  "Sankarankovil": [
    { name: "Sankarankovil Town", pincode: "627756" },
    { name: "Thiruvenkatam", pincode: "627719" },
    { name: "Karivalamvandanallur", pincode: "627753" },
  ],
  "Vasudevanallur": [
    { name: "Vasudevanallur Town", pincode: "627758" },
    { name: "Sivagiri Tenkasi", pincode: "627757" },
    { name: "Thenmalai", pincode: "627770" },
  ],

  // --- Theni ---
  "Bodinayakanur": [
    { name: "Bodinayakanur Town", pincode: "625513" },
    { name: "Bodi Camp", pincode: "625582" },
    { name: "Silamarathupatti", pincode: "625528" },
    { name: "Dombuchery", pincode: "625582" },
  ],
  "Cumbum": [
    { name: "Cumbum Town", pincode: "625516" },
    { name: "Uthamapalayam", pincode: "625533" },
    { name: "Gudalur Theni", pincode: "625518" },
    { name: "Kamayagoundanpatti", pincode: "625521" },
    { name: "Surulipatti", pincode: "625516" },
  ],
  "Periyakulam": [
    { name: "Periyakulam Town", pincode: "625601" },
    { name: "Thenkarai", pincode: "625601" },
    { name: "Thamaraikulam", pincode: "625605" },
    { name: "Devadanapatti", pincode: "625602" },
    { name: "Vadugapatti", pincode: "625603" },
  ],
  "Andipatti": [
    { name: "Andipatti Town", pincode: "625512" },
    { name: "Kadamalaikundu", pincode: "625579" },
    { name: "Myladumparai", pincode: "625579" },
    { name: "Thekkampatti", pincode: "625512" },
  ],

  // --- Thoothukudi ---
  "Thoothukudi": [
    { name: "Tuticorin Main", pincode: "628001" },
    { name: "Muthialpuram", pincode: "628005" },
    { name: "Millerpuram", pincode: "628008" },
    { name: "Threspuram", pincode: "628001" },
    { name: "SIPCOT Thoothukudi", pincode: "628008" },
  ],
  "Kovilpatti": [
    { name: "Kovilpatti Town", pincode: "628501" },
    { name: "Kayathar", pincode: "628952" },
    { name: "Kalugumalai", pincode: "628552" },
    { name: "Kadambur", pincode: "628714" },
  ],
  "Tiruchendur": [
    { name: "Tiruchendur Town", pincode: "628215" },
    { name: "Arumuganeri", pincode: "628202" },
    { name: "Kayalpattinam", pincode: "628204" },
    { name: "Authoor", pincode: "628151" },
    { name: "Kayamozhi", pincode: "628205" },
  ],
  "Srivaikuntam": [
    { name: "Srivaikuntam Town", pincode: "628601" },
    { name: "Alwarthirunagari", pincode: "628612" },
    { name: "Sayalgudi Road", pincode: "628601" },
    { name: "Eral", pincode: "628801" },
    { name: "Perungulam", pincode: "628752" },
  ],
  "Vilathikulam": [
    { name: "Vilathikulam Town", pincode: "628907" },
    { name: "Pudur Vilathikulam", pincode: "628905" },
    { name: "Kulathur", pincode: "628903" },
    { name: "Vembar", pincode: "628906" },
  ],
  "Ottapidaram": [
    { name: "Ottapidaram Town", pincode: "628401" },
    { name: "Panchalankurichi", pincode: "628401" },
    { name: "Eppodumvendran", pincode: "628712" },
    { name: "Pudur Pandiyapuram", pincode: "628002" },
  ],

  // --- Tirupathur ---
  "Tirupathur": [
    { name: "Tirupathur Town", pincode: "635601" },
    { name: "Jolarpet", pincode: "635851" },
    { name: "Kandili", pincode: "635901" },
    { name: "Natrampalli", pincode: "635852" },
  ],
  "Vaniyambadi": [
    { name: "Vaniyambadi Town", pincode: "635751" },
    { name: "Alangayam", pincode: "635701" },
    { name: "Uthangarai Road", pincode: "635751" },
    { name: "Kavalur", pincode: "635704" },
  ],
  "Ambur": [
    { name: "Ambur Town", pincode: "635802" },
    { name: "Oomerabad", pincode: "635808" },
    { name: "Madhanur Road", pincode: "635804" },
    { name: "Thuthipet", pincode: "635811" },
  ],

  // --- Tiruvannamalai ---
  "Tiruvannamalai": [
    { name: "Tiruvannamalai Town", pincode: "606601" },
    { name: "Girivalam Path Area", pincode: "606603" },
    { name: "Kilpennathur Road", pincode: "606601" },
    { name: "Vengikkal", pincode: "606604" },
  ],
  "Arani": [
    { name: "Arani Town", pincode: "632301" },
    { name: "Kannamangalam", pincode: "632311" },
    { name: "Sevvoor", pincode: "632316" },
  ],
  "Chengam": [
    { name: "Chengam Town", pincode: "606701" },
    { name: "Pudupalayam", pincode: "606705" },
    { name: "Melchengam", pincode: "606703" },
  ],
  "Cheyyar": [
    { name: "Cheyyar Town (Tiruvetipuram)", pincode: "604407" },
    { name: "SIPCOT Cheyyar", pincode: "604407" },
    { name: "Anakkavoor", pincode: "604401" },
    { name: "Perungattur", pincode: "604402" },
  ],
  "Kalasapakkam": [
    { name: "Kalasapakkam Town", pincode: "606751" },
    { name: "Polur Road", pincode: "606751" },
    { name: "Padavedu", pincode: "606905" },
  ],
  "Kilpennathur": [
    { name: "Kilpennathur Town", pincode: "604601" },
    { name: "Vettavalam", pincode: "606754" },
    { name: "Avur", pincode: "606755" },
  ],
  "Polur": [
    { name: "Polur Town", pincode: "606803" },
    { name: "Chetpet Polur", pincode: "606801" },
    { name: "Devikapuram", pincode: "606902" },
  ],
  "Vandavasi": [
    { name: "Vandavasi Town", pincode: "604408" },
    { name: "Thellar", pincode: "604406" },
    { name: "Desur", pincode: "604501" },
  ],

  // --- Tiruvarur ---
  "Tiruvarur": [
    { name: "Tiruvarur Town", pincode: "610001" },
    { name: "Koradacheri", pincode: "613703" },
    { name: "Vilamal", pincode: "610004" },
    { name: "Kudavasal", pincode: "612601" },
  ],
  "Mannargudi": [
    { name: "Mannargudi Town", pincode: "614001" },
    { name: "Needamangalam", pincode: "614404" },
    { name: "Vaduvur", pincode: "614019" },
    { name: "Pamani", pincode: "614014" },
  ],
  "Nannilam": [
    { name: "Nannilam Town", pincode: "610105" },
    { name: "Peralam", pincode: "609405" },
    { name: "Thirumeyachur", pincode: "609405" },
    { name: "Sannanallur", pincode: "609504" },
  ],
  "Thiruthuraipoondi": [
    { name: "Thiruthuraipoondi Town", pincode: "614713" },
    { name: "Muthupet", pincode: "614704" },
    { name: "Kottur Tiruvarur", pincode: "614708" },
  ],

  // --- Viluppuram ---
  "Viluppuram": [
    { name: "Viluppuram Town", pincode: "605602" },
    { name: "Koliyanur", pincode: "605103" },
    { name: "Kandamanadi", pincode: "605401" },
    { name: "Valavanur", pincode: "605108" },
  ],
  "Tindivanam": [
    { name: "Tindivanam Town", pincode: "604001" },
    { name: "Marakkanam", pincode: "604303" },
    { name: "Brammadesam", pincode: "604301" },
    { name: "Mailam", pincode: "604304" },
  ],
  "Mailam": [
    { name: "Mailam Town", pincode: "604304" },
    { name: "Kooteripattu", pincode: "604302" },
    { name: "Nedungampattu", pincode: "604307" },
  ],
  "Gingee": [
    { name: "Gingee Town", pincode: "604202" },
    { name: "Ananthapuram", pincode: "605201" },
    { name: "Melmalayanur", pincode: "604204" },
    { name: "Valathi", pincode: "604208" },
  ],
  "Vanur": [
    { name: "Vanur Town", pincode: "605109" },
    { name: "Auroville Area", pincode: "605101" },
    { name: "Kottakuppam", pincode: "605104" },
    { name: "Kiliyanur", pincode: "604102" },
  ],
  "Vikravandi": [
    { name: "Vikravandi Town", pincode: "605652" },
    { name: "Kandachipuram", pincode: "605701" },
    { name: "Kanai", pincode: "605301" },
    { name: "Mundiyampakkam", pincode: "605601" },
  ],

  // --- Virudhunagar ---
  "Virudhunagar": [
    { name: "Virudhunagar Town", pincode: "626001" },
    { name: "Aruppukkottai Road", pincode: "626001" },
    { name: "Rosalpatti", pincode: "626001" },
    { name: "Kalligudi Road", pincode: "626001" },
  ],
  "Aruppukkottai": [
    { name: "Aruppukkottai Town", pincode: "626101" },
    { name: "Kariapatti", pincode: "626106" },
    { name: "Mallankinaru", pincode: "626109" },
    { name: "Pandalgudi", pincode: "626113" },
  ],
  "Sivakasi": [
    { name: "Sivakasi Town", pincode: "626123" },
    { name: "Thiruthangal", pincode: "626130" },
    { name: "Sithurajapuram", pincode: "626123" },
    { name: "Maraneri", pincode: "626124" },
  ],
  "Rajapalayam": [
    { name: "Rajapalayam Town", pincode: "626117" },
    { name: "Chettiarpatti", pincode: "626122" },
    { name: "Seithur", pincode: "626121" },
    { name: "Sammandhapuram", pincode: "626117" },
  ],
  "Sattur": [
    { name: "Sattur Town", pincode: "626203" },
    { name: "Vembakottai", pincode: "626131" },
    { name: "Elayirampannai", pincode: "626201" },
    { name: "Nalli", pincode: "626202" },
  ],
  "Srivilliputhur": [
    { name: "Srivilliputhur Town", pincode: "626125" },
    { name: "Watrap", pincode: "626132" },
    { name: "Mamsapuram", pincode: "626110" },
    { name: "Sundarapandiam", pincode: "626126" },
  ],
  "Tiruchuli": [
    { name: "Tiruchuli Town", pincode: "626129" },
    { name: "Narikudi", pincode: "626607" },
    { name: "Veeracholan", pincode: "626612" },
    { name: "Kamuthi Road", pincode: "626129" },
  ],

  // --- Kallakurichi ---
  "Kallakurichi": [
    { name: "Kallakurichi Town", pincode: "606202" },
    { name: "Chinnasalem", pincode: "606201" },
    { name: "Thiyagadurgam", pincode: "606206" },
    { name: "Vadakanandal", pincode: "606207" },
  ],
  "Rishivandiyam": [
    { name: "Rishivandiyam Town", pincode: "606205" },
    { name: "Manalurpet", pincode: "605754" },
    { name: "Tirukkoyilur Road", pincode: "606205" },
  ],
  "Sankarapuram": [
    { name: "Sankarapuram Town", pincode: "606401" },
    { name: "Moongilthuraipattu", pincode: "605702" },
    { name: "Kalrayan Hills", pincode: "606207" },
    { name: "Pudupattu", pincode: "606402" },
  ],
  "Ulundurpet": [
    { name: "Ulundurpet Town", pincode: "606107" },
    { name: "Thirunavalur", pincode: "607204" },
    { name: "Asanur", pincode: "606305" },
    { name: "Elavanasurkottai", pincode: "607202" },
  ],
  "Tirukkoyilur": [
    { name: "Tirukkoyilur Town", pincode: "605757" },
    { name: "Arakandanallur", pincode: "605752" },
    { name: "Mugaiyur", pincode: "605755" },
    { name: "Kandachipuram", pincode: "605701" },
  ],
};

import {
  TAMIL_NADU_GEO,
  getTaluksForDistrict,
  getPanchayatsForTaluk,
  getDefaultPincodeForTaluk,
} from "./taluks";

export {
  TAMIL_NADU_GEO,
  getTaluksForDistrict,
  getPanchayatsForTaluk,
  getDefaultPincodeForTaluk,
};

/**
 * Returns available Panchayats / Areas for a Taluk or Assembly Constituency.
 */
export function getPanchayatsForConstituency(constituencyOrTaluk: string, district?: string): AreaInfo[] {
  if (!constituencyOrTaluk) return [];
  if (district) {
    const talukPanchayats = getPanchayatsForTaluk(district, constituencyOrTaluk);
    if (talukPanchayats && talukPanchayats.length > 0) return talukPanchayats;
  }
  // Check direct constituency mapping
  if (PANCHAYATS_BY_CONSTITUENCY[constituencyOrTaluk]) {
    return PANCHAYATS_BY_CONSTITUENCY[constituencyOrTaluk];
  }
  // Search across all districts for this taluk name
  for (const dist of Object.keys(TAMIL_NADU_GEO)) {
    if (TAMIL_NADU_GEO[dist][constituencyOrTaluk]) {
      return TAMIL_NADU_GEO[dist][constituencyOrTaluk].panchayats;
    }
  }
  return [];
}

/**
 * Gets the postal pincode for a given taluk/constituency and panchayat name.
 */
export function getPincodeForPanchayat(constituencyOrTaluk: string, panchayatName: string, district?: string): string | undefined {
  const list = getPanchayatsForConstituency(constituencyOrTaluk, district);
  const found = list.find((item) => item.name.toLowerCase() === panchayatName.toLowerCase().trim());
  return found?.pincode;
}

/**
 * Fallback / default pincode for a taluk or constituency.
 */
export function getDefaultPincodeForConstituency(constituencyOrTaluk: string, district?: string): string | undefined {
  if (district) {
    const pin = getDefaultPincodeForTaluk(district, constituencyOrTaluk);
    if (pin) return pin;
  }
  const list = getPanchayatsForConstituency(constituencyOrTaluk, district);
  return list[0]?.pincode;
}
