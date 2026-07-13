"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Pencil } from "lucide-react"
import { Modal } from "@/utils/Modals"
import {
  getAllMinisterProvinsial,
  createMinisterProvinsial,
  updateMinisterProvinsial,
  deleteMinisterProvinsial,
} from "@/services/api"

type MinisterProvinsial = {
  id: number
  nama: string
  periode_mulai?: string | null
  periode_selesai?: string | null
  keterangan?: string | null
  urutan?: number | null
}

const EMPTY_FORM = {
  nama: "",
  periode_mulai: "",
  periode_selesai: "",
  keterangan: "",
  urutan: "",
}

function toDateInputValue(value?: string | null) {
  if (!value) return ""
  return value.split("T")[0]
}

export function MinisterProvinsialForm() {
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [submitting, setSubmitting] = React.useState(false)

  const [list, setList] = React.useState<MinisterProvinsial[]>([])
  const [loading, setLoading] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const [editItem, setEditItem] = React.useState<MinisterProvinsial | null>(null)
  const [editForm, setEditForm] = React.useState(EMPTY_FORM)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [editSubmitting, setEditSubmitting] = React.useState(false)

  const [resultModal, setResultModal] = React.useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })

  async function loadData() {
    try {
      setLoading(true)
      const data = await getAllMinisterProvinsial()
      setList(data ?? [])
    } catch (error) {
      console.error("Gagal mengambil data minister provinsial:", error)
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

  function resetForm() {
    setForm(EMPTY_FORM)
  }

  function openEditModal(item: MinisterProvinsial) {
    setEditItem(item)
    setEditForm({
      nama: item.nama ?? "",
      periode_mulai: toDateInputValue(item.periode_mulai),
      periode_selesai: toDateInputValue(item.periode_selesai),
      keterangan: item.keterangan ?? "",
      urutan: item.urutan != null ? String(item.urutan) : "",
    })
    setShowEditModal(true)
  }

  function closeEditModal() {
    setShowEditModal(false)
    setEditItem(null)
    setEditForm(EMPTY_FORM)
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.nama) {
      setResultModal({
        open: true,
        title: "Data Belum Lengkap",
        description: "Nama wajib diisi.",
      })
      return
    }

    const payload = {
      nama: form.nama,
      periode_mulai: form.periode_mulai || undefined,
      periode_selesai: form.periode_selesai || undefined,
      keterangan: form.keterangan || undefined,
      urutan: form.urutan ? Number(form.urutan) : undefined,
    }

    try {
      setSubmitting(true)
      await createMinisterProvinsial(payload)
      setResultModal({
        open: true,
        title: "Data Berhasil Dibuat",
        description: `${form.nama} berhasil ditambahkan.`,
      })
      resetForm()
      await loadData()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi"
      setResultModal({
        open: true,
        title: "Gagal Membuat Data",
        description: message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditSubmit() {
    if (!editItem) return

    if (!editForm.nama) {
      setResultModal({
        open: true,
        title: "Data Belum Lengkap",
        description: "Nama wajib diisi.",
      })
      return
    }

    const payload = {
      nama: editForm.nama,
      periode_mulai: editForm.periode_mulai || undefined,
      periode_selesai: editForm.periode_selesai || undefined,
      keterangan: editForm.keterangan || undefined,
      urutan: editForm.urutan ? Number(editForm.urutan) : undefined,
    }

    try {
      setEditSubmitting(true)
      await updateMinisterProvinsial(editItem.id, payload)
      setResultModal({
        open: true,
        title: "Data Berhasil Diupdate",
        description: `${editForm.nama} berhasil diperbarui.`,
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

  async function handleDelete(item: MinisterProvinsial) {
    const confirmed = window.confirm(`Hapus "${item.nama}"? Aksi ini tidak bisa dibatalkan.`)
    if (!confirmed) return

    try {
      setDeletingId(item.id)
      await deleteMinisterProvinsial(item.id)
      setResultModal({
        open: true,
        title: "Data Dihapus",
        description: `${item.nama} berhasil dihapus.`,
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
    <div className=" space-y-10">
      {/* FORM CREATE SAJA */}
      <form onSubmit={handleCreateSubmit} className="space-y-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-base font-semibold">Tambah Data Baru</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              value={form.nama}
              onChange={(e) => updateField("nama", e.target.value)}
              placeholder="Sdr. Maximilianus Kalef Sembiring, OFMConv"
              required
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
              placeholder="Kosongkan jika masih menjabat"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="keterangan">Keterangan (opsional)</Label>
            <Textarea
              id="keterangan"
              value={form.keterangan}
              onChange={(e) => updateField("keterangan", e.target.value)}
              placeholder="Catatan tambahan tentang masa jabatan ini"
              rows={3}
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto  bg-[#2E6193] hover:bg-[#1477C2] text-white">
          <Plus className="h-4 w-4" />
          {submitting ? "Menyimpan..." : "Simpan Data"}
        </Button>
      </form>

      {/* LIST + EDIT + DELETE */}
      <div className="rounded-xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Data Minister Provinsial Tersimpan</h2>
        <Separator className="mb-4" />

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          <div className="space-y-2">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-start font-medium">{item.nama}</p>
                  <p className="text-start text-muted-foreground">
                    {toDateInputValue(item.periode_mulai) || "?"} –{" "}
                    {toDateInputValue(item.periode_selesai) || "saat ini"}
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
                    <Trash2 className="h-4 w-4 " />
                    {deletingId === item.id ? "Menghapus..." : "Hapus"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL EDIT (POPUP) */}
      <Modal
        title={`Edit: ${editItem?.nama ?? ""}`}
        description="Perbarui data minister provinsial di bawah ini."
        open={showEditModal}
        onClose={closeEditModal}
        onConfirm={handleEditSubmit}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-nama">Nama</Label>
            <Input
              id="edit-nama"
              value={editForm.nama}
              onChange={(e) => updateEditField("nama", e.target.value)}
              placeholder="Sdr. Maximilianus Kalef Sembiring, OFMConv"
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
              placeholder="Kosongkan jika masih menjabat"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-urutan">Urutan Tampil</Label>
            <Input
              id="edit-urutan"
              type="number"
              min="1"
              step="1"
              value={editForm.urutan}
              onChange={(e) => {
                const value = e.target.value
                if (value !== "" && Number(value) < 1) return
                updateEditField("urutan", value)
              }}
              placeholder="1"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-keterangan">Keterangan (opsional)</Label>
            <Textarea
              id="edit-keterangan"
              value={editForm.keterangan}
              onChange={(e) => updateEditField("keterangan", e.target.value)}
              placeholder="Catatan tambahan tentang masa jabatan ini"
              rows={3}
            />
          </div>
        </div>
        {editSubmitting && (
          <p className="text-xs text-muted-foreground mt-3">Menyimpan perubahan...</p>
        )}
      </Modal>

      {/* MODAL HASIL (sukses/gagal) */}
      <Modal
        title={resultModal.title}
        description={resultModal.description}
        open={resultModal.open}
        onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}