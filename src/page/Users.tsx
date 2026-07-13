

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Check, User, MapPin, HeartCrack, FileText } from "lucide-react";
import { getProfile, requestChange, updateProfileDirect } from "@/services/api";
import { useLocation } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { Modal } from "@/utils/Modals"
import EducationSection from "../utils/Education";
import ReligiousFeastSection from "@/utils/components/Religius";
import CommunitySection from "@/utils/components/Comunity";
import PhotoGallerySection from "@/utils/components/Galery";

function EditableField({ label, value, onChange, labelClassName }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    labelClassName?: string;
}) {
    const [editing, setEditing] = useState(false);

    return (
        <div className="space-y-1.5">
            <p className={`text-xs font-medium text-gray-500 text-left ${labelClassName ?? ""}`}>
                {label}
            </p>

            {editing ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={value ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                        autoFocus
                        onBlur={() => setEditing(false)}
                        className="h-9 focus-visible:ring-[#1B3A5C]"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setEditing(false)}
                    >
                        <Check className="w-4 h-4 text-[#1B3A5C]" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/60 px-3 py-2">
                    <span className={`text-sm ${value ? "text-gray-800" : "text-gray-400"}`}>
                        {value || "-"}
                    </span>
                    <button
                        onClick={() => setEditing(true)}
                        className="text-gray-400 hover:text-[#1B3A5C] transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-md bg-[#1B3A5C]/10">
                <Icon className="w-4 h-4 text-[#1B3A5C]" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>({});
    const [changes, setChanges] = useState<any>({});

    const location = useLocation();
    const nkp = location.state?.nkp;

    const isAdmin = location.state?.isAdmin === true;

    const [isChange, setIsChange] = useState(0)
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage] = useState("");

    useEffect(() => {
        async function load() {
            const profileData = await getProfile("nkp", nkp);

            const listUsers = profileData?.users?.users || profileData?.users || [];
            const safeUsers = Array.isArray(listUsers) ? listUsers : [];

            const detailMap: Record<string, any> = {};
            const safeDetails = Array.isArray(profileData?.details) ? profileData.details : [];
            safeDetails.forEach((item: any) => {
                if (item?.nkp) detailMap[item.nkp] = item;
            });

            const merged = safeUsers.map((u: any) => ({
                ...u,
                ...(u?.nkp ? detailMap[u.nkp] : {}),
            }));

            const current = merged.find((u: any) => u.nkp === nkp) ?? merged[0] ?? {};
            setProfile(current);
        }

        load();
    }, [nkp]);

    const updateField = (key: string) => (val: string) => {
        setProfile((prev: any) => ({ ...prev, [key]: val }));
        setChanges((prev: any) => ({ ...prev, [key]: val }));
    };

    const handleSubmit = async () => {
        if (Object.keys(changes).length === 0) {
            return;
        }

        try {
            if (isAdmin) {
                const { email, ...detailChanges } = changes;
                await updateProfileDirect(nkp, detailChanges, email);
            } else {
                const { email, ...detailChanges } = changes;
                await requestChange(nkp, "Update data pribadi", detailChanges, email);
            }
            setChanges({});
            setSuccessModalOpen(true);
        } catch (error: any) {
            setErrorMessage(
                error?.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
            );
            setErrorModalOpen(true);
        }
    };

    const submitLabel = isAdmin ? "Save Changes" : "Send Request";

    return (
        <div className="min-h-screen bg-gray-50/70 py-8 px-4">
            <ProfileHeader
                change={setIsChange}
                nkp={nkp}
                name={profile.full_name}
                role={profile.religious_name}
                email={profile.email}
                location={profile.place_of_birth}
                avatarSrc={profile.photo_profile}
                coverSrc={profile.photo_background}
                onAvatarChange={(dataUrl) => updateField("photo_profile")(dataUrl)}
                onCoverChange={(dataUrl) => updateField("photo_background")(dataUrl)}
            />
            {isChange === 0 ?
                <div className=" mx-auto space-y-5 mt-5">

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <SectionHeader icon={User} title="Profil" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <EditableField label="Full Name" value={profile.full_name} onChange={updateField("full_name")} />
                                <EditableField label="Family Name" value={profile.family_name} onChange={updateField("family_name")} />
                                <EditableField label="Name" value={profile.name} onChange={updateField("name")} />
                                <EditableField label="Religious Name" value={profile.religious_name} onChange={updateField("religious_name")} />
                                <EditableField label="Name on ID Card" value={profile.ktp_name} onChange={updateField("ktp_name")} />
                                <EditableField label="Name on Passport" value={profile.name_in_passport} onChange={updateField("name_in_passport")} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <SectionHeader icon={MapPin} title="Birth" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <EditableField
                                    label="Date of Birth"
                                    value={profile.date_of_birth?.split("T")[0] ?? ""}
                                    onChange={updateField("date_of_birth")}
                                />
                                <EditableField label="Place of Birth" value={profile.place_of_birth} onChange={updateField("place_of_birth")} />
                                <EditableField label="Birth Province" value={profile.birth_province} onChange={updateField("birth_province")} />
                                <EditableField label="Birth Region" value={profile.birth_region} onChange={updateField("birth_region")} />
                                <EditableField label="Birth Country" value={profile.birth_country} onChange={updateField("birth_country")} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <SectionHeader icon={User} title="Contact" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <EditableField label="Email" value={profile.email} onChange={updateField("email")} />
                                <EditableField label="Phone Number" value={profile.phone_number} onChange={updateField("phone_number")} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <SectionHeader icon={HeartCrack} title="Death" />
                            <p className="text-xs text-gray-400 -mt-3 mb-4">Fill in only if deceased.</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <EditableField label="Date of Death" value={profile.dead_date?.split("T")[0] ?? ""} onChange={updateField("dead_date")} />
                                <EditableField label="Place of Burial" value={profile.place_of_burial} onChange={updateField("place_of_burial")} />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={handleSubmit}
                        className="w-full h-10 rounded-full text-white hover:opacity-90"
                        style={{ backgroundColor: "#275c94" }}
                    >
                        {submitLabel}
                    </Button>
                </div>
                : isChange === 1 ?
                    <EducationSection nkp={nkp} isAdmin={isAdmin} />
                    : isChange === 2 ?
                        <ReligiousFeastSection nkp={nkp} isAdmin={isAdmin} />
                        : isChange === 3 ?
                            <CommunitySection nkp={nkp} isAdmin={isAdmin} />
                            : isChange === 4 ?
                                <PhotoGallerySection nkp={nkp} isAdmin={isAdmin} />
                                : <>

                                    <div className="mx-auto space-y-5 mt-5">
                                        <Card className="border-0 shadow-sm">
                                            <CardContent className="p-6">
                                                <SectionHeader icon={FileText} title="Informasi Lainnya" />
                                                <EditableField
                                                    label="Notes"
                                                    value={profile.other_information}
                                                    onChange={updateField("other_information")}
                                                />
                                                <Button
                                                    onClick={handleSubmit}
                                                    className="w-full h-10 rounded-full text-white hover:opacity-90 mt-4"
                                                    style={{ backgroundColor: "#275c94" }}
                                                >
                                                    {submitLabel}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div></>
            }
            <Modal
                title="Failed to send request"
                description={errorMessage}
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
            />
            <Modal
                title={isAdmin ? "Changes Saved Successfully" : "Request Sent Successfully"}
                description={successMessage}
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
            />
        </div>
    );
}