// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
// import { Modal } from "@/utils/Modals";
// import { getEducation, requestEducationChange } from "@/services/api";

// type EducationRecord = {
//     education_id: number;
//     nkp: string;
//     level: string;
//     institution: string;
//     start_year: number;
//     end_year: number;
// };

// const LEVEL_OPTIONS = ["SD", "SMP", "SMA", "S1", "TOP", "Post-S1 / S2", "Licensiat", "Doktorat"];

// export default function EducationSection({ nkp }: { nkp: string }) {
//     const [educationList, setEducationList] = useState<EducationRecord[]>([]);
//     const [loading, setLoading] = useState(true);

//     const [formOpen, setFormOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState<EducationRecord | null>(null);
//     const [form, setForm] = useState({ level: "", institution: "", start_year: "", end_year: "" });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [errorModalOpen, setErrorModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [successModalOpen, setSuccessModalOpen] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     // confirm delete
//     const [deleteTarget, setDeleteTarget] = useState<EducationRecord | null>(null);

//     useEffect(() => {
//         async function load() {
//             if (!nkp) return;
//             setLoading(true);
//             try {
//                 const data = await getEducation(nkp);
//                 setEducationList(data ?? []);
//             } catch (error) {
//                 console.error("Failed to load education:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         load();
//     }, [nkp]);

//     const openAddForm = () => {
//         setEditingRecord(null);
//         setForm({ level: "", institution: "", start_year: "", end_year: "" });
//         setFormOpen(true);
//     };

//     const openEditForm = (record: EducationRecord) => {
//         setEditingRecord(record);
//         setForm({
//             level: record.level,
//             institution: record.institution,
//             start_year: String(record.start_year ?? ""),
//             end_year: String(record.end_year ?? ""),
//         });
//         setFormOpen(true);
//     };

//     const handleSaveForm = async () => {
//         if (!form.level || !form.institution) {
//             setErrorMessage("Jenjang dan nama sekolah wajib diisi.");
//             setErrorModalOpen(true);
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const action = editingRecord ? "update" : "insert";
//             const res = await requestEducationChange(
//                 nkp,
//                 editingRecord ? "Koreksi data pendidikan" : "Menambahkan riwayat pendidikan baru",
//                 action,
//                 {
//                     level: form.level,
//                     institution: form.institution,
//                     start_year: Number(form.start_year) || 0,
//                     end_year: Number(form.end_year) || 0,
//                 },
//                 editingRecord?.education_id
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
//             const res = await requestEducationChange(
//                 nkp,
//                 "Menghapus riwayat pendidikan",
//                 "delete",
//                 {
//                     level: deleteTarget.level,
//                     institution: deleteTarget.institution,
//                     start_year: deleteTarget.start_year,
//                     end_year: deleteTarget.end_year,
//                 },
//                 deleteTarget.education_id
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
//                                 <GraduationCap className="w-4 h-4 text-gray-700" />
//                             </div>
//                             <div>
//                                 <h2 className="text-sm font-semibold text-gray-800">Riwayat Pendidikan</h2>
//                                 <p className="text-xs text-gray-400">Isi jenjang yang sudah ditempuh.</p>
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
//                     ) : educationList.length === 0 ? (
//                         <p className="text-sm text-gray-400 text-center py-6">
//                             Belum ada riwayat pendidikan. Klik "Tambah" untuk menambahkan.
//                         </p>
//                     ) : (
//                         <div className="space-y-3">
//                             {educationList.map((record) => (
//                                 <div
//                                     key={record.education_id}
//                                     className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <span
//                                             className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
//                                             style={{ backgroundColor: "#1B3A5C" }}
//                                         >
//                                             {record.level}
//                                         </span>
//                                         <div>
//                                             <p className="text-sm text-gray-800 font-medium">{record.institution}</p>
//                                             <p className="text-xs text-gray-400">
//                                                 {record.start_year} — {record.end_year || "sekarang"}
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

//             {/* Modal tambah / edit */}
//             <Modal
//                 title={editingRecord ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan"}
//                 open={formOpen}
//                 onClose={() => setFormOpen(false)}
//                 onConfirm={handleSaveForm}
//             >
//                 <div className="space-y-3">
//                     <div>
//                         {/* <p className="text-xs font-medium text-gray-500 mb-1.5">Jenjang</p> */}
//                         <select
//                             value={form.level}
//                             onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
//                             className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
//                         >
//                             <option value="" disabled>Pilih jenjang</option>
//                             {LEVEL_OPTIONS.map((lvl) => (
//                                 <option key={lvl} value={lvl}>{lvl}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         {/* <p className="text-xs font-medium text-gray-500 mb-1.5">Nama Sekolah / Universitas</p> */}
//                         <Input
//                             value={form.institution}
//                             onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
//                             placeholder="Nama sekolah / universitas"
//                             className="h-9 focus-visible:ring-[#1B3A5C]"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <p className="text-xs font-medium text-gray-500 mb-1.5">Tahun Mulai</p>
//                             <Input
//                                 value={form.start_year}
//                                 onChange={(e) => setForm((prev) => ({ ...prev, start_year: e.target.value }))}
//                                 placeholder="2011"
//                                 className="h-9 focus-visible:ring-[#1B3A5C]"
//                             />
//                         </div>
//                         <div>
//                             <p className="text-xs font-medium text-gray-500 mb-1.5">Tahun Selesai</p>
//                             <Input
//                                 value={form.end_year}
//                                 onChange={(e) => setForm((prev) => ({ ...prev, end_year: e.target.value }))}
//                                 placeholder="2014"
//                                 className="h-9 focus-visible:ring-[#1B3A5C]"
//                             />
//                         </div>
//                     </div>

//                     {isSubmitting && (
//                         <p className="text-xs text-gray-400">Mengirim pengajuan...</p>
//                     )}
//                 </div>
//             </Modal>

//             {/* Modal konfirmasi hapus */}
//             <Modal
//                 title="Hapus Riwayat Pendidikan"
//                 description={
//                     deleteTarget
//                         ? `Yakin ingin mengajukan penghapusan "${deleteTarget.institution}" (${deleteTarget.level})? Perubahan ini butuh persetujuan admin.`
//                         : ""
//                 }
//                 open={!!deleteTarget}
//                 onClose={() => setDeleteTarget(null)}
//                 onConfirm={confirmDelete}
//             />

//             {/* Modal error */}
//             <Modal
//                 title="Gagal Mengirim Pengajuan"
//                 description={errorMessage}
//                 open={errorModalOpen}
//                 onClose={() => setErrorModalOpen(false)}
//             />

//             {/* Modal sukses */}
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
import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/utils/Modals";
import { getEducation, requestEducationChange, updateEducationDirect } from "@/services/api";

type EducationRecord = {
    education_id: number;
    nkp: string;
    level: string;
    institution: string;
    start_year: number;
    end_year: number;
};

const LEVEL_OPTIONS = ["SD", "SMP", "SMA", "S1", "TOP", "Post-S1 / S2", "Licensiat", "Doktorat"];

export default function EducationSection({ nkp, isAdmin = false }: { nkp: string; isAdmin?: boolean }) {
    const [educationList, setEducationList] = useState<EducationRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EducationRecord | null>(null);
    const [form, setForm] = useState({ level: "", institution: "", start_year: "", end_year: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<EducationRecord | null>(null);

    useEffect(() => {
        async function load() {
            if (!nkp) return;
            setLoading(true);
            try {
                const data = await getEducation(nkp);
                setEducationList(data ?? []);
            } catch (error) {
                console.error("Failed to load education:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [nkp]);

    const openAddForm = () => {
        setEditingRecord(null);
        setForm({ level: "", institution: "", start_year: "", end_year: "" });
        setFormOpen(true);
    };

    const openEditForm = (record: EducationRecord) => {
        setEditingRecord(record);
        setForm({
            level: record.level,
            institution: record.institution,
            start_year: String(record.start_year ?? ""),
            end_year: String(record.end_year ?? ""),
        });
        setFormOpen(true);
    };

    const handleSaveForm = async () => {
        if (!form.level || !form.institution) {
            setErrorMessage("Jenjang dan nama sekolah wajib diisi.");
            setErrorModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const action = editingRecord ? "update" : "insert";
            const payload = {
                level: form.level,
                institution: form.institution,
                start_year: Number(form.start_year) || 0,
                end_year: Number(form.end_year) || 0,
            };

            if (isAdmin) {
                const res = await updateEducationDirect(nkp, action, payload, editingRecord?.education_id);
                setFormOpen(false);
                setSuccessMessage(res?.message || "Data pendidikan berhasil disimpan.");
                setSuccessModalOpen(true);

                const data = await getEducation(nkp);
                setEducationList(data ?? []);
            } else {
                const res = await requestEducationChange(
                    nkp,
                    editingRecord ? "Koreksi data pendidikan" : "Menambahkan riwayat pendidikan baru",
                    action,
                    payload,
                    editingRecord?.education_id
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
                level: deleteTarget.level,
                institution: deleteTarget.institution,
                start_year: deleteTarget.start_year,
                end_year: deleteTarget.end_year,
            };

            if (isAdmin) {
                const res = await updateEducationDirect(nkp, "delete", payload, deleteTarget.education_id);
                setSuccessMessage(res?.message || "Data pendidikan berhasil dihapus.");
                setSuccessModalOpen(true);

                const data = await getEducation(nkp);
                setEducationList(data ?? []);
            } else {
                const res = await requestEducationChange(
                    nkp,
                    "Menghapus riwayat pendidikan",
                    "delete",
                    payload,
                    deleteTarget.education_id
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
                                <GraduationCap className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">Riwayat Pendidikan</h2>
                                <p className="text-xs text-gray-400">Isi jenjang yang sudah ditempuh.</p>
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
                    ) : educationList.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">
                            Belum ada riwayat pendidikan. Klik "Tambah" untuk menambahkan.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {educationList.sort((a, b) => {
          const order: any = {
            SD: 1,
            SMP: 2,
            SMA: 3,
            D1: 4,
            D2: 5,
            D3: 6,
            D4: 7,
            S1: 8,
            S2: 9,
            S3: 10,
          };

          return (order[a.level] || 99) - (order[b.level] || 99);
        }).map((record) => (
                                <div
                                    key={record.education_id}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
                                            style={{ backgroundColor: "#1B3A5C" }}
                                        >
                                            {record.level}
                                        </span>
                                        <div>
                                            <p className="text-left text-gray-800 font-medium">{record.institution}</p>
                                            <p className="text-left text-gray-400">
                                                {record.start_year} — {record.end_year || "sekarang"}
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

            {/* Modal tambah / edit */}
            <Modal
                title={editingRecord ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan"}
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onConfirm={handleSaveForm}
            >
                <div className="space-y-3">
                    <div>
                        {/* <p className="text-xs font-medium text-gray-500 mb-1.5">Jenjang</p> */}
                        <select
                            value={form.level}
                            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                            className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]"
                        >
                            <option value="" disabled>Pilih jenjang</option>
                            {LEVEL_OPTIONS.map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        {/* <p className="text-xs font-medium text-gray-500 mb-1.5">Nama Sekolah / Universitas</p> */}
                        <Input
                            value={form.institution}
                            onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
                            placeholder="Nama sekolah / universitas"
                            className="h-9 focus-visible:ring-[#1B3A5C]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">Tahun Mulai</p>
                            <Input
                                value={form.start_year}
                                onChange={(e) => setForm((prev) => ({ ...prev, start_year: e.target.value }))}
                                placeholder="2011"
                                className="h-9 focus-visible:ring-[#1B3A5C]"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">Tahun Selesai</p>
                            <Input
                                value={form.end_year}
                                onChange={(e) => setForm((prev) => ({ ...prev, end_year: e.target.value }))}
                                placeholder="2014"
                                className="h-9 focus-visible:ring-[#1B3A5C]"
                            />
                        </div>
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
                title="Hapus Riwayat Pendidikan"
                description={
                    deleteTarget
                        ? isAdmin
                            ? `Yakin ingin menghapus "${deleteTarget.institution}" (${deleteTarget.level})? Data akan langsung terhapus.`
                            : `Yakin ingin mengajukan penghapusan "${deleteTarget.institution}" (${deleteTarget.level})? Perubahan ini butuh persetujuan admin.`
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