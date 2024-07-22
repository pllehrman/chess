export async function fetchGameAvailability(gameId, orientation) {
    // Note the use of cache-busting parameters with date
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/check-game-availability?id=${gameId}&orientation=${orientation}&t=${new Date().getTime()}`;
  
    try {
        console.log("Trying to fetch...")
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error!, status: ${response.status}`);
        }

        const data = await response.json();
        return { isAvailable: data.isAvailable, game: data.gameData }
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        return { isAvailable: false, gameData: null }
    }
  }
  