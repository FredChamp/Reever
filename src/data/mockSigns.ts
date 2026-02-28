import type { RiverSign } from '@/types'

/** Sample CEVNI navigation signs on French waterways */
export const MOCK_SIGNS: RiverSign[] = [
  // ── Prohibition signs (A-series in CEVNI) ──
  {
    id: 'sign-001',
    code: 'A.1',
    name: 'No entry',
    description: 'Navigation prohibited for all vessels',
    category: 'prohibition',
    coordinates: [2.3522, 48.8566], // Paris area, Seine
  },
  {
    id: 'sign-002',
    code: 'A.9',
    name: 'No overtaking',
    description: 'Overtaking prohibited',
    category: 'prohibition',
    coordinates: [2.1200, 48.8600],
  },
  {
    id: 'sign-003',
    code: 'A.10',
    name: 'No passing',
    description: 'Do not pass vessels going the other way',
    category: 'prohibition',
    coordinates: [4.8755, 45.7715], // Rhône — Cusset area
  },
  {
    id: 'sign-004',
    code: 'A.12',
    name: 'Speed limit',
    description: 'Maximum speed 8 km/h',
    category: 'prohibition',
    coordinates: [3.2100, 43.3450], // Canal du Midi
  },
  // ── Obligation signs (B-series in CEVNI) ──
  {
    id: 'sign-005',
    code: 'B.1',
    name: 'Keep starboard side',
    description: 'Vessels must pass on the starboard (right) side',
    category: 'obligation',
    coordinates: [1.9052, 49.0014], // Seine — Meulan
  },
  {
    id: 'sign-006',
    code: 'B.2',
    name: 'Keep port side',
    description: 'Vessels must pass on the port (left) side',
    category: 'obligation',
    coordinates: [5.5922, 47.4478], // Saône — Gray
  },
  {
    id: 'sign-007',
    code: 'B.4',
    name: 'Sound horn',
    description: 'Sound horn before proceeding',
    category: 'obligation',
    coordinates: [5.0419, 47.3136], // Canal de Bourgogne
  },
  // ── Warning signs (C/D-series in CEVNI) ──
  {
    id: 'sign-008',
    code: 'C.1',
    name: 'General hazard',
    description: 'Danger ahead — proceed with caution',
    category: 'warning',
    coordinates: [5.7955, 46.0417], // Rhône — Génissiat
  },
  {
    id: 'sign-009',
    code: 'C.4',
    name: 'Shallow water',
    description: 'Shallow water ahead — minimum depth 1.2 m',
    category: 'warning',
    coordinates: [2.6274, 47.6797], // Loire — Gien
  },
  {
    id: 'sign-010',
    code: 'C.5',
    name: 'Low bridge',
    description: 'Restricted overhead clearance — 3.5 m maximum',
    category: 'warning',
    coordinates: [3.0417, 43.3258], // Canal du Midi — Capestang
  },
  // ── Information signs (E-series in CEVNI) ──
  {
    id: 'sign-011',
    code: 'E.1',
    name: 'Mooring permitted',
    description: 'Mooring on this bank is permitted',
    category: 'information',
    coordinates: [4.8556, 46.7797], // Saône — Chalon
  },
  {
    id: 'sign-012',
    code: 'E.4.1',
    name: 'Water point',
    description: 'Fresh water available for vessels',
    category: 'information',
    coordinates: [6.1756, 49.1194], // Moselle — Metz
  },
  {
    id: 'sign-013',
    code: 'E.5',
    name: 'Fuel station',
    description: 'Diesel and/or petrol available',
    category: 'information',
    coordinates: [-0.0456, 44.5603], // Garonne
  },
]
