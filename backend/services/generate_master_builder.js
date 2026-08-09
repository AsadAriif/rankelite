const fs = require('fs');
const path = require('path');

console.log('⚡ Generating master 800 seed data...');

// Helper to create clean slug
function toSlug(text, id) {
  return `${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
}

// 1. BILLIONAIRES (100)
const b100 = [
  { t: 'Elon Musk', w: '$242.0B', s: 'Tesla, SpaceX, xAI, X', c: 'United States', com: 'Tesla & SpaceX', u: 'https://www.tesla.com', a: 53, d: 'Visionary tech pioneer advancing interplanetary exploration with SpaceX Starship, autonomous driving, and Grok frontier intelligence.' },
  { t: 'Bernard Arnault & Family', w: '$215.0B', s: 'LVMH Luxury Empire', c: 'France', com: 'LVMH Moët Hennessy', u: 'https://www.lvmh.com', a: 75, d: 'Global luxury titan overseeing 75 prestigious Maisons including Louis Vuitton, Christian Dior, Tiffany & Co., and Dom Pérignon.' },
  { t: 'Jeff Bezos', w: '$204.0B', s: 'Amazon, Blue Origin', c: 'United States', com: 'Amazon.com, Inc.', u: 'https://www.aboutamazon.com', a: 60, d: 'E-commerce and cloud compute architect who built Amazon AWS into the global internet backbone and funds Blue Origin orbital rocketry.' },
  { t: 'Mark Zuckerberg', w: '$182.0B', s: 'Meta Platforms', c: 'United States', com: 'Meta Platforms, Inc.', u: 'https://about.meta.com', a: 40, d: 'Commands the worlds premier social network ecosystem across Instagram, WhatsApp, Quest VR, and open-weights Llama 3 AI.' },
  { t: 'Larry Ellison', w: '$168.0B', s: 'Oracle Corporation', c: 'United States', com: 'Oracle Corporation', u: 'https://www.oracle.com', a: 80, d: 'Software pioneer and database architect driving massive enterprise cloud migration and multi-cloud AI infrastructure.' },
  { t: 'Warren Buffett', w: '$138.0B', s: 'Berkshire Hathaway', c: 'United States', com: 'Berkshire Hathaway', u: 'https://www.berkshirehathaway.com', a: 94, d: 'The Oracle of Omaha, legendary investor celebrated for compounding capital across American insurance, energy, and blue-chip equities.' },
  { t: 'Bill Gates', w: '$132.0B', s: 'Microsoft, Cascade', c: 'United States', com: 'Gates Foundation & Breakthrough Energy', u: 'https://www.gatesfoundation.org', a: 68, d: 'Pioneered personal computing software with Windows and now deploys billions into global vaccine initiatives and zero-carbon nuclear energy.' },
  { t: 'Steve Ballmer', w: '$126.0B', s: 'Microsoft, LA Clippers', c: 'United States', com: 'Los Angeles Clippers', u: 'https://www.nba.com/clippers', a: 68, d: 'Former Microsoft CEO and passionate owner of the Los Angeles Clippers, developer of the billion-dollar Intuit Dome arena.' },
  { t: 'Mukesh Ambani', w: '$120.0B', s: 'Reliance Industries', c: 'India', com: 'Reliance Industries Ltd', u: 'https://www.ril.com', a: 67, d: 'Indian industrial magnate transforming 1.4B people digital access through Jio 5G high-speed networks and green energy giga-factories.' },
  { t: 'Larry Page', w: '$118.0B', s: 'Google / Alphabet', c: 'United States', com: 'Alphabet Inc.', u: 'https://abc.xyz', a: 51, d: 'Co-invented the foundational PageRank algorithm that organized world information and built Google search monopoly.' },
  { t: 'Sergey Brin', w: '$112.5B', s: 'Google / Alphabet', c: 'United States', com: 'Alphabet Inc.', u: 'https://abc.xyz', a: 51, d: 'Co-founder of Google who led Google X moonshot initiatives including self-driving Waymo and Gemini foundation models.' },
  { t: 'Amancio Ortega', w: '$106.0B', s: 'Zara / Inditex', c: 'Spain', com: 'Inditex Group', u: 'https://www.inditex.com', a: 88, d: 'Pioneered fast-fashion logistics through Zara and owns a multi-billion euro prime real estate empire across London, Paris, and Madrid.' },
  { t: 'Michael Bloomberg', w: '$104.0B', s: 'Bloomberg LP', c: 'United States', com: 'Bloomberg LP', u: 'https://www.bloomberg.com', a: 82, d: 'Financial data billionaire whose Bloomberg Terminal connects global stock exchanges, bond markets, and Wall Street trading desks.' },
  { t: 'Jensen Huang', w: '$98.0B', s: 'NVIDIA Corporation', c: 'United States', com: 'NVIDIA Corporation', u: 'https://www.nvidia.com', a: 61, d: 'Semiconductor visionary who invented GPU parallel computing and transformed Nvidia into the heart of global artificial intelligence.' },
  { t: 'Carlos Slim Helu', w: '$94.0B', s: 'América Móvil', c: 'Mexico', com: 'Grupo Carso', u: 'https://www.americamovil.com', a: 84, d: 'Latin American telecommunications kingpin controlling Telmex and Telcel cellular networks across 18 countries.' },
  { t: 'Françoise Bettencourt Meyers', w: '$91.0B', s: "L'Oréal", c: 'France', com: "L'Oréal Group", u: 'https://www.loreal.com', a: 71, d: 'Worlds richest woman and heiress to the cosmetic empire spanning Lancôme, Maybelline, and Kiehls.' },
  { t: 'Michael Dell', w: '$88.0B', s: 'Dell Technologies', c: 'United States', com: 'Dell Technologies', u: 'https://www.dell.com', a: 59, d: 'Pioneered direct-to-consumer PC manufacturing from his dorm room and built modern enterprise data storage server arrays.' },
  { t: 'Gautam Adani', w: '$82.0B', s: 'Adani Group', c: 'India', com: 'Adani Enterprises', u: 'https://www.adani.com', a: 62, d: 'Infrastructure kingpin controlling India largest commercial seaports, thermal power grids, solar parks, and international airports.' },
  { t: 'Jim Walton', w: '$79.5B', s: 'Walmart', c: 'United States', com: 'Walmart Inc.', u: 'https://www.walmart.com', a: 76, d: 'Heir to the retail empire founded by Sam Walton and chairman of Arvest Bank.' },
  { t: 'Rob Walton', w: '$78.0B', s: 'Walmart, Denver Broncos', c: 'United States', com: 'Walmart Inc.', u: 'https://www.walmart.com', a: 79, d: 'Longtime Walmart chairman and principal owner of the NFL Denver Broncos football franchise.' },
  { t: 'Alice Walton', w: '$77.0B', s: 'Walmart', c: 'United States', com: 'Crystal Bridges Museum', u: 'https://crystalbridges.org', a: 74, d: 'Walmart heiress and renowned art philanthropist who founded the Crystal Bridges Museum of American Art.' },
  { t: 'David Thomson & Family', w: '$68.0B', s: 'Thomson Reuters', c: 'Canada', com: 'Thomson Reuters Corp', u: 'https://www.thomsonreuters.com', a: 67, d: 'Controls global news and legal intelligence agency Thomson Reuters and extensive institutional real estate.' },
  { t: 'Zhong Shanshan', w: '$64.0B', s: 'Nongfu Spring', c: 'China', com: 'Nongfu Spring Co', u: 'https://www.nongfuspring.com', a: 69, d: 'Beverage billionaire who turned bottled natural spring water into China premier consumer staples empire.' },
  { t: 'Colin Huang', w: '$58.0B', s: 'PDD Holdings (Temu / Pinduoduo)', c: 'China', com: 'PDD Holdings', u: 'https://www.pddholdings.com', a: 44, d: 'Tech innovator behind social e-commerce giant Pinduoduo and international discount shopping sensation Temu.' },
  { t: 'Julia Koch & Family', w: '$56.5B', s: 'Koch Industries', c: 'United States', com: 'Koch Industries', u: 'https://www.kochind.com', a: 62, d: 'Inherited a major stake in Koch Industries, America second-largest private conglomerate in oil, chemical, and paper.' },
  { t: 'Charles Koch', w: '$56.0B', s: 'Koch Industries', c: 'United States', com: 'Koch Industries', u: 'https://www.kochind.com', a: 88, d: 'Co-owner and CEO of Koch Industries for over 50 years, expanding revenues beyond $125 billion annually.' },
  { t: 'Ma Huateng (Pony Ma)', w: '$46.0B', s: 'Tencent Holdings', c: 'China', com: 'Tencent', u: 'https://www.tencent.com', a: 52, d: 'Architect of WeChat super-app used by 1.3 billion people and global leader in interactive entertainment.' },
  { t: 'Phil Knight & Family', w: '$43.0B', s: 'Nike, Inc.', c: 'United States', com: 'Nike, Inc.', u: 'https://www.nike.com', a: 86, d: 'Co-founder of Nike who transformed athletic footwear and global sports marketing into an iconic $150B brand.' },
  { t: 'Tadashi Yanai & Family', w: '$41.5B', s: 'Uniqlo / Fast Retailing', c: 'Japan', com: 'Fast Retailing Co', u: 'https://www.fastretailing.com', a: 75, d: 'Built Uniqlo into Japan greatest global apparel powerhouse focused on functional LifeWear fabrics.' },
  { t: 'Dieter Schwarz', w: '$39.0B', s: 'Lidl & Kaufland', c: 'Germany', com: 'Schwarz Gruppe', u: 'https://gruppe.schwarz', a: 84, d: 'Retail genius who built the Schwarz Group into Europe largest discount supermarket network with 13,000+ stores.' }
];

console.log('Helper template initialized.');
