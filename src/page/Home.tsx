import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { GetDewanPimpinan } from "@/services/api";
import { DataTableWilayah } from "@/utils/components/DataTableWilayah"
import { getAllWilayah } from "@/services/api"

const navLinks = [
  { label: "Beranda", href: "#", active: true },
  { label: "Kuria Dewan Pimpinan", href: "#kuria" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Berkarya di ", href: "#berkarya" },
];


function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <Separator className="flex-1" />
      <h2 className="shrink-0 font-serif text-2xl text-gray-900 sm:text-3xl">
        {children}
      </h2>
      <Separator className="flex-1" />
    </div>
  );
}
function Navbar() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#"
          className="flex items-center gap-2 font-serif text-lg font-semibold text-[#1B1C1F]"
        >
          <img
            src="./Logo_ordo1.png"
            alt="Logo OFMConv"
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
          <span>OFMConv</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-sm font-medium text-red-800"
                  : "text-sm font-medium text-gray-700 transition-colors hover:text-red-800"
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
                        link.active
                          ? "text-base font-medium text-red-800"
                          : "text-base font-medium text-gray-700 transition-colors hover:text-red-800"
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

  function HandleHistory() {
    navigate("/history")
  }
  return (
    <section className="fixed inset-x-0 top-0 z-0 h-screen w-full overflow-hidden">
      <img
        src="/Kapitularis-1536x802.jpg"
        alt="Interior gereja New Horizon Chapel"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="flex flex-col justify-end gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="max-w-lg font-serif text-3xl leading-[1.15] text-white sm:text-4xl sm:leading-[1.1] md:text-5xl">
              Melayani dalam Jejak
              <br />
              Fransiskus dari Assisi
            </h1>
            <p className="mt-4 max-w-md text-left text-sm text-gray-200 sm:text-base">
              Ordo Fratrum Minorum Conventual (OFMConv) adalah ordo Fransiskan
              tertua, hidup dalam persaudaraan, kesederhanaan, dan doa sejak
              tahun 1209.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={HandleHistory}
                className="inline-flex items-center gap-2 rounded-md bg-[#616572] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d505b] sm:px-5"
              >
                Lihat Sejarah
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:px-5"
              >
                Jadwal
              </a>
            </div>
          </div>

          <div className="flex gap-6 sm:gap-8">
            <div className="text-right">
              <p className="font-serif text-2xl text-white sm:text-3xl">1209</p>
              <p className="text-[11px] text-gray-300 sm:text-xs">Didirikan</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl text-white sm:text-3xl">113</p>
              <p className="text-[11px] text-gray-300 sm:text-xs">
                Saudara di Indonesia
              </p>
            </div>
            <div className="text-right">
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
    <div className="mx-auto w-full max-w-[200px] sm:max-w-[240px]">
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

      <div className="mt-4 text-center sm:mt-5">
        <p className="font-serif text-base leading-snug text-gray-900 sm:text-lg">
          {name}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-[#616572] sm:text-xs">
          {role}
        </p>
      </div>
    </div>
  );
}

function LayoutArtikel() {
  return (
    <Reveal>
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="w-full md:w-1/2">
          <img
            src="./Gabungan.jpg"
            alt="Foto para frater bersama"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Judul dan deskripsi di sebelah kanan, rata kiri, mentok atas dengan gambar */}
        <div className="w-full px-6 pt-0 pb-8 text-left md:w-1/2 md:px-10">
          <h3 className="font-serif text-lg text-gray-900 sm:text-xl">
            Judul Anda di Sini
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Tuliskan deskripsi singkat di sini. Bagian ini menjelaskan
            konteks foto atau informasi tambahan yang ingin Anda
            sampaikan kepada pembaca. Ganti teks ini sesuai kebutuhan.
          </p>
        </div>
      </div>
    </Reveal>
  );
}


function History() {
  return (
    <Reveal>
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="w-full md:w-1/4 flex justify-center items-start">
          <img
            src="./Logo_ordo.jpeg"
            alt="Foto para frater bersama"
            className="w-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] h-auto object-contain"
          />
        </div>

        <div className="w-full px-6 pt-0 pb-8 text-left md:w-1/1 md:px-10">
          <h3 className="font-serif text-lg text-gray-900 sm:text-xl pb-5">
            Sejarah Ordo OFMConv
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 text-justify">
            Ordo Saudara Dina Konventual (OFMConv) adalah cabang dari Ordo Fransiskan yang didirikan oleh Santo Fransiskus dari Assisi. Kata "konventual" merujuk pada kehidupan biara yang terstruktur. Di Indonesia, ordo ini hadir di Bogor pada tahun 1937 dan berkembang di Sumatera Utara sejak 1967. Pada tahun 2019, wilayah Indonesia resmi menjadi Provinsi mandiri.
          </p>
          <br />
          <p className="mt-3 text-sm leading-relaxed text-gray-600 text-justify">
            Pada awal abad ke-13, Santo Fransiskus dari Assisi mendirikan Ordo Saudara Dina (Friars Minor) yang berfokus pada kehidupan injili, kemiskinan, dan karya amal. Seiring berjalannya waktu, ordo ini berkembang sangat pesat, dan terjadi perbedaan interpretasi mengenai cara menghidupi semangat kemiskinan Fransiskan.
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

  // const vikaris = dewanPimpinan.find((d) => d.position?.includes("Vikaris"));
  // const minister = dewanPimpinan.find((d) => d.position?.includes("Minister"));
  // const sekretaris = dewanPimpinan.find((d) => d.position?.includes("Sekretaris"));

  return (
    <div className="relative z-10 mt-[100vh] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div id="kuria" className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
          <History />
        </div>
        <h2 className="text-center font-serif text-2xl text-gray-900 sm:text-3xl">
          <SectionHeading>Minister & Definitorium</SectionHeading>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          <Reveal delay={120}>
            <LeaderCard
              photo="test"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Vikaris Provinsial Definitor 1"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="test"
              name="test"
              role="Minister Provinsial"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="/ero.jpeg"
              name="Sdr. Rufinus Ero Jenska P., OFMConv"
              role="Sekretaris Provinsi"
            />
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:mt-14 sm:grid-cols-5 sm:gap-8">
          <Reveal delay={120}>
            <LeaderCard
              photo="/vikaris-provinsial.jpg"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Definitor 3"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="/vikaris-provinsial.jpg"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Definitor 3"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="/vikaris-provinsial.jpg"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Definitor 3"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="/vikaris-provinsial.jpg"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Definitor 3"
            />
          </Reveal>
          <Reveal delay={0}>
            <LeaderCard
              photo="/vikaris-provinsial.jpg"
              name="Sdr. Gonzales Petrus Zonggar, OFMConv"
              role="Definitor 3"
            />
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <LayoutArtikel />
      </div>

      <div id="berkarya" className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-9">
        <h2 className="text-center font-serif text-2xl text-gray-900 sm:text-3xl">

          <SectionHeading>Peta Wilayah Pelayanan Fransiskan Konventual Di Indonesia Dan Timor Leste</SectionHeading>
          <img src="./Map.png" className="mx-auto mt-6 w-full max-w-3xl" />
        </h2>
        <div className="mt-10">
          <DataTableWilayah
            data={wilayah}
          />
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
    <div className="relative min-h-screen bg-white">
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
              OFMConv-Indonesia.org merupakan situs resmi Kongregasi OFM Conventual Indonesia yang menyajikan update berita dan informasi seputar komunitas OFMConv Indonesia dan dunia.
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