const cron = require("node-cron");
const { Session, Game } = require("../db/models"); // Adjust the path to your models
const { Op } = require("sequelize");

console.log("Cronjob file loaded");

// Function to remove expired sessions and games
async function removeExpiredSessionsAndGames() {
  const currentTime = new Date();

  try {
    // Find all expired sessions
    const expiredSessions = await Session.findAll({
      where: {
        expiresAt: {
          [Op.lt]: currentTime, // Sessions that expired before the current time
        },
      },
    });

    const expiredSessionIds = expiredSessions.map((session) => session.id);
    // Remove games where both playerWhiteSession and playerBlackSession are expired
    await Game.destroy({
      where: {
        playerWhiteSession: {
          [Op.in]: expiredSessionIds,
        },
        playerBlackSession: {
          [Op.in]: expiredSessionIds,
        },
      },
    });

    // Remove expired sessions
    await Session.destroy({
      where: {
        id: {
          [Op.in]: expiredSessionIds,
        },
      },
    });

    console.log(
      `Removed ${expiredSessions.length} expired sessions and related games`
    );
  } catch (error) {
    console.error("Error while removing expired sessions and games:", error);
  }
}

cron.schedule("0 */4 * * *", () => {
  console.log("Running cron job to remove expired sessions and games...");
  removeExpiredSessionsAndGames();
});
