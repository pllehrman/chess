export async function fetchGameAvailability(gameId, orientation) {
    // Note the use of cache-busting parameters with date
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/check-game-availability?id=${gameId}&orientation=${orientation}&t=${new Date().getTime()}`;
    
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
        console.log("Trying to fetch...")
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error!, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.isAvailable) {
            return { isAvailable: data.isAvailable, game: data.gameData }
        }
        attempt++;

        } catch (error) {
        console.error(`Fetch error on attempt ${attempt + 1}: ${error.message}`);
        attempt++;
        }

        if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
    }
    return { isAvailable: false, gameData: null };
  }
  