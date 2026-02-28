import type { Lock } from '@/types'

/** 20 real French locks across major waterways, used as fallback data */
export const MOCK_LOCKS: Lock[] = [
  // Seine — Paris to Rouen axis
  {
    id: 'mock-lock-001',
    name: 'Écluse de Bougival',
    coordinates: [2.1357, 48.8664],
    lockRef: 'SN-01',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-002',
    name: 'Écluse de Meulan',
    coordinates: [1.9052, 49.0014],
    lockRef: 'SN-02',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-003',
    name: 'Écluse de Notre-Dame-de-la-Garenne',
    coordinates: [1.6621, 49.1031],
    lockRef: 'SN-03',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-004',
    name: 'Écluse des Mureaux',
    coordinates: [1.9187, 48.9951],
    lockRef: 'SN-04',
    operator: 'VNF',
  },
  // Canal du Midi
  {
    id: 'mock-lock-005',
    name: 'Écluse de Fonserannes',
    coordinates: [3.2056, 43.3492],
    lockRef: 'CM-01',
    operator: 'VNF',
    openingHours: 'Mo-Su 09:00-19:00',
  },
  {
    id: 'mock-lock-006',
    name: 'Écluse de Béziers',
    coordinates: [3.2167, 43.3478],
    lockRef: 'CM-02',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-007',
    name: 'Écluse de Capestang',
    coordinates: [3.0417, 43.3258],
    lockRef: 'CM-03',
    operator: 'VNF',
  },
  // Rhône
  {
    id: 'mock-lock-008',
    name: 'Écluse de Génissiat',
    coordinates: [5.7955, 46.0417],
    lockRef: 'RH-01',
    operator: 'CNR',
  },
  {
    id: 'mock-lock-009',
    name: 'Écluse de Cusset',
    coordinates: [4.8755, 45.7715],
    lockRef: 'RH-02',
    operator: 'CNR',
  },
  {
    id: 'mock-lock-010',
    name: 'Écluse de Vaugris',
    coordinates: [4.8528, 45.5208],
    lockRef: 'RH-03',
    operator: 'CNR',
  },
  // Canal de Bourgogne
  {
    id: 'mock-lock-011',
    name: 'Écluse de Dijon',
    coordinates: [5.0419, 47.3136],
    lockRef: 'CB-01',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-012',
    name: 'Écluse de Thorey',
    coordinates: [5.1028, 47.2347],
    lockRef: 'CB-02',
    operator: 'VNF',
  },
  // Loire
  {
    id: 'mock-lock-013',
    name: 'Écluse de Gien',
    coordinates: [2.6274, 47.6797],
    lockRef: 'LO-01',
    operator: 'VNF',
  },
  // Canal du Nivernais
  {
    id: 'mock-lock-014',
    name: 'Écluse de Cercy-la-Tour',
    coordinates: [3.6410, 46.8647],
    lockRef: 'CN-01',
    operator: 'VNF',
  },
  // Moselle
  {
    id: 'mock-lock-015',
    name: 'Écluse de Metz',
    coordinates: [6.1756, 49.1194],
    lockRef: 'MO-01',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-016',
    name: 'Écluse de Toul',
    coordinates: [5.8933, 48.6747],
    lockRef: 'MO-02',
    operator: 'VNF',
  },
  // Garonne / Canal latéral
  {
    id: 'mock-lock-017',
    name: 'Écluse de Castets-en-Dorthe',
    coordinates: [-0.0456, 44.5603],
    lockRef: 'GA-01',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-018',
    name: 'Écluse de Meilhan-sur-Garonne',
    coordinates: [-0.0947, 44.4717],
    lockRef: 'GA-02',
    operator: 'VNF',
  },
  // Saône
  {
    id: 'mock-lock-019',
    name: 'Écluse de Gray',
    coordinates: [5.5922, 47.4478],
    lockRef: 'SA-01',
    operator: 'VNF',
  },
  {
    id: 'mock-lock-020',
    name: 'Écluse de Chalon-sur-Saône',
    coordinates: [4.8556, 46.7797],
    lockRef: 'SA-02',
    operator: 'VNF',
  },
]
