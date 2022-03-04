import { useEffect, useState } from "react";

export function useLoader(loadFn) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  async function load() {
    try {
      setLoading(true);
      setError(undefined);
      setData(await loadFn());
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error };
}
