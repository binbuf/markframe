import { describe, it, expect } from 'vitest';
import { resolveColor } from '../colorUtils';

describe('colorUtils', () => {
  describe('resolveColor', () => {
    it('resolves Tailwind gray colors', () => {
      expect(resolveColor('gray-100')).toBe('#f3f4f6');
      expect(resolveColor('gray-500')).toBe('#6b7280');
      expect(resolveColor('gray-900')).toBe('#111827');
    });

    it('resolves Tailwind blue colors', () => {
      expect(resolveColor('blue-100')).toBe('#dbeafe');
      expect(resolveColor('blue-500')).toBe('#3b82f6');
      expect(resolveColor('blue-600')).toBe('#2563eb');
    });

    it('resolves Tailwind green colors', () => {
      expect(resolveColor('green-100')).toBe('#dcfce7');
      expect(resolveColor('green-500')).toBe('#22c55e');
    });

    it('resolves named colors', () => {
      expect(resolveColor('white')).toBe('#ffffff');
      expect(resolveColor('black')).toBe('#000000');
      expect(resolveColor('transparent')).toBe('transparent');
    });

    it('passes through hex colors unchanged', () => {
      expect(resolveColor('#ff0000')).toBe('#ff0000');
      expect(resolveColor('#00ff00')).toBe('#00ff00');
      expect(resolveColor('#0000ff')).toBe('#0000ff');
    });

    it('passes through rgb colors unchanged', () => {
      expect(resolveColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(resolveColor('rgba(0, 255, 0, 0.5)')).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('passes through unknown color names unchanged', () => {
      expect(resolveColor('currentColor')).toBe('currentColor');
      expect(resolveColor('inherit')).toBe('inherit');
      expect(resolveColor('custom-color')).toBe('custom-color');
    });
  });
});
