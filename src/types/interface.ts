import type { Icon } from "@tabler/icons-react"

export interface interfaceProfile {
  nkp: number,
  familyName: string,
  fullname: string,
  religiousName: string,
  ktpName: string
  namePassport: string,
  dateBirth: string,
  placeBirth: string,
  phoneNumber: string,
  study: string,
  email: string,
  avatarUrl: string,
  education: any[],
  assignment: any[],
  feastival: any[]
}

export interface interfaceSelectionGroups {
  desc: string,
  label: string,
  items: Array<string>
}

export interface NavItem {
  title: string
  url: string
  icon?: Icon,
}

export interface NavMainProps {
  items: NavItem[]
  userSelect: (val: number) => void
}

export interface ModalProps {
  title: string
  description?: string
  triggerLabel?: string
  children?: React.ReactNode
  onConfirm?: () => void
  open?: boolean
  onClose?: () => void
}

export interface CreateAccount {
  user: {
    nkp: string,
    email: string,
    secret: string,
    is_admin: boolean
  },
  detail_user: {
    nkp: string,
    full_name: string,
    family_name: string,
    name: string,
    religious_name: string,
    ktp_name: string,
    name_in_pasport: string,
    date_of_birth: string,
    place_of_birth: string,
    phone_number: string,
    photo_profile: null,
    photo_background: null,
    dead_date: null,
    place_of_burial: null,
    other_information: string,
  }
}

export interface PresignResponse {
  upload_url: string
  public_url: string
}

export interface JabatanRow {
  name: string
  photo: File | null
}

