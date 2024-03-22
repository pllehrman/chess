// models/user.js
module.exports = (sequelize, DataTypes) => {
    const TournamentMembership = sequelize.define('TournamentMembership', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          tournamentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Tournaments',
              key: 'id'
            }
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'id'
            }
          }
        }, {
            timestamps: true
        });
  
  return TournamentMembership;
};