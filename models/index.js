'use strict';
import { pathToFileURL } from 'url';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { Sequelize, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// read config.json (synchronous to mirror original)
const configPath = path.resolve(__dirname, '../config/config.json');
const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// load model files (dynamic import)
const files = fs
    .readdirSync(__dirname)
    .filter(file =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1 &&
        file.indexOf('models.js') === -1
    );

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const imported = await import(fileUrl);
  const modelFactory = imported.default || imported;
  const model = modelFactory(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;