const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
async function processTags(thisTag) {
  const tagObj = {
    tag: {id: thisTag.id, name: thisTag.tag_name},
    productTags: [],
    productsWithTag: []
  };
  
  return ProductTag.findAll({where: {tag_id: thisTag.id}})
    .then(productTags => {
      for (let i = 0; i < productTags.length; i++) {
        const productTag = productTags[i].dataValues;
        tagObj.productTags.push(productTag);
      }
      return tagObj.productTags;
    })
    .then(async productTags => {
      for (let i = 0; i < productTags.length; i++) {
        const thisProductTag = productTags[i];
        const products = await Product.findAll({ where: { id: thisProductTag.product_id } });
        for (let j = 0; j < products.length; j++) {
          const product = products[j].dataValues;
          tagObj.productsWithTag.push(product);
        }
      }
      return tagObj;
    }); 
}

router.get('/', (req, res) => {
  // find all tags
  const retVals = [];
  Tag.findAll()
  .then(async tags => {
    if(tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const thisTag = tags[i].dataValues;
        const val = await processTags(thisTag);
        retVals.push(val);
      }
    }
  })
  .finally(() => {
    res.status(200).json(retVals);
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const retVals = [];
  Tag.findAll({where: {id: req.params.id}})
    .then(async tags => {
      if(tags.length > 0){
        for (let i = 0; i < tags.length; i++) {
          const thisTag = tags[i].dataValues;
          const val = await processTags(thisTag);
          retVals.push(val);
        }
      }
    })
    .finally(() => {
      res.status(200).json(retVals[0]);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});



router.post('/', (req, res) => {
  const retObj = {};
  Tag.create(req.body).then(tag => {
    retObj["tag"] = tag.dataValues;
    res.status(200).json(retObj);
  })
  .catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  const retObj = { tagsUpdated: 0};
  Tag.update(req.body, {where: {id: req.params.id}})
  .then(tagsUpdated => {
    retObj.tagsUpdated = tagsUpdated[0];
    res.status(200).json(retObj);
  })
  .catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  const retObj = { tagsDeleted: 0, productTagsDeleted: 0};
  ProductTag.destroy({where: {tag_id: req.params.id}})
  .then(productTagRows => {
    retObj.productTagsDeleted = productTagRows;
    Tag.destroy({where: {id: req.params.id}})
    .then(tagRows => {
      retObj.tagsDeleted = tagRows;
      res.status(200).json(retObj);
    });
  })
  .catch(err => {
    console.log(err);
    retObj["err"] = err;
    res.status(400).json(retObj);
  });
});

module.exports = router;
