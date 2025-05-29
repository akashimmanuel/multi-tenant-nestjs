import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

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

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when executed', () => {
      // Create a properly mocked execution context
      const mockExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });
}); 