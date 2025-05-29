import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

describe('Bootstrap', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // Create a minimal module with just the components we need to test
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
          cache: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    
    // Configure CORS like in main.ts
    const allowedOrigins = ['http://localhost:5173'];
    app.enableCors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-tenant-id', 'Authorization'],
      credentials: true,
    });
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should define the application', () => {
    expect(app).toBeDefined();
  });
}); 