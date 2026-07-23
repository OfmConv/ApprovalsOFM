"use client"

import { ArrowRight, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import React, { useEffect, useState } from "react"
import { changeAdminAcc, changePassword, deleteUser } from "@/services/api"
import { Modal } from "./Modals"
import.meta.env.VITE_CREDENTIALS

// function GeneralSettings() {
//     const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
//     useEffect(() => {
//         const root = document.documentElement

//         const applyTheme = (t: string) => {
//             if (t === "dark") {
//                 root.classList.add("dark")
//             } else if (t === "light") {
//                 root.classList.remove("dark")
//             } else {
//                 const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
//                 prefersDark ? root.classList.add("dark") : root.classList.remove("dark")
//             }
//         }
//         applyTheme(theme)
//         localStorage.setItem("theme", theme)

//         if (theme === "system") {
//             const media = window.matchMedia("(prefers-color-scheme: dark)")
//             const handler = (e: MediaQueryListEvent) => {
//                 e.matches ? root.classList.add("dark") : root.classList.remove("dark")
//             }
//             media.addEventListener("change", handler)
//             return () => media.removeEventListener("change", handler)
//         }
//     }, [theme]);
//     return (
//         <div className="flex flex-col gap-6 mt-5">
//             <Separator />
//             <div className="flex flex-col gap-4">
//                 <div>
//                     <h3 className="text-sm font-medium">Tema</h3>
//                     <p className="text-sm text-muted-foreground">Pilih tampilan aplikasi</p>
//                 </div>
//                 <ToggleGroup
//                     type="single"
//                     value={theme}
//                     onValueChange={(v) => v && setTheme(v)}
//                     className="flex flex-row justify-center w-full"
//                 >
//                     <ToggleGroupItem value="light" className="flex flex-col items-center gap-2 h-auto py-3 rounded-lg border data-[state=on]:border-primary data-[state=on]:bg-primary/5">
//                         <Sun className="size-4" />
//                         <span className="text-xs">Light</span>
//                     </ToggleGroupItem>
//                     <ToggleGroupItem value="dark" className="flex flex-col items-center gap-2 h-auto py-3 rounded-lg border data-[state=on]:border-primary data-[state=on]:bg-primary/5">
//                         <Moon className="size-4" />
//                         <span className="text-xs">Dark</span>
//                     </ToggleGroupItem>
//                     <ToggleGroupItem value="system" className="flex flex-col items-center gap-2 h-auto py-3 rounded-lg border data-[state=on]:border-primary data-[state=on]:bg-primary/5">
//                         <Monitor className="size-4" />
//                         <span className="text-xs">System</span>
//                     </ToggleGroupItem>
//                 </ToggleGroup>
//             </div>
//         </div>
//     )
// }

function DeleteConfirmModal({
    open,
    targetNkp,
    onClose,
    onConfirm,
}: {
    open: boolean
    targetNkp: string | null
    onClose: () => void
    onConfirm: () => void
}) {
    const COUNTDOWN_SECONDS = 5
    const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)

    useEffect(() => {
        if (!open) return

        setSecondsLeft(COUNTDOWN_SECONDS)
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [open])

    if (!open) return null

    const canConfirm = secondsLeft <= 0

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" />

            <div
                className="relative z-10 bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="size-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Delete this account permanently?
                    </h2>
                </div>

                <div className="mb-5">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        You are about to permanently delete the account with NKP{" "}
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{targetNkp}</span>.
                        This action <span className="font-medium text-zinc-900 dark:text-zinc-100">cannot be undone</span>.
                        All related data — profile, education, assignments, gallery photos, and pending
                        approvals — will be permanently removed.
                    </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                    >
                        {canConfirm ? "Confirm Delete" : `Confirm Delete (${secondsLeft})`}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ChangePassword({ Udata, detailUser }: any) {
    const [selectedNkp, setSelectedNkp] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPopup, setShowPoup] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    // const [getNKP, setGetNkp] = useState('')
    const isFormValid = selectedNkp && password.length >= 8 && password === confirmPassword;
    const daftarUser = Array.isArray(Udata) ? Udata : [];

    const currentAdminNkp = localStorage.getItem("nkp");
    const isSelectingSelf = !!selectedNkp && selectedNkp === currentAdminNkp;

    async function savePassword() {
        if (password === confirmPassword) {
            localStorage.getItem("token")
            await changePassword(selectedNkp!, password)
            setShowPoup(true)
        } else {
            console.log("ada eror")
        }
    }

    async function handleDeleteUser() {
        if (!selectedNkp) return
        if (selectedNkp === currentAdminNkp) {
            console.log("Tidak bisa menghapus akun sendiri")
            setShowDeletePopup(false)
            return
        }
        try {
            await deleteUser(selectedNkp)
            setShowDeletePopup(false)
            setSelectedNkp(null)
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            console.log("Gagal menghapus user:", error)
        }
    }

    return (
        <div className="flex flex-col gap-6 mt-5">
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className="text-sm font-medium">Pilih user</h3>
                    <p className="text-sm text-muted-foreground">Pilih akun yang ingin diganti passwordnya</p>
                </div>

                <div className="flex flex-col rounded-lg border overflow-hidden bg-background w-full">
                    {daftarUser.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Memuat data pengguna...
                        </div>
                    ) : (
                        daftarUser.map((e: any, index: number) => {
                            const isSelected = selectedNkp === e.nkp;
                            const namaUser = detailUser && detailUser[index] ? detailUser[index] : (e.full_name || "Tanpa Nama");

                            return (
                                <div
                                    key={e.nkp || index}
                                    onClick={() => setSelectedNkp(e.nkp)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors text-left ${index !== daftarUser.length - 1 ? "border-b" : ""
                                        } ${isSelected ? "bg-muted/70" : ""}`}
                                >
                                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                                        {e.nkp || index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-medium capitalize">{namaUser}</p>
                                        <p className="text-xs text-muted-foreground">NKP: {e.nkp} | Email: {e.email}</p>
                                    </div>

                                    <div className={`size-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary" : "border-muted-foreground/30"
                                        }`}>
                                        {isSelected && <div className="size-2 rounded-full bg-primary" />}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3 text-left">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="new-pass">Password baru</Label>
                    <Input
                        id="new-pass"
                        type="password"
                        placeholder="Min. 8 karakter"
                        disabled={!selectedNkp}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirm-pass">Konfirmasi password</Label>
                    <Input
                        id="confirm-pass"
                        type="password"
                        placeholder="Ulangi password baru"
                        disabled={!selectedNkp}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Konfirmasi password tidak cocok.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-2">
                    <div>
                        {selectedNkp && (
                            <Button
                                variant="destructive"
                                disabled={isSelectingSelf}
                                onClick={() => setShowDeletePopup(true)}
                            >
                                Delete Account
                            </Button>
                        )}
                    </div>
                    <div>
                        <Button variant="outline" onClick={() => { setPassword(""); setConfirmPassword(""); setSelectedNkp(null); }}>Batal</Button>
                        <Button
                            onClick={savePassword}
                            className="bg-[#2E6193] hover:bg-[#1477C2] text-white"
                            disabled={!isFormValid}
                        >
                            Simpan Password
                        </Button>
                    </div>
                </div>
              
            </div>

            <Modal
                title="Are you sure you're changing it?"
                description="Ensure you have noted down and remembered the changes made!"
                open={showPopup}
                onClose={() => setShowPoup(false)}
                onConfirm={() => setShowPoup(false)}
            />

            <DeleteConfirmModal
                open={showDeletePopup}
                targetNkp={selectedNkp}
                onClose={() => setShowDeletePopup(false)}
                onConfirm={handleDeleteUser}
            />
        </div>
    );
}

export function AkunAdmin() {
    const [changeView, setChangeView] = React.useState(false);
    const [inputData, setInputData] = React.useState("");
    const [currentNKP, setCurrentNKP] = React.useState("");
    const [newNKP, setnewNKP] = React.useState("");

    const credentials = import.meta.env.VITE_CREDENTIALS;

    function validate() {
        if (inputData === credentials) {
            setChangeView(true)
        }
    }

    async function handlePopup() {
        await changeAdminAcc(currentNKP, newNKP);
    }
    if (changeView !== false) {
        return (
            <div className="flex flex-col gap-6 mt-5">
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-sm font-medium">Switch Admin Account</h3>
                        <p className="text-sm text-muted-foreground">Change or update the administrator account details.</p>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-0">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                                Current admin
                            </Label>
                            <div className="flex items-center gap-2.5 bg-muted/40 border border-border rounded-lg p-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium shrink-0">
                                    CA
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">NKP</p>
                                    <p className="text-xs text-muted-foreground">Active admin </p>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                                    Admin
                                </span>
                            </div>
                            <Input onChange={(e: any) => setCurrentNKP(e.target.value)} id="admin-current" placeholder="Enter NKP..." />

                        </div>

                        <div className="flex flex-col items-center justify-center gap-1 px-3 pt-[26px]">
                            <div className="w-px h-4 bg-border" />
                            <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-px h-4 bg-border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                                Switch to
                            </Label>
                            <div className="flex items-center gap-2.5 bg-muted/40 border border-border rounded-lg p-2.5">
                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-medium shrink-0">
                                    NA
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">NKP</p>
                                    <p className="text-xs text-muted-foreground">New admin</p>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                                    New
                                </span>
                            </div>
                            <Input onChange={(e: any) => setnewNKP(e.target.value)} id="admin-new" placeholder="Enter NKP..." />
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 leading-relaxed">
                            The current admin account will lose all administrator access rights once this process is complete; please take note. Ensure the entered NKP is correct.
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button variant="outline">Batal</Button>
                    <Button onClick={handlePopup} className="bg-[#2E6193] hover:bg-[#1477C2] text-white">
                        <ArrowRight className="w-4 h-4 mr-1.5" />
                        Switch admin
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center py-13 w-full">
            <div className="bg-white border border-border rounded-xl p-10 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center text-center mb-6">

                    <h2 className="text-base font-medium">Are you admin?</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter admin credentials to continue.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="Credentials">Credentials</Label>
                        <Input onChange={(e: any) => setInputData(e.target.value)} autoComplete="off" id="credential" name="credential" key="credential" placeholder="Enter credentials" />
                    </div>

                    <Button onClick={validate} className="w-full bg-[#2E6193] hover:bg-[#1477C2] text-white mt-1">
                        Validasi
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function SettingsPage({ detailUser, Udata }: any) {
    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                {/* <TabsTrigger value="general">Umum</TabsTrigger> */}
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            {/* <TabsContent value="general">
                <GeneralSettings />
            </TabsContent> */}
            <TabsContent value="password">
                <ChangePassword Udata={Udata} detailUser={detailUser} />
            </TabsContent>
            <TabsContent value="admin">
                <AkunAdmin />
            </TabsContent>
        </Tabs>
    )
}