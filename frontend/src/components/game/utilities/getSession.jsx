export async function getSession() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);

    if (!response.ok) {
      throw new Error(
        `error in requesting session with status ${response.status} and message: ${response.message}`
      );
    }

    const { session } = await response.json();

    return session;
  } catch (error) {
    console.error(`error joining game:`, error.msg);
    return null;
  }
}
