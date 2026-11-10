import { PlayIcon, StarIcon } from "./Icons";

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "");
}

export default function MovieCard({ movie, onSelect }) {
  const rating = movie.rating?.average?.toFixed(1) ?? "—";
  const year = movie.premiered?.slice(0, 4) ?? "New";

  return (
    <article className="movie-card" onClick={() => onSelect(movie)} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") onSelect(movie);
    }} role="button" tabIndex="0">
      <div className="poster-wrap">
        <img src={movie.image.medium} alt={`${movie.name} poster`} className="poster" />
        <div className="poster-overlay"><span className="play-button"><PlayIcon /></span></div>
        <span className="rating-badge"><StarIcon /> {rating}</span>
      </div>
      <div className="movie-card-content">
        <h3>{movie.name}</h3>
        <p>{year} <span>•</span> {movie.genres?.[0] ?? "Drama"}</p>
        <p className="movie-summary">{stripHtml(movie.summary) || "A story worth discovering."}</p>
      </div>
    </article>
  );
}
