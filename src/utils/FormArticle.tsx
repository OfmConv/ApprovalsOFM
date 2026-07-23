"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { axiosInstance } from "@/services/api"
import { getArticles, createArticle, updateArticle, deleteArticle } from "@/services/api"
import type { PresignResponse } from "@/types/interface"

const MAX_FILE_SIZE_MB = 5
const DEBOUNCE_MS = 300

interface Article {
  id: number
  jdl_artikel: string
  description: string
  img: string
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

const ArticleListItem = React.memo(function ArticleListItem({
  article,
  onEdit,
  onDelete,
  isDeleting,
}: {
  article: Article
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
  isDeleting: boolean
}) {
  const isProtected = article.id === 1 || article.id === 2

  return (
    <div className="flex items-center justify-between gap-4 py-4 w-full min-w-0">
      <div className="flex items-center gap-4 min-w-0">
        {article.img && (
          <img
            src={article.img}
            alt={article.jdl_artikel}
            loading="lazy"
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="font-medium truncate">{article.jdl_artikel}</p>
          <p className="text-sm text-muted-foreground truncate">{article.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(article)} disabled={isDeleting}>
          Edit
        </Button>
        {!isProtected && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(article.id)} disabled={isDeleting}>
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        )}
      </div>
    </div>
  )
})

export function ArticleForm() {
  const [jdlArtikel, setJdlArtikel] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [photo, setPhoto] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [status, setStatus] = React.useState<{ state: string; message: string }>({
    state: "idle",
    message: "",
  })

  const [articles, setArticles] = React.useState<Article[]>([])
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const isEditing = editingId !== null

  const debouncedJdl = useDebouncedValue(jdlArtikel, DEBOUNCE_MS)
  const debouncedDescription = useDebouncedValue(description, DEBOUNCE_MS)

  const fetchArticles = React.useCallback(async () => {
    try {
      const data = await getArticles()
      setArticles(data || [])
    } catch (error) {
      console.error("[fetchArticles] error:", error)
    }
  }, [])

  React.useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // validasi ringan jalan setelah user berhenti mengetik, bukan tiap keystroke
  React.useEffect(() => {
    if (status.state !== "error") return
    if (debouncedJdl && debouncedDescription) {
      setStatus({ state: "idle", message: "" })
    }
  }, [debouncedJdl, debouncedDescription, status.state])

  const handlePhotoChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setStatus({ state: "error", message: `Ukuran gambar maksimal ${MAX_FILE_SIZE_MB}MB` })
      setPhoto(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setStatus({ state: "idle", message: "" })
    setPhoto(file)
  }, [])

  const resetForm = React.useCallback(() => {
    setJdlArtikel("")
    setDescription("")
    setPhoto(null)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const handleEditClick = React.useCallback((article: Article) => {
    setEditingId(article.id)
    setJdlArtikel(article.jdl_artikel)
    setDescription(article.description)
    setPhoto(null)
    setStatus({ state: "idle", message: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleCancelEdit = React.useCallback(() => {
    resetForm()
  }, [resetForm])

 const handleDelete = React.useCallback(
  async (id: number) => {
    if (id === 1 || id === 2) {
      setStatus({ state: "error", message: "Artikel ini tidak boleh dihapus" })
      return
    }

    setDeletingId(id)
    try {
      await deleteArticle(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
      if (editingId === id) {
        resetForm()
      }
    } catch (error: any) {
      console.error("[handleDelete] error:", error)
      setStatus({
        state: "error",
        message: error.response?.data?.message || error.message || "Gagal menghapus artikel",
      })
    } finally {
      setDeletingId(null)
    }
  },
  [editingId, resetForm]
)

  const handleSubmit = React.useCallback(async () => {
    if (!jdlArtikel || !description || (!isEditing && !photo)) {
      setStatus({ state: "error", message: "Judul, deskripsi, dan gambar wajib diisi" })
      return
    }

    setStatus({ state: "loading", message: "" })

    try {
      let imgUrl: string | undefined

      if (photo) {
        const presignRes = await axiosInstance.post<PresignResponse>("/storage/presign", {
          type: "artikel",
          content_type: photo.type,
        })

        const { upload_url, public_url } = presignRes.data

        const uploadRes = await fetch(upload_url, {
          method: "PUT",
          headers: { "Content-Type": photo.type },
          body: photo,
        })

        if (!uploadRes.ok) {
          const errText = await uploadRes.text()
          console.error("[handleSubmit] upload ke R2 gagal:", errText)
          throw new Error("Gagal upload gambar ke storage")
        }

        imgUrl = public_url
      }

      if (isEditing && editingId !== null) {
        await updateArticle(editingId, {
          jdl_artikel: jdlArtikel,
          description,
          ...(imgUrl ? { img: imgUrl } : {}),
        })
        setStatus({ state: "success", message: "Artikel berhasil diupdate" })
      } else {
        await createArticle({
          jdl_artikel: jdlArtikel,
          description,
          img: imgUrl || "",
        })
        setStatus({ state: "success", message: "Artikel berhasil ditambahkan" })
      }

      resetForm()
      fetchArticles()
    } catch (error: any) {
      console.error("[handleSubmit] error:", error)
      setStatus({
        state: "error",
        message: error.response?.data?.message || error.message || "Terjadi kesalahan",
      })
    }
  }, [jdlArtikel, description, photo, isEditing, editingId, resetForm, fetchArticles])

  const isLoading = status.state === "loading"
  const isDisabled = isLoading || !jdlArtikel || !description || (!isEditing && !photo)

  return (
    <div className="w-full p-10">
      
      <div className="flex flex-col gap-3 border bg-card shadow-sm rounded-2xl p-6">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Judul Artikel</Label>
          <Input
            type="text"
            placeholder="Judul artikel..."
            value={jdlArtikel}
            onChange={(e) => setJdlArtikel(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Deskripsi</Label>
          <Textarea
            placeholder="Deskripsi artikel..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Gambar{" "}
            {isEditing && (
              <span className="text-xs text-muted-foreground">
                (opsional, kosongkan jika tidak diganti)
              </span>
            )}
          </Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="cursor-pointer file:text-sm file:font-medium"
            disabled={isLoading}
          />
        </div>

        <div className="text-right ">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-fit px-6 bg-[#2E6193] hover:bg-[#1477C2] text-white"
          >
            {isLoading
              ? isEditing
                ? "Mengupdate..."
                : "Menyimpan..."
              : isEditing
              ? "Update Artikel"
              : "Simpan Artikel"}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="w-fit px-6"
            >
              Batal
            </Button>
          )}
        </div>

        {status.state === "success" && <p className="text-xs text-green-600">{status.message}</p>}
        {status.state === "error" && <p className="text-xs text-red-600">{status.message}</p>}
      </div>

      <div className="mt-6 border bg-card shadow-sm rounded-2xl p-6 min-w-0">
        <h3 className="text-center text-lg font-semibold mb-4">Artikel Tersimpan</h3>

        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">Belum ada artikel</p>
        )}

        <div className="flex flex-col divide-y w-full min-w-0">
          {articles.map((article) => (
            <ArticleListItem
              key={article.id}
              article={article}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              isDeleting={deletingId === article.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}