const seedCategories = require('./category-seeds');
const seedProducts = require('./product-seeds');
const seedTags = require('./tag-seeds');
const seedProductTags = require('./product-tag-seeds');

const sequelize = require('../config/connection');
const { Category } = require('../models');

const seedAll = async () => {
  try {
    await sequelize.sync({ force: true });
    await seedCategories();  
    await seedProducts();
    await seedTags();
    await seedProductTags();
  } catch (err) { 
    console.log('err', err); 
    process.exit(1);
  } 
  console.log('end of scripts');
};

seedAll();
setTimeout(() => {
  console.clear();
  console.log('~ ecommerce_db has been seeded. ~');
  process.exit(0);
}, 500);
