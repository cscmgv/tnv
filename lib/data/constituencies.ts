// Tamil Nadu Legislative Assembly constituencies (234 seats), grouped by
// district. Source: tnelections2026.in/results/district and myneta.info —
// cross-checked against the 2020 Mayiladuthurai district carve-out (which
// moved Mayiladuthurai, Sirkazhi and Poompuhar out of Nagapattinam).
export const CONSTITUENCIES_BY_DISTRICT: Record<string, readonly string[]> = {
  Ariyalur: ["Ariyalur", "Jayankondam"],
  Chengalpattu: ["Chengalpattu", "Cheyyur", "Madurantakam", "Pallavaram", "Sholinganallur", "Tambaram", "Thiruporur"],
  Chennai: [
    "Anna Nagar",
    "Chepauk-Thiruvallikeni",
    "Dr. Radhakrishnan Nagar",
    "Egmore",
    "Harbour",
    "Kolathur",
    "Mylapore",
    "Perambur",
    "Royapuram",
    "Saidapet",
    "Thiru Vi Ka Nagar",
    "Thiyagarayanagar",
    "Thousand Lights",
    "Velachery",
    "Villivakkam",
    "Virugambakkam",
  ],
  Coimbatore: [
    "Coimbatore North",
    "Coimbatore South",
    "Kavundampalayam",
    "Kinathukadavu",
    "Mettupalayam",
    "Pollachi",
    "Singanallur",
    "Sulur",
    "Thondamuthur",
    "Valparai",
  ],
  Cuddalore: ["Bhuvanagiri", "Chidambaram", "Cuddalore", "Kattumannarkoil", "Kurinjipadi", "Neyveli", "Panruti", "Tittakudi", "Vriddhachalam"],
  Dharmapuri: ["Dharmapuri", "Harur", "Palacode", "Pappireddipatti", "Pennagaram"],
  Dindigul: ["Athoor", "Dindigul", "Natham", "Nilakottai", "Oddanchatram", "Palani", "Vedasandur"],
  Erode: ["Anthiyur", "Bhavani", "Bhavanisagar", "Erode East", "Erode West", "Gobichettipalayam", "Modakkurichi", "Perundurai"],
  Kallakurichi: ["Kallakurichi", "Rishivandiyam", "Sankarapuram", "Ulundurpet"],
  Kancheepuram: ["Alandur", "Kancheepuram", "Sriperumbudur", "Uthiramerur"],
  Kanyakumari: ["Colachel", "Kanniyakumari", "Killiyoor", "Nagercoil", "Padmanabhapuram", "Vilavancode"],
  Karur: ["Aravakurichi", "Karur", "Krishnarayapuram", "Kulithalai"],
  Krishnagiri: ["Bargur", "Hosur", "Krishnagiri", "Thalli", "Uthangarai", "Veppanahalli"],
  Madurai: [
    "Madurai Central",
    "Madurai East",
    "Madurai North",
    "Madurai South",
    "Madurai West",
    "Melur",
    "Sholavandan",
    "Thirumangalam",
    "Thiruparankundram",
    "Usilampatti",
  ],
  Mayiladuthurai: ["Mayiladuthurai", "Poompuhar", "Sirkazhi"],
  Nagapattinam: ["Kilvelur", "Nagapattinam", "Vedaranyam"],
  Namakkal: ["Kumarapalayam", "Namakkal", "Paramathi-Velur", "Rasipuram", "Senthamangalam", "Tiruchengode"],
  Nilgiris: ["Coonoor", "Gudalur", "Udhagamandalam"],
  Perambalur: ["Kunnam", "Perambalur"],
  Pudukkottai: ["Alangudi", "Aranthangi", "Gandarvakottai", "Pudukkottai", "Thirumayam", "Viralimalai"],
  Ramanathapuram: ["Mudukulathur", "Paramakudi", "Ramanathapuram", "Thiruvadanai"],
  Ranipet: ["Arakkonam", "Arcot", "Ranipet", "Sholinghur"],
  Salem: ["Attur", "Edappadi", "Gangavalli", "Mettur", "Omalur", "Salem North", "Salem South", "Salem West", "Sankari", "Veerapandi", "Yercaud"],
  Sivaganga: ["Karaikudi", "Manamadurai", "Sivaganga", "Tiruppattur"],
  Tenkasi: ["Alangulam", "Kadayanallur", "Sankarankoil", "Tenkasi", "Vasudevanallur"],
  Thanjavur: ["Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Peravurani", "Thanjavur", "Thiruvaiyaru", "Thiruvidaimarudur"],
  Theni: ["Andipatti", "Bodinayakanur", "Cumbum", "Periyakulam"],
  Thoothukudi: ["Kovilpatti", "Ottapidaram", "Srivaikuntam", "Thoothukudi", "Tiruchendur", "Vilathikulam"],
  Tiruchirappalli: [
    "Lalgudi",
    "Manachanallur",
    "Manapparai",
    "Musiri",
    "Srirangam",
    "Thiruverumbur",
    "Thuraiyur",
    "Tiruchirappalli East",
    "Tiruchirappalli West",
  ],
  Tirunelveli: ["Ambasamudram", "Nanguneri", "Palayamkottai", "Radhapuram", "Tirunelveli"],
  Tirupathur: ["Ambur", "Jolarpet", "Tirupattur", "Vaniyambadi"],
  Tiruppur: ["Avanashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Tirupur North", "Tirupur South", "Udumalpet"],
  Tiruvallur: [
    "Ambattur",
    "Avadi",
    "Gummidipoondi",
    "Madavaram",
    "Maduravoyal",
    "Ponneri",
    "Poonamallee",
    "Tiruvallur",
    "Thiruvottiyur",
    "Tiruttani",
  ],
  Tiruvannamalai: ["Arani", "Chengam", "Cheyyar", "Kalasapakkam", "Kilpennathur", "Polur", "Tiruvannamalai", "Vandavasi"],
  Tiruvarur: ["Mannargudi", "Nannilam", "Thiruthuraipoondi", "Tiruvarur"],
  Vellore: ["Anaikattu", "Gudiyatham", "Katpadi", "Kilvaithinankuppam", "Vellore"],
  Viluppuram: ["Gingee", "Mailam", "Tindivanam", "Tirukoilur", "Vanur", "Vikravandi", "Villupuram"],
  Virudhunagar: ["Aruppukkottai", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Virudhunagar"],
};

// Flat, alphabetised list of every constituency — used wherever a
// district-scoped list isn't available (e.g. filters over existing records).
export const CONSTITUENCIES = Object.values(CONSTITUENCIES_BY_DISTRICT)
  .flat()
  .sort((a, b) => a.localeCompare(b)) as readonly string[];

// Sentinel value used by the UI to let admins type a constituency (or
// district) that isn't in the list above, rather than being blocked by it.
export const OTHERS = "__others__";

export function constituenciesForDistrict(district: string): readonly string[] {
  return CONSTITUENCIES_BY_DISTRICT[district] ?? CONSTITUENCIES;
}
