/**
 * Category helpers — colors, icons, and labels for scheme categories
 */
export const categoryColors = {
  Education:   { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  Agriculture: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  Business:    { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  Health:      { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  Housing:     { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  Women:       { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  'SC/ST':     { bg: '#f0fdf4', text: '#14532d', border: '#86efac' },
  General:     { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
};

export const categoryIcons = {
  Education:   '🎓',
  Agriculture: '🌾',
  Business:    '💼',
  Health:      '❤️',
  Housing:     '🏠',
  Women:       '👩',
  'SC/ST':     '🌿',
  General:     '📋',
};

export const userTypeIcons = {
  Student:          '🎓',
  Farmer:           '🌾',
  'Business Owner': '💼',
  'General Citizen':'👤',
};

export function getCategoryStyle(category) {
  return categoryColors[category] || categoryColors.General;
}
