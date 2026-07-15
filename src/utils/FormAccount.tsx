"use client"

import * as React from "react"
import {
  IconEye,
  IconEyeOff,
  IconShieldCheck,
  IconUser,
  IconHash,
  IconLoader2,
  IconX,
  IconLock,
  IconBug,
  IconMail,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconFileText,
  IconCheck,
  IconIdBadge,
  IconCross,
  IconEPassport,
  IconWorld,
} from "@tabler/icons-react"
import { createAccount, getToken, verifyEmail, verifyNKP } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Field } from "@/components/ui/field"
import { Modal } from "./Modals"
import { Popup } from "./popup"
import { Globe, MapPin } from "lucide-react"

export function FormAccount() {
  const [isVerifyNkp, setIsVerifyNkp] = React.useState("NeedVerify")
  const [isVerifyEmail, setIsVerifyEmail] = React.useState("NeedVerify")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [detailProfile, setDetailProfile] = React.useState(true)
  const [showSubmitForm, setShowSubmitForm] = React.useState(false)
  const [showPassConfirm, setShowPassConfirm] = React.useState(false)

  const [verifyKey, setVerifyKey] = React.useState({
    Nkp: {
      NkpAvailable: null,
      message: ""
    },
    Email: {
      EmailAvailable: null,
      message: ""
    }
  })

  const [UserData, setUserData] = React.useState({
    user: {
      nkp: "",
      email: "",
      secret: "",
      is_admin: false
    },
    detail_user: {
      nkp: "",
      full_name: "",
      family_name: "",
      name: "",
      religious_name: "",
      ktp_name: "",
      name_in_passport: "",
      date_of_birth: "",
      place_of_birth: "",
      phone_number: "",
      photo_profile: null,
      photo_background: null,
      dead_date: null,
      place_of_burial: null,
      other_information: null,
      birth_province: "",
      birth_region: "",
      birth_country: "",
      place_of_death: null
    }
  })

  async function verificationNKP(v: any) {
    setIsVerifyNkp("Waiting")

    if (v && v.trim() !== "" && /^\d+$/.test(v)) {
      try {
        const res = await verifyNKP(v)
        if (res.available === true) {
          setVerifyKey({
            ...verifyKey,
            Nkp: {
              NkpAvailable: res.available,
              message: res.message
            }
          })
          setIsVerifyNkp("Verify")
          return true;
        } else if (res.available === false) {
          setIsVerifyNkp("UnVerify")
          return false;
        }
      } catch (error) {
        setIsVerifyNkp("Error")
        return false;
      }
    } else {
      setIsVerifyNkp("UnVerify")
      return false;
    }
  }

  async function verificationEmail(v: any) {
    setIsVerifyEmail("Waiting")

    if (v && v.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      try {
        const res = await verifyEmail(v)
        if (res.available === true) {
          setVerifyKey({
            ...verifyKey,
            Email: {
              EmailAvailable: res.available,
              message: res.message
            }
          })
          setIsVerifyEmail("Verify")
          return true;
        } else if (res.available === false) {
          setIsVerifyEmail("UnVerify")
          return false;
        }
      } catch (error) {
        setIsVerifyEmail("Error")
        return false;
      }
    } else {
      setIsVerifyEmail("NeedVerify")
      return false;
    }
  }

  async function submitForm() {
    await getToken()
    try {
      await createAccount(UserData)
      return true
    } catch (error) {
      return false
    }
  }

  function setButton() {
    if (detailProfile === true) {
      setDetailProfile(false)
    } else {
      setDetailProfile(true)
    }
  }

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function handleInput(e: any) {
    clearTimeout(debounceTimer.current)

    const key = e.target.name;
    const values = e.target.value;

    debounceTimer.current = setTimeout(async () => {
      if (key === "FullName") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            full_name: values
          }
        })
      } else if (key === "nkp") {
        if (isVerifyNkp === "NeedVerify" || "") {
          await verificationNKP(values)
          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              nkp: values
            },
            detail_user: {
              ...UserData.detail_user,
              nkp: values
            }
          })
        } else if (isVerifyNkp === "Verify") {
          await verificationNKP(values)

          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              nkp: values
            },
            detail_user: {
              ...UserData.detail_user,
              nkp: values
            }
          })
        } else if (isVerifyNkp === "UnVerify") {
          await verificationNKP(values)
          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              nkp: values
            },
            detail_user: {
              ...UserData.detail_user,
              nkp: values
            }
          })
        } else if (isVerifyNkp === "Error") {
          await verificationNKP(values)
        }
      } else if (key === "Pass") {
        setUserData({
          ...UserData,
          user: {
            ...UserData.user,
            secret: values
          }
        })
      } else if (key === "confirmPassword") {
        if (values === UserData.user?.secret) {
          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              secret: values
            }
          })
        } else {
          setShowPassConfirm(true)
        }
      } else if (key === "email") {
        if (isVerifyEmail === "NeedVerify" || "") {
          await verificationEmail(values)
          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              email: values
            }
          })
        } else if (isVerifyEmail === "Verify") {
          await verificationEmail(values)

          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              email: values
            }
          })
        } else if (isVerifyEmail === "UnVerify") {
          await verificationEmail(values)
          setUserData({
            ...UserData,
            user: {
              ...UserData.user,
              email: values
            }
          })
        } else if (isVerifyEmail === "Error") {
          await verificationEmail(values)
        }

      } else if (key === "familyName") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            family_name: values
          }
        })
      } else if (key === "Name") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            name: values
          }
        })
      } else if (key === "religiousName") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            religious_name: values
          }
        })
      } else if (key === "ktpName") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            ktp_name: values
          }
        })
      } else if (key === "passportName") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            name_in_passport: values
          }
        })
      } else if (key === "dateOfBirth") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            date_of_birth: values
          }
        })
      } else if (key === "placeOfBirth") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            place_of_birth: values
          }
        })
      } else if (key === "phoneNumber") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            phone_number: values
          }
        })
      } else if (key === "deadDate") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            dead_date: values
          }
        })
      } else if (key === "placeOfBurial") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            place_of_burial: values
          }
        })
      } else if (key === "otherInfo") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            other_information: values
          }
        })
      } else if (key === "birthProvince") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            birth_province: values
          }
        })
      } else if (key === "birthRegion") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            birth_region: values
          }
        })
      } else if (key === "birthCountry") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            birth_country: values
          }
        })
      } else if (key === "placeOfDeath") {
        setUserData({
          ...UserData,
          detail_user: {
            ...UserData.detail_user,
            place_of_death: values
          }
        })
      }
    }, 500)
  }


  return (
    <div className="w-full rounded-2xl border bg-card shadow-sm overflow-hidden">

      <div className="flex flex-col gap-6 px-4 sm:px-8 py-6">
        {detailProfile ?
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                User Information
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    key="FullName"
                    onChange={(e: any) => handleInput(e)}
                    autoComplete="disable-autofill"
                    name="FullName"
                    type="text"
                    placeholder="e.g. Yohanes Paulus"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/50 px-3">
                  <IconShieldCheck className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Anggota Provinsi</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Default</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nkp" className="text-sm font-medium">
                  NKP
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    Membership Number
                  </span>
                </Label>

                <Field orientation="horizontal" className="w-full">
                  <div className="relative flex-1">
                    <IconHash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="nkp"
                      autoComplete="off"
                      onChange={(e: any) => handleInput(e)}
                      name="nkp"
                      placeholder="e.g. 20240001"
                      className="pl-9 w-full"
                    />
                  </div>
                  {
                    isVerifyNkp === "NeedVerify" ? <Button disabled className="bg-[#2E6193] hover:bg-[#1477C2] text-white">Verify</Button>
                      : isVerifyNkp === "Verify" ? <IconCheck className="h-6 w-6 text-green-500" />
                        : isVerifyNkp === "UnVerify" ? <IconX className="h-6 w-6" color="red" />
                          : isVerifyNkp === "Waiting" ? <div className="flex items-center justify-center"><IconLoader2 className="animate-spin h-8 w-8 text-[#2E6193]" /></div>
                            : <IconBug className="h-6 w-6" color="red" />
                  }
                </Field>
                <p className="text-left text-xs text-muted-foreground font-bold">
                  Used as login username! {verifyKey.Nkp.NkpAvailable} {verifyKey.Nkp.message}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    name="Pass"
                    key="Pass"
                    autoComplete="disable-autofill"
                    onChange={(e) => handleInput(e)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 karakter"
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email </Label>

                <Field orientation="horizontal" className="w-full">
                  <div className="relative flex-1">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      autoComplete="disable-autofill"
                      onChange={(e) => handleInput(e)}
                      name="email"
                      key="email"
                      type="email"
                      placeholder="e.g. yohanes@provinsi.org"
                      className="pl-9 w-full"
                    />
                  </div>
                  {
                    isVerifyEmail === "NeedVerify" ?
                      <Button disabled className="bg-[#2E6193] hover:bg-[#1477C2] text-white">Verify</Button>
                      : isVerifyEmail === "Verify" ? <IconCheck className="h-6 w-6 text-green-500" />
                        : isVerifyEmail === "UnVerify" ? <IconX className="h-6 w-6" color="red" />
                          : isVerifyEmail === "Waiting" ? <div className="flex items-center justify-center"><IconLoader2 className="animate-spin h-8 w-8 text-[#2E6193]" /></div>
                            : <IconBug className="h-6 w-6" color="red" />
                  }
                </Field>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
                <div className="relative">
                  <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    name="confirmPassword"
                    key="confirmPassword"
                    autoComplete="disable-autofill"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password"
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div> :

          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Detail User
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="familyName" className="text-sm font-medium">Family Name</Label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="familyName"
                    onChange={(e) => handleInput(e)}
                    autoComplete="off"
                    name="familyName"
                    placeholder="e.g. User"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="Name" className="text-sm font-medium">Name</Label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    autoComplete="disable-autofill"
                    id="Name"
                    name="Name"
                    placeholder="e.g. Test"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="religiousName" className="text-sm font-medium">Religious Name</Label>
                <div className="relative">
                  <IconCross className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    autoComplete="disable-autofill"
                    id="religiousName"
                    name="religiousName"
                    placeholder="e.g. Test"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ktpName" className="text-sm font-medium">KTP Name</Label>
                <div className="relative">
                  <IconIdBadge className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    autoComplete="disable-autofill"
                    id="ktpName"
                    name="ktpName"
                    placeholder="e.g. TEST USER"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="passportName" className="text-sm font-medium">Name in Passport</Label>
                <div className="relative">
                  <IconEPassport className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    autoComplete="disable-autofill"
                    id="passportName"
                    name="passportName"
                    placeholder="e.g. Test User"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} autoComplete="disable-autofill" name="phoneNumber" id="phoneNumber" placeholder="e.g. 081234567890" inputMode="tel" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                <div className="relative">
                  <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => handleInput(e)}
                    autoComplete="off"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeOfBirth" className="text-sm font-medium">Place of Birth</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} autoComplete="off" name="placeOfBirth" id="placeOfBirth" placeholder="e.g. Jakarta" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthProvince" className="text-sm font-medium mb-1.5">Birth Province</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} type="text" autoComplete="disable-autofill" id="birthProvince" name="birthProvince" placeholder="Enter birth province" className="pl-9" />
                </div>
              </div>


              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthRegion" className="text-sm font-medium mb-1.5">Birth Region</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} type="text" autoComplete="disable-autofill" id="birthRegion" name="birthRegion" placeholder="Enter birth region" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthCountry" className="text-sm font-medium mb-1.5">Birth Country</Label>
                <div className="relative">
                  <IconWorld className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} type="text" autoComplete="disable-autofill" id="birthCountry" name="birthCountry" placeholder="Enter birth country" className="pl-9" />
                </div>
              </div>


              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deadDate" className="text-sm font-medium">Dead Date (Optional)</Label>
                <div className="relative">
                  <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} id="deadDate" name="deadDate" autoComplete="disable-autofill" type="date" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeOfBurial" className="text-sm font-medium">Place of Burial (Optional)</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} type="text" autoComplete="disable-autofill" id="placeOfBurial" name="placeOfBurial" placeholder="Enter place of burial" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeOfDeath" className="text-sm font-medium mb-1.5">Place Of Death</Label>
                <div className="relative">
                  <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input onChange={(e) => handleInput(e)} type="text" autoComplete="disable-autofill" id="placeOfDeath" name="placeOfDeath" placeholder="Enter place of death" className="pl-9" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otherInfo" className="text-sm font-medium">Other Information</Label>
                <div className="relative">
                  <IconFileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <textarea onChange={(e) => handleInput(e)} id="otherInfo" name="otherInfo" autoComplete="disable-autofill" placeholder="Enter additional information" className="w-full pl-9 p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-24 resize-none" />
                </div>
              </div>

            </div>

          </div>
        }
      </div>

      <Popup
        open={showSubmitForm}
        onClose={() => setShowSubmitForm(false)}
        onSubmit={() => submitForm()}
        data={UserData}
      />
      <Modal
        title="Passwords don't match"
        description="Please checkAgain your password."
        open={showPassConfirm}
        onClose={() => setShowPassConfirm(false)}
        onConfirm={() => setShowPassConfirm(false)}
      />

      <div className="flex items-center justify-end gap-2 border-t bg-muted/20 px-4 sm:px-8 py-4">
        <Button onClick={setButton} className={detailProfile ? "px-6 bg-[#2E6193] hover:bg-[#1477C2] text-white" : "px-6 bg-white border border-[#1477C2] text-[#1477C2] hover:bg-[#1477C2]/10"}>{detailProfile ? "Next" : "Back"}</Button>
        {detailProfile === false ? <Button onClick={() => setShowSubmitForm(true)} className="px-6 bg-[#2E6193] hover:bg-[#1477C2] text-white">Submit</Button> : <></>}
      </div>
    </div>
  )
}