import { useEffect, useMemo, useState } from "react";
import { getFeaturedMovies, searchMovies } from "./api";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import { SearchIcon } from "./components/Icons";

const categories = ["All", "Drama", "Comedy", "Thriller", "Action", "Romance", "Science-Fiction"];

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getFeaturedMovies(controller.signal)
      .then(setMovies)
      .catch((reason) => { if (reason.name !== "AbortError") setError(reason.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setActiveCategory("All");
    try {
      setMovies(await searchMovies(value));
    } catch (reason) {
      if (reason.name !== "AbortError") setError(reason.message);
    } finally {
      setLoading(false);
    }
  }

  const visibleMovies = useMemo(() => activeCategory === "All"
    ? movies
    : movies.filter((movie) => movie.genres?.some((genre) => genre.toLowerCase() === activeCategory.toLowerCase())), [activeCategory, movies]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); setSearched(false); setQuery(""); }}>
          <span className="brand-mark">C</span><span>Cine<span>Scope</span></span>
        </a>
        <nav><a href="#discover">Discover</a><a href="#categories">Categories</a><a href="#about">About</a></nav>
        <form className="header-search" onSubmit={handleSearch}>
          <SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies..." aria-label="Search movies" /><button type="submit">Search</button>
        </form>
      </header>

      <main>
        <section className="hero" id="discover">
          <div className="hero-copy">
            <p className="eyebrow">Your next story starts here</p>
            <h1>Find something <em>worth watching.</em></h1>
            <p className="hero-text">Explore handpicked stories, timeless favorites, and hidden gems from around the world.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you in the mood for?" aria-label="Search for a movie" /><button type="submit">Explore</button>
            </form>
            <div className="hero-stats"><span><strong>10k+</strong> titles to discover</span><span><strong>4.8</strong> average community rating</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-glow" /><div className="art-card art-card-back" /><div className="art-card art-card-mid" /><div className="art-card art-card-front"><span className="art-label">A world of stories</span></div></div>
        </section>

        <section className="catalog" id="categories">
          <div className="section-heading"><div><p className="eyebrow">{searched ? "Search results" : "Curated for you"}</p><h2>{searched ? `Results for “${query}”` : "Discover your next favorite"}</h2></div><span className="result-count">{visibleMovies.length} titles</span></div>
          <div className="category-list">{categories.map((category) => <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
          {error && <div className="notice error-notice"><strong>Something went wrong.</strong> {error} <button onClick={() => window.location.reload()}>Try again</button></div>}
          {loading && <div className="movie-grid" aria-label="Loading movies">{[1, 2, 3, 4, 5, 6].map((item) => <div className="skeleton-card" key={item}><div className="skeleton poster-skeleton" /><div className="skeleton line-skeleton" /><div className="skeleton short-skeleton" /></div>)}</div>}
          {!loading && !error && visibleMovies.length === 0 && <div className="empty-state"><span>◌</span><h3>No titles found</h3><p>Try a different search or category.</p></div>}
          {!loading && !error && visibleMovies.length > 0 && <div className="movie-grid">{visibleMovies.map((movie) => <MovieCard movie={movie} onSelect={setSelectedMovie} key={movie.id} />)}</div>}
        </section>
      </main>
      <footer id="about"><span className="brand"><span className="brand-mark">C</span><span>Cine<span>Scope</span></span></span><p>Made for curious viewers. Movie data provided by TVmaze.</p></footer>
      <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default App;
