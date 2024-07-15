export async function fetchGameAvailability(gameId, orientation) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/check-game-availability?id=${gameId}&orientation=${orientation}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate', // Add cache control headers
              'Pragma': 'no-cache',
              'Expires': '0'
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error!, status: ${response.status}`);
      }

      const data = await response.json();

      return data.isAvailable;
  } catch (error) {
    //   console.log(error);
      console.error(`Fetch error: ${error.message}`);
      return false;
  }
}
