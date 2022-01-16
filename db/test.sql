SHOW databases;
USE ecommerce_db;
SHOW tables;
DESCRIBE category;
SELECT * FROM category;
DESCRIBE product;
SELECT * FROM product;
DESCRIBE product_tag;
SELECT * FROM product_tag;
DESCRIBE tag;
SELECT * FROM tag;

SELECT 
(
    SELECT 
        COUNT(*) 
    FROM 
        category
) as categories,
 
(
    SELECT 
        COUNT(*) 
    FROM 
        product
) as products,
(
    SELECT 
        COUNT(*) 
    FROM 
        product_tag
) as product_tags, 
(
    SELECT 
        COUNT(*) 
    FROM 
        tag
) as tags
;
