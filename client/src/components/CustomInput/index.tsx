import React, { useEffect, useRef, useState } from "react";
import { readQueryFromURL, setQueryInURL } from "@/api/services/urlParams";
import "./styles.scss";

type Props = {
  placeholder?: string;
  button?: string;
  onSubmit: (value: string) => void | Promise<void>;
  onClear?: () => void;
  syncParam?: string | false;
  defaultValue?: string;
};

const CustomInput: React.FC<Props> = ({
  placeholder = "Type…",
  button = "Go",
  onSubmit,
  onClear,
  syncParam = false,
  defaultValue = "",
}) => {
  const [value, setValue] = useState(defaultValue);
  const lastSubmittedRef = useRef<string>("");

  useEffect(() => {
    if (!syncParam) return;
    const q = readQueryFromURL().trim();
    if (q) {
      setValue(q);
    }
  }, [syncParam]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = value.trim();

    if (syncParam !== false) setQueryInURL(v, "replace");
    if (v === lastSubmittedRef.current) return;

    await onSubmit(v);
    lastSubmittedRef.current = v;
  };

  const clear = async () => {
    setValue("");
    if (syncParam !== false) setQueryInURL("", "replace");

    // allow a clear-triggered request even if lastSubmitted was already ""
    lastSubmittedRef.current = "__force_clear__";
    await onSubmit("");
    lastSubmittedRef.current = "";
    onClear?.();
  };

  return (
    <form className="custom-input-form" onSubmit={submit}>
      <input
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={placeholder}
      />
      <button className="button-submit" type="submit">
        {button}
      </button>
      <button
        type="button"
        className="button-clear"
        disabled={!value.trim()}
        onClick={clear}
      >
        Clear
      </button>
    </form>
  );
};

export default CustomInput;
