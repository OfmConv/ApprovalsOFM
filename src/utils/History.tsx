import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getAllMinisterProvinsial } from "@/services/api"
import { Button } from "@/components/ui/button"

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
  const ref = React.useRef(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

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
  )
}

export function History() {
  const navigate = useNavigate()
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
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="flex w-full justify-start pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
          className="group gap-2 rounded-full pl-3 pr-4 text-sm font-medium text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Button>
      </div>

      <div className=" flex w-full flex-col items-center text-center">
        <h2 className="text-xl font-medium text-gray-700 sm:text-3xl">
          Sejarah Minister Provinsial
        </h2>
        <p className="mt-3 w-full text-center text-sm font-medium text-gray-700">
          Daftar para pemimpin provinsi beserta masa jabatannya.
        </p>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[88px] animate-pulse rounded-xl border border-black/5 bg-gray-50"
              />
            ))}
          </div>
        ) : daftarMinister.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="text-sm font-medium text-gray-700">Belum ada data.</p>
          </div>
        ) : (
          <ol className="flex flex-col gap-5">
            {daftarMinister.map((item, index) => {
              const isFirst = index === 0
              const isLast = index === daftarMinister.length - 1

              return (
                <li key={item.id} className="relative pl-10 sm:pl-14">
                  <span
                    aria-hidden
                    className="absolute left-3 w-px -translate-x-1/2 bg-gray-300"
                    style={{
                      top: isFirst ? "50%" : "-1.25rem",
                      bottom: isLast ? "50%" : "0",
                    }}
                  />

                  <span
                    className={
                      "absolute left-3 top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white " +
                      (isFirst ? "border-[#1B1C1F]" : "border-gray-300")
                    }
                  >
                    <span
                      className={
                        "h-2 w-2 rounded-full " +
                        (isFirst ? "bg-[#1B1C1F]" : "bg-gray-300")
                      }
                    />
                  </span>

                  <Reveal delay={index * 80}>
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white px-4 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:justify-between sm:px-8 sm:text-left">
                      <span className="text-base font-medium text-gray-700 sm:text-lg">
                        {item.nama}
                      </span>
                      <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        {formatPeriode(item.periode_mulai, item.periode_selesai)}
                      </span>
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}

export default History