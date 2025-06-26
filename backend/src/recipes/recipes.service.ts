import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RECIPES_CONSTANTS } from './constants/recipes.constants';
import { RecipesLoggerService } from './services/recipes-logger.service';
import { ValidationService } from './services/validation.service';
import {
  FindAllOptions,
  Recipe,
  RecipeWhereCondition,
} from './interfaces/recipes.interfaces';

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,
    private recipesLogger: RecipesLoggerService,
    private validationService: ValidationService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, authorId: string) {
    try {
      this.validationService.validateUserId(authorId);
      this.validationService.validateTitle(createRecipeDto.title);
      this.validationService.validateDescription(createRecipeDto.description);
      this.validationService.validateIngredients(createRecipeDto.ingredients);
      this.validationService.validateCookingTime(createRecipeDto.cookingTime);

      const recipe = await this.prisma.recipe.create({
        data: {
          ...createRecipeDto,
          authorId,
        },
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      });

      this.recipesLogger.logRecipeCreation(
        {
          recipeId: recipe.id,
          userId: authorId,
          title: recipe.title,
          cookingTime: recipe.cookingTime,
          ingredientsCount: recipe.ingredients.length,
        },
        true,
      );

      return recipe;
    } catch (error) {
      this.recipesLogger.logRecipeCreation(
        {
          userId: authorId,
          title: createRecipeDto.title,
          cookingTime: createRecipeDto.cookingTime,
          ingredientsCount: createRecipeDto.ingredients?.length,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.CREATE_FAILED,
      );
    }
  }

  async findAll(options: FindAllOptions = {}) {
    const {
      page = RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_PAGE,
      limit = RECIPES_CONSTANTS.VALIDATION.PAGINATION.DEFAULT_LIMIT,
      search,
      maxCookingTime,
      minIngredients,
    } = options;

    try {
      const skip = (page - 1) * limit;
      const where: RecipeWhereCondition = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { ingredients: { hasSome: [search] } },
        ];
      }
      if (maxCookingTime) {
        where.cookingTime = { lte: maxCookingTime };
      }

      let total = 0;
      let recipes: Recipe[] = [];

      if (minIngredients) {
        const allMatchingRecipes = await this.prisma.recipe.findMany({
          where,
          select: { id: true, ingredients: true },
        });
        const filteredIds = allMatchingRecipes
          .filter((r) => r.ingredients.length >= minIngredients)
          .map((r) => r.id);
        total = filteredIds.length;
        const pageIds = filteredIds.slice(skip, skip + limit);
        recipes = await this.prisma.recipe.findMany({
          where: { ...where, id: { in: pageIds } },
          include: {
            author: { select: { id: true, username: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        const [foundRecipes, foundTotal] = await this.prisma.$transaction([
          this.prisma.recipe.findMany({
            where,
            skip,
            take: limit,
            include: {
              author: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.recipe.count({ where }),
        ]);
        recipes = foundRecipes;
        total = foundTotal;
      }

      this.recipesLogger.logRecipesFetch(
        {
          searchTerm: search,
          page,
          limit,
          totalRecipes: total,
        },
        true,
      );

      return {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: total === 0 ? 0 : Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.recipesLogger.logRecipesFetch(
        {
          searchTerm: search,
          page,
          limit,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.FETCH_FAILED,
      );
    }
  }

  async findOne(id: string) {
    try {
      this.validationService.validateRecipeId(id);

      const recipe = await this.prisma.recipe.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      });

      if (!recipe) {
        this.recipesLogger.logRecipeFetch(
          { recipeId: id },
          false,
          'Recipe not found',
        );
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }

      this.recipesLogger.logRecipeFetch(
        {
          recipeId: id,
          title: recipe.title,
        },
        true,
      );

      return recipe;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.recipesLogger.logRecipeFetch(
        { recipeId: id },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.FETCH_ONE_FAILED,
      );
    }
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, authorId: string) {
    try {
      this.validationService.validateRecipeId(id);
      this.validationService.validateUserId(authorId);

      const recipe = await this.findOne(id);

      if (recipe.authorId !== authorId) {
        this.recipesLogger.logAuthorizationCheck(
          'update',
          authorId,
          recipe.authorId,
          false,
        );
        throw new ForbiddenException(
          RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UPDATE_FORBIDDEN,
        );
      }

      this.recipesLogger.logAuthorizationCheck(
        'update',
        authorId,
        recipe.authorId,
        true,
      );

      // Validate update data if provided
      if (updateRecipeDto.title) {
        this.validationService.validateTitle(updateRecipeDto.title);
      }
      if (updateRecipeDto.description) {
        this.validationService.validateDescription(updateRecipeDto.description);
      }
      if (updateRecipeDto.ingredients) {
        this.validationService.validateIngredients(updateRecipeDto.ingredients);
      }
      if (updateRecipeDto.cookingTime) {
        this.validationService.validateCookingTime(updateRecipeDto.cookingTime);
      }

      const updatedRecipe = await this.prisma.recipe.update({
        where: { id },
        data: updateRecipeDto,
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      });

      this.recipesLogger.logRecipeUpdate(
        {
          recipeId: id,
          userId: authorId,
          title: updatedRecipe.title,
        },
        true,
      );

      return updatedRecipe;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.recipesLogger.logRecipeUpdate(
        {
          recipeId: id,
          userId: authorId,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.UPDATE_FAILED,
      );
    }
  }

  async remove(id: string, authorId: string) {
    try {
      this.validationService.validateRecipeId(id);
      this.validationService.validateUserId(authorId);

      const recipe = await this.findOne(id);

      if (recipe.authorId !== authorId) {
        this.recipesLogger.logAuthorizationCheck(
          'delete',
          authorId,
          recipe.authorId,
          false,
        );
        throw new ForbiddenException(
          RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.DELETE_FORBIDDEN,
        );
      }

      this.recipesLogger.logAuthorizationCheck(
        'delete',
        authorId,
        recipe.authorId,
        true,
      );

      await this.prisma.recipe.delete({
        where: { id },
      });

      this.recipesLogger.logRecipeDeletion(
        {
          recipeId: id,
          userId: authorId,
          title: recipe.title,
        },
        true,
      );

      return { message: RECIPES_CONSTANTS.MESSAGES.SUCCESS.DELETED };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.recipesLogger.logRecipeDeletion(
        {
          recipeId: id,
          userId: authorId,
        },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.DELETE_FAILED,
      );
    }
  }

  async toggleLike(recipeId: string, userId: string) {
    try {
      this.validationService.validateRecipeId(recipeId);
      this.validationService.validateUserId(userId);

      // Check if recipe exists
      const recipe = await this.prisma.recipe.findUnique({
        where: { id: recipeId },
      });

      if (!recipe) {
        this.recipesLogger.logLikeToggle(
          { recipeId, userId },
          false,
          'Recipe not found',
        );
        throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
      }

      // Check if user already liked the recipe
      const existingLike = await this.prisma.userLikedRecipe.findUnique({
        where: {
          recipeId_userId: {
            recipeId,
            userId,
          },
        },
      });

      if (existingLike) {
        // Unlike the recipe
        await this.prisma.$transaction([
          this.prisma.userLikedRecipe.delete({
            where: {
              recipeId_userId: {
                recipeId,
                userId,
              },
            },
          }),
          this.prisma.recipe.update({
            where: { id: recipeId },
            data: {
              likesCount: {
                decrement: 1,
              },
            },
          }),
        ]);

        this.recipesLogger.logLikeToggle(
          { recipeId, userId, liked: false },
          true,
        );

        // Return the updated recipe
        return await this.findOne(recipeId);
      } else {
        // Like the recipe
        await this.prisma.$transaction([
          this.prisma.userLikedRecipe.create({
            data: {
              recipeId,
              userId,
            },
          }),
          this.prisma.recipe.update({
            where: { id: recipeId },
            data: {
              likesCount: {
                increment: 1,
              },
            },
          }),
        ]);

        this.recipesLogger.logLikeToggle(
          { recipeId, userId, liked: true },
          true,
        );

        // Return the updated recipe
        return await this.findOne(recipeId);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.recipesLogger.logLikeToggle(
        { recipeId, userId },
        false,
        error instanceof Error ? error.message : 'Unknown error',
      );

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        RECIPES_CONSTANTS.MESSAGES.DATABASE.LIKE_TOGGLE_FAILED,
      );
    }
  }
}
