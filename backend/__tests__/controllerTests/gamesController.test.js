const {
  getAllGames,
  startNewGame,
  joinGame,
  deleteAllGames,
} = require("../controllers/gamesController");
const { Game, Session } = require("../db/models");
const {
  checkAndUpdateCurrentSession,
  createSession,
} = require("../controllers/session");

jest.mock("../db/models");
jest.mock("../controllers/session");

describe("Games Controller - Input/Output", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAllGames", () => {
    it("should return all games", async () => {
      const games = [
        { id: 1, type: "pvc" },
        { id: 2, type: "pvp" },
      ];
      Game.findAll.mockResolvedValue(games);

      await getAllGames(mockReq, mockRes);

      expect(Game.findAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ games });
    });

    it("should return 404 if no games found", async () => {
      Game.findAll.mockResolvedValue(null);

      try {
        await getAllGames(mockReq, mockRes);
      } catch (err) {
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe("Could not retrieve games.");
      }
    });
  });

  describe("startNewGame", () => {
    it("should create a new game with valid input", async () => {
      mockReq = {
        body: {
          type: "pvc",
          orientation: "white",
          playerWhiteTimeRemaining: 600,
          playerBlackTimeRemaining: 600,
          timeIncrement: 10,
          sessionUsername: "player1",
          difficulty: "easy",
        },
      };

      const session = { id: 1 };
      checkAndUpdateCurrentSession.mockResolvedValue(session);

      Game.create.mockResolvedValue({ id: 1, type: "pvc" });

      await startNewGame(mockReq, mockRes);

      expect(checkAndUpdateCurrentSession).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        "player1"
      );
      expect(Game.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "pvc",
          playerWhiteSession: 1,
          playerWhiteTimeRemaining: 600,
          playerBlackTimeRemaining: 600,
          difficulty: "easy",
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        game: { id: 1, type: "pvc" },
      });
    });

    it("should return 500 if game creation fails", async () => {
      mockReq = {
        body: {
          type: "pvc",
          orientation: "white",
          playerWhiteTimeRemaining: 600,
          playerBlackTimeRemaining: 600,
          timeIncrement: 10,
          sessionUsername: "player1",
          difficulty: "easy",
        },
      };

      checkAndUpdateCurrentSession.mockResolvedValue({ id: 1 });
      Game.create.mockResolvedValue(null); // Simulate failure

      try {
        await startNewGame(mockReq, mockRes);
      } catch (err) {
        expect(err.statusCode).toBe(500);
        expect(err.message).toBe("error creating new game.");
      }
    });
  });

  describe("joinGame", () => {
    it("should join an existing game", async () => {
      mockReq = {
        body: {
          gameId: 1,
          orientation: "white",
        },
      };

      const mockSession = { id: 1 };
      const mockGame = {
        id: 1,
        playerWhiteSession: null,
        playerBlackSession: null,
        save: jest.fn(),
      };

      Game.findByPk.mockResolvedValue(mockGame);
      createSession.mockResolvedValue(mockSession);

      await joinGame(mockReq, mockRes);

      expect(Game.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(mockGame.playerWhiteSession).toBe(1); // Player joined as white
      expect(mockGame.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        game: mockGame,
        session: mockSession,
      });
    });

    it("should return 404 if game not found", async () => {
      mockReq = {
        body: {
          gameId: 999,
          orientation: "white",
        },
      };

      Game.findByPk.mockResolvedValue(null);

      try {
        await joinGame(mockReq, mockRes);
      } catch (err) {
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe("error in finding game with ID: 999");
      }
    });
  });

  describe("deleteAllGames", () => {
    it("should delete all games", async () => {
      Game.destroy.mockResolvedValue(1); // Simulate successful deletion

      await deleteAllGames(mockReq, mockRes);

      expect(Game.destroy).toHaveBeenCalledWith({ where: {} });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "all games deleted successfully.",
      });
    });
  });
});
