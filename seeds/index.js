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
    //await sequelize.showAllSchemas();
  } catch (err) { 
    console.log('err', err); 
  } finally {
    console.log('end of scripts')
    //process.exit(0);
  }
};

seedAll();
