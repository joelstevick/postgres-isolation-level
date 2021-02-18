const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

function getEntities() {
  let entities = ['dist/**/*.entity.js'];

  switch (process.env.NODE_ENV) {
    case 'test':
    case 'e2e':
      entities = ['./src/**/*.entity.ts'];
      break;
  }

  return entities;
}

// for more information about e2e issues, see: https://stackoverflow.com/questions/59919546/problem-with-e2e-testing-with-nestjs-testingmodule-graphql-code-first-and-typeo
module.exports = [
  {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: getEntities(),
    synchronize: true,
    migrations: ['migrations/*.js'],
    cli: {
      migrationsDir: 'migrations',
    },
  },
];
