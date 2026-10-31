import { Guide } from '../types';

export const SAMPLE_GUIDES: Guide[] = [
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding & Tourniquet Control',
    category: 'first-aid',
    icon: 'Droplets',
    summary: 'Life-threatening arterial or venous hemorrhage protocol: pressure, packing, and tourniquets.',
    priority: 'critical',
    equipmentNeeded: ['Tourniquet (CAT / SOFTT)', 'Hemostatic gauze or clean cloth', 'Pressure bandage'],
    steps: [
      {
        title: 'Step 1: Ensure Scene Safety & Expose Wound',
        instruction: 'Cut or tear clothing to clearly see the source of bright red spurting or pooling blood. Call emergency services immediately.',
        warning: 'Arterial bleeding can cause death in less than 3 minutes. Act without delay.',
      },
      {
        title: 'Step 2: Apply Immediate Direct Firm Pressure',
        instruction: 'Place both hands over the wound using sterile gauze or clean fabric. Lock elbows and push down with your full body weight.',
        detail: 'Do not remove blood-soaked pads; add more layers on top and continue pressing.',
      },
      {
        title: 'Step 3: Apply Tourniquet (Limbs Only)',
        instruction: 'Place tourniquet 2 to 3 inches (5–7 cm) above the wound, closer to the torso. Never place directly over a joint (elbow or knee).',
        detail: 'Pull the self-adhering band as tight as possible before turning the windlass rod.',
      },
      {
        title: 'Step 4: Twist Windlass Until Bleeding Ceases',
        instruction: 'Turn the windlass rod until the arterial bleeding completely stops and the distal pulse disappears. Lock the windlass in the clip.',
        warning: 'This will cause severe pain to the casualty. Do NOT loosen or remove the tourniquet once placed!',
      },
      {
        title: 'Step 5: Record Exact Time (T-Time)',
        instruction: 'Write the application time (e.g. "T 14:35") directly on the casualty’s forehead or the tourniquet band using a permanent marker.',
        detail: 'Log time in the VieKit Tourniquet Tool to keep track of elapsed minutes for the trauma team.',
      },
    ],
    dos: [
      'Lock your elbows and apply full body weight for direct pressure',
      'Apply a second tourniquet above the first if bleeding continues',
      'Keep the patient warm with an emergency space blanket to prevent trauma hypothermia',
    ],
    donts: [
      'NEVER loosen or remove a tourniquet once applied except by a trauma surgeon',
      'NEVER place a tourniquet directly over a joint (knee or elbow)',
      'DO NOT use thin wire, shoelaces, or nylon cord that cuts into flesh; use at least 1.5 inch wide material if improvised',
    ],
  },
  {
    id: 'choking-heimlich',
    title: 'Choking & Airway Obstruction',
    category: 'first-aid',
    icon: 'Activity',
    summary: 'Universal sign of choking: back blows and abdominal thrusts for conscious adults, children, and infants.',
    priority: 'critical',
    equipmentNeeded: ['Hands only', 'Firm surface if unconscious'],
    steps: [
      {
        title: 'Step 1: Recognize Severe Choking',
        instruction: 'Ask "Are you choking?" If the person cannot speak, cough forcefully, or breathe, or clutches their throat, intervene immediately.',
        detail: 'If the person can cough loudly, encourage them to keep coughing—do not strike their back yet.',
      },
      {
        title: 'Step 2: Deliver 5 Sharp Back Blows',
        instruction: 'Stand slightly behind and to one side. Support their chest with one hand and lean them forward. Deliver 5 firm blows between the shoulder blades with the heel of your hand.',
      },
      {
        title: 'Step 3: Perform 5 Abdominal Thrusts (Heimlich)',
        instruction: 'Stand behind the person. Wrap arms around their waist. Make a fist with one hand and place the thumb side just above the navel (belly button), well below the breastbone.',
        detail: 'Grasp your fist with your other hand. Pull sharply inward and upward into their abdomen.',
      },
      {
        title: 'Step 4: Alternate 5 Blows and 5 Thrusts',
        instruction: 'Continue the cycle of 5 back blows and 5 abdominal thrusts until the foreign object is dislodged or the victim becomes unconscious.',
      },
      {
        title: 'Step 5: If Casualty Collapses / Unconscious',
        instruction: 'Lower them gently to a hard, flat floor. Call emergency dispatch and begin immediate CPR (30 compressions followed by 2 breaths).',
        warning: 'Check mouth before giving breaths; remove visible objects with a finger sweep. Never blind finger sweep.',
      },
    ],
    dos: [
      'Lean the person forward so the dislodged object falls out rather than further down',
      'For pregnant women or obese individuals, give chest thrusts over the center of the breastbone instead',
      'For infants: 5 back slaps face down along your forearm, then 5 two-finger chest thrusts',
    ],
    donts: [
      'DO NOT perform blind finger sweeps in the mouth',
      'DO NOT give abdominal thrusts to infants under 1 year (use back slaps and gentle chest thrusts)',
      'DO NOT slap a victim’s back while they are standing completely upright',
    ],
  },
  {
    id: 'earthquake-safety',
    title: 'Earthquake Survival & Aftershocks',
    category: 'disaster',
    icon: 'ShieldAlert',
    summary: 'Immediate Drop, Cover, and Hold On protocols during primary tremors and post-earthquake evacuation safety.',
    priority: 'high',
    equipmentNeeded: ['Sturdy table/desk', 'Heavy work gloves', 'Flashlight', 'Sturdy shoes'],
    steps: [
      {
        title: 'Step 1: DROP where you are',
        instruction: 'Drop onto your hands and knees immediately before the seismic shaking knocks you down. This position prevents falling and allows crawl mobility.',
      },
      {
        title: 'Step 2: COVER head, neck and body',
        instruction: 'Crawl under a sturdy desk or table. If no shelter is available, crawl next to an interior wall away from windows, cover your head and neck with both arms.',
        detail: 'Stay away from glass windows, hanging lights, heavy mirrors, tall bookcases, and masonry chimneys.',
      },
      {
        title: 'Step 3: HOLD ON until shaking stops',
        instruction: 'Hold onto your shelter with one hand and protect your head/neck with the other. Be prepared to move with the furniture as it shifts.',
      },
      {
        title: 'Step 4: After Tremor Ceases - Assess & Check Hazards',
        instruction: 'Put on sturdy shoes before stepping on debris. Check for gas leaks (smell of rotten eggs/sulfur). If gas is suspected, shut main valve and evacuate immediately.',
        warning: 'DO NOT flip light switches or light matches if gas leak is possible. Use VieKit screen or LED flashlight only.',
      },
      {
        title: 'Step 5: Evacuate with Go-Bag to Open Ground',
        instruction: 'Use stairs, NEVER elevators. Watch for falling facade tiles, power lines, and shattered masonry. Move to open parks or clear streets.',
      },
    ],
    dos: [
      'Keep shoes, flashlight, and glasses next to your bed at all times',
      'If in a vehicle, pull over safely away from overpasses, bridges, and power lines; stay inside',
      'Prepare for intense aftershocks, which often strike minutes to hours after the main quake',
    ],
    donts: [
      'DO NOT run outside while shaking is happening (falling roof tiles and brickwork cause majority of casualties)',
      'DO NOT stand in doorways; modern doorways are not reinforced and doors swing violently',
      'DO NOT use elevators or escalators under any circumstance',
    ],
  },
  {
    id: 'hypothermia-care',
    title: 'Hypothermia & Extreme Cold Exposure',
    category: 'survival',
    icon: 'ThermometerSnowflake',
    summary: 'Protocol for managing core body temperature drop: prevention, active gentle rewarming, and frostbite care.',
    priority: 'high',
    equipmentNeeded: ['Mylar space blanket', 'Dry wool/synthetic clothing', 'Insulating ground mat', 'Warm sweet beverage'],
    steps: [
      {
        title: 'Step 1: Remove from Cold & Insulate from Ground',
        instruction: 'Move casualty into shelter or out of the wind. Place an insulating pad, dry cardboard, or backpacks underneath them to block conductive ground heat loss.',
      },
      {
        title: 'Step 2: Remove Wet Garments Gently',
        instruction: 'Cut or peel off wet clothing. Replace immediately with multiple layers of dry wool or synthetic fleece. Cover head, neck, and torso completely.',
      },
      {
        title: 'Step 3: The "Hypothermia Burrito" Wrap',
        instruction: 'Wrap casualty in an emergency foil space blanket (shiny side facing inward toward body), topped by an outer windproof tarp or sleeping bag.',
      },
      {
        title: 'Step 4: Gentle Active Rewarming to Core Only',
        instruction: 'Place warm water bottles or heat packs wrapped in cloth on the chest, armpits, and groin. Never apply bare heat directly to cold skin.',
        warning: 'Do NOT rub or vigorously massage limbs. This can force cold, acidic blood back to the heart, triggering lethal cardiac arrhythmias (afterdrop).',
      },
      {
        title: 'Step 5: Hydrate if Fully Conscious',
        instruction: 'Give warm, sweet non-caffeinated drinks (warm broth, sugar tea, warm ORS solution) only if the victim can swallow without choking.',
      },
    ],
    dos: [
      'Rewarm the central core first before warming hands and feet',
      'Handle the hypothermic patient with extreme gentleness—sudden jarring can trigger ventricular fibrillation',
      'Shelter them from wind chill immediately (even light wind drastically accelerates heat loss)',
    ],
    donts: [
      'NEVER give alcohol (alcohol dilates peripheral blood vessels, causing rapid core heat dumping)',
      'NEVER give cigarettes or nicotine (vasoconstriction worsens frostbite tissue necrosis)',
      'NEVER use hot baths or direct fire heating on numb/frostbitten skin',
    ],
  },
  {
    id: 'water-purification',
    title: 'Emergency Water Disinfection & Purification',
    category: 'survival',
    icon: 'GlassWater',
    summary: 'WHO and CDC survival methods to eliminate pathogens: filtration, rolling boil, bleach disinfection, and solar SODIS.',
    priority: 'high',
    equipmentNeeded: ['Clean vessel/pot', 'Heat source', 'Unscented household bleach (5–6% sodium hypochlorite)', 'Clean cloth/coffee filter'],
    steps: [
      {
        title: 'Step 1: Clarify Turbid Water First',
        instruction: 'Pour murky or silty water through a clean cotton cloth, bandanna, or coffee filter into a clean container. Let sediment settle to the bottom for 30 minutes, then pour off the clear top water.',
        detail: 'Chemical disinfectants fail if water is turbid because pathogens hide behind suspended particulates.',
      },
      {
        title: 'Step 2: Boiling (Gold Standard)',
        instruction: 'Bring clear water to a vigorous, rolling boil for a full 1 minute. At elevations above 2,000 meters (6,500 feet), boil continuously for 3 minutes.',
        detail: 'Boiling destroys bacteria, viruses, and heat-resistant protozoan cysts (Giardia and Cryptosporidium).',
      },
      {
        title: 'Step 3: Chlorine Bleach Disinfection (When Boiling is Not Possible)',
        instruction: 'Use ordinary UNSCENTED liquid household bleach (5.25% to 6% sodium hypochlorite). For 1 Liter (approx 1 quart) of clear water: add 2 drops. For cloudy water: add 4 drops.',
        warning: 'NEVER use scented, color-safe, or splashless bleaches. They contain poisonous surfactants.',
      },
      {
        title: 'Step 4: Mix and Wait 30 Minutes',
        instruction: 'Shake or stir thoroughly. Let the treated water stand covered for at least 30 minutes. The water should have a faint chlorine odor.',
        detail: 'If it does not smell faintly of chlorine, repeat the dose and wait another 15 minutes before drinking.',
      },
      {
        title: 'Step 5: Solar Disinfection (SODIS Alternative)',
        instruction: 'Fill clean, clear PET plastic water bottles with clear water. Lay them horizontally on a dark or corrugated metal surface in direct sunlight for 6 full hours (or 2 days if cloudy). UV-A rays and heat kill pathogens.',
      },
    ],
    dos: [
      'Store disinfected water in clean, sanitized, tightly capped containers away from direct heat',
      'Filter out large debris before chemical disinfection',
      'Aerate boiled water by pouring it between two clean containers to restore fresh oxygen taste',
    ],
    donts: [
      'DO NOT drink flood water or water contaminated with toxic industrial chemicals (boiling does NOT remove chemical poisons or heavy metals)',
      'DO NOT drink seawater or urine; the high salt and urea concentration accelerates fatal dehydration',
      'DO NOT use pool chlorine tablets without precision volumetric dilution',
    ],
  },
];
