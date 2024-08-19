module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 'Users' refers to table name
        key: 'id'
      },
      validate: {
        isInt: {
          msg: 'UserId must be an integer.'
        }
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true
  })

  Session.associate = function (models) {
    Session.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
  }

  return Session
}
