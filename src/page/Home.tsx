import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllWilayah } from "@/services/api";
import { Separator } from "@/components/ui/separator";
import type { Statistik } from '../utils/homeComponent';
import React, { useEffect, useState, type ReactNode } from "react";
import { DataTableWilayah } from "@/utils/components/DataTableWilayah";
import { getArticles, GetDewanPimpinan, getStatistik } from "@/services/api";
import { Reveal, HistoryOrdo, Footer, LayoutArtikel, Navbar } from '../utils/homeComponent';


const STATISTIK_FALLBACK: Statistik = {
  didirikan: 1209,
  jumlah_saudara: 139,
  negara: 70,
};

function useStatistik() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getStatistik();
        if (!cancelled) setStatistik(data);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return statistik;
}

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <>{display}</>;
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2 sm:gap-4">
      <Separator className="flex-1 min-w-[20px]" />
      <h2 className="text-center font-serif text-lg leading-tight text-gray-900 sm:text-2xl md:text-3xl">
        {children}
      </h2>
      <Separator className="flex-1 min-w-[20px]" />
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-left md:text-right">
      <p className="font-serif text-2xl text-white sm:text-3xl">
        <AnimatedNumber value={value} />
      </p>
      <p className="text-[11px] text-gray-300 sm:text-xs">{label}</p>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [article, setArticle] = React.useState<any>(null);
  const statistik = useStatistik();

  function HandleHistory() {
    navigate("/history");
  }

  function navigateToArticle() {
    navigate("/kegiatan");
  }

  React.useEffect(() => {
    async function init() {
      try {
        const res = await getArticles(1);
        setArticle(res);
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-end">
      <img
        src={article?.img}
        alt={article?.jdl_artikel}
        className="absolute inset-0 h-full w-full object-cover object-center md:object-top"
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full h-full max-w-6xl flex-col justify-end px-4 pb-24 pt-32 sm:px-6 sm:pb-20">
        <div className="flex flex-col justify-end gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="max-w-lg text-left font-serif text-3xl leading-[1.15] text-white sm:text-4xl sm:leading-[1.1] md:text-2xl">
              {article?.jdl_artikel}
            </h1>
            <p className="mt-4 max-w-md text-left text-sm text-gray-200 md:text-1xl">
              {article?.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={HandleHistory}
                className="inline-flex items-center gap-2 rounded-md bg-[#616572] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d505b] sm:px-5"
              >
                Sejarah Minister
              </button>
              <button
                onClick={navigateToArticle}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md backdrop-saturate-150 shadow-sm transition-colors hover:bg-white/20 sm:px-5"
              >
                Lihat Kegiatan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex w-full justify-between gap-2 md:w-auto md:justify-end md:gap-8">
            <HeroStat
              value={statistik?.didirikan ?? STATISTIK_FALLBACK.didirikan}
              label="Didirikan"
            />
            <HeroStat
              value={statistik?.jumlah_saudara ?? STATISTIK_FALLBACK.jumlah_saudara}
              label="Saudara di Indonesia"
            />
            <HeroStat
              value={statistik?.negara ?? STATISTIK_FALLBACK.negara}
              label="Negara di Dunia"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderCard({ photo, name, role }: any) {
  return (
    <div className="mx-auto w-full max-w-[160px] sm:max-w-[240px]">
      <div className="relative">
        <div className="rounded-sm border-[3px] border-[#616572] bg-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.25)]">
          <div className="border border-[#616572]/30">
            <img
              src={photo}
              alt={name}
              className="aspect-[4/5] w-full rounded-[1px] object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 text-center sm:mt-5">
        <p className="font-serif text-sm leading-snug text-gray-900 sm:text-lg">
          {name}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#616572] sm:text-xs">
          {role}
        </p>
      </div>
    </div>
  );
}

function MainContent() {
  const [dewanPimpinan, setDewanPimpinan] = useState<any[]>([]);
  const [wilayah, setWilayah] = useState<any[]>([]);

  useEffect(() => {
    async function initWilayah() {
      try {
        const data = await getAllWilayah();
        setWilayah(data ?? []);
      } catch (err) {
        console.error("Gagal mengambil data wilayah:", err);
      }
    }
    initWilayah();

    async function init() {
      try {
        const res = await GetDewanPimpinan();
        const list = res?.data?.data ?? res?.data ?? [];
        setDewanPimpinan(list);
      } catch (err) {
        console.error("Gagal mengambil data dewan pimpinan:", err);
      }
    }
    init();
  }, []);

  return (
    <div className="relative z-20 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="mb-16 sm:mb-24">
          <HistoryOrdo />
        </div>

        <div id="kepemimpinan" className="text-center">
          <SectionHeading>Struktur Kepemimpinan</SectionHeading>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          <Reveal delay={120}>
            <LeaderCard
              photo={dewanPimpinan[1]?.profile}
              name={dewanPimpinan[1]?.name}
              role="Vikaris Provinsial & Definitor 1"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo={dewanPimpinan[0]?.profile}
              name={dewanPimpinan[0]?.name}
              role="Minister Provinsial"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo={dewanPimpinan[2]?.profile}
              name={dewanPimpinan[2]?.name}
              role={dewanPimpinan[2]?.position}
            />
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-14 md:grid-cols-5 sm:gap-8">
          {[3, 4, 5, 6, 7].map((idx, i) => (
            <Reveal delay={i === 0 ? 120 : 0} key={idx}>
              <LeaderCard
                photo={dewanPimpinan[idx]?.profile}
                name={dewanPimpinan[idx]?.name}
                role={dewanPimpinan[idx]?.position}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8">
        <LayoutArtikel />
      </div>

      <div id="berkarya" className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-9">
        <div className="text-center">
          <SectionHeading>
            Peta Wilayah Pelayanan Fransiskan Konventual
          </SectionHeading>
        </div>
        <img
          src="./Map.png"
          alt="Peta Wilayah"
          className="mx-auto mt-6 w-full max-w-3xl object-contain"
        />

        <div className="mt-10 w-full overflow-x-auto">
          <DataTableWilayah data={wilayah} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <MainContent />
    </div>
  );
}

export default Home;