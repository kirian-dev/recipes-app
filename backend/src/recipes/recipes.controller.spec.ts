import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { RECIPES_CONSTANTS } from './constants/recipes.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedRequest } from './interfaces/recipes.interfaces';

describe('RecipesController', () => {
  let controller: RecipesController;

  const mockRecipesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleLike: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    signUp: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(),
  };

  const mockRequest: AuthenticatedRequest = {
    user: { sub: 'user-id', username: 'testuser' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a recipe', async () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
      };

      const expectedRecipe = {
        id: 'recipe-id',
        ...createRecipeDto,
        authorId: 'user-id',
        author: { id: 'user-id', username: 'testuser' },
        likesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRecipesService.create.mockResolvedValue(expectedRecipe);

      const result = await controller.create(createRecipeDto, mockRequest);

      expect(mockRecipesService.create).toHaveBeenCalledWith(
        createRecipeDto,
        'user-id',
      );
      expect(result).toEqual(expectedRecipe);
    });

    it('should throw error when user ID not found', async () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
      };

      const mockRequestWithoutUser: AuthenticatedRequest = {
        user: { sub: '', id: '' },
      };

      await expect(
        controller.create(createRecipeDto, mockRequestWithoutUser),
      ).rejects.toThrow(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND,
      );
    });

    it('should throw error when user object is missing', async () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
      };

      const mockRequestWithoutUser = {} as AuthenticatedRequest;

      await expect(
        controller.create(createRecipeDto, mockRequestWithoutUser),
      ).rejects.toThrow(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated recipes', async () => {
      const queryRecipeDto: QueryRecipeDto = {
        page: 1,
        limit: 10,
        search: 'chicken',
        maxCookingTime: 30,
        minIngredients: 2,
      };

      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'Chicken Recipe',
          description: 'Delicious chicken',
          ingredients: ['chicken', 'salt', 'pepper'],
          cookingTime: 25,
          likesCount: 5,
          authorId: 'user-1',
          author: { id: 'user-1', username: 'chef' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedResult = {
        recipes: mockRecipes,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      mockRecipesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(queryRecipeDto);

      expect(mockRecipesService.findAll).toHaveBeenCalledWith({
        page: queryRecipeDto.page,
        limit: queryRecipeDto.limit,
        search: queryRecipeDto.search,
        maxCookingTime: queryRecipeDto.maxCookingTime,
        minIngredients: queryRecipeDto.minIngredients,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle default parameters', async () => {
      const expectedResult = {
        recipes: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      };

      mockRecipesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({});

      expect(mockRecipesService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a recipe by ID', async () => {
      const recipeId = 'recipe-id';
      const expectedRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
        likesCount: 10,
        authorId: 'user-id',
        author: { id: 'user-id', username: 'testuser' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRecipesService.findOne.mockResolvedValue(expectedRecipe);

      const result = await controller.findOne(recipeId);

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(recipeId);
      expect(result).toEqual(expectedRecipe);
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      const recipeId = 'recipe-id';
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
        description: 'Updated description',
      };

      const expectedRecipe = {
        id: recipeId,
        ...updateRecipeDto,
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
        likesCount: 5,
        authorId: 'user-id',
        author: { id: 'user-id', username: 'testuser' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRecipesService.update.mockResolvedValue(expectedRecipe);

      const result = await controller.update(
        recipeId,
        updateRecipeDto,
        mockRequest,
      );

      expect(mockRecipesService.update).toHaveBeenCalledWith(
        recipeId,
        updateRecipeDto,
        'user-id',
      );
      expect(result).toEqual(expectedRecipe);
    });

    it('should throw error when user ID not found', async () => {
      const recipeId = 'recipe-id';
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
      };

      const mockRequestWithoutUser: AuthenticatedRequest = {
        user: { sub: '', id: '' },
      };

      await expect(
        controller.update(recipeId, updateRecipeDto, mockRequestWithoutUser),
      ).rejects.toThrow(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND,
      );
    });
  });

  describe('remove', () => {
    it('should remove a recipe', async () => {
      const recipeId = 'recipe-id';
      const expectedResult = {
        message: RECIPES_CONSTANTS.MESSAGES.SUCCESS.DELETED,
      };

      mockRecipesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(recipeId, mockRequest);

      expect(mockRecipesService.remove).toHaveBeenCalledWith(
        recipeId,
        'user-id',
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw error when user ID not found', async () => {
      const recipeId = 'recipe-id';
      const mockRequestWithoutUser: AuthenticatedRequest = {
        user: { sub: '', id: '' },
      };

      await expect(
        controller.remove(recipeId, mockRequestWithoutUser),
      ).rejects.toThrow(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND,
      );
    });
  });

  describe('toggleLike', () => {
    it('should like a recipe and return full recipe', async () => {
      const recipeId = 'recipe-id';
      const expectedRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: ['ingredient1', 'ingredient2'],
        cookingTime: 30,
        likesCount: 6,
        authorId: 'user-id',
        author: { id: 'user-id', username: 'testuser' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRecipesService.toggleLike.mockResolvedValue(expectedRecipe);

      const result = await controller.toggleLike(recipeId, mockRequest);

      expect(mockRecipesService.toggleLike).toHaveBeenCalledWith(
        recipeId,
        'user-id',
      );
      expect(result).toEqual(expectedRecipe);
    });

    it('should throw error when user ID not found', async () => {
      const recipeId = 'recipe-id';
      const mockRequestWithoutUser: AuthenticatedRequest = {
        user: { sub: '', id: '' },
      };

      await expect(
        controller.toggleLike(recipeId, mockRequestWithoutUser),
      ).rejects.toThrow(
        RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND,
      );
    });
  });
});
