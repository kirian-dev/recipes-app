import { PrismaClient } from '@prisma/client';
import { Recipe } from '../src/recipes/interfaces/recipes.interfaces';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Mock data for realistic recipes
const recipeTemplates = [
  // Italian Cuisine
  {
    title: 'Spaghetti Carbonara',
    description:
      'Classic Italian pasta with eggs, cheese, and pancetta. A simple yet delicious Roman dish.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large egg yolks',
      '50g Pecorino Romano cheese',
      '50g Parmigiano-Reggiano',
      'Black pepper',
      'Salt',
    ],
    cookingTime: 20,
  },
  {
    title: 'Margherita Pizza',
    description:
      'Traditional Neapolitan pizza with tomato sauce, mozzarella, and fresh basil.',
    ingredients: [
      '300g pizza dough',
      '200g San Marzano tomatoes',
      '200g fresh mozzarella',
      'Fresh basil leaves',
      'Extra virgin olive oil',
      'Salt',
    ],
    cookingTime: 25,
  },
  {
    title: 'Risotto alla Milanese',
    description:
      'Creamy saffron risotto from Milan, a luxurious and comforting dish.',
    ingredients: [
      '320g Arborio rice',
      '1L chicken stock',
      '1g saffron threads',
      '50g butter',
      '50g Parmigiano-Reggiano',
      '1 onion',
      'White wine',
      'Salt and pepper',
    ],
    cookingTime: 30,
  },

  // French Cuisine
  {
    title: 'Coq au Vin',
    description:
      'Classic French braised chicken in red wine with mushrooms and pearl onions.',
    ingredients: [
      '1 whole chicken, cut into pieces',
      '750ml red wine',
      '200g pearl onions',
      '300g mushrooms',
      '200g bacon lardons',
      '4 garlic cloves',
      'Fresh thyme',
      'Bay leaves',
      'Butter',
      'Flour',
    ],
    cookingTime: 90,
  },
  {
    title: 'Beef Bourguignon',
    description:
      'Rich French beef stew with red wine, mushrooms, and pearl onions.',
    ingredients: [
      '1kg beef chuck',
      '750ml red wine',
      '200g pearl onions',
      '300g mushrooms',
      '200g bacon',
      '4 carrots',
      '4 garlic cloves',
      'Fresh thyme',
      'Bay leaves',
      'Butter',
      'Flour',
    ],
    cookingTime: 120,
  },
  {
    title: 'Ratatouille',
    description:
      'Provençal vegetable stew with eggplant, zucchini, tomatoes, and bell peppers.',
    ingredients: [
      '2 eggplants',
      '3 zucchinis',
      '4 tomatoes',
      '2 bell peppers',
      '2 onions',
      '4 garlic cloves',
      'Fresh thyme',
      'Fresh basil',
      'Olive oil',
      'Salt and pepper',
    ],
    cookingTime: 60,
  },

  // Asian Cuisine
  {
    title: 'Pad Thai',
    description:
      'Classic Thai stir-fried rice noodles with eggs, tofu, and peanuts.',
    ingredients: [
      '200g rice noodles',
      '2 eggs',
      '150g tofu',
      '100g bean sprouts',
      '50g peanuts',
      '2 tbsp tamarind paste',
      '2 tbsp fish sauce',
      '2 tbsp palm sugar',
      '2 garlic cloves',
      '2 green onions',
      'Lime wedges',
    ],
    cookingTime: 25,
  },
  {
    title: 'Chicken Tikka Masala',
    description:
      'Creamy Indian curry with tender chicken in a spiced tomato sauce.',
    ingredients: [
      '500g chicken breast',
      '400ml coconut milk',
      '400g canned tomatoes',
      '2 onions',
      '4 garlic cloves',
      '2 tbsp ginger',
      '2 tbsp garam masala',
      '1 tbsp turmeric',
      '1 tbsp cumin',
      'Fresh cilantro',
      'Basmati rice',
    ],
    cookingTime: 45,
  },
  {
    title: 'Sushi Roll California',
    description: 'Classic California roll with crab, avocado, and cucumber.',
    ingredients: [
      '2 cups sushi rice',
      'Nori sheets',
      '200g imitation crab',
      '1 avocado',
      '1 cucumber',
      'Sesame seeds',
      'Rice vinegar',
      'Sugar',
      'Salt',
    ],
    cookingTime: 40,
  },

  // Mexican Cuisine
  {
    title: 'Chicken Enchiladas',
    description:
      'Tortillas filled with chicken and cheese, topped with enchilada sauce.',
    ingredients: [
      '8 corn tortillas',
      '400g chicken breast',
      '200g cheese',
      '400g enchilada sauce',
      '1 onion',
      '2 garlic cloves',
      'Sour cream',
      'Fresh cilantro',
    ],
    cookingTime: 50,
  },
  {
    title: 'Guacamole',
    description: 'Fresh avocado dip with lime, cilantro, and spices.',
    ingredients: [
      '4 ripe avocados',
      '1 lime',
      '1 onion',
      '2 tomatoes',
      'Fresh cilantro',
      '1 jalapeño',
      'Salt and pepper',
    ],
    cookingTime: 10,
  },
  {
    title: 'Beef Tacos',
    description: 'Seasoned ground beef in corn tortillas with fresh toppings.',
    ingredients: [
      '500g ground beef',
      '12 corn tortillas',
      '1 onion',
      '2 garlic cloves',
      '2 tbsp taco seasoning',
      'Lettuce',
      'Tomatoes',
      'Cheese',
      'Sour cream',
    ],
    cookingTime: 30,
  },

  // American Cuisine
  {
    title: 'Classic Burger',
    description: 'Juicy beef burger with lettuce, tomato, and special sauce.',
    ingredients: [
      '400g ground beef',
      '4 burger buns',
      'Lettuce',
      'Tomatoes',
      'Onion',
      'Cheese slices',
      'Ketchup',
      'Mustard',
      'Mayonnaise',
    ],
    cookingTime: 20,
  },
  {
    title: 'Mac and Cheese',
    description: 'Creamy macaroni and cheese with a crispy breadcrumb topping.',
    ingredients: [
      '400g macaroni',
      '300g cheddar cheese',
      '100g breadcrumbs',
      '50g butter',
      '50g flour',
      '500ml milk',
      'Salt and pepper',
    ],
    cookingTime: 35,
  },
  {
    title: 'Chicken Wings',
    description: 'Crispy fried chicken wings with buffalo sauce.',
    ingredients: [
      '1kg chicken wings',
      '100g hot sauce',
      '50g butter',
      'Flour',
      'Salt and pepper',
      'Celery sticks',
      'Blue cheese dip',
    ],
    cookingTime: 45,
  },

  // Mediterranean Cuisine
  {
    title: 'Greek Salad',
    description:
      'Fresh Mediterranean salad with feta cheese, olives, and vegetables.',
    ingredients: [
      '2 cucumbers',
      '4 tomatoes',
      '1 red onion',
      '200g feta cheese',
      '100g Kalamata olives',
      'Extra virgin olive oil',
      'Red wine vinegar',
      'Dried oregano',
      'Salt and pepper',
    ],
    cookingTime: 15,
  },
  {
    title: 'Hummus',
    description: 'Creamy chickpea dip with tahini, lemon, and garlic.',
    ingredients: [
      '400g canned chickpeas',
      '3 tbsp tahini',
      '2 lemons',
      '3 garlic cloves',
      'Extra virgin olive oil',
      'Cumin',
      'Salt and pepper',
    ],
    cookingTime: 15,
  },
  {
    title: 'Falafel',
    description: 'Crispy chickpea fritters with herbs and spices.',
    ingredients: [
      '400g canned chickpeas',
      '1 onion',
      '4 garlic cloves',
      'Fresh parsley',
      'Fresh cilantro',
      '2 tbsp flour',
      'Cumin',
      'Coriander',
      'Salt and pepper',
    ],
    cookingTime: 30,
  },

  // Japanese Cuisine
  {
    title: 'Miso Soup',
    description:
      'Traditional Japanese soup with miso paste, tofu, and seaweed.',
    ingredients: [
      '4 cups dashi stock',
      '3 tbsp miso paste',
      '200g tofu',
      '2 green onions',
      'Wakame seaweed',
    ],
    cookingTime: 20,
  },
  {
    title: 'Teriyaki Chicken',
    description: 'Grilled chicken glazed with sweet teriyaki sauce.',
    ingredients: [
      '500g chicken breast',
      '1/2 cup soy sauce',
      '1/4 cup mirin',
      '2 tbsp sugar',
      '2 tbsp sake',
      '1 tbsp ginger',
      '2 garlic cloves',
      'Sesame seeds',
    ],
    cookingTime: 35,
  },
  {
    title: 'Tempura Vegetables',
    description: 'Light and crispy battered vegetables.',
    ingredients: [
      'Assorted vegetables (carrots, broccoli, sweet potato)',
      '1 cup flour',
      '1 egg',
      '1 cup ice water',
      'Vegetable oil',
      'Salt',
    ],
    cookingTime: 25,
  },

  // Indian Cuisine
  {
    title: 'Butter Chicken',
    description:
      'Creamy Indian curry with tender chicken in a rich tomato sauce.',
    ingredients: [
      '500g chicken breast',
      '400ml heavy cream',
      '400g canned tomatoes',
      '2 onions',
      '4 garlic cloves',
      '2 tbsp ginger',
      '2 tbsp garam masala',
      '1 tbsp turmeric',
      'Butter',
      'Basmati rice',
    ],
    cookingTime: 50,
  },
  {
    title: 'Naan Bread',
    description: 'Soft and fluffy Indian flatbread.',
    ingredients: [
      '3 cups all-purpose flour',
      '1 cup warm water',
      '2 tbsp yeast',
      '2 tbsp sugar',
      '1/4 cup yogurt',
      '2 tbsp oil',
      'Salt',
    ],
    cookingTime: 40,
  },
  {
    title: 'Dal Makhani',
    description: 'Creamy black lentils with spices and butter.',
    ingredients: [
      '200g black lentils',
      '100g kidney beans',
      '2 onions',
      '4 garlic cloves',
      '2 tbsp ginger',
      '2 tbsp garam masala',
      '1 tbsp turmeric',
      'Butter',
      'Heavy cream',
    ],
    cookingTime: 90,
  },

  // Thai Cuisine
  {
    title: 'Green Curry',
    description: 'Spicy Thai curry with coconut milk and vegetables.',
    ingredients: [
      '400ml coconut milk',
      '2 tbsp green curry paste',
      '500g chicken breast',
      '2 eggplants',
      '2 bell peppers',
      'Bamboo shoots',
      'Thai basil',
      'Fish sauce',
      'Palm sugar',
    ],
    cookingTime: 40,
  },
  {
    title: 'Tom Yum Soup',
    description: 'Hot and sour Thai soup with shrimp and mushrooms.',
    ingredients: [
      '500g shrimp',
      '200g mushrooms',
      '4 cups chicken stock',
      '2 lemongrass stalks',
      '4 kaffir lime leaves',
      '2 tbsp fish sauce',
      '2 tbsp lime juice',
      'Thai chili peppers',
      'Fresh cilantro',
    ],
    cookingTime: 30,
  },
  {
    title: 'Mango Sticky Rice',
    description: 'Sweet Thai dessert with sticky rice and fresh mango.',
    ingredients: [
      '1 cup sticky rice',
      '2 ripe mangoes',
      '1 cup coconut milk',
      '1/2 cup sugar',
      '1/4 tsp salt',
      'Sesame seeds',
    ],
    cookingTime: 45,
  },

  // Korean Cuisine
  {
    title: 'Bibimbap',
    description: 'Korean rice bowl with vegetables, egg, and gochujang sauce.',
    ingredients: [
      '2 cups rice',
      'Spinach',
      'Carrots',
      'Bean sprouts',
      'Cucumber',
      '2 eggs',
      'Gochujang sauce',
      'Sesame oil',
      'Sesame seeds',
    ],
    cookingTime: 35,
  },
  {
    title: 'Kimchi Fried Rice',
    description: 'Spicy fried rice with kimchi and vegetables.',
    ingredients: [
      '3 cups cooked rice',
      '200g kimchi',
      '2 eggs',
      '2 green onions',
      '2 tbsp gochujang',
      'Sesame oil',
      'Sesame seeds',
    ],
    cookingTime: 20,
  },
  {
    title: 'Bulgogi',
    description: 'Korean marinated beef with soy sauce and sesame oil.',
    ingredients: [
      '500g beef sirloin',
      '1/4 cup soy sauce',
      '2 tbsp sesame oil',
      '2 tbsp sugar',
      '2 garlic cloves',
      '1 onion',
      'Sesame seeds',
      'Green onions',
    ],
    cookingTime: 30,
  },

  // Middle Eastern Cuisine
  {
    title: 'Shawarma',
    description: 'Marinated chicken wrapped in pita bread with tahini sauce.',
    ingredients: [
      '500g chicken breast',
      '4 pita breads',
      '2 tbsp shawarma seasoning',
      'Tahini sauce',
      'Pickles',
      'Tomatoes',
      'Onion',
      'Parsley',
    ],
    cookingTime: 40,
  },
  {
    title: 'Baba Ganoush',
    description: 'Smoky eggplant dip with tahini and lemon.',
    ingredients: [
      '2 large eggplants',
      '3 tbsp tahini',
      '2 lemons',
      '3 garlic cloves',
      'Extra virgin olive oil',
      'Parsley',
      'Salt and pepper',
    ],
    cookingTime: 45,
  },
  {
    title: 'Tabbouleh',
    description: 'Fresh parsley salad with bulgur wheat and vegetables.',
    ingredients: [
      '1 cup bulgur wheat',
      '2 bunches parsley',
      '4 tomatoes',
      '1 cucumber',
      '1 onion',
      '2 lemons',
      'Extra virgin olive oil',
      'Salt and pepper',
    ],
    cookingTime: 25,
  },

  // Vietnamese Cuisine
  {
    title: 'Pho',
    description: 'Vietnamese beef noodle soup with herbs and spices.',
    ingredients: [
      '500g beef bones',
      '200g beef sirloin',
      '200g rice noodles',
      'Bean sprouts',
      'Thai basil',
      'Cilantro',
      'Lime wedges',
      'Fish sauce',
      'Star anise',
      'Cinnamon',
    ],
    cookingTime: 180,
  },
  {
    title: 'Banh Mi',
    description:
      'Vietnamese sandwich with pork, pickled vegetables, and herbs.',
    ingredients: [
      '4 baguettes',
      '400g pork belly',
      'Pickled carrots',
      'Pickled daikon',
      'Cucumber',
      'Cilantro',
      'Mayonnaise',
      'Soy sauce',
    ],
    cookingTime: 60,
  },
  {
    title: 'Spring Rolls',
    description: 'Fresh Vietnamese spring rolls with shrimp and vegetables.',
    ingredients: [
      'Rice paper wrappers',
      '200g shrimp',
      'Rice vermicelli',
      'Lettuce',
      'Cucumber',
      'Carrots',
      'Mint',
      'Cilantro',
      'Peanut sauce',
    ],
    cookingTime: 30,
  },

  // Spanish Cuisine
  {
    title: 'Paella',
    description: 'Spanish rice dish with seafood, chicken, and saffron.',
    ingredients: [
      '2 cups Bomba rice',
      '500g mixed seafood',
      '200g chicken',
      '1L chicken stock',
      '1g saffron',
      '1 onion',
      '2 garlic cloves',
      'Bell peppers',
      'Peas',
      'Lemon wedges',
    ],
    cookingTime: 45,
  },
  {
    title: 'Gazpacho',
    description: 'Cold Spanish tomato soup with vegetables.',
    ingredients: [
      '1kg ripe tomatoes',
      '1 cucumber',
      '1 red bell pepper',
      '1 onion',
      '2 garlic cloves',
      '2 tbsp olive oil',
      '2 tbsp red wine vinegar',
      'Bread',
      'Salt and pepper',
    ],
    cookingTime: 20,
  },
  {
    title: 'Tortilla Española',
    description: 'Spanish potato and egg omelette.',
    ingredients: [
      '6 eggs',
      '4 potatoes',
      '1 onion',
      'Olive oil',
      'Salt and pepper',
    ],
    cookingTime: 40,
  },

  // German Cuisine
  {
    title: 'Schnitzel',
    description: 'Breaded and fried veal cutlet with lemon.',
    ingredients: [
      '4 veal cutlets',
      '2 eggs',
      '1 cup breadcrumbs',
      '1 cup flour',
      'Lemon wedges',
      'Parsley',
      'Butter',
      'Salt and pepper',
    ],
    cookingTime: 25,
  },
  {
    title: 'Sauerkraut',
    description: 'Fermented cabbage with caraway seeds.',
    ingredients: [
      '1 head cabbage',
      '2 tbsp salt',
      '1 tbsp caraway seeds',
      'Juniper berries',
      'Bay leaves',
    ],
    cookingTime: 1440, // 24 hours fermentation
  },
  {
    title: 'Bratwurst',
    description: 'German sausage with mustard and sauerkraut.',
    ingredients: [
      '4 bratwurst sausages',
      '4 hot dog buns',
      'Mustard',
      'Sauerkraut',
      'Onions',
    ],
    cookingTime: 20,
  },

  // Russian Cuisine
  {
    title: 'Borscht',
    description: 'Beetroot soup with vegetables and sour cream.',
    ingredients: [
      '500g beets',
      '300g beef',
      '2 potatoes',
      '1 onion',
      '2 carrots',
      'Cabbage',
      'Sour cream',
      'Dill',
      'Garlic',
    ],
    cookingTime: 90,
  },
  {
    title: 'Pelmeni',
    description: 'Russian dumplings filled with meat.',
    ingredients: [
      '2 cups flour',
      '1 egg',
      '1/2 cup water',
      '300g ground beef',
      '1 onion',
      'Sour cream',
      'Butter',
      'Salt and pepper',
    ],
    cookingTime: 60,
  },
  {
    title: 'Olivier Salad',
    description: 'Russian potato salad with vegetables and mayonnaise.',
    ingredients: [
      '4 potatoes',
      '4 eggs',
      '200g ham',
      '1 cucumber',
      '1 onion',
      'Peas',
      'Mayonnaise',
      'Dill',
      'Salt and pepper',
    ],
    cookingTime: 30,
  },

  // Brazilian Cuisine
  {
    title: 'Feijoada',
    description: 'Brazilian black bean stew with pork.',
    ingredients: [
      '500g black beans',
      '500g pork shoulder',
      '200g bacon',
      '200g sausage',
      '2 onions',
      '4 garlic cloves',
      'Bay leaves',
      'Rice',
      'Orange slices',
    ],
    cookingTime: 180,
  },
  {
    title: 'Pão de Queijo',
    description: 'Brazilian cheese bread made with tapioca flour.',
    ingredients: [
      '2 cups tapioca flour',
      '1 cup milk',
      '1/2 cup oil',
      '2 eggs',
      '200g cheese',
      'Salt',
    ],
    cookingTime: 35,
  },
  {
    title: 'Moqueca',
    description: 'Brazilian fish stew with coconut milk and palm oil.',
    ingredients: [
      '500g white fish',
      '400ml coconut milk',
      '2 onions',
      '2 tomatoes',
      '2 bell peppers',
      'Palm oil',
      'Cilantro',
      'Lime',
    ],
    cookingTime: 40,
  },

  // Moroccan Cuisine
  {
    title: 'Tagine',
    description: 'Moroccan stew with meat, vegetables, and dried fruits.',
    ingredients: [
      '500g lamb',
      '2 onions',
      '2 carrots',
      'Dried apricots',
      'Dried prunes',
      'Honey',
      'Cinnamon',
      'Cumin',
      'Coriander',
      'Saffron',
    ],
    cookingTime: 120,
  },
  {
    title: 'Couscous',
    description: 'Steamed semolina with vegetables and spices.',
    ingredients: [
      '2 cups couscous',
      '2 cups vegetable stock',
      '2 carrots',
      '2 zucchinis',
      'Chickpeas',
      'Raisins',
      'Almonds',
      'Cinnamon',
      'Cumin',
    ],
    cookingTime: 30,
  },
  {
    title: 'Harira',
    description: 'Moroccan soup with lentils, chickpeas, and tomatoes.',
    ingredients: [
      '200g lentils',
      '200g chickpeas',
      '400g tomatoes',
      '1 onion',
      '2 celery stalks',
      'Cilantro',
      'Parsley',
      'Cinnamon',
      'Turmeric',
    ],
    cookingTime: 90,
  },

  // Lebanese Cuisine
  {
    title: 'Kibbeh',
    description: 'Lebanese meatballs with bulgur wheat and pine nuts.',
    ingredients: [
      '300g ground lamb',
      '1 cup bulgur wheat',
      '1 onion',
      'Pine nuts',
      'Cinnamon',
      'Allspice',
      'Parsley',
      'Mint',
    ],
    cookingTime: 45,
  },
  {
    title: 'Fattoush',
    description: 'Lebanese bread salad with vegetables and sumac.',
    ingredients: [
      'Pita bread',
      'Lettuce',
      'Tomatoes',
      'Cucumber',
      'Radishes',
      'Mint',
      'Parsley',
      'Sumac',
      'Lemon juice',
      'Olive oil',
    ],
    cookingTime: 20,
  },
  {
    title: 'Mujadara',
    description: 'Lebanese rice and lentils with caramelized onions.',
    ingredients: [
      '1 cup rice',
      '1 cup lentils',
      '2 onions',
      'Cumin',
      'Cinnamon',
      'Olive oil',
      'Salt and pepper',
    ],
    cookingTime: 50,
  },

  // Turkish Cuisine
  {
    title: 'Kebab',
    description: 'Turkish grilled meat with vegetables and yogurt sauce.',
    ingredients: [
      '500g lamb',
      '4 pita breads',
      '2 onions',
      '2 tomatoes',
      'Yogurt sauce',
      'Sumac',
      'Parsley',
      'Lemon',
    ],
    cookingTime: 35,
  },
  {
    title: 'Baklava',
    description: 'Turkish pastry with layers of phyllo dough and nuts.',
    ingredients: [
      'Phyllo dough',
      '300g pistachios',
      '200g butter',
      '2 cups sugar',
      '1 cup water',
      'Lemon juice',
      'Rose water',
    ],
    cookingTime: 60,
  },
  {
    title: 'Lentil Soup',
    description: 'Turkish red lentil soup with spices.',
    ingredients: [
      '200g red lentils',
      '1 onion',
      '2 carrots',
      '2 garlic cloves',
      'Cumin',
      'Paprika',
      'Lemon',
      'Parsley',
    ],
    cookingTime: 40,
  },

  // Greek Cuisine
  {
    title: 'Moussaka',
    description:
      'Greek layered eggplant dish with ground meat and béchamel sauce.',
    ingredients: [
      '2 eggplants',
      '500g ground lamb',
      '2 onions',
      '4 tomatoes',
      'Cinnamon',
      'Nutmeg',
      'Béchamel sauce',
      'Parmesan cheese',
    ],
    cookingTime: 90,
  },
  {
    title: 'Spanakopita',
    description: 'Greek spinach and feta pie with phyllo dough.',
    ingredients: [
      'Phyllo dough',
      '500g spinach',
      '200g feta cheese',
      '1 onion',
      '4 eggs',
      'Dill',
      'Parsley',
      'Butter',
    ],
    cookingTime: 50,
  },
  {
    title: 'Souvlaki',
    description: 'Greek grilled meat skewers with tzatziki sauce.',
    ingredients: [
      '500g pork',
      '4 pita breads',
      'Tzatziki sauce',
      'Tomatoes',
      'Onion',
      'Oregano',
      'Lemon',
    ],
    cookingTime: 30,
  },

  // Portuguese Cuisine
  {
    title: 'Bacalhau à Brás',
    description: 'Portuguese codfish with potatoes and eggs.',
    ingredients: [
      '400g salted cod',
      '4 potatoes',
      '4 eggs',
      '1 onion',
      '4 garlic cloves',
      'Parsley',
      'Olive oil',
      'Black olives',
    ],
    cookingTime: 45,
  },
  {
    title: 'Caldo Verde',
    description: 'Portuguese kale soup with potatoes and chorizo.',
    ingredients: [
      '4 potatoes',
      '1 bunch kale',
      '200g chorizo',
      '1 onion',
      '2 garlic cloves',
      'Olive oil',
      'Salt and pepper',
    ],
    cookingTime: 60,
  },
  {
    title: 'Pastéis de Nata',
    description: 'Portuguese custard tarts with flaky pastry.',
    ingredients: [
      'Puff pastry',
      '6 egg yolks',
      '1 cup milk',
      '1/2 cup sugar',
      '2 tbsp flour',
      'Vanilla extract',
      'Cinnamon',
    ],
    cookingTime: 40,
  },
];

async function main() {
  console.log('Starting database seeding...');

  // Check if data already exists
  const existingUser = await prisma.user.findFirst();
  const existingRecipes = await prisma.recipe.findFirst();

  if (existingUser && existingRecipes) {
    console.log('✅ Database already has data, skipping seed');
    return;
  }

  // Clear the database only if we need to seed
  if (!existingUser) {
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleaned for fresh seeding');
  }

  // Create a test user if it doesn't exist
  let user = existingUser;
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'chef_maria',
        passwordHash: crypto
          .createHash('sha256')
          .update('password123' + 'salt1')
          .digest('hex'),
        salt: 'salt1',
      },
    });
    console.log('User created:', user.username);
  } else {
    console.log('Using existing user:', user.username);
  }

  // Create recipes from templates if they don't exist
  if (!existingRecipes) {
    const recipes: Recipe[] = [];
    for (const template of recipeTemplates) {
      const recipe = (await prisma.recipe.create({
        data: {
          title: template.title,
          description: template.description,
          ingredients: template.ingredients,
          cookingTime: template.cookingTime,
          authorId: user.id,
        },
      })) as Recipe;
      recipes.push(recipe);
    }

    console.log('Recipes created:', recipes.length);
  } else {
    const recipeCount = await prisma.recipe.count();
    console.log('Using existing recipes:', recipeCount);
  }

  console.log('✅ Database seeding completed!');
  console.log('\n📋 Summary:');
  console.log(`- User: ${user.username}`);
  const recipeCount = await prisma.recipe.count();
  console.log(`- Recipes: ${recipeCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
