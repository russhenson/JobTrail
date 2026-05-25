import { MOTIVATIONS, getRandomMotivation } from '../src/constants';

describe('getRandomMotivation', () => {
    it('should return a non-empty string', () => {
        const result = getRandomMotivation();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return a value from the MOTIVATIONS array', () => {
        const result = getRandomMotivation();
        expect(MOTIVATIONS).toContain(result);
    });

    it('should not always return the same value (randomness check)', () => {
        const results = new Set(Array.from({ length: 20 }, () => getRandomMotivation()));
        expect(results.size).toBeGreaterThan(1);
    });

    // edge case
    it('should never return undefined or null', () => {
        for (let i = 0; i < 50; i++) {
            const result = getRandomMotivation();
            expect(result).toBeDefined();
            expect(result).not.toBeNull();
        }
    });

    it('MOTIVATIONS array should have no empty strings', () => {
        MOTIVATIONS.forEach(m => {
            expect(m.trim().length).toBeGreaterThan(0);
        });
    });

    it('MOTIVATIONS array should have no duplicates', () => {
        const unique = new Set(MOTIVATIONS);
        expect(unique.size).toBe(MOTIVATIONS.length);
    });
});
