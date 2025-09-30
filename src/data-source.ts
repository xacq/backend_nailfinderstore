import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';

const currentFile = (() => {
  if (typeof __filename === 'string' && __filename.length > 0) {
    return __filename;
  }

  if (typeof module !== 'undefined' && module?.filename) {
    return module.filename;
  }

  try {
    const importMetaUrl = eval('import.meta.url');
    if (typeof importMetaUrl === 'string' && importMetaUrl.length > 0) {
      return fileURLToPath(importMetaUrl);
    }
  } catch {
    // import.meta is not directly accessible in this environment
  }

  const stack = new Error().stack;
  if (typeof stack === 'string') {
    for (const line of stack.split('\n')) {
      const match = line.match(/(?:\(|\s)(file:\/\/[\S]+|\/[\S]+):\d+:\d+/);
      if (match?.[1]) {
        const potentialPath = match[1];
        return potentialPath.startsWith('file://')
          ? fileURLToPath(potentialPath)
          : potentialPath;
      }
    }
  }

  throw new Error('Unable to determine the current module path.');
})();
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
  migrations: [rootDir + '/migrations/*.' + fileExtension],
  synchronize: false,
  migrationsRun: false,
});

export default AppDataSource;
export { AppDataSource };
