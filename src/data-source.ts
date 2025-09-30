import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';

const isTsEnv = currentFile.endsWith('.ts');
const rootDir = isTsEnv ? 'src' : 'dist';
const fileExtension = isTsEnv ? 'ts' : 'js';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [rootDir + '/**/*.entity.' + fileExtension],
  migrations: [rootDir + '/**/migrations/*.' + fileExtension],
  synchronize: false,
  migrationsRun: false,
});

export default AppDataSource;
export { AppDataSource };
