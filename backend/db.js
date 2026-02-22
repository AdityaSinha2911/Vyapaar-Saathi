const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    business_type: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    location: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, unique: true }, // Added for Phone OTP login
    googleId: { type: DataTypes.STRING, unique: true, allowNull: true }, // Added for Google OAuth
});

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
});

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'completed'), defaultValue: 'active' },
    completed_at: { type: DataTypes.DATE, allowNull: true },
});

const Record = sequelize.define('Record', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
});

// Relationships
User.hasMany(Sale, { foreignKey: 'user_id' });
Sale.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Record, { foreignKey: 'user_id' });
Record.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Sale, Task, Record };
