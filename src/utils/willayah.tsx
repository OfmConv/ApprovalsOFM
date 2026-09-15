"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Pencil } from "lucide-react"
import { Modal } from "@/utils/Modals"
import {
  getAllWilayah,
  createWilayah,
  updateWilayah,
  deleteWilayah,
} from "@/services/api"

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
  tanggal_berdiri?: string | null
}

const EMPTY_FORM = {
  nama_lokasi: "",
  status: "",
  kota: "",
  provinsi: "",
  negara: "Indonesia",
  pemimpin: "",
  jabatan: "Guardian",
  periode_mulai: "",
  periode_selesai: "",
  fungsi_khusus: "",
  tanggal_berdiri: "",
}

function toDateInputValue(value?: string | null) {
  if (!value) return ""
  return value.split("T")[0]
}

export function WilayahForm() {
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [wilayahList, setWilayahList] = React.useState<Wilayah[]>([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  // --- state untuk modal edit ---
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [editItem, setEditItem] = React.useState<Wilayah | null>(null)
  const [editForm, setEditForm] = React.useState(EMPTY_FORM)
  const [editSubmitting, setEditSubmitting] = React.useState(false)

  const [resultModal, setResultModal] = React.useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })

  async function loadData() {
    try {
      setLoading(true)
      const data = await getAllWilayah()
      // urutkan berdasarkan tanggal_berdiri (tertua -> termuda), data tanpa tanggal ditaruh di bawah
      const sorted = [...(data ?? [])].sort((a: Wilayah, b: Wilayah) => {
        if (!a.tanggal_berdiri && !b.tanggal_berdiri) return 0
        if (!a.tanggal_berdiri) return 1
        if (!b.tanggal_berdiri) return -1
        return new Date(a.tanggal_berdiri).getTime() - new Date(b.tanggal_berdiri).getTime()
      })
      setWilayahList(sorted)
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

  function updateEditField(key: keyof typeof editForm, value: string) {
    setEditForm((prev) => ({ ...prev, [key]: value }))
  }

  // --- buka modal edit, isi form dengan data item yang diklik ---
  function openEditModal(item: Wilayah) {
    setEditItem(item)
    setEditForm({
      nama_lokasi: item.nama_lokasi ?? "",
      status: item.status ?? "",
      kota: item.kota ?? "",
      provinsi: item.provinsi ?? "",
      negara: item.negara ?? "Indonesia",
      pemimpin: item.pemimpin ?? "",
      jabatan: item.jabatan ?? "Guardian",
      periode_mulai: toDateInputValue(item.periode_mulai),
      periode_selesai: toDateInputValue(item.periode_selesai),
      fungsi_khusus: item.fungsi_khusus ?? "",
      tanggal_berdiri: toDateInputValue(item.tanggal_berdiri),
    })
    setShowEditModal(true)
  }

  function closeEditModal() {
    setShowEditModal(false)
    setEditItem(null)
    setEditForm(EMPTY_FORM)
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
        tanggal_berdiri: form.tanggal_berdiri || undefined,
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

  // --- submit perubahan dari modal edit ---
  async function handleEditSubmit() {
    if (!editItem) return

    if (!editForm.nama_lokasi || !editForm.status) {
      setResultModal({
        open: true,
        title: "Data Belum Lengkap",
        description: "Nama Lokasi dan Status wajib diisi.",
      })
      return
    }

    const payload = {
      nama_lokasi: editForm.nama_lokasi,
      status: editForm.status,
      kota: editForm.kota,
      provinsi: editForm.provinsi,
      negara: editForm.negara || "Indonesia",
      pemimpin: editForm.pemimpin,
      jabatan: editForm.jabatan,
      periode_mulai: editForm.periode_mulai || undefined,
      periode_selesai: editForm.periode_selesai || undefined,
      fungsi_khusus: editForm.fungsi_khusus || undefined,
      tanggal_berdiri: editForm.tanggal_berdiri || undefined,
    }

    try {
      setEditSubmitting(true)
      await updateWilayah(editItem.id, payload)
      setResultModal({
        open: true,
        title: "Wilayah Berhasil Diupdate",
        description: `${editForm.nama_lokasi} berhasil diperbarui.`,
      })
      closeEditModal()
      await loadData()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi"
      setResultModal({
        open: true,
        title: "Gagal Mengupdate",
        description: message,
      })
    } finally {
      setEditSubmitting(false)
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
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6 rounded-xl border p-6 shadow-sm">

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nama_lokasi">komunitas</Label>
            <Input
              id="nama_lokasi"
              value={form.nama_lokasi}
              autoComplete="off"
              onChange={(e) => updateField("nama_lokasi", e.target.value)}
              placeholder="Biara St. Yosep"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Karya</Label>
            <Input
              id="status"
              value={form.status}
              autoComplete="off"
              onChange={(e) => updateField("status", e.target.value)}
              placeholder="Isi karya..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kota">Kota</Label>
            <Input
              id="kota"
              value={form.kota}
              autoComplete="off"
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
            <Label htmlFor="negara">Negara</Label>
            <Input
              id="negara"
              value={form.negara}
              autoComplete="off"
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
              autoComplete="off"
              onChange={(e) => updateField("periode_selesai", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tanggal_berdiri">Tanggal Berdiri</Label>
            <Input
              id="tanggal_berdiri"
              type="date"
              value={form.tanggal_berdiri}
              autoComplete="off"
              onChange={(e) => updateField("tanggal_berdiri", e.target.value)}
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
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(item)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === item.id ? "Menghapus..." : "Hapus"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Edit — muncul saat tombol Edit ditekan */}
      <Modal
        title={`Edit: ${editItem?.nama_lokasi ?? ""}`}
        description="Perbarui data wilayah di bawah ini."
        open={showEditModal}
        onClose={closeEditModal}
        onConfirm={handleEditSubmit}
      >
        <div className="max-h-[65vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-nama_lokasi">Komunitas</Label>
            <Input
              id="edit-nama_lokasi"
              value={editForm.nama_lokasi}
              onChange={(e) => updateEditField("nama_lokasi", e.target.value)}
              placeholder="Biara St. Yosep"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-status">Karya</Label>
            <Input
              id="edit-status"
              value={editForm.status}
              onChange={(e) => updateEditField("status", e.target.value)}
              placeholder="Isi karya..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-kota">Kota</Label>
            <Input
              id="edit-kota"
              value={editForm.kota}
              onChange={(e) => updateEditField("kota", e.target.value)}
              placeholder="Delitua"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-provinsi">Provinsi</Label>
            <Input
              id="edit-provinsi"
              value={editForm.provinsi}
              onChange={(e) => updateEditField("provinsi", e.target.value)}
              placeholder="Sumatera Utara"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-negara">Negara</Label>
            <Input
              id="edit-negara"
              value={editForm.negara}
              onChange={(e) => updateEditField("negara", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-pemimpin">Guardian</Label>
            <Input
              id="edit-pemimpin"
              value={editForm.pemimpin}
              onChange={(e) => updateEditField("pemimpin", e.target.value)}
              placeholder="Sdr. Rufinus Ero Jenska P., OFMConv"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-periode_mulai">Periode Mulai</Label>
            <Input
              id="edit-periode_mulai"
              type="date"
              value={editForm.periode_mulai}
              onChange={(e) => updateEditField("periode_mulai", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-periode_selesai">Periode Selesai</Label>
            <Input
              id="edit-periode_selesai"
              type="date"
              value={editForm.periode_selesai}
              onChange={(e) => updateEditField("periode_selesai", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-tanggal_berdiri">Tanggal Berdiri</Label>
            <Input
              id="edit-tanggal_berdiri"
              type="date"
              value={editForm.tanggal_berdiri}
              onChange={(e) => updateEditField("tanggal_berdiri", e.target.value)}
            />
          </div>
        </div>
        {editSubmitting && (
          <p className="text-xs text-muted-foreground mt-3">Menyimpan perubahan...</p>
        )}
        </div>
      </Modal>

      <Modal
        title={resultModal.title}
        description={resultModal.description}
        open={resultModal.open}
        onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}