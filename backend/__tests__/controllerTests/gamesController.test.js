const request = require('supertest');
const app = require('../../src/server'); // Import your Express app
const { Game } = require('../../src/db/models');



describe('Games Controller', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Game.destroy({ where: {} });
  });

  describe('GET /games', () => {
    it('should return all games', async () => {
      // Insert some games into the database
      const mockGames = await Promise.all([
        Game.create({
                "turn": 1, 
                "playerWhite": 1, 
                "playerWhiteTimeRemaining": 600, 
                "playerBlack": 2, 
                "playerBlackTimeRemaining": 600
            }
        ),
        Game.create({
                "turn": 3, 
                "playerWhite": 3, 
                "playerWhiteTimeRemaining": 600, 
                "playerBlack": 4, 
                "playerBlackTimeRemaining": 600
        })
      ]);

      const response = await request(app).get('/games');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map(game => game.turn)).toEqual([1, 3]);
    });
  });

  describe('POST /games', () => {
    it('should create a new game', async () => {
      const newGame = {
          "turn": 1, 
          "playerWhite": 1, 
          "playerWhiteTimeRemaining": 600, 
          "playerBlack": 2, 
          "playerBlackTimeRemaining": 600
      };

      const response = await request(app).post('/games').send({ gameDetails: newGame });

      expect(response.status).toBe(201);
      expect(response.body.game.turn).toEqual(newGame.turn);

      // Check that the game was inserted into the database
      const gameInDb = await Game.findByPk(response.body.game.id);
      expect(gameInDb).not.toBeNull();
      expect(gameInDb.turn).toEqual(newGame.turn);
    });
  });

  describe('DELETE /games', () => {
    it('should delete all games', async () => {
      // Insert a game into the database
      await Game.create({
        "turn": 1, 
        "playerWhite": 1, 
        "playerWhiteTimeRemaining": 600, 
        "playerBlack": 2, 
        "playerBlackTimeRemaining": 600
        });

      const response = await request(app).delete('/games');

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("All games deleted successfully.");

      // Check that the games were deleted from the database
      const gamesInDb = await Game.findAll();
      expect(gamesInDb).toHaveLength(0);
    });
  });

  describe('GET /games/:id', () => {
    it('should return a specific game', async () => {
      // Insert a game into the database
      const game = await Game.create({
        "turn": 1, 
        "playerWhite": 1, 
        "playerWhiteTimeRemaining": 600, 
        "playerBlack": 2, 
        "playerBlackTimeRemaining": 600
        });

      const response = await request(app).get(`/games/${game.id}`);

      expect(response.status).toBe(200);
      expect(response.body.turn).toEqual(game.turn);
    });

    it('should return a 404 if the game does not exist', async () => {
      const response = await request(app).get('/games/999');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /games/:id', () => {
    it('should delete a specific game', async () => {
      // Insert a game into the database
      const game = await Game.create({
        "turn": 1, 
        "playerWhite": 1, 
        "playerWhiteTimeRemaining": 600, 
        "playerBlack": 2, 
        "playerBlackTimeRemaining": 600
        });

      const response = await request(app).delete(`/games/${game.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual(`Game with ${game.id} ID successfully deleted`);

      // Check that the game was deleted from the database
      const gameInDb = await Game.findByPk(game.id);
      expect(gameInDb).toBeNull();
    });

    it('should return a 404 if the game does not exist', async () => {
      const response = await request(app).delete('/games/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /games/:id', () => {
    it('should update a specific game', async () => {
      // Insert a game into the database
      const game = await Game.create({
        "turn": 1, 
        "playerWhite": 1, 
        "playerWhiteTimeRemaining": 600, 
        "playerBlack": 2, 
        "playerBlackTimeRemaining": 600
        });
      const updatedGameDetails = { turn: 2};

      const response = await request(app).put(`/games/${game.id}`).send({ gameDetails: updatedGameDetails });

      expect(response.status).toBe(200);
      expect(response.body.turn).toEqual(updatedGameDetails.turn);

      // Check that the game was updated in the database
      const gameInDb = await Game.findByPk(game.id);
      expect(gameInDb.turn).toEqual(updatedGameDetails.turn);
    });

    it('should return a 404 if the game does not exist', async () => {
      const response = await request(app).put('/games/999').send({ gameDetails: { turn: 1 } });

      expect(response.status).toBe(404);
    });
  });
});

