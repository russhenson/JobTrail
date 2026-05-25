import dayjs from 'dayjs';

// pull out pure functions to test — no RN imports needed
const parseOrNow = (value: string): Date => {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : new Date();
};

const formatDisplay = (value: string, pickerMode: 'datetime' | 'date'): string => {
    const d = dayjs(value);
    if (!d.isValid()) return '';
    return pickerMode === 'date' ? d.format('DD MMM YYYY') : d.format('DD MMM YYYY, hh:mm A');
};

describe('parseOrNow', () => {
    it('should parse a valid ISO string', () => {
        const iso = '2025-01-20T10:00:00.000Z';
        const result = parseOrNow(iso);
        expect(result).toBeInstanceOf(Date);
        expect(dayjs(result).isValid()).toBe(true);
    });

    it('should return current date for invalid string', () => {
        const before = Date.now();
        const result = parseOrNow('not-a-date');
        const after = Date.now();
        expect(result.getTime()).toBeGreaterThanOrEqual(before);
        expect(result.getTime()).toBeLessThanOrEqual(after);
    });

    it('should return current date for empty string', () => {
        const before = Date.now();
        const result = parseOrNow('');
        const after = Date.now();
        expect(result.getTime()).toBeGreaterThanOrEqual(before);
        expect(result.getTime()).toBeLessThanOrEqual(after);
    });
});

describe('formatDisplay', () => {
    const iso = '2025-01-20T10:30:00.000Z';

    it('should format date-only correctly', () => {
        const result = formatDisplay(iso, 'date');
        expect(result).toMatch(/^\d{2} \w{3} \d{4}$/); // e.g. 20 Jan 2025
    });

    it('should format datetime correctly', () => {
        const result = formatDisplay(iso, 'datetime');
        expect(result).toMatch(/^\d{2} \w{3} \d{4}, \d{2}:\d{2} (AM|PM)$/);
    });

    it('should return empty string for invalid value', () => {
        expect(formatDisplay('', 'date')).toBe('');
        expect(formatDisplay('bad-date', 'datetime')).toBe('');
    });
});
