"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus } from "lucide-react"
import { Modal } from "@/utils/Modals"
import { getAllWilayah, createWilayah, deleteWilayah } from "@/services/api"

type Wilayah = {
  id: number
  nama_lokasi: string
  status: string
  kota: string
  provinsi: string
  negara: string
  pemimpin: string
  jabatan: string
  periode_mulai?: string | null
  periode_selesai?: string | null
  fungsi_khusus?: string | null
}

const EMPTY_FORM = {
  nama_lokasi: "",
  status: "",
  kota: "",
  provinsi: "",
  negara: "Indonesia",
  pemimpin: "",
  jabatan: "",
  periode_mulai: "",
  periode_selesai: "",
  fungsi_khusus: "",
}

export function WilayahForm() {
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [wilayahList, setWilayahList] = React.useState<Wilayah[]>([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [resultModal, setResultModal] = React.useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })

  async function loadData() {
    try {
      setLoading(true)
      const data = await getAllWilayah()
      setWilayahList(data ?? [])
    } catch (error) {
      console.error("Gagal mengambil data wilayah:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.nama_lokasi || !form.status) {
      setResultModal({
        open: true,
        title: "Data Belum Lengkap",
        description: "Nama Lokasi dan Status wajib diisi.",
      })
      return
    }

    try {
      setSubmitting(true)
      await createWilayah({
        nama_lokasi: form.nama_lokasi,
        status: form.status,
        kota: form.kota,
        provinsi: form.provinsi,
        negara: form.negara || "Indonesia",
        pemimpin: form.pemimpin,
        jabatan: form.jabatan,
        periode_mulai: form.periode_mulai || undefined,
        periode_selesai: form.periode_selesai || undefined,
        fungsi_khusus: form.fungsi_khusus || undefined,
      })

      setResultModal({
        open: true,
        title: "Wilayah Berhasil Dibuat",
        description: `${form.nama_lokasi} berhasil ditambahkan.`,
      })
      setForm(EMPTY_FORM)
      await loadData()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi"
      setResultModal({
        open: true,
        title: "Gagal Membuat Wilayah",
        description: message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(item: Wilayah) {
    const confirmed = window.confirm(`Hapus "${item.nama_lokasi}"? Aksi ini tidak bisa dibatalkan.`)
    if (!confirmed) return

    try {
      setDeletingId(item.id)
      await deleteWilayah(item.id)
      setResultModal({
        open: true,
        title: "Wilayah Dihapus",
        description: `${item.nama_lokasi} berhasil dihapus.`,
      })
      await loadData()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi"
      setResultModal({
        open: true,
        title: "Gagal Menghapus",
        description: message,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className=" space-y-10 ">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border p-6 shadow-sm">


        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nama_lokasi">Nama Lokasi</Label>
            <Input
              id="nama_lokasi"
              value={form.nama_lokasi}
              onChange={(e) => updateField("nama_lokasi", e.target.value)}
              placeholder="Biara St. Yosep"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">keterangan</Label>
            <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Biara">Biara</SelectItem>
                <SelectItem value="Rumah Filial">Rumah Filial</SelectItem>
                <SelectItem value="Kantor Provinsi">Kantor Provinsi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kota">Kota</Label>
            <Input
              id="kota"
              value={form.kota}
              onChange={(e) => updateField("kota", e.target.value)}
              placeholder="Delitua"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="provinsi">Provinsi</Label>
            <Input
              id="provinsi"
              value={form.provinsi}
              onChange={(e) => updateField("provinsi", e.target.value)}
              placeholder="Sumatera Utara"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="negara">Komunitas</Label>
            <Input
              id="negara"
              value={form.negara}
              onChange={(e) => updateField("negara", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pemimpin">Guardian</Label>
            <Input
              id="pemimpin"
              value={form.pemimpin}
              onChange={(e) => updateField("pemimpin", e.target.value)}
              placeholder="Sdr. Rufinus Ero Jenska P., OFMConv"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="periode_mulai">Periode Mulai</Label>
            <Input
              id="periode_mulai"
              type="date"
              value={form.periode_mulai}
              onChange={(e) => updateField("periode_mulai", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="periode_selesai">Periode Selesai</Label>
            <Input
              id="periode_selesai"
              type="date"
              value={form.periode_selesai}
              onChange={(e) => updateField("periode_selesai", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="fungsi_khusus">Karya</Label>
            <Input
              id="fungsi_khusus"
              value={form.fungsi_khusus}
              onChange={(e) => updateField("fungsi_khusus", e.target.value)}
              placeholder="Kantor Pusat Provinsi"
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#2E6193] hover:bg-[#1477C2] text-white ">
          <Plus className="h-4 w-4" />
          {submitting ? "Menyimpan..." : "Simpan Wilayah"}
        </Button>
      </form>

      <div className="rounded-xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Data Wilayah Tersimpan</h2>
        <Separator className="mb-4" />

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : wilayahList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data wilayah.</p>
        ) : (
          <div className="space-y-2">
            {wilayahList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-start font-medium">{item.nama_lokasi}</p>
                  <p className="text-start text-muted-foreground">
                    {item.status} &middot; {item.kota}, {item.provinsi}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === item.id ? "Menghapus..." : "Hapus"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={resultModal.title}
        description={resultModal.description}
        open={resultModal.open}
        onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}