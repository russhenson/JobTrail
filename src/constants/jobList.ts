export const STATUS_CHIPS = [
    { label: 'Saved', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
    { label: 'Applied', bg: '#F0FDF9', border: '#A7F3D0', text: '#065F46' },
    { label: 'Follow Up', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    { label: 'Interview', bg: '#F5F3FF', border: '#DDD6FE', text: '#4C1D95' },
    { label: 'Offer', bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D' },
    { label: 'Hired', bg: '#ECFDF5', border: '#A7F3D0', text: '#166534' },
    { label: 'Rejected', bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
];

export const DATE_FILTERS = [
    { label: 'All' },
    { label: 'Last 3 days' },
    { label: 'This week' },
    { label: 'This month' },
];

export const MOTIVATIONS = [
    'In this economy? Respect for even trying. 🫡',
    'Tired of spamming applications? Same. Keep going.',
    'Your dream job ghosted you. Apply again anyway.',
    'Another day, another rejection to build character. 💀',
    'They said 3-5 years experience for an entry role. Apply anyway.',
    "LinkedIn said 847 people applied. You're number 848. Let's go.",
    "The hiring manager hasn't even read your CV. But you're still here. 🤝",
    'Plot twist: the right job actually exists. Probably.',
    'Somewhere out there, a recruiter is about to open your email. Maybe.',
    'Your parents keep asking. Apply faster.',
    "Day 47 of being 'actively looking'. We don't talk about it.",
    "It's giving unemployed with ambition. We love to see it. 💅",
];

export const getRandomMotivation = () => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];

export const STATUS_COLORS = Object.fromEntries(
    STATUS_CHIPS.map(({ label, bg, border, text }) => [label, { bg, border, text }]),
);
