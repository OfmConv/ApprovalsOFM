import { useState, useEffect, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "./Home";
import { getArticles } from "@/services/api";

interface Article {
  id: number;
  jdl_artikel: string;
  description: string;
  img: string;
}

const DEBOUNCE_MS = 300;

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function BlogGrid() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const fetchArticles = useCallback(async () => {
    try {
      const data = await getArticles();
      setArticles(data || []);
    } catch (error) {
      console.error("[fetchArticles] error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const featured = useMemo(
    () => articles.find((a) => a.id === 1),
    [articles]
  );

  const gridArticles = useMemo(
    () => articles.filter((a) => a.id >= 3),
    [articles]
  );

  const filtered = useMemo(
    () =>
      gridArticles.filter((p) =>
        p.jdl_artikel.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [gridArticles, debouncedQuery]
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
      <section className="w-full max-w-6xl mx-auto px-6 py-10 mt-10">
        {featured && (
          <Card
            className={`mb-10 overflow-hidden border-none shadow-none py-0 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="h-55 w-full overflow-hidden">
              <img
                src={featured.img}
                alt={featured.jdl_artikel}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="px-0 pt-4 min-w-0">
              <div className="text-lg font-semibold text-slate-900 break-words">
                {featured.jdl_artikel}
              </div>
              <div className="mt-1 text-sm text-muted-foreground break-words whitespace-normal">
                {featured.description}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end mb-8">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Cari Kegiatan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-9 rounded-full"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, index) => (
            <Card
              key={post.id}
              className={`overflow-hidden border-none shadow-none py-0 transition-all duration-700 ease-out ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden ">
                <img
                  src={post.img}
                  alt={post.jdl_artikel}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="px-0 pt-0 min-w-0">
                <div className="text-base font-semibold text-slate-900 break-words">
                  {post.jdl_artikel}
                </div>
                <div className="mt-1 mb-5 ml-5 mr-5 text-justify text-sm text-muted-foreground break-words whitespace-normal">
                  {post.description}
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-10">
              Tidak ada artikel yang cocok dengan pencarian.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}