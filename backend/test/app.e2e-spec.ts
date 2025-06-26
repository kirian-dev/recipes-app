import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Express } from 'express';
import {
  Recipe,
  RecipesResponse,
} from '../src/recipes/interfaces/recipes.interfaces';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: string;
  let testRecipeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        errorHttpStatusCode: 400,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    if (testRecipeId) {
      await prismaService.recipe.deleteMany({
        where: { id: testRecipeId },
      });
    }
    if (testUserId) {
      await prismaService.user.deleteMany({
        where: { id: testUserId },
      });
    }
    if (app) {
      await app.close();
    }
  });

  describe('Authentication', () => {
    describe('POST /auth/sign-up', () => {
      it('should register a new user successfully', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/sign-up')
          .send({
            username: 'testuser123',
            password: 'SecurePass456!',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('username', 'testuser123');
            expect(res.body).toHaveProperty('accessToken');
            testUserId = (res.body as AuthResponseDto).id as string;
            authToken = (res.body as AuthResponseDto).accessToken as string;
          });
      });

      it('should return 409 when username already exists', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/sign-up')
          .send({
            username: 'testuser123',
            password: 'SecurePass456!',
          })
          .expect(409);
      });

      it('should return 400 for invalid input', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/sign-up')
          .send({
            username: 'ab', // Too short
            password: '123', // Too short
          })
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should authenticate user and return JWT token', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/login')
          .send({
            username: 'testuser123',
            password: 'SecurePass456!',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('username', 'testuser123');
            authToken = (res.body as AuthResponseDto).accessToken as string;
          });
      });

      it('should return 422 for invalid credentials', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/login')
          .send({
            username: 'testuser123',
            password: 'wrongpassword',
          })
          .expect(422);
      });

      it('should return 400 for missing credentials', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/auth/login')
          .send({
            username: 'testuser123',
          })
          .expect(400);
      });
    });
  });

  describe('Recipes', () => {
    describe('POST /recipes', () => {
      it('should create a recipe when authenticated', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Recipe Title',
            description:
              'A delicious test recipe for testing purposes with more than 10 characters',
            ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
            cookingTime: 30,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('title', 'Test Recipe Title');
            expect(res.body).toHaveProperty('author');
            testRecipeId = (res.body as Recipe).id;
          });
      });

      it('should return 401 when not authenticated', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/recipes')
          .send({
            title: 'Test Recipe Title',
            description: 'A delicious test recipe with more than 10 characters',
            ingredients: ['ingredient1'],
            cookingTime: 30,
          })
          .expect(401);
      });

      it('should return 400 for invalid recipe data', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Te',
            description: 'Short',
            ingredients: [],
            cookingTime: 0,
          })
          .expect(400);
      });
    });

    describe('GET /recipes', () => {
      it('should return paginated recipes', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes')
          .expect(200)
          .expect((res) => {
            const response = res.body as RecipesResponse;
            expect(response).toHaveProperty('recipes');
            expect(response).toHaveProperty('pagination');
            expect(response.pagination).toHaveProperty('page');
            expect(response.pagination).toHaveProperty('limit');
            expect(response.pagination).toHaveProperty('total');
            expect(response.pagination).toHaveProperty('pages');
          });
      });

      it('should filter recipes by search term', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes?search=Test')
          .expect(200)
          .expect((res) => {
            const response = res.body as RecipesResponse;
            expect(response.recipes).toBeInstanceOf(Array);
            const testRecipe = response.recipes.find(
              (recipe: Recipe) => recipe.title === 'Test Recipe Title',
            );
            expect(testRecipe).toBeDefined();
          });
      });

      it('should filter recipes by cooking time', () => {
        return request(app.getHttpServer() as Express)
          .get('/recipes?maxCookingTime=30')
          .expect(200)
          .expect((res) => {
            const response = res.body as RecipesResponse;
            expect(response.recipes).toBeInstanceOf(Array);
            response.recipes.forEach((recipe: Recipe) => {
              expect(recipe.cookingTime).toBeLessThanOrEqual(30);
            });
          });
      });

      it('should filter recipes by minimum ingredients', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes?minIngredients=2')
          .expect(200)
          .expect((res) => {
            const response = res.body as RecipesResponse;
            expect(response.recipes).toBeInstanceOf(Array);
            response.recipes.forEach((recipe: Recipe) => {
              expect(recipe.ingredients.length).toBeGreaterThanOrEqual(2);
            });
          });
      });

      it('should handle pagination parameters', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes?page=1&limit=5')
          .expect(200)
          .expect((res) => {
            const response = res.body as RecipesResponse;
            expect(response.pagination.page).toBe(1);
            expect(response.pagination.limit).toBe(5);
            expect(response.recipes.length).toBeLessThanOrEqual(5);
          });
      });

      it('should return 400 for invalid query parameters', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes?page=0&limit=0')
          .expect(400);
      });
    });

    describe('GET /recipes/:id', () => {
      it('should return a specific recipe', () => {
        return request(app.getHttpServer() as Express)
          .get(`/api/recipes/${testRecipeId}`)
          .expect(200)
          .expect((res) => {
            const recipe = res.body as Recipe;
            expect(recipe).toHaveProperty('id', testRecipeId);
            expect(recipe).toHaveProperty('title', 'Test Recipe Title');
            expect(recipe).toHaveProperty('author');
          });
      });

      it('should return 404 for non-existent recipe', () => {
        return request(app.getHttpServer() as Express)
          .get('/api/recipes/non-existent-id')
          .expect(404);
      });
    });

    describe('POST /recipes/:id/like', () => {
      it('should like a recipe when authenticated', () => {
        return request(app.getHttpServer() as Express)
          .post(`/api/recipes/${testRecipeId}/like`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            const response = res.body as Recipe;
            expect(response).toHaveProperty('id', testRecipeId);
            expect(response).toHaveProperty('likesCount');
            expect(typeof response.likesCount).toBe('number');
          });
      });

      it('should unlike a recipe when already liked', () => {
        return request(app.getHttpServer() as Express)
          .post(`/api/recipes/${testRecipeId}/like`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            const response = res.body as Recipe;
            expect(response).toHaveProperty('id', testRecipeId);
            expect(response).toHaveProperty('likesCount');
            expect(typeof response.likesCount).toBe('number');
          });
      });

      it('should return 401 when not authenticated', () => {
        return request(app.getHttpServer() as Express)
          .post(`/api/recipes/${testRecipeId}/like`)
          .expect(401);
      });

      it('should return 404 for non-existent recipe', () => {
        return request(app.getHttpServer() as Express)
          .post('/api/recipes/non-existent-id/like')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', () => {
      return request(app.getHttpServer() as Express)
        .get('/non-existent-endpoint')
        .expect(404);
    });

    it('should handle malformed JSON', () => {
      return request(app.getHttpServer() as Express)
        .post('/api/auth/sign-up')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });
});
