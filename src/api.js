const API_URL = "https://api.tvmaze.com";

export async function searchMovies(query, signal) {
  const response = await fetch(
    `${API_URL}/search/shows?q=${encodeURIComponent(query)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("The movie service is unavailable right now.");
  }

  const results = await response.json();
  return results.map(({ show }) => show).filter((show) => show.image?.medium);
}

export async function getFeaturedMovies(signal) {
  const response = await fetch(`${API_URL}/shows?page=1`, { signal });

  if (!response.ok) {
    throw new Error("We could not load featured movies.");
  }

  const shows = await response.json();
  return shows.filter((show) => show.image?.medium).slice(0, 24);
}
