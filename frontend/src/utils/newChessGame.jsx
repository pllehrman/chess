import axios from 'axios';
const apiUrl = "http://localhost:3001";

// type (engine vs. pvp), playerWhite, playerWhiteTimeRemaining, playerBlack, playerBlackTimeRemaining
export async function startNewGame(type, playerWhite, playerBlack, timeControl) {
    try {
    console.log(type, playerWhite, playerBlack, timeControl);
    const response = await axios.post(`${apiUrl}/games`, {
        type: type,
        playerWhite: playerWhite,
        playerWhiteTimeRemaining: timeControl, 
        playerBlack: playerBlack,
        playerBlackTimeRemaining: timeControl,
    });

    return response.data;
  } catch (error) {
    console.error('Error starting new game:', error);
    throw error;
  }
}
