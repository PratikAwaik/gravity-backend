const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false,
        }
    }
});

const migratorConfig = {
    migrations: {
        glob: "migrations/*.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migratorConfig);

    const migrations = await migrator.up();
    console.log("Migrations up to date: ", {
        files: migrations.map(mig => mig.name)
    });
}

const rollbackMigration = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migratorConfig);
    // pass { to: 0 } as parameter to rollback all migrations at once. 
    await migrator.down({ to: 0 });
}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await runMigrations();
        console.log("Connected to Database");
    } catch (error) {
        console.log("Failed to connect to the database");
        console.error(error);
        process.exit(0);
    }
}

module.exports = { connectToDatabase, sequelize, rollbackMigration };