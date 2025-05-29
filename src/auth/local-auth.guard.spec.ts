import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './local-auth.guard';

// Mock the @nestjs/passport AuthGuard
jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: jest.fn(() => {
      return class {
        canActivate() {
          return true;
        }
      };
    }),
  };
});

describe('LocalAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when executed', () => {
      // Create a properly mocked execution context
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
      
      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
}); 