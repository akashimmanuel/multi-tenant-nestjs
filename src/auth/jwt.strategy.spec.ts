import { JwtStrategy } from './jwt.strategy';

// Mock passport-jwt and @nestjs/passport
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn().mockImplementation(() => {
    return class MockStrategy {
      constructor() {}
      authenticate() {}
    };
  }),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(() => 'token'),
  },
}));

// Mock the constants
jest.mock('./constants', () => ({
  jwtConstants: {
    secret: 'test-secret',
  },
}));

describe('JwtStrategy', () => {
  let validateMethod: (payload: any) => any;

  beforeEach(() => {
    // Extract just the validate method implementation without instantiating the class
    validateMethod = JwtStrategy.prototype.validate;
  });

  describe('validate', () => {
    it('should return user when valid payload is provided', async () => {
      const payload = { sub: 'user-123', email: 'test@example.com', role: 'admin' };
      
      const result = await validateMethod(payload);
      
      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        role: payload.role
      });
    });
  });
}); 