import { DataSource } from 'typeorm';
import { config } from './config/env-configuration';
import { Transaction } from './entity/transaction.entity';


export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.databaseName,
  synchronize: true,
  logging: false,
  entities: [Transaction], // Добавляем сюда нашу сущность
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
