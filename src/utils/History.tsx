"use client"

import * as React from "react"
import { getAllMinisterProvinsial } from "@/services/api"
import { Separator } from "@/components/ui/separator"

type MinisterProvinsial = {
  id: number
  nama: string
  periode_mulai?: string | null
  periode_selesai?: string | null
  keterangan?: string | null
  urutan?: number | null
}

function formatPeriode(mulai?: string | null, selesai?: string | null) {
  const tahunMulai = mulai ? mulai.split("T")[0].split("-")[0] : "?"
  const tahunSelesai = selesai ? selesai.split("T")[0].split("-")[0] : "saat ini"
  return `${tahunMulai}–${tahunSelesai}`
}
function Reveal({ children, delay = 0 }: any) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
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
function SectionHeading({ children }: { children: React.ReactNode }) {
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
export function History() {
  const [daftarMinister, setDaftarMinister] = React.useState<MinisterProvinsial[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function init() {
      try {
        const data = await getAllMinisterProvinsial()
        setDaftarMinister(data ?? [])
      } catch (err) {
        console.error("Gagal mengambil data minister provinsial:", err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 className="text-center font-serif text-2xl text-gray-900 sm:text-3xl">
        <SectionHeading>Sejarah Minister Provinsial</SectionHeading>
      </h2>

      <div className="mt-10 space-y-4 sm:mt-14">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Memuat data...</p>
        ) : daftarMinister.length === 0 ? (
          <p className="text-center text-sm text-gray-500">Belum ada data.</p>
        ) : (
          daftarMinister.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <div className="flex items-center justify-between rounded-lg border px-5 py-4">
                <span className="font-medium text-gray-900">{item.nama}</span>
                <span className="text-sm text-gray-500">
                  {formatPeriode(item.periode_mulai, item.periode_selesai)}
                </span>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </div>
  )
}

export default History;