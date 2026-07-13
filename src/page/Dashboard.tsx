import { AppSidebar } from "@/utils/components/app-sidebar";
import { ProfileCard } from "@/utils/components/section-cards";
import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/utils/components/site-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/utils/components/data-table";
import { FormAccount } from "@/utils/FormAccount";
import { SettingsPage } from "@/utils/SettingAccount";
import React from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { approve, getPendingData, getProfile, reject } from "@/services/api";
import { DataTableApprovals } from "@/utils/components/DataTableApprovals";
import { ApprovalAlertModal } from "@/utils/ApprovalAlertModal";
import { z } from "zod";
import { schema } from "@/utils/components/DataTableApprovals";
import { FormJabatan } from "@/utils/FormJabatan";

export default function Page() {
  const [userProfile, setUserProfile] = useState<any[]>([]);
  const [userSelect, setUserSelect] = useState(0);
  const [needApprovals, setNeedApprovals] = useState<z.infer<typeof schema>[]>([])
  const [approvalPopupOpen, setApprovalPopupOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const initRef = useRef(false);

  const handleSearch = () => {
    setAppliedSearch(searchInput.trim().toLowerCase());
  };

  const filteredProfiles = appliedSearch
    ? userProfile.filter((e) =>
      e.full_name?.toLowerCase().includes(appliedSearch)
    )
    : userProfile;

    // console.log(filteredProfiles);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function init() {
      try {
        const profileData = await getProfile("both");

        const listUsers = profileData?.users?.users || profileData?.users || [];

        const safeUsers = Array.isArray(listUsers) ? listUsers : [];

        const detailMap: Record<string, any> = {};
        const safeDetails = Array.isArray(profileData?.details) ? profileData.details : [];

        safeDetails.forEach((item: any) => {
          if (item && item.nkp) {
            detailMap[item.nkp] = item;
          }
        });

        const educationMap: Record<string, any[]> = {};
        const safeEducation = Array.isArray(profileData?.education) ? profileData.education : [];
        safeEducation.forEach((item: any) => {
          if (item && item.nkp) {
            if (!educationMap[item.nkp]) educationMap[item.nkp] = [];
            educationMap[item.nkp].push(item);
          }
        });

        const assignmentMap: Record<string, any[]> = {};
        const safeAssignment = Array.isArray(profileData?.assignment) ? profileData.assignment : [];
        safeAssignment.forEach((item: any) => {
          if (item && item.nkp) {
            if (!assignmentMap[item.nkp]) assignmentMap[item.nkp] = [];
            assignmentMap[item.nkp].push(item);
          }
        });

        const feastivalMap: Record<string, any[]> = {};
        const safeFeastival = Array.isArray(profileData?.feastival) ? profileData.feastival : [];
        safeFeastival.forEach((item: any) => {
          if (item && item.nkp) {
            if (!feastivalMap[item.nkp]) feastivalMap[item.nkp] = [];
            feastivalMap[item.nkp].push(item);
          }
        });

        const pending = await getPendingData();
        setNeedApprovals(pending ?? [])

        if (pending && pending.length >= 0) {
          setApprovalPopupOpen(true);
        }
        const hasilGabungan = safeUsers.map((userItem: any) => {
          return {
            ...userItem,
            ...(userItem?.nkp ? detailMap[userItem.nkp] : {}),
            education: userItem?.nkp ? (educationMap[userItem.nkp] ?? []) : [],
            assignment: userItem?.nkp ? (assignmentMap[userItem.nkp] ?? []) : [],
            feastival: userItem?.nkp ? (feastivalMap[userItem.nkp] ?? []) : [],
          };
        });

        setUserProfile(hasilGabungan);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    init();
  }, []);

  const fullName = userProfile?.map((e) => e.full_name)
  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 50)", "--header-height": "calc(var(--spacing) * 15)", } as React.CSSProperties}>
      <AppSidebar variant="inset" userSelect={setUserSelect} />
      {
        userSelect === 0 ?
          <SidebarInset>
            <SiteHeader Headers="Dashboard (Card)" />

            <div className="flex justify-end items-center pt-4 pr-4 ">
              <div className="relative ml-3">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input
                  className="pl-9"
                  placeholder="Cari..."
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    if (value.trim() === "") {
                      setAppliedSearch("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <Button
                className="text-xs bg-[#2E6193] hover:bg-[#1477C2] text-white ml-4 pl-4 pr-4"
                size="default"
                onClick={handleSearch}
              >
                Search
              </Button>

            </div>

            <div className="flex flex-1 flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
                {filteredProfiles.map((e) => (
                  <div key={e.nkp}>
                    <ProfileCard
                      nkp={e.nkp}
                      familyName={e.family_name}
                      fullname={e.full_name}
                      religiousName={e.religious_name}
                      ktpName={e.ktp_name}
                      namePassport={e.name_in_passport}
                      dateBirth={e.date_of_birth}
                      placeBirth={e.place_of_birth}
                      phoneNumber={e.phone_number}
                      email={e.email}
                      avatarUrl={e.photo_profile}
                      background={e.photo_background}
                      education={e.education}
                      study={e.education?.[e.education.length - 1]?.institution}
                      assignment={e.assignment}
                      feastival={e.feastival}
                    />
                  </div>
                ))}
              </div>
            </div>

          </SidebarInset> :
          userSelect === 1 ?
            <SidebarInset>
              <SiteHeader Headers="Dashboard (Table)" />
              <div className="pt-6">
                <DataTable data={userProfile} />
              </div>
            </SidebarInset> :
            userSelect === 2 ?
              <SidebarInset>
                <SiteHeader Headers="Approvals (Pending)" />
                <div className="pt-6">
                  <DataTableApprovals
                    data={needApprovals}
                    onApprove={async (approval) => {
                      await approve(approval.approval_id)
                      const data = await getPendingData()
                      setNeedApprovals(data ?? [])
                    }}
                    onReject={async (approval) => {
                      await reject(approval.approval_id)
                      const data = await getPendingData()
                      setNeedApprovals(data ?? [])
                    }}
                  />
                </div>
              </SidebarInset> :
              userSelect === 3 ?
                <SidebarInset className="w-full ">
                  <SiteHeader Headers="Create New Account" />
                  <div className="flex justify-center p-6">
                    <FormAccount />
                  </div>

                </SidebarInset> :
                userSelect === 4 ?
                  <SidebarInset className="w-full ">
                    <SiteHeader Headers="Update Landing Page" />
                    <div className="flex justify-center p-6">
                      <FormJabatan />
                    </div>
                  </SidebarInset>
                  : <SidebarInset className="w-full">
                    <SiteHeader Headers="Settings" />
                    <div className="flex justify-center p-6">
                      <SettingsPage detailUser={fullName} Udata={userProfile} />
                    </div>
                  </SidebarInset>
      }
      <ApprovalAlertModal
        open={approvalPopupOpen}
        count={needApprovals?.length ?? 0}
        onClose={() => setApprovalPopupOpen(false)}
        onView={() => {
          setUserSelect(2);
          setApprovalPopupOpen(false);
        }}
      />
    </SidebarProvider>
  )
}


