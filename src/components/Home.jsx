import { useRef } from "react";
import {
  categories,
  categoryCovers,
  categoryEmojis,
  dishes,
  homeRows,
  hoursSummary,
  restaurant,
  shareOffers,
} from "../data";
import { heroBottle, heroBucket } from "../photos";
import DishImage from "./DishImage";

// [from, to] gradient of each category tile, cycled in menu order
const TINTS = [
  ["#ffe9a8", "#ffc22e"],
  ["#ffd9cf", "#ff9d85"],
  ["#fff0cf", "#ffd98a"],
  ["#ffe1d6", "#ffb59c"],
  ["#fff3bd", "#ffd84d"],
  ["#fde0c8", "#f7b68a"],
];

const byName = Object.fromEntries(dishes.map((d) => [d.name, d]));
// bucket, burger, fries, bottle: the numbers match the .home-hero-photo--N positions in the CSS
const HERO_PHOTOS = [heroBucket, byName["Menu Giant"]?.photo, byName.Frites?.photo, heroBottle];

function Row({ row, ranked, onPick }) {
  const scroller = useRef(null);
  const scrollBy = (dir) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="row">
      <div className="row-head">
        <h3 className="row-title">{row.title}</h3>
        <div className="row-arrows">
          <button aria-label="Précédent" onClick={() => scrollBy(-1)}>‹</button>
          <button aria-label="Suivant" onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>
      <div className="row-scroller" ref={scroller}>
        {row.items.map((dish, i) => (
          <PosterCard key={dish.id} dish={dish} rank={ranked ? i + 1 : null} onPick={onPick} />
        ))}
      </div>
    </section>
  );
}

function PosterCard({ dish, rank, onPick }) {
  return (
    <button className="poster" onClick={() => onPick(dish)}>
      <span className="poster-art">
        {rank && <span className="poster-rank">{rank}</span>}
        <DishImage dish={dish} />
      </span>
      {dish.groups.length > 0 && <span className="poster-badge">À composer</span>}
      <span className="poster-name">{dish.name}</span>
      <span className="poster-desc">{dish.description}</span>
      <span className="poster-foot">
        <span className="poster-price">€{dish.price.toFixed(2)}</span>
        <span className="poster-add" aria-hidden="true">+</span>
      </span>
    </button>
  );
}

export default function Home({ onPickDish, onGoMenus, onGoCategory, onSurprise }) {
  const [firstRow, ...otherRows] = homeRows;

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="home-kicker">{restaurant.slogan}</p>
          <h3>
            Faim ? Compose
            <br />
            <mark>ton menu</mark> en 30 secondes.
          </h3>
          <p>Burgers, tacos, paninis et desserts maison. Tu choisis, tu personnalises, c'est prêt.</p>
          <div className="home-hero-actions">
            <button className="home-btn primary" onClick={onGoMenus}>Voir nos menus</button>
            <button className="home-btn" onClick={onSurprise}>🎲 Surprends-moi</button>
          </div>
        </div>
        <div className="home-hero-art" aria-hidden="true">
          {HERO_PHOTOS.map(
            (src, i) => src && <img key={i} className={`home-hero-photo home-hero-photo--${i + 1}`} src={src} alt="" />
          )}
        </div>
      </section>

      <section className="row">
        <h3 className="row-title">Qu'est-ce qui te ferait plaisir ?</h3>
        <div className="home-cats">
          {categories.map((category, i) => {
            const count = dishes.filter((d) => d.category === category).length;
            const [from, to] = TINTS[i % TINTS.length];
            const cover = categoryCovers[category];
            return (
              <button
                key={category}
                className="home-cat"
                style={{ "--tint-from": from, "--tint-to": to }}
                onClick={() => onGoCategory(category)}
              >
                <span className="home-cat-name">{category}</span>
                <span className="home-cat-count">{count} produit{count > 1 ? "s" : ""}</span>
                {cover ? (
                  <img className="home-cat-photo" src={cover} alt="" loading="lazy" />
                ) : (
                  <span className="home-cat-emoji" aria-hidden="true">{categoryEmojis[category]}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <Row row={firstRow} ranked onPick={onPickDish} />

      <section className="row">
        <h3 className="row-title">On partage ?</h3>
        <div className="share">
          {shareOffers.map(({ people, items }) => (
            <div key={people} className="share-card">
              <div className="share-people">
                <strong>{people}</strong>
                <span>personnes</span>
              </div>
              <ul className="share-list">
                {items.map((dish) => (
                  <li key={dish.id}>
                    <button className="share-item" onClick={() => onPickDish(dish)}>
                      <span className="share-art"><DishImage dish={dish} /></span>
                      <span className="share-name">{dish.name}</span>
                      <span className="share-price">
                        €{dish.price.toFixed(2)}
                        <small>soit €{(dish.price / people).toFixed(2)} / pers.</small>
                      </span>
                      <span className="share-go" aria-hidden="true">+</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {otherRows.map((row) => (
        <Row key={row.title} row={row} onPick={onPickDish} />
      ))}

      <section className="home-surprise">
        <span className="home-surprise-dice" aria-hidden="true">🎲</span>
        <div>
          <h3>Pas d'idée ?</h3>
          <p>Donne ton humeur et ton budget, on compose un repas pour toi.</p>
        </div>
        <button className="home-btn primary" onClick={onSurprise}>Surprends-moi</button>
      </section>

      <section className="home-info" aria-label="Infos pratiques">
        <div>
          <h4>📍 Où nous trouver</h4>
          <p>{restaurant.address}</p>
          <p>{restaurant.service}</p>
        </div>
        <div>
          <h4>🕒 Horaires</h4>
          {hoursSummary.map(([days, hours]) => (
            <p key={days}><span>{days}</span> {hours}</p>
          ))}
        </div>
        <div>
          <h4>📞 Contact</h4>
          <p><a href={`tel:${restaurant.phone.replace(/\s/g, "")}`}>{restaurant.phone}</a></p>
          <p>Snapchat : {restaurant.snapchat}</p>
          <p>🥩 Viande halal</p>
        </div>
      </section>
    </div>
  );
}
