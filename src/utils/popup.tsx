import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DetailUser {
  full_name: string;
  family_name: string;
  name: string;
  ktp_name: string;
  name_in_passport: string;
  nkp: string;
  phone_number: string;
  date_of_birth: string;
  place_of_birth: string;
  religious_name: string;
  photo_profile: string | null;
  photo_background: string | null;
  other_information: string | null;
  dead_date: string | null;
  place_of_burial: string | null;
  birth_province: string;
  birth_region: string;
  birth_country: string;
  place_of_death: string | null;

}

interface User {
  email: string;
  nkp: string;
  is_admin: boolean;
  secret: string;
}

interface UserResponse {
  user: User;
  detail_user: DetailUser;
}

interface PopupProps {
  open: boolean;
  data: UserResponse;
  onClose: () => void;
  onSubmit: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-zinc-100 last:border-0">
      <span className="text-sm font-medium text-zinc-600">{label}</span>
      <div className="text-sm text-zinc-900 font-medium">{children}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-sm text-zinc-900 font-medium bg-zinc-100 rounded-lg px-3 py-1.5 mr-2">
      {children}
    </span>
  );
}


export function Popup({ open, data, onClose, onSubmit }: PopupProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  if (!open || !data) return null;

  const { user, detail_user } = data;

  
  const handleSubmit = () => {
    let statusCreate;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(async () => {
        setSuccess(false);
        statusCreate = await onSubmit?.();
        onClose?.();
      }, 1200);
    }, 1400);
    if (statusCreate != true) {
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          <Field label="NKP">

            <div className="flex items-center gap-2 justify-end">
              <Pill>{user.nkp}</Pill>
              <IconVerified className="text-blue-500 shrink-0" />
            </div>
          </Field>

          <Field label="Email address">
            <div className="flex items-center gap-2 justify-end">
              <span>{user.email}</span>
              <IconEmail />
            </div>
          </Field>

          <Field label="Full Name"><div className="flex gap-2 flex-wrap justify-end">{detail_user.full_name}</div></Field>
          <Field label="Name">{detail_user.name || "—"}</Field>
          <Field label="KTP Name">{detail_user.ktp_name || "—"}</Field>
          <Field label="Passport Name">{detail_user.name_in_passport || "—"}</Field>
          <Field label="Family Name">{detail_user.religious_name || "—"}</Field>
          <Field label="Religious Name">{detail_user.family_name || "—"}</Field>

          <Field label="Phone">{detail_user.phone_number || "—"}</Field>

          <Field label="Place of Birth">{detail_user.place_of_birth || "—"}</Field>
          <Field label="Birth Country">{detail_user.birth_country || "—"}</Field>
          <Field label="Birth Province">{detail_user.birth_province || "—"}</Field>
          <Field label="Birth Region">{detail_user.birth_region || "—"}</Field>
          <Field label="Date of Birth">{detail_user.date_of_birth || "—"}</Field>
          <Field label="Dead Date">{detail_user.dead_date || "—"}</Field>
          <Field label="Place Of Death">{detail_user.place_of_death || "—"}</Field>
          <Field label="Place Of Burial">{detail_user.place_of_burial || "—"}</Field>
          {detail_user.other_information && (
            <Field label="Other Information">{detail_user.other_information}</Field>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleSubmit}
              disabled={loading || success}
              className={`px-6 bg-[#2E6193] hover:bg-[#1477C2] text-white`}
            >
              <>Create</>

            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconVerified({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4 12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
