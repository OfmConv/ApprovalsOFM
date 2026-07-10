import { useState } from "react";

const detailFields = [
  { label: "Family Name", value: "Paulus" },
  { label: "Name", value: "Yohanes" },
  { label: "Religious Name", value: "Yohanes" },
  { label: "KTP Name", value: "YOHANES PAULUS" },
  { label: "Name in Passport", value: "Yohanes Paulus" },
  { label: "Date of Birth", value: "01/01/1990" },
  { label: "Place of Birth", value: "Jakarta" },
  { label: "Phone Number", value: "081234567890" },
  { label: "Dead Date", value: "—" },
  { label: "Place of Burial", value: "—" },
];

export default function App() {
  const [open, setOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 font-sans">
      {!open && !submitted && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          Buka Popup
        </button>
      )}

      {open && !submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold tracking-wide">
                  YP
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 leading-tight">Yohanes Paulus</h2>
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                    Anggota Provinsi
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg p-1.5 transition-colors"
                aria-label="Tutup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="px-6 pb-2">
              <div className="h-px bg-zinc-100" />
            </div>

            <div className="px-6 py-4 max-h-[360px] overflow-y-auto space-y-5">

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Informasi Akun</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-1">NKP</p>
                    <p className="text-sm font-semibold text-zinc-800">20240001</p>
                  </div>
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-semibold text-zinc-800 truncate">yohanes@provinsi.id</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Detail Pengguna</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {detailFields.map((f) => (
                    <div key={f.label}>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">{f.label}</p>
                      <p className={`text-sm font-medium ${f.value === "—" ? "text-zinc-300" : "text-zinc-800"}`}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pt-2">
              <div className="h-px bg-zinc-100" />
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <p className="text-xs text-zinc-400">Pastikan semua data sudah benar</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round"/>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Submit Data"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center px-8 py-10 border border-zinc-200">
            <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">Data berhasil dikirim</h3>
            <p className="text-sm text-zinc-500 mb-6">Data pengguna Yohanes Paulus telah tersimpan.</p>
            <button
              onClick={() => { setSubmitted(false); setOpen(false); }}
              className="w-full py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}