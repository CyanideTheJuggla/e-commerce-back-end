# E-commerce Back End

Back end for an e-commerce site useing [MySQL2](https://www.npmjs.com/package/mysql2) and [Sequelize](https://www.npmjs.com/package/sequelize) to interact with a MySQL database.
Sensitive data stored within a [dotenv](https://www.npmjs.com/package/dotenv) variable.

Use the `schema.sql` file in the `db` folder to create your database using MySQL shell commands.
Use npm run seed to seed the data. Ignore errors.

## User Story

```md
AS A manager at an internet retail company
I WANT a back end for my e-commerce website that uses the latest technologies
SO THAT my company can compete with other e-commerce companies
```

## Acceptance Criteria

```md
GIVEN a functional Express.js API
WHEN I add my database name, MySQL username, and MySQL password to an environment variable file
THEN I am able to connect to a database using Sequelize
WHEN I enter schema and seed commands
THEN a development database is created and is seeded with test data
WHEN I enter the command to invoke the application
THEN my server is started and the Sequelize models are synced to the MySQL database
WHEN I open API GET routes in Insomnia for categories, products, or tags
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete data in my database
```

### Models

- `Category`

  - `id`

    - Integer
    - Doesn't allow null values
    - Primary key
    - Uses auto increment

  - `category_name`
    - String
    - Doesn't allow null values

- `Product`

  - `id`

    - Integer
    - Doesn't allow null values
    - Primary key
    - Uses auto increment

  - `product_name`

    - String
    - Doesn't allow null values

  - `price`

    - Decimal
    - Doesn't allow null values
    - Validates that the value is a decimal

  - `stock`

    - Integer
    - Doesn't allow null values
    - Set a default value of 10
    - Validates that the value is numeric

  - `category_id`
    - Integer
    - Foreign Key:
    - - References the `category` model's `id`

- `Tag`

  - `id`

    - Integer
    - Doesn't allow null values
    - Primary key
    - Uses auto increment

  - `tag_name`
    - String

- `ProductTag`

  - `id`

    - Integer
    - Doesn't allow null values
    - Primary key
    - Uses auto increment

  - `product_id`

    - Integer
    - Foreign Key:
    - - References the `product` model's `id`

  - `tag_id`
    - Integer
    - Foreign Key:
    - - References the `tag` model's `id`

## Submission

You are required to submit BOTH of the following for review:

- A walkthrough video demonstrating the functionality of the application and all of the acceptance criteria being met.
  Video will be in the submission on the bootcamp site.
- The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.
  [e-commerce-back-end repository](https://github.com/CyanideTheJuggla/e-commerce-back-end)
