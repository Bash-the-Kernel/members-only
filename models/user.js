module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      memberStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
      admin: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: 'users' // Explicit table name
      });
    return User;
  };