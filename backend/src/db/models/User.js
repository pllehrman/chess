module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'First name must be between 1 and 255 characters'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Last name must be between 1 and 255 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    hashed_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: true
  })

  User.associate = function (models) {
    // User has many sessions
    User.hasMany(models.Session, {
      foreignKey: 'userId',
      as: 'sessions'
    })
  }

  return User
}
