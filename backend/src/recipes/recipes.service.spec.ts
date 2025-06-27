import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { RECIPES_CONSTANTS } from './constants/recipes.constants';
import { RecipesLoggerService } from './services/recipes-logger.service';
import { ValidationService } from './services/validation.service';

describe('RecipesService', () => {
  let service: RecipesService;

  const mockPrismaService = {
    recipe: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    userLikedRecipe: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockRecipesLoggerService = {
    logRecipeCreation: jest.fn(),
    logRecipesFetch: jest.fn(),
    logRecipeFetch: jest.fn(),
    logRecipeUpdate: jest.fn(),
    logRecipeDeletion: jest.fn(),
    logAuthorizationCheck: jest.fn(),
    logValidationError: jest.fn(),
    logLikeToggle: jest.fn(),
  };

  const mockValidationService = {
    validateUserId: jest.fn(),
    validateRecipeId: jest.fn(),
    validateTitle: jest.fn(),
    validateDescription: jest.fn(),
    validateIngredients: jest.fn(),
    validateCookingTime: jest.fn(),
    validatePaginationParams: jest.fn(),
    validateSearchParams: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RecipesLoggerService,
          useValue: mockRecipesLoggerService,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockValidationService.validateRecipeId.mockReset();
    mockValidationService.validateUserId.mockReset();
  });

  describe('create', () => {
    it('should create a recipe successfully', async () => {
      const createRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
      };
      const authorId = 'user-id';
      const expectedRecipe = {
        id: 'recipe-id',
        ...createRecipeDto,
        authorId,
        likesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: authorId, username: 'testuser' },
      };

      mockPrismaService.recipe.create.mockResolvedValue(expectedRecipe);

      const result = await service.create(createRecipeDto, authorId);

      expect(mockPrismaService.recipe.create).toHaveBeenCalledWith({
        data: { ...createRecipeDto, authorId },
        include: {
          author: { select: { id: true, username: true } },
        },
      });
      expect(result).toEqual(expectedRecipe);
    });

    it('should throw BadRequestException on creation failure', async () => {
      const createRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 30,
      };
      const authorId = 'user-id';

      mockPrismaService.recipe.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createRecipeDto, authorId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return recipes with pagination and filtering', async () => {
      const options = {
        page: 1,
        limit: 10,
        search: 'chicken',
        maxCookingTime: 30,
        minIngredients: 3,
      };

      const allMatchingRecipes = [
        { id: 'recipe-1', ingredients: ['a', 'b', 'c'] },
        { id: 'recipe-2', ingredients: ['a', 'b', 'c', 'd'] },
      ];
      mockPrismaService.recipe.findMany.mockResolvedValueOnce(allMatchingRecipes);

      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'Chicken Recipe',
          description: 'Delicious chicken',
          ingredients: ['a', 'b', 'c'],
          cookingTime: 25,
          likesCount: 5,
          authorId: 'user-1',
          author: { id: 'user-1', username: 'chef' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.recipe.findMany.mockResolvedValueOnce(mockRecipes);

      const result = await service.findAll(options);

      expect(result).toEqual({
        recipes: mockRecipes,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      });
    });

    it('should handle empty search and filters', async () => {
      const options = { page: 1, limit: 10 };
      const mockRecipes = [];
      const mockTotal = 0;

      mockPrismaService.$transaction.mockResolvedValue([mockRecipes, mockTotal]);

      const result = await service.findAll(options);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a recipe by ID', async () => {
      const recipeId = 'recipe-id';
      const mockRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
        likesCount: 5,
        authorId: 'user-1',
        author: { id: 'user-1', username: 'chef' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.findOne(recipeId);

      expect(mockPrismaService.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: recipeId },
        include: {
          author: { select: { id: true, username: true } },
        },
      });
      expect(result).toEqual(mockRecipe);
    });

    it('should throw NotFoundException for non-existent recipe', async () => {
      const recipeId = 'non-existent-id';

      mockPrismaService.recipe.findUnique.mockResolvedValue(null);

      await expect(service.findOne(recipeId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      mockValidationService.validateRecipeId.mockImplementation((id) => {
        if (!id || id === '') {
          throw new Error('Invalid recipe ID');
        }
      });

      await expect(service.findOne('')).rejects.toThrow(BadRequestException);
      await expect(service.findOne(undefined as unknown as string)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update recipe successfully', async () => {
      const recipeId = 'recipe-id';
      const authorId = 'user-id';
      const updateDto = { title: 'Updated Recipe' };
      const existingRecipe = {
        id: recipeId,
        authorId,
        title: 'Old Recipe',
        description: 'Old Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedRecipe = {
        id: recipeId,
        ...updateDto,
        description: 'Old Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        authorId,
        author: { id: authorId, username: 'chef' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(existingRecipe);
      mockPrismaService.recipe.update.mockResolvedValue(updatedRecipe);

      const result = await service.update(recipeId, updateDto, authorId);

      expect(mockPrismaService.recipe.update).toHaveBeenCalledWith({
        where: { id: recipeId },
        data: updateDto,
        include: {
          author: { select: { id: true, username: true } },
        },
      });
      expect(result).toEqual(updatedRecipe);
    });

    it('should throw ForbiddenException when updating another user recipe', async () => {
      const recipeId = 'recipe-id';
      const authorId = 'user-id';
      const differentAuthorId = 'different-user-id';
      const updateDto = { title: 'Updated Recipe' };
      const existingRecipe = {
        id: recipeId,
        authorId: differentAuthorId,
        title: 'Old Recipe',
        description: 'Old Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(existingRecipe);

      await expect(service.update(recipeId, updateDto, authorId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete recipe successfully', async () => {
      const recipeId = 'recipe-id';
      const authorId = 'user-id';
      const existingRecipe = {
        id: recipeId,
        authorId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(existingRecipe);
      mockPrismaService.recipe.delete.mockResolvedValue(existingRecipe);

      const result = await service.remove(recipeId, authorId);

      expect(mockPrismaService.recipe.delete).toHaveBeenCalledWith({
        where: { id: recipeId },
      });
      expect(result).toEqual({
        message: RECIPES_CONSTANTS.MESSAGES.SUCCESS.DELETED,
      });
    });

    it('should throw ForbiddenException when deleting another user recipe', async () => {
      const recipeId = 'recipe-id';
      const authorId = 'user-id';
      const differentAuthorId = 'different-user-id';
      const existingRecipe = {
        id: recipeId,
        authorId: differentAuthorId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(existingRecipe);

      await expect(service.remove(recipeId, authorId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleLike', () => {
    it('should like a recipe when not previously liked', async () => {
      const recipeId = 'recipe-id';
      const userId = 'user-id';

      const initialRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        authorId: 'author-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 4,
        authorId: 'author-id',
        author: { id: 'author-id', username: 'author' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValueOnce(initialRecipe).mockResolvedValueOnce(updatedRecipe);

      mockPrismaService.userLikedRecipe.findUnique.mockResolvedValue(null);

      mockPrismaService.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.toggleLike(recipeId, userId);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedRecipe);
    });

    it('should unlike a recipe when previously liked', async () => {
      const recipeId = 'recipe-id';
      const userId = 'user-id';

      const initialRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 4,
        authorId: 'author-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['ingredient1'],
        cookingTime: 25,
        likesCount: 3,
        authorId: 'author-id',
        author: { id: 'author-id', username: 'author' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.recipe.findUnique.mockResolvedValueOnce(initialRecipe).mockResolvedValueOnce(updatedRecipe);

      mockPrismaService.userLikedRecipe.findUnique.mockResolvedValue({
        userId,
        recipeId,
      });

      mockPrismaService.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.toggleLike(recipeId, userId);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedRecipe);
    });

    it('should throw BadRequestException for invalid IDs', async () => {
      mockValidationService.validateRecipeId.mockImplementation((id) => {
        if (!id || id === '') {
          throw new Error('Invalid recipe ID');
        }
      });
      mockValidationService.validateUserId.mockImplementation((id) => {
        if (!id || id === '') {
          throw new Error('Invalid user ID');
        }
      });

      await expect(service.toggleLike('', 'user-id')).rejects.toThrow(BadRequestException);
      await expect(service.toggleLike('recipe-id', '')).rejects.toThrow(BadRequestException);
    });
  });
});
