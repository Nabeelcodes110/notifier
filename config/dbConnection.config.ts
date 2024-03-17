export default () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    password: String(process.env.DATABASE_PASSWORD),
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
  });
