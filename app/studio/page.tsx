'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

interface CharacterProfile {
  id: string;
  name: string;
  age: number;
  culture: string;
  role: string;
  profession: string;
  backstory: string;
  personality: string[];
  speech_patterns: string;
  relationships: string;
  dialogue_samples: string[];
  visual_description: string;
  cultural_notes: string;
  voice_notes: string;
  casting_tags: string[];
  generated_at: string;
}

interface Project {
  id: string;
  title: string;
  created_at: string;
  characters: CharacterProfile[];
}

// ═══════════════════════════════════════════════════════════════
//  DATA: EXPANDED CULTURES (20+ Major Nigerian + Pan-African)
// ═══════════════════════════════════════════════════════════════

const CULTURES = [
  // Major Nigerian Groups
  { id: 'Yoruba',      label: 'Yoruba',      region: 'Southwest',      population: '47M',  desc: 'Southwest Nigeria — Ife, Oyo, Lagos. Deep ritual tradition, talking drums, oriki praise poetry.',            adinkra: 'Gye Nyame' },
  { id: 'Igbo',        label: 'Igbo',        region: 'Southeast',      population: '45M',  desc: 'Southeast Nigeria — Nri, Arochukwu. Uli art, Igbo-Ukwu bronzes, republican ethos.',                      adinkra: 'Akoma' },
  { id: 'Hausa',       label: 'Hausa',       region: 'North',          population: '55M',  desc: 'Northern Nigeria — Kano, Zaria. Ancient city-states, Durbar horsemanship, Islamic scholarship.',           adinkra: 'Dwennimmen' },
  { id: 'Fulani',      label: 'Fulani',      region: 'North',          population: '15M',  desc: 'Nomadic pastoralists across the Sahel. Sharo initiation, exquisite leatherwork, Pulaaku code.',            adinkra: 'Sankofa' },
  { id: 'Ijaw',        label: 'Ijaw',        region: 'Niger Delta',    population: '14M',  desc: 'Water people of the Delta. Masquerade (Ogori), fishing cosmology, resource conflict heritage.',            adinkra: 'Bi Nka Bi' },
  { id: 'Edo',         label: 'Edo (Bini)',  region: 'South-South',    population: '5M',   desc: 'Kingdom of Benin — bronze casters, Igue festival, divine kingship (Oba).',                                  adinkra: 'Hye Wo Nhye' },
  { id: 'Tiv',         label: 'Tiv',         region: 'Middle Belt',    population: '7M',   desc: 'Benue valley — kwagh-hir puppet theatre, black-and-red stripe cloth, yam cultivation.',                    adinkra: 'Funtunfunefu' },
  { id: 'Efik',        label: 'Efik',        region: 'Cross River',    population: '1M',   desc: 'Calabar — Ekpe/Mgbe society, Abang dance, sophisticated cuisine (Edikang Ikong).',                         adinkra: 'Epa' },
  { id: 'Ibibio',      label: 'Ibibio',      region: 'Akwa Ibom',      population: '5M',   desc: 'Akwa Ibom — Ekpo masquerade, Annang warriors, rich mask traditions.',                                      adinkra: 'Kramo Bone' },
  { id: 'Kanuri',      label: 'Kanuri',      region: 'Borno',          population: '7M',   desc: 'Borno Empire heirs — Saifawa dynasty, Lake Chad trade, Kotoko architecture.',                              adinkra: 'Nkyinkyim' },
  { id: 'Nupe',        label: 'Nupe',        region: 'Middle Belt',    population: '5M',   desc: 'Bida — glass beadwork, Etsu Nupe royalty, riverine military tradition.',                                    adinkra: 'Owuo Atwedee' },
  { id: 'Igala',       label: 'Igala',       region: 'Middle Belt',    population: '2M',   desc: 'Kogi — Attah Igala kingship, confluence of Niger/Benue, ancient trade hub.',                               adinkra: 'Sesa Wo Suban' },
  { id: 'Idoma',       label: 'Idoma',       region: 'Middle Belt',    population: '4M',   desc: 'Benue — Agila masquerade, red-and-black cloth, agricultural calendar rituals.',                            adinkra: 'Mframadan' },
  { id: 'Urhobo',      label: 'Urhobo',      region: 'Delta',          population: '2M',   desc: 'Delta — Ugie festivals, phallo-sculptural art, water spirit (Edjo) cosmology.',                            adinkra: 'Nkonsonkonson' },
  { id: 'Isoko',       label: 'Isoko',       region: 'Delta',          population: '1M',   desc: 'Delta — closely related to Urhobo, distinct masking and funeral traditions.',                              adinkra: 'Boa Me Na Me' },
  { id: 'Ebira',       label: 'Ebira',       region: 'Middle Belt',    population: '2M',   desc: 'Kogi — Echane festival, weaving, ironworking, terraced hills.',                                            adinkra: 'Dame-Dame' },
  { id: 'Gwari',       label: 'Gwari (Gbagyi)', region: 'Middle Belt', population: '3M',   desc: 'Abuja environs — original landowners of FCT, pottery, terraced farming.',                                  adinkra: 'Kintinkantan' },
  { id: 'Bura',        label: 'Bura (Babur)', region: 'Borno',         population: '1M',   desc: 'Mandara mountains — iron smelting, distinct from Kanuri but related.',                                     adinkra: 'Mpuannum' },
  { id: 'Itsekiri',    label: 'Itsekiri',    region: 'Delta',          population: '0.5M', desc: 'Warri kingdom — seafaring traders, Olu dynasty, unique syncretic culture.',                                adinkra: 'Nyame Dua' },
  { id: 'Ogoni',       label: 'Ogoni',       region: 'Rivers',         population: '2M',   desc: 'Rivers State — environmental justice heritage, Lelu masquerade, tight-knit village republics.',            adinkra: 'Funtunfunefu' },
  { id: 'Ikwerre',     label: 'Ikwerre',     region: 'Rivers',         population: '2M',   desc: 'Rivers — Ohafia warrior links, distinct from Igbo politically, rich oral tradition.',                      adinkra: 'Akoben' },
  { id: 'Annang',      label: 'Annang',      region: 'Akwa Ibom',      population: '1M',   desc: 'Akwa Ibom — Ikot Ekpene heritage, raffia weaving, distinct from Ibibio.',                                  adinkra: 'Mate Masie' },
  { id: 'Yakurr',      label: 'Yakurr',      region: 'Cross River',    population: '0.5M', desc: 'Cross River — Leboku festival, yam harvest rituals, unique tonal language.',                               adinkra: 'Ohene Tuo' },
  // Pan-African / Diaspora options for studios
  { id: 'Akan',        label: 'Akan (Ghana)', region: 'West Africa',   population: '20M',  desc: 'Ghana — Adinkra, Kente, Ashanti gold stool, Akwasidae festivals.',                                         adinkra: 'Gye Nyame' },
  { id: 'Wolof',       label: 'Wolof (Senegal)', region: 'West Africa', population: '6M',  desc: 'Senegal — Griot tradition, sabar drumming, teranga hospitality.',                                          adinkra: 'Sankofa' },
  { id: 'Mandinka',    label: 'Mandinka',    region: 'West Africa',    population: '12M',  desc: 'Mali/Senegal — Epic of Sundiata, kora music, empire builders.',                                            adinkra: 'Dwennimmen' },
  { id: 'Yoruba-Diaspora', label: 'Yoruba Diaspora', region: 'Americas', population: '—', desc: 'Cuba (Lucumí), Brazil (Candomblé), Trinidad — Orisha retention, syncretic survival.',                      adinkra: 'Sankofa' },
];

const ROLES = [
  { id: 'Protagonist',    label: 'Protagonist',      category: 'Core',       desc: 'The one whose want drives the story. Flawed but magnetic.' },
  { id: 'Antagonist',     label: 'Antagonist',       category: 'Core',       desc: 'Opposition with a point of view. Not evil — just opposed.' },
  { id: 'Deuteragonist',  label: 'Deuteragonist',    category: 'Core',       desc: 'The second most important character. Mirror or foil to the lead.' },
  { id: 'Mentor',         label: 'Mentor',           category: 'Archetype',  desc: 'Has walked the path before. May be unreliable or have fallen.' },
  { id: 'Trickster',      label: 'Trickster',        category: 'Archetype',  desc: 'Disrupts order to reveal truth. Eshu, Anansi, or modern con artist.' },
  { id: 'Love-Interest',  label: 'Love Interest',    category: 'Archetype',  desc: 'Not just romance — the one who makes the protagonist feel seen.' },
  { id: 'Sidekick',       label: 'Sidekick',         category: 'Archetype',  desc: 'Loyal, often funnier than the lead. Carries the emotional load.' },
  { id: 'Skeptic',        label: 'Skeptic',          category: 'Archetype',  desc: 'Voices doubt. Often right at the worst moment.' },
  { id: 'Guardian',       label: 'Guardian',         category: 'Archetype',  desc: 'Protects the threshold. May be a parent, soldier, or tradition itself.' },
  { id: 'Threshold-Keeper', label: 'Threshold Keeper', category: 'Archetype', desc: 'Controls access — information, place, or power. Gatekeeper energy.' },
  { id: 'Shape-Shifter',  label: 'Shape-Shifter',    category: 'Archetype',  desc: 'Allegiance unclear until Act III. Double agent, spy, or conflicted soul.' },
  { id: 'Shadow',         label: 'Shadow',           category: 'Depth',      desc: 'What the protagonist could become. Dark mirror.' },
  { id: 'Anima-Animus',   label: 'Anima / Animus',   category: 'Depth',      desc: 'The idealized other within. Often appears in dreams or memory.' },
  { id: 'Herald',         label: 'Herald',           category: 'Depth',      desc: 'Brings the call. Often dies or disappears after delivering the message.' },
  { id: 'Outcast',        label: 'Outcast',          category: 'Depth',      desc: 'Exiled by choice or force. Sees the system clearly because they are outside it.' },
  { id: 'Rival',          label: 'Rival',            category: 'Depth',      desc: 'Competitor, not enemy. Makes the protagonist better through friction.' },
  { id: 'Comic-Relief',   label: 'Comic Relief',     category: 'Depth',      desc: 'Breaks tension, but often delivers the most painful truths.' },
  { id: 'Sacrificial-Lamb', label: 'Sacrificial Lamb', category: 'Depth',    desc: 'Death or loss that raises the stakes. Often innocent.' },
  { id: 'False-Ally',     label: 'False Ally',       category: 'Depth',      desc: 'Seems helpful. Betrayal cuts deepest when it comes from here.' },
  { id: 'Redeemer',       label: 'Redeemer',         category: 'Depth',      desc: 'Seeks atonement. The hardest character to write convincingly.' },
];

const AGES = [
  { id: 'Child (5-12)',       label: 'Child',        range: '5–12',   stage: 'Innocence' },
  { id: 'Teen (13-19)',       label: 'Teenager',     range: '13–19',  stage: 'Rebellion' },
  { id: 'Young Adult (20-28)', label: 'Young Adult', range: '20–28',  stage: 'Discovery' },
  { id: 'Adult (29-40)',      label: 'Adult',        range: '29–40',  stage: 'Responsibility' },
  { id: 'Middle Age (41-55)', label: 'Middle Age',   range: '41–55',  stage: 'Reckoning' },
  { id: 'Senior (56-70)',     label: 'Senior',       range: '56–70',  stage: 'Legacy' },
  { id: 'Elder (70+)',        label: 'Elder',        range: '70+',    stage: 'Transcendence' },
];

const PROFESSIONS = [
  'Farmer', 'Trader', 'Blacksmith', 'Teacher', 'Musician / Griot', 'Healer / Herbalist',
  'Soldier / Warrior', 'Fisher', 'Weaver', 'Potter', 'Hunter', 'Carpenter',
  'Politician / Chief', 'Imam / Pastor / Priest', 'Driver', 'Engineer', 'Doctor',
  'Lawyer', 'Journalist', 'Artist', 'Student', 'Unemployed', 'Retired',
  'Civil Servant', 'Entrepreneur', 'Security', 'Domestic Worker', 'Miner',
  'Oil Worker', 'Activist', 'Refugee / IDP', 'Exile', 'Royalty',
];

const TONES = [
  { id: 'gritty',      label: 'Gritty Realism',      desc: 'No heroes. Hard choices. Lagos traffic and unpaid bills.' },
  { id: 'mythic',      label: 'Mythic Modern',       desc: 'Ancient spirits in WhatsApp groups. Anansi as a hacker.' },
  { id: 'satirical',   label: 'Political Satire',    desc: 'Sharp tongue, sharper observations. Armando Iannucci energy.' },
  { id: 'romantic',    label: 'Romantic Drama',      desc: 'Love across class, religion, or ethnicity. High emotion.' },
  { id: 'thriller',    label: 'Thriller / Crime',    desc: 'Corruption, ritual, or organized crime. Ticking clock.' },
  { id: 'historical',  label: 'Historical Epic',     desc: 'Pre-colonial kingdoms, civil war, or independence era.' },
  { id: 'scifi',       label: 'Afrofuturism',        desc: 'Tech, space, and tradition intertwined. Black Panther meets District 9.' },
  { id: 'horror',      label: 'Folk Horror',         desc: 'The forest remembers. The river takes. The ancestors watch.' },
];
    
// ═══════════════════════════════════════════════════════════════
//  ADINKRA SVG COMPONENTS (replacing emojis with real symbols)
// ═══════════════════════════════════════════════════════════════

const AdinkraSymbol = ({ name, className = '' }: { name: string; className?: string }) => {
  const symbols: Record<string, JSX.Element> = {
    'Gye Nyame': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="M32 4 C18 4, 8 16, 8 28 C8 42, 20 52, 32 60 C44 52, 56 42, 56 28 C56 16, 46 4, 32 4 Z M32 12 C40 12, 48 18, 48 28 C48 38, 40 46, 32 52 C24 46, 16 38, 16 28 C16 18, 24 12, 32 12 Z M32 20 C28 20, 24 24, 24 28 C24 34, 28 38, 32 42 C36 38, 40 34, 40 28 C40 24, 36 20, 32 20 Z"/>
        <circle cx="32" cy="28" r="4"/>
      </svg>
    ),
    'Sankofa': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="M20 48 C12 40, 12 24, 24 16 C32 10, 44 12, 48 20 L44 24 C40 18, 32 18, 26 22 C20 28, 20 38, 26 44 Z"/>
        <path d="M44 24 L52 16 L56 28 Z"/>
        <path d="M48 20 L56 12"/>
      </svg>
    ),
    'Dwennimmen': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="M32 8 L32 24 M20 16 L32 24 L44 16 M16 28 C16 20, 24 16, 32 24 C40 16, 48 20, 48 28 C48 36, 40 40, 32 32 C24 40, 16 36, 16 28 Z"/>
        <path d="M24 36 L20 56 M40 36 L44 56 M28 44 L36 44"/>
      </svg>
    ),
    'Akoma': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="M32 16 C20 16, 12 24, 12 34 C12 46, 22 52, 32 52 C42 52, 52 46, 52 34 C52 24, 44 16, 32 16 Z M32 24 C36 24, 40 28, 40 34 C40 40, 36 44, 32 44 C28 44, 24 40, 24 34 C24 28, 28 24, 32 24 Z"/>
        <path d="M32 8 L32 16 M24 12 L40 12"/>
      </svg>
    ),
    'Epa': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <rect x="16" y="12" width="32" height="40" rx="2"/>
        <circle cx="32" cy="28" r="8"/>
        <path d="M24 48 L32 40 L40 48"/>
        <path d="M20 12 L20 8 M44 12 L44 8"/>
      </svg>
    ),
    'Bi Nka Bi': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <circle cx="24" cy="32" r="14"/><circle cx="40" cy="32" r="14"/>
        <path d="M24 18 L24 10 M40 18 L40 10 M24 46 L24 54 M40 46 L40 54"/>
      </svg>
    ),
    'Funtunfunefu': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <path d="M20 20 C28 12, 36 12, 44 20 C52 28, 52 36, 44 44 C36 52, 28 52, 20 44 C12 36, 12 28, 20 20 Z"/>
        <path d="M24 24 C30 18, 34 18, 40 24 C46 30, 46 34, 40 40 C34 46, 30 46, 24 40 C18 34, 18 30, 24 24 Z"/>
      </svg>
    ),
    'default': (
      <svg viewBox="0 0 64 64" className={className} fill="currentColor">
        <circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="8"/>
      </svg>
    ),
  };
  return symbols[name] || symbols['default'];
};

// ═══════════════════════════════════════════════════════════════
//  MOCK GENERATOR (replace with real API call)
// ═══════════════════════════════════════════════════════════════

const MOCK_FIRST_NAMES: Record<string, string[]> = {
  Yoruba: ['Olumide','Adebisi','Folake','Tunde','Yetunde','Bayo','Ngozi','Kunle','Adunni','Segun'],
  Igbo: ['Chinua','Ngozi','Obi','Ifeoma','Chidi','Amara','Kelechi','Adaeze','Ikenna','Ziora'],
  Hausa: ['Amina','Usman','Fatima','Yusuf','Zainab','Abubakar','Halima','Isa','Khadija','Musa'],
  Fulani: ['Binta','Amadou','Mariama','Ibrahim','Aissata','Ousmane','Fatou','Modibo','Kadiatou','Sekou'],
  Ijaw: ['Ebiere','Timi','Dumo','Bibobra','Austin','Tamara','Ine','Kuro','Seiyefa','Ere'],
  Edo: ['Eghosa','Osaretin','Aghogho','Ekiuwa','Esohe','Aize','Osagie','Eki','Omoruyi','Ese'],
  Tiv: ['Terngu','Dooshima','Aondohemba','Mlumun','Iveren','Terver','Sedoo','Akaahan','Torkwase','Suur'],
  Efik: ['Ekanem','Edet','Ekpenyong','Eyo','Nsikak','Aniekan','Imabong','Ekem','Eti','Offiong'],
  Ibibio: ['Akpan','Ekaette','Nsikak','Aniebiet','Ime','Effiong','Uduak','Ekong','Etim','Anwana'],
  Kanuri: ['Bukar','Falmata','Goni','Kaka','Lawan','Maina','Mustapha','Shetima','Tijjani','Yerima'],
  Nupe: ['Musa','Fatima','Yahaya','Hassan','Aisha','Ibrahim','Zainab','Abdul','Halima','Suleiman'],
  Igala: ['Onoja','Ameh','Ekele','Ocholi','Adejo','Halimat','Amina','Yusuf','Fatima','Moses'],
  Idoma: ['Oche','Ene','Aba','Agbo','Ogbu','Adakole','Ehi','Ode','Aloysius','Ene'],
  Urhobo: ['Oghenekaro','Efe','Onome','Akporero','Ovie','Elohor','Miriam','Ochuko','Emume','Efetobore'],
  Isoko: ['Ogaga','Efe','Onome','Ovie','Elohor','Ochuko','Emume','Efetobore','Akpor','Miriam'],
  Ebira: ['Ozovehe','Aminu','Onimisi','Adavize','Yakubu','Aisha','Halima','Sani','Zainab','Yusuf'],
  Gwari: ['Musa','Yakubu','Aisha','Sani','Halima','Zainab','Yusuf','Fatima','Ibrahim','Abdul'],
  Bura: ['Bukar','Falmata','Goni','Kaka','Lawan','Maina','Mustapha','Shetima','Tijjani','Yerima'],
  Itsekiri: ['Emiko','Olu','Ikenwoli','Erejuwa','Akenzua','Ogiame','Eyimofe','Oritse','Omatsone','Tuedon'],
  Ogoni: ['Letam','Bariledum','Suanu','Nwinee','Gbeneku','Lolomari','Nkeduru','Deekae','Bariyira','Nale'],
  Ikwerre: ['Chibuike','Ngozi','Obi','Ifeoma','Chidi','Amara','Kelechi','Adaeze','Ikenna','Ziora'],
  Annang: ['Akpan','Ekaette','Nsikak','Aniebiet','Ime','Effiong','Uduak','Ekong','Etim','Anwana'],
  Yakurr: ['Ekpenyong','Ekanem','Edet','Eyo','Nsikak','Aniekan','Imabong','Ekem','Eti','Offiong'],
  Akan: ['Kwame','Ama','Kofi','Akosua','Kwabena','Adwoa','Yaw','Afua','Kofi','Yaa'],
  Wolof: ['Amadou','Aminata','Moussa','Fatou','Ibrahima','Ndeye','Omar','Mariama','Cheikh','Awa'],
  Mandinka: ['Kunta','Binta','Lamin','Isatou','Mamadou','Fatoumata','Sulayman','Neneh','Modou','Kaddy'],
  'Yoruba-Diaspora': ['Lazaro','Oya','Shango','Oshun','Yemaya','Obatala','Eleggua','Oya','Babalu','Yemoja'],
};

function generateMockCharacter(
  cultureId: string,
  roleId: string,
  ageId: string,
  profession: string,
  toneId: string
): CharacterProfile {
  const names = MOCK_FIRST_NAMES[cultureId] || MOCK_FIRST_NAMES['Yoruba'];
  const firstName = names[Math.floor(Math.random() * names.length)];
  const surnames = ['Okafor','Adeyemi','Mohammed','Ibrahim','Eze','Nwosu','Abubakar','Ojo','Balogun','Danjuma'];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const ageMap: Record<string, [number, number]> = {
    'Child (5-12)': [5,12], 'Teen (13-19)': [13,19], 'Young Adult (20-28)': [20,28],
    'Adult (29-40)': [29,40], 'Middle Age (41-55)': [41,55], 'Senior (56-70)': [56,70], 'Elder (70+)': [70,85],
  };
  const [minAge, maxAge] = ageMap[ageId] || [25,45];
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

  const culture = CULTURES.find(c => c.id === cultureId)!;
  const role = ROLES.find(r => r.id === roleId)!;
  const tone = TONES.find(t => t.id === toneId)!;

  const backstories: Record<string, string[]> = {
    gritty: [
      `Born in ${culture.region}, ${firstName} grew up in a household where silence was safer than speech. The ${profession.toLowerCase()} trade chose them before they could choose it.`,
      `${firstName} left ${culture.region} at 16 with a borrowed phone and a forged reference. Now they are a ${profession.toLowerCase()} who knows which doors open with money and which with memory.`,
    ],
    mythic: [
      `${firstName} carries a birthmark that elders whisper mirrors the constellation of the ${culture.label} creation myth. As a ${profession.toLowerCase()}, they straddle two worlds.`,
      `The ${culture.label} spirits do not speak to just anyone. But since the accident, ${firstName} has heard them in the static between radio stations.`,
    ],
    satirical: [
      `${firstName} became a ${profession.toLowerCase()} because it was the only job where incompetence looked like strategy. They have Excel sheets for everything except their own life.`,
      `In ${culture.region}, ${firstName} is known as the ${profession.toLowerCase()} who once corrected a senator's grammar on live television. The tweet is still circulating.`,
    ],
    romantic: [
      `${firstName} has loved exactly once — at nineteen, in the rain, behind the ${culture.label} community hall. Now a ${profession.toLowerCase()}, they measure every new encounter against that impossible standard.`,
      `They say ${firstName} has a laugh like their grandmother's. As a ${profession.toLowerCase()}, they hide behind competence what they cannot say with words.`,
    ],
    thriller: [
      `${firstName} discovered something in the ${profession.toLowerCase()}'s ledger that was never meant to be found. Now the phone rings at 3 AM and the caller knows their mother's name.`,
      `Three people have died in ${culture.region} this month. All ${profession.toLowerCase()}s. ${firstName} does not believe in coincidences.`,
    ],
    historical: [
      `${firstName} was born in the year the ${culture.label} elders signed the treaty that would unravel their kingdom. As a ${profession.toLowerCase()}, they have spent forty years watching the consequences unfold.`,
      `The British called them a ${profession.toLowerCase()}. The ${culture.label} resistance called them something else entirely. ${firstName} answers to neither.`,
    ],
    scifi: [
      `${firstName} is a ${profession.toLowerCase()} on Orbital Station Ife-7, where the ${culture.label} diaspora has preserved traditions in code and ritual in zero gravity.`,
      `In 2087, ${firstName} uploads ancestral memory to the cloud for a living. But last Tuesday, something downloaded back.`,
    ],
    horror: [
      `${firstName} returned to ${culture.region} to bury their father. The ${profession.toLowerCase()} shop was supposed to be temporary. That was three months ago. The forest has started whispering.`,
      `Every ${culture.label} child knows not to speak the name of the river at night. ${firstName}, a ${profession.toLowerCase()}, learned why the hard way.`,
    ],
  };

  const pool = backstories[tone.id] || backstories['gritty'];
  const backstory = pool[Math.floor(Math.random() * pool.length)];

  return {
    id: Math.random().toString(36).slice(2, 10),
    name: `${firstName} ${surname}`,
    age,
    culture: culture.label,
    role: role.label,
    profession,
    backstory,
    personality: ['Resilient','Wry humor','Guarded warmth','Strategic silence'],
    speech_patterns: `Speaks with the measured cadence of ${culture.region}. Uses proverbs when cornered. Code-switches between ${culture.label} and English depending on power dynamics.`,
    relationships: 'Estranged from a sibling who chose tradition over ambition. Owes a debt to a former mentor that can never be fully repaid.',
    dialogue_samples: [
      `"The river does not hurry, but it reaches the sea." — spoken while staring at a phone that will not ring.`,
      `"In my house, we do not say 'impossible.' We say 'not yet.'" — deflecting a direct question about the past.`,
      `"You think this is about money?" — the moment before the truth comes out.`,
    ],
    visual_description: `${age > 50 ? 'Silver-threaded hair' : 'Close-cropped hair with a deliberate scar above the left brow'}. Dresses like someone who learned early that appearance is armor. ${culture.region} features with ${['sharp','soft','angular','broad'][Math.floor(Math.random()*4)]} bone structure.`,
    cultural_notes: `${culture.desc}. In ${culture.label} tradition, the ${role.label.toLowerCase()} archetype appears in ${['oral epics','masquerade narratives','proverb cycles','funeral oratory'][Math.floor(Math.random()*4)]}.`,
    voice_notes: `Pitch: ${['low','mid','high'][Math.floor(Math.random()*3)]}. Tempo: ${['deliberate','rapid','measured'][Math.floor(Math.random()*3)]}. Distinctive feature: ${['pauses before proper nouns','laughs at own jokes','rarely uses first person','hums when thinking'][Math.floor(Math.random()*4)]}.`,
    casting_tags: [culture.region, role.category, tone.label.split(' ')[0], profession.split(' ')[0]],
    generated_at: new Date().toISOString(),
  };
    }
          // ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function GitCastStudio() {
  const [culture, setCulture]     = useState('');
  const [role, setRole]           = useState('');
  const [age, setAge]             = useState('');
  const [profession, setProfession] = useState('');
  const [tone, setTone]           = useState('gritty');
  const [loading, setLoading]     = useState(false);
  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [error, setError]         = useState('');
  const [activeTab, setActiveTab] = useState<'studio' | 'projects' | 'export'>('studio');
  const [projects, setProjects]   = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode]   = useState<'bible' | 'cards' | 'script'>('bible');

  const resultRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(async () => {
    if (!culture || !role || !age) return;
    setLoading(true);
    setError('');
    setCharacter(null);

    try {
      await new Promise(r => setTimeout(r, 1800));
      const data = generateMockCharacter(culture, role, age, profession || 'Unspecified', tone);
      setCharacter(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Generation failed. Check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [culture, role, age, profession, tone]);

  const canGenerate = culture && role && age;

  const saveToProject = () => {
    if (!character) return;
    const proj = projects.find(p => p.id === activeProject);
    if (proj) {
      setProjects(prev => prev.map(p => p.id === activeProject ? { ...p, characters: [...p.characters, character] } : p));
    } else {
      const newProj: Project = {
        id: Math.random().toString(36).slice(2, 8),
        title: `Project ${projects.length + 1}`,
        created_at: new Date().toISOString(),
        characters: [character],
      };
      setProjects(prev => [...prev, newProj]);
      setActiveProject(newProj.id);
    }
  };

  const exportJSON = () => {
    if (!character) return;
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/\s+/g, '_')}_profile.json`;
    a.click();
  };

  const exportPDF = () => {
    alert('PDF export requires server-side rendering (puppeteer/playwright). See architecture notes below.');
  };

  const selectedCulture = CULTURES.find(c => c.id === culture);
  const selectedRole = ROLES.find(r => r.id === role);
  const selectedAge = AGES.find(a => a.id === age);
  const selectedTone = TONES.find(t => t.id === tone);

  return (
    <div className="studio-root">
                                                   <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --paper:      #F4F1EA;
          --paper-dark: #E8E4DA;
          --ink:        #1C1917;
          --ink-light:  #44403C;
          --ink-faint:  #A8A29E;
          --accent:     #B45309;
          --accent-light:#D97706;
          --accent-wash: #FEF3C7;
          --indigo:     #3730A3;
          --indigo-wash:#E0E7FF;
          --forest:     #14532D;
          --forest-wash:#DCFCE7;
          --terracotta: #9A3412;
          --terracotta-wash:#FFEDD5;
          --border:     #D6D3D1;
          --border-light:#E7E5E4;
          --shadow:     0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
          --shadow-lg:  0 4px 6px rgba(0,0,0,0.03), 0 12px 24px rgba(0,0,0,0.04);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--paper); color: var(--ink); font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

        .studio-root { min-height: 100vh; display: flex; flex-direction: column; }

        .topbar {
          height: 56px; background: var(--ink); color: var(--paper);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; position: sticky; top: 0; z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .topbar-left { display: flex; align-items: center; gap: 16px; }
        .topbar-logo {
          font-family: 'Instrument Serif', Georgia, serif; font-size: 1.25rem;
          letter-spacing: -0.02em; display: flex; align-items: center; gap: 10px;
        }
        .topbar-logo svg { width: 22px; height: 22px; opacity: 0.9; }
        .topbar-tag {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--ink-faint); background: rgba(255,255,255,0.08);
          padding: 3px 10px; border-radius: 4px; font-weight: 500;
        }
        .topbar-nav { display: flex; gap: 4px; }
        .topbar-nav button {
          background: transparent; border: none; color: var(--ink-faint);
          font-size: 0.78rem; font-weight: 500; padding: 6px 14px; border-radius: 6px;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
        }
        .topbar-nav button:hover { color: var(--paper); background: rgba(255,255,255,0.06); }
        .topbar-nav button.active { color: var(--paper); background: rgba(255,255,255,0.1); }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-btn {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
          padding: 7px 16px; border-radius: 6px; cursor: pointer; transition: all 0.15s;
          border: 1px solid transparent; font-family: inherit;
        }
        .topbar-btn-ghost { background: transparent; color: var(--ink-faint); border-color: rgba(255,255,255,0.1); }
        .topbar-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--paper); }
        .topbar-btn-primary { background: var(--accent); color: white; border-color: var(--accent); }
        .topbar-btn-primary:hover { background: var(--accent-light); }

        .workspace { display: flex; flex: 1; min-height: 0; }

        .sidebar {
          width: 280px; background: var(--paper-dark); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; transition: width 0.2s;
        }
        .sidebar.collapsed { width: 0; overflow: hidden; border: none; }
        .sidebar-header {
          padding: 20px; border-bottom: 1px solid var(--border-light);
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--ink-faint); font-weight: 600;
        }
        .sidebar-list { flex: 1; overflow-y: auto; padding: 8px; }
        .sidebar-item {
          padding: 10px 12px; border-radius: 8px; cursor: pointer;
          font-size: 0.82rem; color: var(--ink-light); transition: all 0.12s;
          display: flex; align-items: center; gap: 10px; margin-bottom: 2px;
        }
        .sidebar-item:hover { background: rgba(0,0,0,0.03); }
        .sidebar-item.active { background: var(--ink); color: var(--paper); }
        .sidebar-item .count {
          margin-left: auto; font-size: 0.7rem; opacity: 0.6; font-variant-numeric: tabular-nums;
        }
        .sidebar-empty {
          padding: 40px 20px; text-align: center; font-size: 0.8rem; color: var(--ink-faint);
          line-height: 1.6;
        }

        .stage { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .stage-scroll { flex: 1; overflow-y: auto; padding: 32px 40px; }

        .section-label {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.14em;
          color: var(--ink-faint); font-weight: 600; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::after {
          content: ''; flex: 1; height: 1px; background: var(--border-light);
        }

        .param-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px; margin-bottom: 28px;
        }
        .param-card {
          background: white; border: 1.5px solid var(--border-light); border-radius: 10px;
          padding: 14px; cursor: pointer; transition: all 0.15s; position: relative;
        }
        .param-card:hover { border-color: var(--border); box-shadow: var(--shadow); }
        .param-card.selected {
          border-color: var(--accent); background: var(--accent-wash);
          box-shadow: 0 0 0 3px rgba(180,83,9,0.08);
        }
        .param-card .symbol {
          width: 32px; height: 32px; margin-bottom: 10px; color: var(--ink-faint);
        }
        .param-card.selected .symbol { color: var(--accent); }
        .param-card .title {
          font-size: 0.85rem; font-weight: 600; color: var(--ink); margin-bottom: 3px;
        }
        .param-card .meta {
          font-size: 0.72rem; color: var(--ink-faint); line-height: 1.4;
        }
        .param-card .badge {
          position: absolute; top: 10px; right: 10px;
          font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 8px; border-radius: 4px;
        }
        .badge-region { background: var(--indigo-wash); color: var(--indigo); }
        .badge-category { background: var(--forest-wash); color: var(--forest); }
        .badge-stage { background: var(--terracotta-wash); color: var(--terracotta); }

        .field-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;
        }
        .field {
          display: flex; flex-direction: column; gap: 6px;
        }
        .field label {
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--ink-faint);
        }
        .field select, .field input {
          padding: 10px 12px; border: 1.5px solid var(--border-light); border-radius: 8px;
          font-size: 0.85rem; font-family: inherit; color: var(--ink); background: white;
          transition: border-color 0.15s;
        }
        .field select:focus, .field input:focus {
          outline: none; border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(180,83,9,0.08);
        }

        .generate-bar {
          display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
        }
        .generate-btn {
          background: var(--ink); color: var(--paper); border: none;
          padding: 14px 32px; border-radius: 10px; font-size: 0.85rem;
          font-weight: 600; letter-spacing: 0.02em; cursor: pointer;
          transition: all 0.15s; font-family: inherit; display: flex; align-items: center; gap: 10px;
        }
        .generate-btn:hover:not(:disabled) { background: var(--ink-light); transform: translateY(-1px); }
        .generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .generate-hint {
          font-size: 0.78rem; color: var(--ink-faint); font-style: italic;
        }

        .loading-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 80px 20px; color: var(--ink-faint);
        }
        .loading-spinner {
          width: 32px; height: 32px; border: 2.5px solid var(--border-light);
          border-top-color: var(--accent); border-radius: 50%;
          animation: spin 0.8s linear infinite; margin-bottom: 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-size: 0.82rem; letter-spacing: 0.02em; }

        .bible { background: white; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-lg); }
        .bible-header {
          background: var(--ink); color: var(--paper); padding: 28px 32px;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .bible-header-left { max-width: 70%; }
        .bible-header h2 {
          font-family: 'Instrument Serif', Georgia, serif; font-size: 2rem;
          font-weight: 400; margin-bottom: 6px; letter-spacing: -0.01em;
        }
        .bible-header .subtitle {
          font-size: 0.85rem; color: var(--ink-faint); opacity: 0.8;
        }
        .bible-header .tags {
          display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;
        }
        .bible-tag {
          font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
          padding: 4px 10px; border-radius: 4px; background: rgba(255,255,255,0.1); color: var(--paper);
        }
        .bible-actions { display: flex; gap: 8px; }
        .bible-actions button {
          background: rgba(255,255,255,0.08); color: var(--paper); border: 1px solid rgba(255,255,255,0.12);
          padding: 7px 14px; border-radius: 6px; font-size: 0.72rem; font-weight: 600;
          cursor: pointer; transition: all 0.12s; font-family: inherit;
        }
        .bible-actions button:hover { background: rgba(255,255,255,0.15); }

        .bible-body { padding: 32px; }
        .bible-grid {
          display: grid; grid-template-columns: 280px 1fr; gap: 40px;
        }
        .bible-sidebar {
          border-right: 1px solid var(--border-light); padding-right: 32px;
        }
        .bible-meta-row {
          display: flex; justify-content: space-between; padding: 10px 0;
          border-bottom: 1px solid var(--border-light); font-size: 0.82rem;
        }
        .bible-meta-label { color: var(--ink-faint); font-weight: 500; }
        .bible-meta-value { color: var(--ink); font-weight: 600; text-align: right; }
        .bible-section { margin-bottom: 28px; }
        .bible-section h3 {
          font-family: 'Instrument Serif', Georgia, serif; font-size: 1.15rem;
          font-weight: 400; margin-bottom: 10px; color: var(--ink);
        }
        .bible-section p, .bible-section li {
          font-size: 0.88rem; line-height: 1.7; color: var(--ink-light);
        }
        .bible-section ul { padding-left: 18px; }
        .bible-section li { margin-bottom: 6px; }
        .dialogue-block {
          background: var(--paper); border-left: 3px solid var(--accent);
          padding: 14px 18px; margin-bottom: 10px; border-radius: 0 8px 8px 0;
          font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; line-height: 1.6;
          color: var(--ink-light);
        }

        .bible-footer {
          background: var(--paper-dark); padding: 16px 32px;
          border-top: 1px solid var(--border-light);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.72rem; color: var(--ink-faint);
        }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .bible-grid { grid-template-columns: 1fr; }
          .bible-sidebar { border-right: none; border-bottom: 1px solid var(--border-light); padding-right: 0; padding-bottom: 24px; }
          .field-row { grid-template-columns: 1fr; }
          .param-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .param-grid { grid-template-columns: 1fr; }
          .stage-scroll { padding: 20px; }
          .bible-header { flex-direction: column; gap: 16px; }
        }
      `}</style>
                                                           {/* ═══════ TOP BAR ═══════ */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <AdinkraSymbol name="Sankofa" />
            GitCast
          </div>
          <span className="topbar-tag">Studio</span>
        </div>
        <nav className="topbar-nav">
          <button className={activeTab === 'studio' ? 'active' : ''} onClick={() => setActiveTab('studio')}>Forge</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects ({projects.reduce((a,p) => a + p.characters.length, 0)})</button>
          <button className={activeTab === 'export' ? 'active' : ''} onClick={() => setActiveTab('export')}>Export</button>
        </nav>
        <div className="topbar-right">
          <button className="topbar-btn topbar-btn-ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </button>
          <button className="topbar-btn topbar-btn-primary">API Keys</button>
        </div>
      </header>

      {/* ═══════ WORKSPACE ═══════ */}
      <div className="workspace">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-header">Active Projects</div>
          <div className="sidebar-list">
            {projects.length === 0 ? (
              <div className="sidebar-empty">
                No projects yet.<br/>Generate a character and save them here.
              </div>
            ) : (
              projects.map(proj => (
                <div
                  key={proj.id}
                  className={`sidebar-item ${activeProject === proj.id ? 'active' : ''}`}
                  onClick={() => setActiveProject(proj.id)}
                >
                  <span>{proj.title}</span>
                  <span className="count">{proj.characters.length}</span>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Stage */}
        <main className="stage">
          <div className="stage-scroll">
                                {activeTab === 'studio' && (
              <>
                {/* ── CULTURE ── */}
                <div className="section-label">Origin / Ethnicity</div>
                <div className="param-grid">
                  {CULTURES.map(c => (
                    <div
                      key={c.id}
                      className={`param-card ${culture === c.id ? 'selected' : ''}`}
                      onClick={() => setCulture(c.id)}
                    >
                      <span className={`badge badge-region`}>{c.region}</span>
                      <AdinkraSymbol name={c.adinkra} className="symbol" />
                      <div className="title">{c.label}</div>
                      <div className="meta">{c.desc}</div>
                    </div>
                  ))}
                </div>

                {/* ── ROLE ── */}
                <div className="section-label">Dramatic Function</div>
                <div className="param-grid">
                  {ROLES.map(r => (
                    <div
                      key={r.id}
                      className={`param-card ${role === r.id ? 'selected' : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      <span className={`badge badge-category`}>{r.category}</span>
                      <div className="title">{r.label}</div>
                      <div className="meta">{r.desc}</div>
                    </div>
                  ))}
                </div>

                {/* ── AGE + PROFESSION + TONE ── */}
                <div className="field-row">
                  <div className="field">
                    <label>Age Range</label>
                    <select value={age} onChange={e => setAge(e.target.value)}>
                      <option value="">Select age range...</option>
                      {AGES.map(a => (
                        <option key={a.id} value={a.id}>{a.label} ({a.range}) — {a.stage}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Profession / Class</label>
                    <select value={profession} onChange={e => setProfession(e.target.value)}>
                      <option value="">Optional — select profession...</option>
                      {PROFESSIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="section-label">Narrative Tone</div>
                <div className="param-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'}}>
                  {TONES.map(t => (
                    <div
                      key={t.id}
                      className={`param-card ${tone === t.id ? 'selected' : ''}`}
                      onClick={() => setTone(t.id)}
                    >
                      <div className="title">{t.label}</div>
                      <div className="meta">{t.desc}</div>
                    </div>
                  ))}
                </div>

                {/* ── GENERATE ── */}
                <div className="generate-bar">
                  <button className="generate-btn" onClick={generate} disabled={!canGenerate || loading}>
                    {loading ? <span className="loading-spinner" style={{width:16,height:16,margin:0,borderWidth:2}}/> : '▶'}
                    {loading ? 'Generating...' : 'Generate Character'}
                  </button>
                  {!canGenerate && (
                    <span className="generate-hint">Select an origin, dramatic function, and age to begin.</span>
                  )}
                </div>

                {error && (
                  <div style={{padding: '14px 18px', background: '#FEE2E2', color: '#991B1B', borderRadius: 8, fontSize: '0.85rem', marginBottom: 24}}>
                    {error}
                  </div>
                )}

                {/* ── RESULT ── */}
                {loading && (
                  <div className="loading-state">
                    <div className="loading-spinner" />
                    <div className="loading-text">Consulting the narrative engine...</div>
                  </div>
                )}
                            {character && !loading && (
                  <div ref={resultRef} className="bible">
                    <div className="bible-header">
                      <div className="bible-header-left">
                        <h2>{character.name}</h2>
                        <div className="subtitle">
                          {character.culture} · {character.role} · {character.age} years · {character.profession}
                        </div>
                        <div className="tags">
                          {character.casting_tags.map(tag => (
                            <span key={tag} className="bible-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bible-actions">
                        <button onClick={saveToProject}>Save to Project</button>
                        <button onClick={exportJSON}>Export JSON</button>
                        <button onClick={exportPDF}>Export PDF</button>
                      </div>
                    </div>

                    <div className="bible-body">
                      <div className="bible-grid">
                        <div className="bible-sidebar">
                          <div className="bible-meta-row">
                            <span className="bible-meta-label">Age</span>
                            <span className="bible-meta-value">{character.age}</span>
                          </div>
                          <div className="bible-meta-row">
                            <span className="bible-meta-label">Origin</span>
                            <span className="bible-meta-value">{character.culture}</span>
                          </div>
                          <div className="bible-meta-row">
                            <span className="bible-meta-label">Function</span>
                            <span className="bible-meta-value">{character.role}</span>
                          </div>
                          <div className="bible-meta-row">
                            <span className="bible-meta-label">Profession</span>
                            <span className="bible-meta-value">{character.profession}</span>
                          </div>
                          <div className="bible-meta-row">
                            <span className="bible-meta-label">Voice</span>
                            <span className="bible-meta-value" style={{fontSize: '0.75rem'}}>{character.voice_notes}</span>
                          </div>
                        </div>

                        <div>
                          <div className="bible-section">
                            <h3>Backstory</h3>
                            <p>{character.backstory}</p>
                          </div>
                          <div className="bible-section">
                            <h3>Visual Description</h3>
                            <p>{character.visual_description}</p>
                          </div>
                          <div className="bible-section">
                            <h3>Personality Markers</h3>
                            <ul>
                              {character.personality.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bible-section">
                            <h3>Speech Patterns</h3>
                            <p>{character.speech_patterns}</p>
                          </div>
                          <div className="bible-section">
                            <h3>Key Relationships</h3>
                            <p>{character.relationships}</p>
                          </div>
                          <div className="bible-section">
                            <h3>Dialogue Samples</h3>
                            {character.dialogue_samples.map((d, i) => (
                              <div key={i} className="dialogue-block">{d}</div>
                            ))}
                          </div>
                          <div className="bible-section">
                            <h3>Cultural Notes</h3>
                            <p>{character.cultural_notes}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bible-footer">
                      <span>Generated {new Date(character.generated_at).toLocaleString()}</span>
                      <span>GitCast Character Engine v2.0</span>
                    </div>
                  </div>
                )}
              </>
            )}
                                {activeTab === 'projects' && (
              <div>
                <div className="section-label">Project Library</div>
                {projects.length === 0 ? (
                  <div style={{padding: 60, textAlign: 'center', color: 'var(--ink-faint)', fontSize: '0.9rem'}}>
                    No saved projects. Generate characters in the Forge and save them here.
                  </div>
                ) : (
                  projects.map(proj => (
                    <div key={proj.id} style={{background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                        <h3 style={{fontFamily: 'Instrument Serif', fontSize: '1.3rem', fontWeight: 400}}>{proj.title}</h3>
                        <span style={{fontSize: '0.75rem', color: 'var(--ink-faint)'}}>{proj.characters.length} characters</span>
                      </div>
                      <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                        {proj.characters.map(ch => (
                          <div key={ch.id} style={{padding: '10px 16px', background: 'var(--paper)', borderRadius: 8, fontSize: '0.82rem', border: '1px solid var(--border-light)'}}>
                            <strong>{ch.name}</strong> · {ch.culture} · {ch.role}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div>
                <div className="section-label">Export Options</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16}}>
                  {[
                    { label: 'JSON (Structured)', desc: 'Machine-readable profile for game engines, CMS, or pipelines.', action: () => character && exportJSON() },
                    { label: 'PDF Character Bible', desc: 'Print-ready formatted document for casting directors.', action: exportPDF },
                    { label: 'Final Draft (.fdx)', desc: 'Import character metadata directly into Final Draft.', action: () => alert('Requires server-side XML generation.') },
                    { label: 'CSV Cast List', desc: 'Spreadsheet format for production scheduling.', action: () => alert('Requires server-side CSV generation.') },
                  ].map((opt, i) => (
                    <div key={i} style={{background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: 20, cursor: 'pointer'}} onClick={opt.action}>
                      <div style={{fontWeight: 600, fontSize: '0.9rem', marginBottom: 6}}>{opt.label}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--ink-faint)'}}>{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
                     }
                
