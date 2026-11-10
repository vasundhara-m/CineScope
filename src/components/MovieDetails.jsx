import { CloseIcon, StarIcon } from "./Icons";

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "");
}

export default function MovieDetails({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="details-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="close-button" onClick={onClose} aria-label="Close movie details"><CloseIcon /></button>
        <img src={movie.image?.original || movie.image?.medium} alt="" className="details-backdrop" />
        <div className="details-body">
          <div className="details-poster"><img src={movie.image?.medium} alt={`${movie.name} poster`} /></div>
          <div className="details-copy">
            <p className="eyebrow">Movie spotlight</p>
            <h2 id="details-title">{movie.name}</h2>
            <div className="details-meta">
              <span>{movie.premiered?.slice(0, 4) || "Coming soon"}</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "Feature"}</span>
              <span className="detail-rating"><StarIcon /> {movie.rating?.average?.toFixed(1) || "Unrated"}</span>
            </div>
            <div className="genre-list">{movie.genres?.map((genre) => <span key={genre}>{genre}</span>)}</div>
            <p className="details-summary">{stripHtml(movie.summary) || "No synopsis is available for this title yet."}</p>
            {movie.network?.name && <p className="network">Streaming on <strong>{movie.network.name}</strong></p>}
            <a className="primary-button" href={movie.officialSite || movie.url} target="_blank" rel="noreferrer">View official page</a>
          </div>
        </div>
      </section>
    </div>
  );
}
