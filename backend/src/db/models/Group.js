module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: {
                msg: 'Name cannot be empty'
              },
              len: {
                args: [1, 255],
                msg: 'Name must be between 1 and 255 characters'
              }
            }
          },
        iconUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
              isUrl: {
                msg: 'Icon URL must be a valid URL'
              }
            }
          }
        }, {
          timestamps: true
        });
  
  return Group;
};