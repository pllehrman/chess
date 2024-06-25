import axios from 'axios';

export async function checkGameAvailability(gameId){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/games/check-game-availability`, {
            params: { id: gameId }
        });
        
        if (!response.data.isAvailable) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(`HTTP error!, status: ${error.response ? error.response.status : 'unknown'}`);
        return false;
    }

};