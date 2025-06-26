import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RECIPES_CONSTANTS } from './constants/recipes.constants';
import { AuthenticatedRequest } from './interfaces/recipes.interfaces';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({
    status: 201,
    description: 'Recipe successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UNAUTHORIZED,
  })
  async create(
    @Body() createRecipeDto: CreateRecipeDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const authorId = req.user?.sub || req.user?.id;
    if (!authorId) {
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND);
    }
    return this.recipesService.create(createRecipeDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated and filtered list of recipes' })
  @ApiResponse({
    status: 200,
    description: 'List of recipes with pagination',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error in query parameters',
  })
  async findAll(@Query() queryDto: QueryRecipeDto) {
    return this.recipesService.findAll({
      page: queryDto.page,
      limit: queryDto.limit,
      search: queryDto.search,
      maxCookingTime: queryDto.maxCookingTime,
      minIngredients: queryDto.minIngredients,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific recipe by ID' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe found',
  })
  @ApiResponse({
    status: 400,
    description: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_RECIPE_ID,
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  async findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UNAUTHORIZED,
  })
  @ApiResponse({
    status: 403,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UPDATE_FORBIDDEN,
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const authorId = req.user?.sub || req.user?.id;
    if (!authorId) {
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND);
    }
    return this.recipesService.update(id, updateRecipeDto, authorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 204,
    description: 'Recipe successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_RECIPE_ID,
  })
  @ApiResponse({
    status: 401,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UNAUTHORIZED,
  })
  @ApiResponse({
    status: 403,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.DELETE_FORBIDDEN,
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const authorId = req.user?.sub || req.user?.id;
    if (!authorId) {
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND);
    }
    return this.recipesService.remove(id, authorId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like/unlike a recipe' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe with updated like status',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        ingredients: { type: 'array', items: { type: 'string' } },
        cookingTime: { type: 'number' },
        likesCount: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        authorId: { type: 'string' },
        author: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: RECIPES_CONSTANTS.MESSAGES.VALIDATION.INVALID_RECIPE_ID,
  })
  @ApiResponse({
    status: 401,
    description: RECIPES_CONSTANTS.MESSAGES.AUTHORIZATION.UNAUTHORIZED,
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  async toggleLike(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      throw new Error(RECIPES_CONSTANTS.MESSAGES.VALIDATION.USER_ID_NOT_FOUND);
    }
    return this.recipesService.toggleLike(id, userId);
  }
}
