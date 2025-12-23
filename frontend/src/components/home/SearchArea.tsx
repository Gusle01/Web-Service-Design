import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SEARCH_DELAY_MS = 300;

export default function SearchArea() {
  const [query, setQuery] = useState<string>("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initialQuery = searchParams.get("q") ?? "";
    setQuery(initialQuery);
  }, [searchParams]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      navigate(query ? `?q=${query}` : "/");
    }, SEARCH_DELAY_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [navigate, query]);

  return (
    <section className="search-area">
      <article className="search-area__search">
        <h2 className="search-area__title">Blog Project</h2>
        <p className="search-area__description">
          A Blog About Food, Experience, and Recipes.
        </p>
        <form
          method="get"
          className="search-area__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="text"
            name="q"
            placeholder="Search"
            className="search-area__input"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="search-area__submit">
            <img
              src="/assets/images/search.png"
              alt="search-icon"
              className="search-area__icon"
            />
          </button>
        </form>
      </article>
    </section>
  );
}
