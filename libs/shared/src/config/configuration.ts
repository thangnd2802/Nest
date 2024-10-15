import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

const YAML_CONFIG_FILENAME = 'libs/shared/src/config/config.yaml';

export default () => {
  const config = yaml.load(
    readFileSync(path.join(process.cwd(), YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;

  const enviroment = path.resolve(
    process.cwd(),
    process.env.NODE_ENV || 'development',
  );

  const defaultConfig = config['default'] || {};
  const envConfig = config[enviroment] || {};
  return {
    ...defaultConfig,
    ...envConfig,
  };
};
