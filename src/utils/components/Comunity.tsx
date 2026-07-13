import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/utils/Modals";
import { getAssignment, requestAssignmentChange, updateAssignmentDirect } from "@/services/api";

type AssignmentRecord = {
    assignment_id: number;
    nkp: string;
    location: string;
    tugas: string;
    date: string;
};

export default function CommunitySection({ nkp, isAdmin = false }: { nkp: string; isAdmin?: boolean }) {
    const [list, setList] = useState<AssignmentRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AssignmentRecord | null>(null);
    const [form, setForm] = useState({ location: "", tugas: "", date: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<AssignmentRecord | null>(null);

    useEffect(() => {
        async function load() {
            if (!nkp) return;
            setLoading(true);
            try {
                const data = await getAssignment(nkp);
                setList(data ?? []);
            } catch (error) {
                console.error("Failed to load assignments:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [nkp]);

    const openAddForm = () => {
        setEditingRecord(null);
        setForm({ location: "", tugas: "", date: "" });
        setFormOpen(true);
    };

    const openEditForm = (record: AssignmentRecord) => {
        setEditingRecord(record);
        setForm({
            location: record.location,
            tugas: record.tugas,
            date: record.date?.split("T")[0] ?? "",
        });
        setFormOpen(true);
    };

    const handleSaveForm = async () => {
        if (!form.location || !form.tugas || !form.date) {
            setErrorMessage("Lokasi, tugas, dan tanggal wajib diisi.");
            setErrorModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const action = editingRecord ? "update" : "insert";

            if (isAdmin) {
                const res = await updateAssignmentDirect(nkp, action, form, editingRecord?.assignment_id);
                setFormOpen(false);
                setSuccessMessage(res?.message || "Data penugasan berhasil disimpan.");
                setSuccessModalOpen(true);

                const data = await getAssignment(nkp);
                setList(data ?? []);
            } else {
                const res = await requestAssignmentChange(
                    nkp,
                    editingRecord ? "Koreksi data penugasan" : "Menambahkan penugasan baru",
                    action,
                    form,
                    editingRecord?.assignment_id
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
                location: deleteTarget.location,
                tugas: deleteTarget.tugas,
                date: deleteTarget.date,
            };

            if (isAdmin) {
                const res = await updateAssignmentDirect(nkp, "delete", payload, deleteTarget.assignment_id);
                setSuccessMessage(res?.message || "Data penugasan berhasil dihapus.");
                setSuccessModalOpen(true);

                const data = await getAssignment(nkp);
                setList(data ?? []);
            } else {
                const res = await requestAssignmentChange(
                    nkp,
                    "Menghapus penugasan",
                    "delete",
                    payload,
                    deleteTarget.assignment_id
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
                                <Users className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                                <h2 className="text-left font-semibold text-gray-800">Komunitas & Karya (Tugas)</h2>
                                <p className="text-left text-gray-400">Isi riwayat penugasan / komunitas.</p>
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
                    ) : list.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">
                            Belum ada data penugasan. Klik "Tambah" untuk menambahkan.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {list.map((record) => (
                                <div
                                    key={record.assignment_id}
                                    className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3.5"
                                >
                                    <div className="flex flex-1 items-start gap-4 min-w-0">
                                        {/* Lokasi + tanggal */}
                                        <div className="shrink-0 w-44">
                                            <span
                                                className="inline-block max-w-full truncate px-3 py-1 rounded-full text-white text-xs font-medium"
                                                style={{ backgroundColor: "#1B3A5C" }}
                                                title={record.location}
                                            >
                                                {record.location}
                                            </span>
                                            <p className="mt-1.5 text-xs text-gray-400">
                                                {record.date?.split("T")[0]}
                                            </p>
                                        </div>

                                        {/* Tugas */}
                                        <p className="text-sm text-gray-700 leading-relaxed pt-0.5">
                                            {record.tugas}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => openEditForm(record)}
                                            className="p-1.5 text-gray-400 hover:text-[#1B3A5C] transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(record)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal
                title={editingRecord ? "Edit Penugasan" : "Tambah Penugasan"}
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onConfirm={handleSaveForm}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Lokasi</p>
                        <Input
                            value={form.location}
                            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Nama tempat/paroki"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Tugas</p>
                        <Input
                            value={form.tugas}
                            onChange={(e) => setForm((prev) => ({ ...prev, tugas: e.target.value }))}
                            placeholder="Jabatan / tugas"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Tanggal</p>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
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

            <Modal
                title="Hapus Penugasan"
                description={
                    deleteTarget
                        ? isAdmin
                            ? `Yakin ingin menghapus "${deleteTarget.tugas}" di ${deleteTarget.location}? Data akan langsung terhapus.`
                            : `Yakin ingin mengajukan penghapusan "${deleteTarget.tugas}" di ${deleteTarget.location}? Perubahan ini butuh persetujuan admin.`
                        : ""
                }
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />

            <Modal
                title="Gagal Mengirim Pengajuan"
                description={errorMessage}
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
            />

            <Modal
                title={isAdmin ? "Perubahan Disimpan" : "Pengajuan Terkirim"}
                description={successMessage}
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
            />
        </div>
    );
}