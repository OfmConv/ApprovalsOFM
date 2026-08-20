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
  background: string,
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

export interface DetailUser {
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

export interface User {
  email: string;
  nkp: string;
  is_admin: boolean;
  secret: string;
}

export interface UserResponse {
  user: User;
  detail_user: DetailUser;
}

export interface PopupProps {
  open: boolean;
  data: UserResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export interface Article {
  id: number
  jdl_artikel: string
  description: string
  img: string
}

export interface LoadingProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface Profile {
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
  background?: string,
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

export interface Article {
  id: number;
  jdl_artikel: string;
  description: string;
  img: string;
}
