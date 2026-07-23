import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ArrowRight, Menu } from "lucide-react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getArticles, GetDewanPimpinan } from "@/services/api";
import { DataTableWilayah } from "@/utils/components/DataTableWilayah"
import { getAllWilayah } from "@/services/api"

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Struktur Kepemimpinan ", href: "#kepemimpinan" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Berkarya di ", href: "#berkarya" },
];


function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2 sm:gap-4">
      {/* Tambahkan min-w-[20px] agar garis tidak hilang sepenuhnya saat teks sangat panjang */}
      <Separator className="flex-1 min-w-[20px]" />

      {/* HAPUS 'shrink-0' dan ubah ukuran teks mobile jadi text-lg. 
          Tambahkan 'text-center' dan 'leading-tight' agar rapi saat turun baris */}
      <h2 className="text-center font-serif text-lg leading-tight text-gray-900 sm:text-2xl md:text-3xl">
        {children}
      </h2>

      <Separator className="flex-1 min-w-[20px]" />
    </div>
  );
}

export function Navbar() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-black border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#"
          className="flex items-center gap-2 font-serif text-lg font-semibold text-[#1B1C1F]">
          <img
            src="./Logo_ordo1.png"
            alt="Logo OFMConv"
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
          <span>OFMConv Indonesia</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                "text-sm font-medium text-gray-700 transition-colors hover:text-red-800"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="hidden pl-4 pr-3 bg-[#1B1C1F] sm:flex"
            onClick={handleLogin}
          >
            Login <ArrowRight className="h-4 w-4" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-10 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <a
                      href={link.href}
                      className={
                        "text-base font-medium text-gray-700 transition-colors hover:text-red-800"
                      }
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    className="mt-4 w-full justify-center bg-[#1B1C1F]"
                    onClick={handleLogin}
                  >
                    Login <ArrowRight className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [article, setArticle] = React.useState<any>(null);

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
            <div className="text-left md:text-right">
              <p className="font-serif text-2xl text-white sm:text-3xl">1209</p>
              <p className="text-[11px] text-gray-300 sm:text-xs">Didirikan</p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-serif text-2xl text-white sm:text-3xl">113</p>
              <p className="text-[11px] text-gray-300 sm:text-xs">
                Saudara di Indonesia
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-serif text-2xl text-white sm:text-3xl">70</p>
              <p className="text-[11px] text-gray-300 sm:text-xs">
                Negara di Dunia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderCard({ photo, name, role }: any) {
  return (
    // Memperkecil max-w di mobile (160px) agar muat dalam grid 2 kolom tanpa overflow
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
        {/* Mengecilkan teks di mobile menjadi text-sm agar tidak terlalu panjang */}
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

function History() {
  return (
    <Reveal>
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <div className="flex w-full items-start justify-center md:w-1/4">
          <img
            src="./Logo_ordo.jpeg"
            alt="Logo OFMConv"
            className="h-auto w-full max-w-[160px] object-contain sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
          />
        </div>

        <div className="w-full flex-1 px-4 pt-6 pb-8 text-left sm:px-6 md:px-0 md:pt-0">
          <h3 className="pb-4 font-serif text-xl text-gray-900 sm:text-2xl">
            Sejarah OFMConv Indonesia
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 text-justify sm:text-base">
            Ordo Saudara Dina Konventual (OFMConv) adalah cabang dari Ordo
            Fransiskan yang didirikan oleh Santo Fransiskus dari Assisi. Kata
            "konventual" merujuk pada kehidupan biara yang terstruktur. Di
            Indonesia, ordo ini hadir di Bogor pada tahun 1937 dan berkembang di
            Sumatera Utara sejak 1967. Pada tahun 2019, wilayah Indonesia resmi
            menjadi Provinsi mandiri.
          </p>
          <br />
          <p className="text-sm leading-relaxed text-gray-600 text-justify sm:text-base">
            Pada awal abad ke-13, Santo Fransiskus dari Assisi mendirikan Ordo
            Saudara Dina (Friars Minor) yang berfokus pada kehidupan injili,
            kemiskinan, dan karya amal. Seiring berjalannya waktu, ordo ini
            berkembang sangat pesat, dan terjadi perbedaan interpretasi mengenai
            cara menghidupi semangat kemiskinan Fransiskan.
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function LayoutArtikel() {
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await getArticles(2);
        setArticle(res);
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
      }
    }
    init();
  }, []);

  return (
    <Reveal>
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={article?.img}
            alt={article?.jdl_artikel}
            className="h-full w-full object-cover rounded-sm"
          />
        </div>

        <div className="w-full flex-1 px-4 pt-6 pb-8 text-left sm:px-6 md:px-0 md:pt-0">
          <h3 className="font-serif text-xl text-gray-900 sm:text-2xl">
            {article?.jdl_artikel}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            {article?.description}
          </p>
        </div>
      </div>
    </Reveal>
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
          <History />
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
        <img src="./Map.png" alt="Peta Wilayah" className="mx-auto mt-6 w-full max-w-3xl object-contain" />

        <div className="mt-10 w-full overflow-x-auto">
          <DataTableWilayah data={wilayah} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Reveal({ children, delay = 0 }: any) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        "transition-all duration-700 ease-out " +
        (visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")
      }
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
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


function Footer() {
  return (
    <footer id="tentang" className="border-t border-black/5 bg-[#1B1C1F] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <a
              href="#"
              className="flex items-center gap-2 font-serif text-lg font-semibold text-white"
            >
              <img
                src="./Logo_ordo.jpeg"
                alt="Logo OFMConv"
                className="h-8 w-8 object-contain"
              />
              <span>OFMConv</span>
            </a>
            <p className="mt-4 max-w-xs text-left text-sm leading-relaxed text-gray-400">
              convindo.com merupakan Approvals system OFM Conventual Indonesia yang menyajikan update berita dan informasi seputar komunitas OFMConv di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm text-white">Navigasi</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Kuria Dewan Pimpinan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Berkarya di
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-white">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>Jl. Contoh Alamat No. 1, Kota</li>
              <li>ofmconv@example.org</li>
              <li>+62 812-3456-7890</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-white">Ikuti Kami</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mt-10 bg-white/10 sm:mt-14" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} OFMConv Provinsi Indonesia. Hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Kebijakan Privasi</a>
            <a href="#" className="hover:text-gray-300">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Home;