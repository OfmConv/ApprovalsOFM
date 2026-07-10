import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images, Plus, Pencil, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Modal } from "@/utils/Modals";
import {
    axiosInstance,
    getGalleryPhotos,
    requestGalleryPhotoChange,
    updateGalleryPhotoDirect,
} from "@/services/api";
import type { PresignResponse } from "@/types/interface";

type GalleryPhotoRecord = {
    gallery_id: number;
    file_path: string;
    title: string;
    description: string;
};

export default function PhotoGallerySection({ nkp, isAdmin = false }: { nkp: string; isAdmin?: boolean }) {
    const [photos, setPhotos] = useState<GalleryPhotoRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<GalleryPhotoRecord | null>(null);
    const [form, setForm] = useState({ title: "", description: "" });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<GalleryPhotoRecord | null>(null);

    useEffect(() => {
        async function load() {
            if (!nkp) return;
            setLoading(true);
            try {
                const data = await getGalleryPhotos(nkp);
                setPhotos(data ?? []);
            } catch (error) {
                console.error("Failed to load gallery photos:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [nkp]);

    const openAddForm = () => {
        setEditingRecord(null);
        setForm({ title: "", description: "" });
        setPreviewUrl(null);
        setUploadedUrl(null);
        setFormOpen(true);
    };

    const openEditForm = (record: GalleryPhotoRecord) => {
        setEditingRecord(record);
        setForm({ title: record.title, description: record.description });
        setPreviewUrl(record.file_path);
        // foto lama sudah punya URL R2 valid, langsung pakai sebagai uploadedUrl
        // supaya kalau user tidak ganti foto, file_path lama tetap terpakai saat save
        setUploadedUrl(record.file_path);
        setFormOpen(true);
    };

    // Upload langsung ke R2 begitu file dipilih, mengikuti alur yang sama
    // dengan ProfileHeader (background/profile): presign -> PUT ke R2 -> public_url.
    // uploadedUrl (public_url dari R2) yang nantinya dikirim sebagai file_path,
    // bukan base64.
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!nkp) {
            console.error("[PhotoGallerySection] nkp kosong, tidak bisa upload");
            setErrorMessage("NKP tidak ditemukan, tidak bisa mengunggah foto.");
            setErrorModalOpen(true);
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setUploadedUrl(null);
        setUploadingPhoto(true);

        try {
            const presignRes = await axiosInstance.post<PresignResponse>("/storage/presign", {
                type: "gallery",
                nkp: String(nkp),
                content_type: file.type,
            });

            const { upload_url, public_url } = presignRes.data;

            const uploadRes = await fetch(upload_url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!uploadRes.ok) {
                const errText = await uploadRes.text();
                console.error("[PhotoGallerySection] upload ke R2 gagal:", errText);
                throw new Error("Gagal upload gambar ke storage");
            }

            setUploadedUrl(public_url);
        } catch (error) {
            console.error("[PhotoGallerySection] handleFileChange error:", error);
            setErrorMessage("Gagal mengunggah foto, silakan coba lagi.");
            setErrorModalOpen(true);
            setPreviewUrl(editingRecord?.file_path ?? null);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSaveForm = async () => {
        if (!form.title) {
            setErrorMessage("Judul foto wajib diisi.");
            setErrorModalOpen(true);
            return;
        }
        if (!uploadedUrl) {
            setErrorMessage(
                uploadingPhoto
                    ? "Foto masih diunggah, tunggu sebentar."
                    : "Silakan pilih foto terlebih dahulu."
            );
            setErrorModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const action = editingRecord ? "update" : "insert";
            const payload = {
                file_path: uploadedUrl,
                title: form.title,
                description: form.description,
            };

            if (isAdmin) {
                const res = await updateGalleryPhotoDirect(nkp, action, payload, editingRecord?.gallery_id);
                setFormOpen(false);
                setSuccessMessage(res?.message || "Foto berhasil disimpan.");
                setSuccessModalOpen(true);

                const data = await getGalleryPhotos(nkp);
                setPhotos(data ?? []);
            } else {
                const res = await requestGalleryPhotoChange(
                    nkp,
                    editingRecord ? "Koreksi foto galeri" : "Menambahkan foto galeri baru",
                    action,
                    payload,
                    editingRecord?.gallery_id
                );
                setFormOpen(false);
                setSuccessMessage(res?.message || "Pengajuan berhasil dikirim, menunggu approval.");
                setSuccessModalOpen(true);
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.");
            setErrorModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const payload = {
                file_path: deleteTarget.file_path,
                title: deleteTarget.title,
                description: deleteTarget.description,
            };

            if (isAdmin) {
                const res = await updateGalleryPhotoDirect(nkp, "delete", payload, deleteTarget.gallery_id);
                setSuccessMessage(res?.message || "Foto berhasil dihapus.");
                setSuccessModalOpen(true);

                const data = await getGalleryPhotos(nkp);
                setPhotos(data ?? []);
            } else {
                const res = await requestGalleryPhotoChange(
                    nkp,
                    "Menghapus foto galeri",
                    "delete",
                    payload,
                    deleteTarget.gallery_id
                );
                setSuccessMessage(res?.message || "Pengajuan hapus berhasil dikirim, menunggu approval.");
                setSuccessModalOpen(true);
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.");
            setErrorModalOpen(true);
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="mx-auto space-y-5 mt-5">
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                                <Images className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                                <h2 className="text-left font-semibold text-gray-800">Galeri Foto</h2>
                                <p className="text-xs text-gray-400">Unggah dokumentasi kegiatan.</p>
                            </div>
                        </div>

                        <Button
                            onClick={openAddForm}
                            size="sm"
                            className="rounded-full text-white hover:opacity-90 gap-1"
                            style={{ backgroundColor: "#1B3A5C" }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Tambah
                        </Button>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-400 text-center py-6">Memuat data...</p>
                    ) : photos.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">
                            Belum ada foto. Klik "Tambah" untuk mengunggah.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {photos.map((photo) => (
                                <div
                                    key={photo.gallery_id}
                                    className="group relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50/60"
                                >
                                    <img
                                        src={photo.file_path}
                                        alt={photo.title}
                                        className="w-full aspect-square object-cover"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => openEditForm(photo)}
                                            className="p-2 rounded-full bg-white/90 text-gray-700 hover:text-[#1B3A5C]"
                                            title="Edit"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(photo)}
                                            className="p-2 rounded-full bg-white/90 text-gray-700 hover:text-red-500"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="p-2">
                                        <p className="text-xs font-medium text-gray-800 truncate">{photo.title}</p>
                                        {photo.description && (
                                            <p className="text-[11px] text-gray-400 truncate">{photo.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal tambah / edit */}
            <Modal
                title={editingRecord ? "Edit Foto" : "Tambah Foto"}
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onConfirm={handleSaveForm}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Foto</p>
                        <label className="relative flex flex-col items-center justify-center gap-2 h-40 rounded-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#1B3A5C] transition-colors overflow-hidden">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImagePlus className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-400">Klik untuk pilih foto</span>
                                </>
                            )}
                            {uploadingPhoto && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 text-white text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengunggah...
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingPhoto}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Judul</p>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Judul foto"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Deskripsi</p>
                        <Input
                            value={form.description}
                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Deskripsi (opsional)"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    {isSubmitting && (
                        <p className="text-xs text-gray-400">
                            {isAdmin ? "Menyimpan perubahan..." : "Mengirim pengajuan..."}
                        </p>
                    )}
                </div>
            </Modal>

            {/* Modal konfirmasi hapus */}
            <Modal
                title="Hapus Foto"
                description={
                    deleteTarget
                        ? isAdmin
                            ? `Yakin ingin menghapus foto "${deleteTarget.title}"? Data akan langsung terhapus.`
                            : `Yakin ingin mengajukan penghapusan foto "${deleteTarget.title}"? Perubahan ini butuh persetujuan admin.`
                        : ""
                }
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />

            {/* Modal error */}
            <Modal
                title="Gagal Mengirim Pengajuan"
                description={errorMessage}
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
            />

            {/* Modal sukses */}
            <Modal
                title={isAdmin ? "Perubahan Disimpan" : "Pengajuan Terkirim"}
                description={successMessage}
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
            />
        </div>
    );
}