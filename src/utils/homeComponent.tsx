import { getArticles } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Struktur Kepemimpinan ", href: "#kepemimpinan" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Berkarya di ", href: "#berkarya" },
];

export type Statistik = {
  didirikan: number;
  jumlah_saudara: number;
  negara: number;
};

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
          className="flex items-center gap-2 font-serif text-lg font-semibold text-[#1B1C1F]"
        >
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
              className="text-sm font-medium text-gray-700 transition-colors hover:text-red-800"
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
                      className="text-base font-medium text-gray-700 transition-colors hover:text-red-800"
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

export function Reveal({ children, delay = 0 }: any) {
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

export function HistoryOrdo() {
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

export function Footer() {
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
              convindo.com merupakan Approvals system OFM Conventual Indonesia
              yang menyajikan update berita dan informasi seputar komunitas
              OFMConv di Indonesia.
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
              <li>Jl Sibiru-biru No.1, RT.2/RW.3, Deli Tua Timur</li>
              <li>parokidelitua@gmail.com</li>
              <li>+62 852-6279-7708</li>
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

export function LayoutArtikel() {
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