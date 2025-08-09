const PARAM = "searchParams";

export const readQueryFromURL = (): string => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(PARAM) ?? "";
};

export const setQueryInURL = (q: string, mode: "push" | "replace" = "push") => {
  const searchParams = new URLSearchParams(window.location.search);
  if (q) {
    searchParams.set(PARAM, q);
  } else {
    searchParams.delete(PARAM);
  }
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  if (mode === "push") {
    window.history.pushState(null, "", newUrl);
  } else {
    window.history.replaceState(null, "", newUrl);
  }
};
