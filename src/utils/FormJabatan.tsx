"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { axiosInstance } from "@/services/api"
import { WilayahForm } from "@/utils/willayah"
import type { JabatanRow, PresignResponse } from "@/types/interface"
import { MinisterProvinsialForm } from "./MinisterForm"

const JABATAN_LIST = [
  { id: 1, label: "Minister Provinsial" },
  { id: 2, label: "Vikaris Provinsial Definitor 1" },
  { id: 3, label: "Sekretaris Provinsi & Definitor 2" },
  { id: 4, label: "Definitor 3" },
  { id: 5, label: "Definitor 4" },
  { id: 6, label: "Definitor 5" },
  { id: 7, label: "Ekonom" },
  { id: 8, label: "Eksaktor" },
]

export function FormJabatan() {
  const [jabatanData, setJabatanData] = React.useState<any>(
    JABATAN_LIST.reduce((acc: any, jabatan: any) => {
      acc[jabatan.id] = {
        name: "",
        photo: null,
      }
      return acc
    }, {})
  )

  const [rowStatus, setRowStatus] = React.useState<any>(
    JABATAN_LIST.reduce((acc: any, jabatan: any) => {
      acc[jabatan.id] = { state: "idle", message: "" }
      return acc
    }, {})
  )


function handleInput(id: any, e: any) {
  const key = e.target.name
  const values = e.target.value
  const file = e.target.files?.[0] ?? null

  if (key === "name") {
    setJabatanData((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], name: values },
    }))
  } else if (key === "photo") {
    setJabatanData((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], photo: file },
    }))
  }
}

async function handleUpdate(id: number) {
  const row: JabatanRow = jabatanData[id]

  setRowStatus((prev: any) => ({
    ...prev,
    [id]: { state: "loading", message: "" },
  }));

  try {
    let profileUrl: string | null = null

    if (row.photo) {
      const presignRes = await axiosInstance.post<PresignResponse>("/storage/presign", {
        type: "dewan_pimpinan",
        id: String(id),
        content_type: row.photo.type,
      })

      const { upload_url, public_url } = presignRes.data

      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": row.photo.type },
        body: row.photo,
      })

      if (!uploadRes.ok) {
        const errText = await uploadRes.text()
        console.error("[handleUpdate] upload ke R2 gagal:", errText)
        throw new Error("Gagal upload gambar ke storage")
      }

      profileUrl = public_url
    }

    const body: { id: number; name?: string; profile?: string } = { id }
    if (row.name) body.name = row.name
    if (profileUrl) body.profile = profileUrl

    if (!row.name && !profileUrl) {
      throw new Error("Tidak ada perubahan untuk disimpan")
    }

    await axiosInstance.patch("/dewan-pimpinan/update", body)

    setRowStatus((prev: any) => ({
      ...prev,
      [id]: { state: "success", message: "Berhasil diperbarui" },
    }))
  } catch (error: any) {
    console.error("[handleUpdate] error:", error)
    setRowStatus((prev: any) => ({
      ...prev,
      [id]: {
        state: "error",
        message: error.response?.data?.message || error.message || "Terjadi kesalahan",
      },
    }))
  }
}

  return (
    <>
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3 text-left">Update Kuria Dewan Pimpinan</h3>
      <div className="flex flex-col divide-y border bg-card shadow-sm rounded-2xl">
         
        {JABATAN_LIST.map((jabatan: any) => {
          const status = rowStatus[jabatan.id]
          const isLoading = status.state === "loading"

          return (
            <div key={jabatan.id} className="flex flex-col gap-2 px-8 py-5">
              <Label className="text-sm font-medium">{jabatan.label}</Label>

              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  name="name"
                  placeholder="Change Name....."
                  onChange={(e: any) => handleInput(jabatan.id, e)}
                  className="flex-1"
                  disabled={isLoading}
                />

                <Input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e: any) => handleInput(jabatan.id, e)}
                  className="flex-1 cursor-pointer file:text-sm file:font-medium"
                  disabled={isLoading}
                />

                <Button
                  onClick={() => handleUpdate(jabatan.id)}
                  disabled={isLoading}
                  className="px-6 bg-[#2E6193] hover:bg-[#1477C2] text-white shrink-0"
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </div>

              {status.state === "success" && (
                <p className="text-xs text-green-600">{status.message}</p>
              )}
              {status.state === "error" && (
                <p className="text-xs text-red-600">{status.message}</p>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-8">
        <h3 className="text-lg text-left font-semibold mb-3">Add Wilayah Pelayanan</h3>
        <AdminWilayahPage /> 
      </div>
        <div className="mt-8">
        <h3 className="text-lg text-left font-semibold mb-3">Add History Minister Provinsial</h3>
      <MinisterProvinsialForm />
        </div>
    </div>
    </>
  )
}




function AdminWilayahPage() {
  return <WilayahForm />
}