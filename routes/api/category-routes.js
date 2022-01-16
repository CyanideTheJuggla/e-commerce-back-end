const router = require('express').Router();
const { Category, Product } = require('../../models');
const { categorySeed } = require('../../seeds/category-seeds')
// The `/api/categories` endpoint

async function processCategories(thisCat) {
  const catObj = {
    category: { id: thisCat.id, name: thisCat.category_name },
    productsInCategory: []
  };
  
  const products = await Product.findAll({where: {category_id: thisCat.id}});
  for (let j = 0; j < products.length; j++) {
    const product = products[j].dataValues;
    catObj.productsInCategory.push(product);
  }
  return catObj;
}

router.get('/', (req, res) => {
  // find all categories
  //console.log('req:', req);
  const retVals = [];
  Category.findAll()
  .then(async categories => {
    if(categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        const thisCat = categories[i].dataValues;
        const val = await processCategories(thisCat);
        retVals.push(val);
      }
    }
  })
  .finally(() => {
    console.clear();
    console.log(retVals[0]);
    res.status(200).json(retVals);
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
  // be sure to include its associated Products
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const retVals = [];
  Category.findAll({where: {id: req.params.id}})
  .then(async categories => {
    if(categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        const thisCat = categories[i].dataValues;
        const val = await processCategories(thisCat);
        retVals.push(val);
      }
    }
  })
  .finally(() => {
    console.clear();
    console.log(retVals[0]);
    res.status(200).json(retVals[0]);
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body).then((category)=>{
    console.clear();
    console.log(category);
    res.status(200).json(category);
  }).catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  const retObj = {};
  Category.update(req.body, {where: {id: req.params.id}})
  .then(rowsUpdated => {
    retObj["rowsUpdated"] = rowsUpdated;
    console.clear();
    console.log(retObj);
    res.status(200).json(retObj);
  })
  .catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  const retObj = {
    productsUncategorized: 0,
    categoriesDestroyed: 0
  };
  // instead of deleting products in this category, we have another category names "uncategorized"
  // uncategorize products before deleting category
  Product.update({category_id: 1}, {where: {category_id: req.params.id}})
  .then(productsUpdated => {
    retObj.categoriesDestroyed += productsUpdated[0];
    Category.destroy({where: {id: req.params.id}})
    .then(categoriesDestroyed => {
      retObj.categoriesDestroyed = categoriesDestroyed;
      console.clear();
      console.log(retObj);
      res.status(200).json(retObj);
    })
  })
  .catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  })
});

module.exports = router;
