module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages'
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User' // Alias to ensure proper association
    });
  };

  return Message;
};