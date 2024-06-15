import axios from 'axios';

// type (engine vs. pvp), playerWhite, playerWhiteTimeRemaining, playerBlack, playerBlackTimeRemaining
export async function startNewGame(type, playerWhite, playerBlack, timeControl) {
    try {
    console.log(type, playerWhite, playerBlack, timeControl);
    const response = await axios.post(`${proces.env.NEXT_PUBLIC_API_URL}/games`, {
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
