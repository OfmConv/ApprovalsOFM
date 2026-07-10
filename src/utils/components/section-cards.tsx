import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, GraduationCap, Cross } from "lucide-react";
import type { interfaceProfile } from "@/types/interface";
import { ProfileModal } from "../ModalUsers";

export function ProfileCard({ nkp, familyName, fullname, religiousName, ktpName, namePassport, dateBirth, placeBirth, phoneNumber, study, email, avatarUrl, education, assignment, feastival }: interfaceProfile) {
  console.log("PROPS DI PROFILECARD nkp", nkp, "education:", education, "feastival:", feastival);
  return (
    <Card className="w-full min-h-[320px] rounded-2xl border shadow-sm flex flex-col">
      <CardContent className="pt-3 pb-1 flex flex-col flex-1 items-center gap-2">

        <Avatar className="w-20 h-20">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {fullname?.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <p className="text-xs text-muted-foreground tracking-widest">{nkp}</p>
        <p className="text-sm font-medium text-center">{fullname}</p>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full mt-1">
          <div className="flex items-center gap-1.5"><Cross className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-[11px] text-muted-foreground truncate">{religiousName}</span></div>
          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-[11px] text-muted-foreground truncate">{phoneNumber}</span></div>
          <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-[11px] text-muted-foreground truncate">{study}</span></div>
          <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" /><span className="text-[11px] text-muted-foreground truncate">{email}</span></div>
        </div>

        <div className="flex-1" />

        <ProfileModal
          profile={{
            nkp: nkp,
            namaLengkap: familyName,
            namaBaptis: religiousName,
            namaKeluarga: familyName,
            namaKtp: ktpName,
            namaPaspor: namePassport,
            tanggalLahir: dateBirth,
            tempatLahir: placeBirth,
            noHp: phoneNumber,
            email: email,
            avatarUrl: avatarUrl,
            pendidikan: "S1 Informatika",
            s1: "S1 Informatika - USU",
            profesiPerdana: "20 Januari 2015",
            profesiMeriah: "20 Januari 2018",
            education: education,
            assignment: assignment,
            feastival: feastival,
          }}
        />

      </CardContent>
    </Card>
  );
}

export function ProfileCardGrid({ profiles }: { profiles: interfaceProfile[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {profiles.map((p) => (
        <ProfileCard key={p.nkp} {...p} />
      ))}
    </div>
  );
}