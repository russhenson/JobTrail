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
});
