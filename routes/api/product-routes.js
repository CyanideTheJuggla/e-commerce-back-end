const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  const retObj = {};
  const productsRetVal = [];
  Product.findAll()
  .then(products => {
    products.forEach(product => {
      const productObj = product.dataValues;
      const thisProduct = {
        product_name: productObj.product_name,
        price: productObj.price,
        stock: productObj.stock,
        category_name: '',
        product_tags: []
      };
      Category.findAll({where: {id: product.dataValues.category_id}})
      .then(categories => {
        categories.forEach(category => {
          thisProduct.category_name = category.dataValues.category_name;
        });
      });
      ProductTag.findAll({where: {product_id: product.dataValues.id}})
      .then(productTags => {
        productTags.forEach(productTag => {
          Tag.findAll({where:{id: productTag.dataValues.tag_id}})
          .then(tags => {
            tags.forEach(tag => {
              thisProduct.product_tags.push(tag.dataValues.tag_name);
            });
            if (productTags.indexOf(productTag) == productTags.length - 1) {
              productsRetVal.push(thisProduct);
              if(products.indexOf(product) == products.length - 1){
                retObj["products"] = productsRetVal;
                console.clear();
                console.log(retObj);
                res.status(200).json(retObj);
              }
            }
          });
        });
      });
    });
  }).catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const retObj = {};
  Product.findAll({where: { id: req.params.id }})
  .then(product => {
    const productObj = product[0].dataValues;
    const thisProduct = {
      product_name: productObj.product_name,
      price: productObj.price,
      stock: productObj.stock,
      category_name: '',
      product_tags: []
    };
    Category.findAll({where: {id: productObj.category_id}})
    .then(categories => {
      categories.forEach(category => {
        thisProduct.category_name = category.dataValues.category_name;
      });
    });
    ProductTag.findAll({where: {product_id: productObj.id}})
    .then(productTags => {
      productTags.forEach(productTag => {
        Tag.findAll({where:{id: productTag.dataValues.tag_id}})
        .then(tags => {
          tags.forEach(tag => {
            thisProduct.product_tags.push(tag.dataValues.tag_name);
          });
          if (productTags.indexOf(productTag) == productTags.length - 1) {
            retObj["product"] = thisProduct;
            console.clear();
            console.log(retObj);
            res.status(200).json(retObj);
          }
        });
      });
    });
  })
  .catch((err) => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

// create new product
router.post('/', (req, res) => {
  const retObj = {
    product: {},
    productTags: []
  }
  Product.create(req.body)
  .then((product) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    retObj.product = product.dataValues;
    retObj.product.id = product.id;
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    console.clear();
    console.log(retObj);
    res.status(200).json(retObj);
  })
  .then((productTagIds) => {
    retObj.productTags = productTagIds;
    console.clear();
    console.log(retObj);
    res.status(200).json(retObj);
  })
  .catch((err) => {
    console.log('err', err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  const retObj = {
    products: {updated: 0, deleted: 0},
    productTags: {updated: 0, deleted: 0}
  }
  Product.update(req.body, { where: {id: req.params.id}})
  .then((product) => {
    // find all associated tags from ProductTag
    retObj.products.updated = product[0];
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then(async productTags => {
    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    return Promise.all([{
      deletedTags: await ProductTag.destroy({ where: { id: productTagsToRemove } }),
      createdTags: await ProductTag.bulkCreate(newProductTags, {returning: true})
    }]);
  })
  .then((updatedProductTags) => {
    retObj.productTags = {updated: updatedProductTags[0].createdTags, deleted: updatedProductTags[0].deletedTags}
    console.clear();
    console.log(retObj);
    res.status(200).json(retObj)
  })
  .catch((err) => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

router.delete('/:id', (req, res) => {
  ProductTag.destroy({where: {product_id: req.params.id}})
  .then(tagsDestroyed => {
    Product.destroy({where: {id: req.params.id}})
    .then(productsDestroyed => {
      productsDestroyed = {
        productsDestroyed: productsDestroyed,
        tagsDestroyed: tagsDestroyed, 
        message: "Products and Tags removed from Database."
      }
      console.clear();
      console.log(productsDestroyed);
      res.status(200).json(productsDestroyed);
    })
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
});

module.exports = router;
