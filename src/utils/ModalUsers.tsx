"use client"

import { useState, useMemo, useCallback, memo } from "react"
import {
  IconX, IconPhone, IconMail, IconBook, IconCross,
  IconMapPin, IconId, IconUser, IconCalendar,
} from "@tabler/icons-react"

interface Profile {
  nkp: number
  namaLengkap: string
  namaBaptis: string
  namaKeluarga?: string
  namaKtp?: string
  namaPaspor?: string
  tanggalLahir?: string
  tempatLahir?: string
  noHp: string
  email: string
  pendidikan: string
  avatarUrl?: string
  sd?: string
  smp?: string
  sma?: string
  s1?: string
  profesiPerdana?: string
  profesiMeriah?: string
  tahbisanImamat?: string
  education?: any[]
  assignment?: any[]
  feastival?: any[]
}

const TABS = [
  { key: "profil", label: "Profil" },
  { key: "pendidikan", label: "Pendidikan" },
  // { key: "religius", label: "Pesta Religius" },
] as const

type TabKey = (typeof TABS)[number]["key"]

const InfoRow = memo(({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value?: string
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="text-left">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mt-0.5">
        {value || "-"}
      </p>
    </div>
  </div>
))
InfoRow.displayName = "InfoRow"

const ProfilTab = memo(({ profile }: { profile: Profile }) => {
  const fields = useMemo(() => [
    { icon: <IconUser size={14} />, label: "Nama Keluarga", value: profile.namaKeluarga },
    { icon: <IconPhone size={14} />, label: "No. HP", value: profile.noHp },
    { icon: <IconCross size={14} />, label: "Nama Baptis", value: profile.namaBaptis },
    { icon: <IconMail size={14} />, label: "Email", value: profile.email },
    { icon: <IconId size={14} />, label: "Nama di KTP", value: profile.namaKtp },
    { icon: <IconId size={14} />, label: "Nama di Paspor", value: profile.namaPaspor },
    { icon: <IconCalendar size={14} />, label: "Tanggal Lahir", value: profile.tanggalLahir },
    { icon: <IconMapPin size={14} />, label: "Tempat Lahir", value: profile.tempatLahir },
  ], [profile])

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-0">
      {fields.map((item) => (
        <InfoRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
      ))}
    </div>
  )
})
ProfilTab.displayName = "ProfilTab"

const PendidikanTab = memo(({ profile }: { profile: Profile }) => {
  const hasEducationData = Array.isArray(profile.education) && profile.education.length > 0

  const fallbackFields = useMemo(() => [
    { label: "SD", value: profile.sd },
    { label: "SMP", value: profile.smp },
    { label: "SMA", value: profile.sma },
    { label: "S1", value: profile.s1 || profile.pendidikan },
  ], [profile])

  if (hasEducationData) {
    return (
      <div className="grid grid-cols-1 gap-x-8 gap-y-0">
        {profile.education!.sort((a, b) => {
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
        })
          .map((edu: any) => (
            <div key={edu.education_id} className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                <IconBook size={14} />
              </div>
              <div>
                <p className="text-left font-semibold text-zinc-700 dark:text-zinc-200">{edu.institution || "-"}</p>
                <p className="text-xs text-left text-zinc-400 mt-0.5">
                  {edu.level}{edu.start_year && edu.end_year ? ` (${edu.start_year} - ${edu.end_year})` : ""}
                </p>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-0">
      {fallbackFields.map((item) => (
        <div key={item.label} className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
            <IconBook size={14} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{item.value || "-"}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
})
PendidikanTab.displayName = "PendidikanTab"

// const ReligiusTab = memo(({ profile }: { profile: Profile }) => {
//   const hasFeastivalData = Array.isArray(profile.feastival) && profile.feastival.length > 0

//   const fallbackFields = useMemo(() => [
//     { label: "Profesi Perdana", value: profile.profesiPerdana },
//     { label: "Profesi Meriah", value: profile.profesiMeriah },
//     { label: "Tahbisan Imamat", value: profile.tahbisanImamat },
//   ], [profile])

//   if (hasFeastivalData) {
//     return (
//       <div className="grid grid-cols-2 gap-x-8 gap-y-0">
//         {profile.feastival!.map((f: any) => (
//           <div key={f.religious_id} className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
//             <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
//               <IconCross size={14} />
//             </div>
//             <div>
//               <p className="text-left font-semibold text-zinc-700 dark:text-zinc-200">{f.formation_type || "-"}</p>
//               <p className="text-xs text-left text-zinc-400 mt-0.5">
//                 {f.location}{f.formation_date ? ` - ${new Date(f.formation_date).toLocaleDateString("id-ID")}` : ""}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-2 gap-x-8 gap-y-0">
//       {fallbackFields.map((item) => (
//         <div key={item.label} className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
//           <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
//             <IconCross size={14} />
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{item.value || "-"}</p>
//             <p className="text-xs text-zinc-400 mt-0.5">{item.label}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// })
// ReligiusTab.displayName = "ReligiusTab"

export function ProfileModal({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("profil")

  const initials = useMemo(() => {
    return profile?.namaLengkap?.split(" ")
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "";
  }, [profile?.namaLengkap]);

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full mt-4 py-2.5 rounded-xl bg-[#2E6193] hover:bg-[#1477C2] active:scale-95 text-white text-sm font-semibold transition-all duration-150"
      >
        View profile
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <div className="absolute inset-0 bg-black/40 modal-backdrop" />

          <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col modal-content" onClick={stopPropagation}>
            <div className="bg-[url('/Castle.jpg')] bg-cover bg-center bg-no-repeat w-full h-40 relative">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-lg p-1.5 transition-colors"
              >
                <IconX size={16} />
              </button>
              <div className="absolute top-3 left-3 bg-black/30 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                NKP {profile.nkp}
              </div>
            </div>

            <div className="px-6 pb-0 relative">
              <div className="absolute -top-8 left-6">
                <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-300 text-xl font-bold shadow-md overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={initials} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              <div className="ml-20 pt-2 pb-3 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {profile.namaLengkap}
                </h2>
              </div>
            </div>

            <div className="flex gap-0 px-6 border-b border-zinc-100 dark:border-zinc-800">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-all border-b-2 ${activeTab === tab.key
                    ? "border-[#2E6193] text-[#2E6193]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4">
              {activeTab === "profil" && <ProfilTab profile={profile} />}
              {activeTab === "pendidikan" && <PendidikanTab profile={profile} />}
              {/* {activeTab === "religius" && <ReligiusTab profile={profile} />} */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}