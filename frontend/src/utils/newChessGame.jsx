import axios from 'axios';

// type (engine vs. pvp), playerWhite, playerWhiteTimeRemaining, playerBlack, playerBlackTimeRemaining
export async function startNewGame(type, playerWhite, playerBlack, timeControl) {
    try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
        type: type,
        playerWhite: playerWhite,
        playerWhiteTimeRemaining: timeControl, 
        playerBlack: playerBlack,
        playerBlackTimeRemaining: timeControl,
    });
    return response.data.game;
  } catch (error) {
    console.error('Error starting new game:', error);
    throw error;
  }
}
