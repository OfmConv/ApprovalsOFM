import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { axiosInstance } from "@/services/api";
import type { PresignResponse } from "@/types/interface";

const TABS = ["Profile", "Education", "Religious Feasts", "Community", "Photo Gallery", "Other Information"];

export default function ProfileHeader({
  name = "Rafiqur Rahman",
  email,
  coverSrc,
  avatarSrc,
  onCoverChange,
  onAvatarChange,
  change,
  nkp, // <-- baru: dipakai sebagai "id" saat presign
}: {
  name?: string;
  role?: string;
  email?: string;
  location?: string;
  coverSrc?: string;
  avatarSrc?: string;
  onCoverChange?: (url: string) => void;
  onAvatarChange?: (url: string) => void;
  change?: Dispatch<SetStateAction<number>>;
  nkp?: string;
}) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(coverSrc);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(avatarSrc);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const inisial = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  async function uploadFile(file: File, target: "cover" | "avatar") {
    if (!nkp) {
      console.error("[ProfileHeader] nkp kosong, tidak bisa upload");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    if (target === "cover") {
      setCoverPreview(localPreview);
      setUploadingCover(true);
    } else {
      setAvatarPreview(localPreview);
      setUploadingAvatar(true);
    }

    try {
      const presignRes = await axiosInstance.post<PresignResponse>("/storage/presign", {
  type: target === "cover" ? "background" : "profile",
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
        console.error("[ProfileHeader] upload ke R2 gagal:", errText);
        throw new Error("Gagal upload gambar ke storage");
      }

      if (target === "cover") {
        onCoverChange?.(public_url);
      } else {
        onAvatarChange?.(public_url);
      }
    } catch (err) {
      console.error("[ProfileHeader] uploadFile error:", err);
    } finally {
      if (target === "cover") {
        setUploadingCover(false);
      } else {
        setUploadingAvatar(false);
      }
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      {/* Cover */}
      <div
        className="relative h-40 sm:h-48"
        style={{
          background: coverPreview
            ? `url(${coverPreview}) center/cover no-repeat`
            : "linear-gradient(135deg, #1B3A5C, #2d5a8e)",
        }}
      >
        <label className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/35 hover:bg-black/45 transition-colors rounded-md cursor-pointer text-xs text-white">
          {uploadingCover ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Camera className="w-3.5 h-3.5" />
          )}
          {uploadingCover ? "Mengunggah..." : "Ganti cover"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingCover}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f, "cover");
            }}
          />
        </label>
      </div>

      {/* Info row */}
      <div className="px-6 pb-4">
        <div className="flex items-end -mt-10 sm:-mt-12">
          <div className="relative">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-md">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} />
              ) : (
                <AvatarFallback className="bg-[#1B3A5C] text-white text-xl font-semibold">
                  {inisial}
                </AvatarFallback>
              )}
            </Avatar>

            <label className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer flex items-center justify-center hover:bg-gray-50">
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-gray-500" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingAvatar}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "avatar");
                }}
              />
            </label>
          </div>

          <div className="ml-4 mb-1 text-left">
            <p className="text-lg font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">
              {email}
            </p>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex gap-1 mt-5 border-t border-gray-100 pt-3 overflow-x-auto">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                change?.(idx);
              }}
              className="px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors"
              style={{
                background: activeTab === tab ? "#1B3A5C" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280",
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}