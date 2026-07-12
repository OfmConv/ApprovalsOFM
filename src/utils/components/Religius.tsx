// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Church, Plus, Pencil, Trash2 } from "lucide-react";
// import { Modal } from "@/utils/Modals";
// import { getReligiousFeast, requestReligiousFeastChange } from "@/services/api";

// type ReligiousFeastRecord = {
//     religious_id: number;
//     nkp: string;
//     formation_type: string;
//     formation_date: string;
//     location: string;
//     notes: string;
// };

// const FORMATION_TYPE_OPTIONS = [
//     "Postulat I",
//     "Postulat II",
//     "Novisiat",
//     "Profesi Perdana",
//     "Profesi Meriah",
//     "Tahbisan Diakonat",
//     "Tahbisan Imamat",
// ];

// export default function ReligiousFeastSection({ nkp }: { nkp: string }) {
//     const [list, setList] = useState<ReligiousFeastRecord[]>([]);
//     const [loading, setLoading] = useState(true);

//     const [formOpen, setFormOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState<ReligiousFeastRecord | null>(null);
//     const [form, setForm] = useState({ formation_type: "", formation_date: "", location: "", notes: "" });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [errorModalOpen, setErrorModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [successModalOpen, setSuccessModalOpen] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     const [deleteTarget, setDeleteTarget] = useState<ReligiousFeastRecord | null>(null);

//     useEffect(() => {
//         async function load() {
//             if (!nkp) return;
//             setLoading(true);
//             try {
//                 const data = await getReligiousFeast(nkp);
//                 setList(data ?? []);
//             } catch (error) {
//                 console.error("Failed to load religious feast:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         load();
//     }, [nkp]);

//     const openAddForm = () => {
//         setEditingRecord(null);
//         setForm({ formation_type: "", formation_date: "", location: "", notes: "" });
//         setFormOpen(true);
//     };

//     const openEditForm = (record: ReligiousFeastRecord) => {
//         setEditingRecord(record);
//         setForm({
//             formation_type: record.formation_type,
//             formation_date: record.formation_date?.split("T")[0] ?? "",
//             location: record.location,
//             notes: record.notes,
//         });
//         setFormOpen(true);
//     };

//     const handleSaveForm = async () => {
//         if (!form.formation_type || !form.formation_date) {
//             setErrorMessage("Jenis dan tanggal pembentukan wajib diisi.");
//             setErrorModalOpen(true);
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const action = editingRecord ? "update" : "insert";
//             const res = await requestReligiousFeastChange(
//                 nkp,
//                 editingRecord ? "Koreksi data keagamaan" : "Menambahkan riwayat formasi baru",
//                 action,
//                 form,
//                 editingRecord?.religious_id
//             );
//             setFormOpen(false);
//             setSuccessMessage(res?.message || "Pengajuan berhasil dikirim, menunggu approval.");
//             setSuccessModalOpen(true);
//         } catch (error: any) {
//             setErrorMessage(error?.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.");
//             setErrorModalOpen(true);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const confirmDelete = async () => {
//         if (!deleteTarget) return;
//         try {
//             const res = await requestReligiousFeastChange(
//                 nkp,
//                 "Menghapus riwayat formasi",
//                 "delete",
//                 {
//                     formation_type: deleteTarget.formation_type,
//                     formation_date: deleteTarget.formation_date,
//                     location: deleteTarget.location,
//                     notes: deleteTarget.notes,
//                 },
//                 deleteTarget.religious_id
//             );
//             setSuccessMessage(res?.message || "Pengajuan hapus berhasil dikirim, menunggu approval.");
//             setSuccessModalOpen(true);
//         } catch (error: any) {
//             setErrorMessage(error?.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.");
//             setErrorModalOpen(true);
//         } finally {
//             setDeleteTarget(null);
//         }
//     };

//     return (
//         <div className="mx-auto space-y-5 mt-5">
//             <Card className="border-0 shadow-sm">
//                 <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-6">
//                         <div className="flex items-start gap-3">
//                             <div className="p-2 rounded-lg bg-gray-100">
//                                 <Church className="w-4 h-4 text-gray-700" />
//                             </div>
//                             <div>
//                                 <h2 className="text-sm font-semibold text-gray-800">Riwayat Keagamaan</h2>
//                                 <p className="text-xs text-gray-400">Isi tahapan formasi yang sudah ditempuh.</p>
//                             </div>
//                         </div>

//                         <Button
//                             onClick={openAddForm}
//                             size="sm"
//                             className="rounded-full text-white hover:opacity-90 gap-1"
//                             style={{ backgroundColor: "#1B3A5C" }}
//                         >
//                             <Plus className="w-3.5 h-3.5" />
//                             Tambah
//                         </Button>
//                     </div>

//                     {loading ? (
//                         <p className="text-sm text-gray-400 text-center py-6">Memuat data...</p>
//                     ) : list.length === 0 ? (
//                         <p className="text-sm text-gray-400 text-center py-6">
//                             Belum ada riwayat keagamaan. Klik "Tambah" untuk menambahkan.
//                         </p>
//                     ) : (
//                         <div className="space-y-3">
//                             {list.map((record) => (
//                                 <div
//                                     key={record.religious_id}
//                                     className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <span
//                                             className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
//                                             style={{ backgroundColor: "#1B3A5C" }}
//                                         >
//                                             {record.formation_type}
//                                         </span>
//                                         <div>
//                                             <p className="text-sm text-gray-800 font-medium">{record.location}</p>
//                                             <p className="text-xs text-gray-400">
//                                                 {record.formation_date?.split("T")[0]}
//                                                 {record.notes ? ` — ${record.notes}` : ""}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-1">
//                                         <button
//                                             onClick={() => openEditForm(record)}
//                                             className="p-1.5 text-gray-400 hover:text-[#1B3A5C] transition-colors"
//                                             title="Edit"
//                                         >
//                                             <Pencil className="w-3.5 h-3.5" />
//                                         </button>
//                                         <button
//                                             onClick={() => setDeleteTarget(record)}
//                                             className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
//                                             title="Hapus"
//                                         >
//                                             <Trash2 className="w-3.5 h-3.5" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             <Modal
//                 title={editingRecord ? "Edit Riwayat Keagamaan" : "Tambah Riwayat Keagamaan"}
//                 open={formOpen}
//                 onClose={() => setFormOpen(false)}
//                 onConfirm={handleSaveForm}
//             >
//                 <div className="space-y-3">
//                     <div>
//                         <p className="text-xs font-medium text-gray-500 mb-1.5">Jenis Pembentukan</p>
//                         <select
//                             value={form.formation_type}
//                             onChange={(e) => setForm((prev) => ({ ...prev, formation_type: e.target.value }))}
//                             className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
//                         >
//                             <option value="" disabled>Pilih jenis pembentukan</option>
//                             {FORMATION_TYPE_OPTIONS.map((type) => (
//                                 <option key={type} value={type}>{type}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <p className="text-xs font-medium text-gray-500 mb-1.5">Tanggal Pembentukan</p>
//                         <Input
//                             type="date"
//                             value={form.formation_date}
//                             onChange={(e) => setForm((prev) => ({ ...prev, formation_date: e.target.value }))}
//                             className="h-9 focus-visible:ring-[#1B3A5C]"
//                         />
//                     </div>

//                     <div>
//                         <p className="text-xs font-medium text-gray-500 mb-1.5">Lokasi</p>
//                         <Input
//                             value={form.location}
//                             onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
//                             placeholder="Nama tempat"
//                             className="h-9 focus-visible:ring-[#1B3A5C]"
//                         />
//                     </div>

//                     <div>
//                         <p className="text-xs font-medium text-gray-500 mb-1.5">Catatan</p>
//                         <Input
//                             value={form.notes}
//                             onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
//                             placeholder="Catatan tambahan (opsional)"
//                             className="h-9 focus-visible:ring-[#1B3A5C]"
//                         />
//                     </div>

//                     {isSubmitting && <p className="text-xs text-gray-400">Mengirim pengajuan...</p>}
//                 </div>
//             </Modal>

//             <Modal
//                 title="Hapus Riwayat Keagamaan"
//                 description={
//                     deleteTarget
//                         ? `Yakin ingin mengajukan penghapusan "${deleteTarget.formation_type}" di ${deleteTarget.location}? Perubahan ini butuh persetujuan admin.`
//                         : ""
//                 }
//                 open={!!deleteTarget}
//                 onClose={() => setDeleteTarget(null)}
//                 onConfirm={confirmDelete}
//             />

//             <Modal
//                 title="Gagal Mengirim Pengajuan"
//                 description={errorMessage}
//                 open={errorModalOpen}
//                 onClose={() => setErrorModalOpen(false)}
//             />

//             <Modal
//                 title="Pengajuan Terkirim"
//                 description={successMessage}
//                 open={successModalOpen}
//                 onClose={() => setSuccessModalOpen(false)}
//             />
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Church, Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/utils/Modals";
import { getReligiousFeast, requestReligiousFeastChange, updateReligiousFeastDirect } from "@/services/api";

type ReligiousFeastRecord = {
    religious_id: number;
    nkp: string;
    formation_type: string;
    formation_date: string;
    location: string;
    notes: string;
};

const FORMATION_TYPE_OPTIONS = [
    "Postulat I",
    "Postulat II",
    "Novisiat",
    "Profesi Perdana",
    "Profesi Meriah",
    "Tahbisan Diakonat",
    "Tahbisan Imamat",
];

export default function ReligiousFeastSection({ nkp, isAdmin = false }: { nkp: string; isAdmin?: boolean }) {
    const [list, setList] = useState<ReligiousFeastRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ReligiousFeastRecord | null>(null);
    const [form, setForm] = useState({ formation_type: "", formation_date: "", location: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<ReligiousFeastRecord | null>(null);

    useEffect(() => {
        async function load() {
            if (!nkp) return;
            setLoading(true);
            try {
                const data = await getReligiousFeast(nkp);
                setList(data ?? []);
            } catch (error) {
                console.error("Failed to load religious feast:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [nkp]);

    const openAddForm = () => {
        setEditingRecord(null);
        setForm({ formation_type: "", formation_date: "", location: "", notes: "" });
        setFormOpen(true);
    };

    const openEditForm = (record: ReligiousFeastRecord) => {
        setEditingRecord(record);
        setForm({
            formation_type: record.formation_type,
            formation_date: record.formation_date?.split("T")[0] ?? "",
            location: record.location,
            notes: record.notes,
        });
        setFormOpen(true);
    };

    const handleSaveForm = async () => {
        if (!form.formation_type || !form.formation_date) {
            setErrorMessage("Jenis dan tanggal pembentukan wajib diisi.");
            setErrorModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const action = editingRecord ? "update" : "insert";

            if (isAdmin) {
                const res = await updateReligiousFeastDirect(nkp, action, form, editingRecord?.religious_id);
                setFormOpen(false);
                setSuccessMessage(res?.message || "Data keagamaan berhasil disimpan.");
                setSuccessModalOpen(true);

                const data = await getReligiousFeast(nkp);
                setList(data ?? []);
            } else {
                const res = await requestReligiousFeastChange(
                    nkp,
                    editingRecord ? "Koreksi data keagamaan" : "Menambahkan riwayat formasi baru",
                    action,
                    form,
                    editingRecord?.religious_id
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
                formation_type: deleteTarget.formation_type,
                formation_date: deleteTarget.formation_date,
                location: deleteTarget.location,
                notes: deleteTarget.notes,
            };

            if (isAdmin) {
                const res = await updateReligiousFeastDirect(nkp, "delete", payload, deleteTarget.religious_id);
                setSuccessMessage(res?.message || "Data keagamaan berhasil dihapus.");
                setSuccessModalOpen(true);

                const data = await getReligiousFeast(nkp);
                setList(data ?? []);
            } else {
                const res = await requestReligiousFeastChange(
                    nkp,
                    "Menghapus riwayat formasi",
                    "delete",
                    payload,
                    deleteTarget.religious_id
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
    const formationOrder: Record<string, number> = {
        "Postulat I": 1,
        "Postulat II": 2,
        "Novisiat": 3,
        "Profesi Perdana": 4,
        "Profesi Meriah": 5,
        "Tahbisan Diakonat": 6,
        "Tahbisan Imamat": 7,
    };
    return (
        <div className="mx-auto space-y-5 mt-5">
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                                <Church className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                                <h2 className="text-left font-semibold text-gray-800">Pesta Religius</h2>
                                <p className="text-xs text-gray-400">Isi tahapan formasi yang sudah ditempuh.</p>
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
                            Belum ada riwayat keagamaan. Klik "Tambah" untuk menambahkan.
                        </p>
                    ) : (


                        <div className="space-y-3">
                            {[...list]
                                .sort(
                                    (a, b) =>
                                        (formationOrder[a.formation_type] ?? 99) -
                                        (formationOrder[b.formation_type] ?? 99)
                                )
                                .map((record) => (
                                    <div
                                        key={record.religious_id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
                                                style={{ backgroundColor: "#1B3A5C" }}
                                            >
                                                {record.formation_type}
                                            </span>

                                            <div>
                                                <p className="text-left text-gray-800 font-medium">
                                                    {record.location}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {record.formation_date?.split("T")[0]}
                                                    {record.notes ? ` — ${record.notes}` : ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
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
                title={editingRecord ? "Edit Riwayat Keagamaan" : "Tambah Riwayat Keagamaan"}
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onConfirm={handleSaveForm}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Jenis Pembentukan</p>
                        <select
                            value={form.formation_type}
                            onChange={(e) => setForm((prev) => ({ ...prev, formation_type: e.target.value }))}
                            className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
                        >
                            <option value="" disabled>Pilih jenis pembentukan</option>
                            {FORMATION_TYPE_OPTIONS.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Tanggal Pembentukan</p>
                        <Input
                            type="date"
                            value={form.formation_date}
                            onChange={(e) => setForm((prev) => ({ ...prev, formation_date: e.target.value }))}
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Lokasi</p>
                        <Input
                            value={form.location}
                            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Nama tempat"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Catatan</p>
                        <Input
                            value={form.notes}
                            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                            placeholder="Catatan tambahan (opsional)"
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
                title="Hapus Riwayat Keagamaan"
                description={
                    deleteTarget
                        ? isAdmin
                            ? `Yakin ingin menghapus "${deleteTarget.formation_type}" di ${deleteTarget.location}? Data akan langsung terhapus.`
                            : `Yakin ingin mengajukan penghapusan "${deleteTarget.formation_type}" di ${deleteTarget.location}? Perubahan ini butuh persetujuan admin.`
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