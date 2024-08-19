import axios from 'axios';

// type (engine vs. pvp), playerWhite, playerWhiteTimeRemaining, playerBlack, playerBlackTimeRemaining
export async function startNewGame(type, playerWhite, playerBlack, timeControl, increment) {
    try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
        type: type,
        playerWhite: playerWhite,
        playerWhiteTimeRemaining: timeControl * 60, // convert to seconds
        playerBlack: playerBlack,
        playerBlackTimeRemaining: timeControl * 60, //convert to seconds
        timeIncrement: increment
    });
    return response.data.game;
  } catch (error) {
    console.error('Error starting new game:', error);
    throw error;
  }
}
