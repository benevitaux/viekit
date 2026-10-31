import { ChecklistItem } from '../types';

export const DEFAULT_72H_CHECKLIST: ChecklistItem[] = [
  { id: '72h-1', text: 'Water: 1 gallon (3.8 L) per person/pet per day (minimum 3 days)', checked: false, category: 'Water' },
  { id: '72h-2', text: 'Non-perishable food (canned meats, energy bars, freeze-dried meals, ready-to-eat)', checked: false, category: 'Food' },
  { id: '72h-3', text: 'Manual can opener and multi-tool / utility knife', checked: false, category: 'Tools' },
  { id: '72h-4', text: 'Battery-powered or hand-crank emergency radio with NOAA / emergency band', checked: false, category: 'Communication' },
  { id: '72h-5', text: 'LED Flashlight & headlamp with extra lithium batteries', checked: false, category: 'Light' },
  { id: '72h-6', text: 'First-aid kit (gauze, tourniquet, bandages, antiseptic, burn cream, shears)', checked: false, category: 'Medical' },
  { id: '72h-7', text: 'Essential prescription medications (7-day minimum supply) and copies of prescriptions', checked: false, category: 'Medical' },
  { id: '72h-8', text: 'Heavy-duty high-frequency emergency whistle (plastic non-pea type)', checked: false, category: 'Safety' },
  { id: '72h-9', text: 'N95 dust/smoke masks or particulate respirators (1 per person)', checked: false, category: 'Sanitation' },
  { id: '72h-10', text: 'Personal hygiene kit (moist towelettes, heavy trash bags, toilet paper, soap)', checked: false, category: 'Sanitation' },
  { id: '72h-11', text: 'Cell phone power bank (charged) with heavy-duty USB charging cables', checked: false, category: 'Power' },
  { id: '72h-12', text: 'Water purification tablets or unscented household bleach with dropper', checked: false, category: 'Water' },
  { id: '72h-13', text: 'Duct tape (gorilla / cloth heavy duty) and plastic sheeting (10x10 ft)', checked: false, category: 'Shelter' },
  { id: '72h-14', text: 'Mylar thermal space blankets (reflects 90% body heat)', checked: false, category: 'Shelter' },
  { id: '72h-15', text: 'Cash in small denominations ($1, $5, $10, $20) and local coins (ATMs shut down)', checked: false, category: 'Finance' },
];

export const DEFAULT_GOBAG_CHECKLIST: ChecklistItem[] = [
  { id: 'gb-1', text: 'Waterproof pouch with vital identification documents (passports, IDs, birth certs, insurance)', checked: false, category: 'Documents' },
  { id: 'gb-2', text: 'Compact water filter (Sawyer Squeeze / LifeStraw) + 1L water bladder', checked: false, category: 'Water' },
  { id: 'gb-3', text: 'High-calorie emergency food rations (Datrex / Millennium bars / jerky)', checked: false, category: 'Food' },
  { id: 'gb-4', text: 'Compact trauma kit: tourniquet (CAT/SOFTT), chest seal, compressed gauze', checked: false, category: 'Medical' },
  { id: 'gb-5', text: 'Emergency bivvy sack / ultralight thermal sleeping bag', checked: false, category: 'Shelter' },
  { id: 'gb-6', text: 'Weatherproof outer jacket / rain poncho', checked: false, category: 'Clothing' },
  { id: 'gb-7', text: 'One full change of rugged clothes (wool socks, thermal base layer, bandana)', checked: false, category: 'Clothing' },
  { id: 'gb-8', text: 'Heavy leather work gloves and safety glasses (debris protection)', checked: false, category: 'Protection' },
  { id: 'gb-9', text: 'Stormproof matches / ferrocerium fire starter rod & tinder', checked: false, category: 'Fire' },
  { id: 'gb-10', text: 'Compact compass and laminated local topography / street map', checked: false, category: 'Navigation' },
  { id: 'gb-11', text: 'High-output flashlight + red night light mode + extra batteries', checked: false, category: 'Light' },
  { id: 'gb-12', text: 'Permanent marker (Sharpie) and waterproof notebook', checked: false, category: 'Communication' },
  { id: 'gb-13', text: 'Compact folding shovel or multi-tool pry bar', checked: false, category: 'Tools' },
  { id: 'gb-14', text: 'Emergency whistle and signal mirror', checked: false, category: 'Signaling' },
];

export const DEFAULT_CAR_CHECKLIST: ChecklistItem[] = [
  { id: 'car-1', text: 'Heavy-duty jumper cables (or portable lithium jump-starter pack)', checked: false, category: 'Vehicle' },
  { id: 'car-2', text: 'Window breaker & seatbelt cutter (stored within arm’s reach of driver seat)', checked: false, category: 'Safety' },
  { id: 'car-3', text: 'High-visibility reflective safety vest (1 per passenger)', checked: false, category: 'Safety' },
  { id: 'car-4', text: 'Reflective warning triangles (set of 3) or LED roadside emergency flares', checked: false, category: 'Signaling' },
  { id: 'car-5', text: 'Tow strap with forged steel hooks (min 10,000 lbs rating)', checked: false, category: 'Recovery' },
  { id: 'car-6', text: 'Tire inflator / 12V portable compressor and tire plug puncture kit', checked: false, category: 'Tires' },
  { id: 'car-7', text: 'Tire pressure gauge and working spare tire with jack & lug wrench', checked: false, category: 'Tires' },
  { id: 'car-8', text: 'First aid trauma kit with shears, sterile dressings, and burn gel', checked: false, category: 'Medical' },
  { id: 'car-9', text: 'Two emergency Mylar space blankets and wool blanket', checked: false, category: 'Warmth' },
  { id: 'car-10', text: 'Bottled drinking water (sealed, replaced every 6 months)', checked: false, category: 'Water' },
  { id: 'car-11', text: 'Non-melting emergency food rations (nuts, granola bars)', checked: false, category: 'Food' },
  { id: 'car-12', text: 'Heavy work gloves and rain poncho', checked: false, category: 'Gear' },
  { id: 'car-13', text: 'Multi-tip screwdriver, pliers, duct tape, and zip ties', checked: false, category: 'Tools' },
  { id: 'car-14', text: 'Small folding snow/mud shovel and traction boards or kitty litter', checked: false, category: 'Winter' },
];

export interface LibraryArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
}

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  {
    id: 'morse-signals',
    title: 'Emergency Morse Code & Distress Signals',
    category: 'Signaling',
    summary: 'Standard visual and auditory signaling protocols recognized internationally.',
    content: [
      'SOS is represented in Morse code as: • • •  — — —  • • • (3 short, 3 long, 3 short).',
      'Audio: 3 short whistle blasts (1 sec), 3 long blasts (3 sec), 3 short blasts (1 sec). Pause 7 seconds, then repeat.',
      'Light Strobe: 3 quick flashes, 3 long flashes (holding on), 3 quick flashes. Repeat continuously.',
      'Ground-to-Air Signals (marked in ground debris or rocks, min 3 meters / 10 feet tall):',
      '"V" = Require Assistance',
      '"X" = Require Medical Assistance',
      '"N" = No / Negative',
      '"Y" = Yes / Affirmative',
      '"↑" = Proceeding in this direction',
    ],
  },
  {
    id: 'start-triage',
    title: 'START Mass Casualty Triage Quick Rule',
    category: 'Medical',
    summary: 'Simple Triage And Rapid Treatment protocol for multiple victims.',
    content: [
      '1. GREEN (Minor / Walking Wounded): Ask all who can hear you and walk to move to a designated area. Tag GREEN.',
      '2. RED (Immediate / Life-Threatening):',
      '   - Respiration: Over 30 breaths/min OR airway cleared and breathing starts -> RED.',
      '   - Perfusion: Radial pulse absent OR capillary refill over 2 seconds -> RED.',
      '   - Mental Status: Cannot follow simple commands -> RED.',
      '3. YELLOW (Delayed): Breathing normal (<30/min), pulse present, can follow commands, but cannot walk. Tag YELLOW.',
      '4. BLACK (Deceased / Expectant): No spontaneous breathing even after opening airway. Tag BLACK.',
    ],
  },
  {
    id: 'radiation-rule',
    title: 'Nuclear & Radiation Safety: The 3 Rules',
    category: 'Hazardous',
    summary: 'Time, Distance, and Shielding principles in radiological events.',
    content: [
      '1. TIME: Minimize time exposed to the radioactive source. Halving the time halves the cumulative absorbed dose.',
      '2. DISTANCE: Maximize distance from the source. Radiation intensity drops according to the Inverse Square Law (doubling distance reduces dose to 1/4).',
      '3. SHIELDING: Put the heaviest, densest material possible between you and radiation:',
      '   - Concrete: 6 inches reduces fallout radiation by approx 50%.',
      '   - Earth/Soil: 8 inches reduces radiation by 50%.',
      '   - Steel: 1 inch reduces radiation by 50%.',
      '   - Stay inside an interior room or basement of a heavy concrete or brick building for at least 24 to 72 hours until iodine/short-lived isotopes decay significantly.',
    ],
  },
  {
    id: 'rule-of-threes',
    title: 'The Survival Rule of Threes',
    category: 'Survival Strategy',
    summary: 'Prioritization checklist in severe environmental distress.',
    content: [
      '3 MINUTES without oxygen (airway blockage, suffocation, drowning). Priority 1.',
      '3 HOURS without shelter in extreme conditions (freezing hypothermia or hyperthermia heat exhaustion). Priority 2.',
      '3 DAYS without drinkable water before organ failure and fatal dehydration. Priority 3.',
      '3 WEEKS without food (assuming adequate water and warmth). Priority 4.',
      'Rule #0: 3 SECONDS of panic can cause a fatal mistake. Always pause, use physiological sigh, and ground yourself first.',
    ],
  },
];
