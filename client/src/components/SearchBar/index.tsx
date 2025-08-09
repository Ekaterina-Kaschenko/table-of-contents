// src/components/SearchBar/index.tsx
import { useEffect, useState, FormEvent } from "react";
import { fetchTOCData } from "@/api/services/tocService";
import { readQueryFromURL, setQueryInURL } from "@/utils/urlParams"; // ← reuse helpers
import "./styles.scss";

type TOC = Awaited<ReturnType<typeof fetchTOCData>>;

type Props = {
  onResults: (data: TOC) => void;
  placeholder?: string;
};

const SearchBar = ({ onResults, placeholder = "Filter topics…" }: Props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const applyQuery = async (q: string, mode: "push" | "replace" = "push") => {
    setQueryInURL(q, mode);
    try {
      setLoading(true);
      setErr(null);
      const data = await fetchTOCData(q);
      onResults(data);
    } catch (e) {
      console.error(e);
      setErr("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    applyQuery(value.trim(), "push");
  };

  const clear = () => {
    setValue("");
    applyQuery("", "push");
  };

  useEffect(() => {
    const q = readQueryFromURL();
    if (q) {
      setValue(q);
      applyQuery(q, "replace"); // don’t add a history entry on load
    }
    // eslint-disable-next-line
  }, []);

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <span className="searchbar__icon" aria-hidden>
        🔎
      </span>

      <input
        className="searchbar__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Filter topics"
      />

      <button className="searchbar__btn" type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>

      <button
        type="button"
        className="searchbar__btn searchbar__btn--ghost"
        disabled={!value.trim() || loading}
        onClick={clear}
      >
        Clear
      </button>

      {err && (
        <span className="text-muted" style={{ marginLeft: 8 }}>
          {err}
        </span>
      )}
    </form>
  );
};

export default SearchBar;
