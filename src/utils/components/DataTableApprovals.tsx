"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutColumns,
  IconSearch,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Check, FileText, Fingerprint, Layers, ListChecks, X } from "lucide-react"
import { Modal } from "@/utils/Modals"

export const schema = z.object({
  approval_id: z.number(),
  nkp: z.string(),
  tipe: z.string(),
  status: z.string(),
  description: z.string(),
  data: z.record(z.string(), z.any()).optional(),
})

const TIPE_LABELS: Record<string, string> = {
  education: "Riwayat Pendidikan",
  details_users: "Update Data Pribadi",
  assignments: "Penugasan",
  gallery_photos: "Galeri Foto",
  religious_feast: "Data Keagamaan",
}

const FIELD_LABELS: Record<string, string> = {
  action: "Aksi",
  level: "Jenjang",
  institution: "Institusi",
  start_year: "Tahun Mulai",
  end_year: "Tahun Selesai",
  full_name: "Nama Lengkap",
  family_name: "Nama Keluarga",
  name: "Nama",
  religious_name: "Nama Baptis/Religius",
  ktp_name: "Nama KTP",
  name_in_passport: "Nama di Paspor",
  date_of_birth: "Tanggal Lahir",
  place_of_birth: "Tempat Lahir",
  phone: "Telepon",
  photo_profile: "Foto Profil",
  photo_background: "Foto Latar",
  dead_date: "Tanggal Wafat",
  place_of_burial: "Tempat Pemakaman",
  other_information: "Informasi Lain",
  location: "Lokasi",
  tugas: "Tugas",
  date: "Tanggal",
  file_path: "File",
  title: "Judul",
  formation_type: "Jenis Pembentukan",
  formation_date: "Tanggal Pembentukan",
  notes: "Catatan",
}

function humanize(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? humanize(key)
}

function tipeLabel(tipe: string) {
  return TIPE_LABELS[tipe] ?? humanize(tipe)
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-"
  if (typeof value === "boolean") return value ? "Ya" : "Tidak"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "approved":
      return "default"
    case "rejected":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}

export type ApprovalAction = (approval: z.infer<typeof schema>) => Promise<void> | void

function buildColumns(
  onApprove?: ApprovalAction,
  onReject?: ApprovalAction
): ColumnDef<z.infer<typeof schema>>[] {
  return [
    // {
    //   accessorKey: "approval_id",
    //   header: "ID",
    //   cell: ({ row }) => (
    //     <div className="w-full font-medium text-sm">#{row.original.approval_id}</div>
    //   ),
    //   enableHiding: false,
    // },
    {
      accessorKey: "nkp",
      header: "NKP",
      cell: ({ row }) => (
        <div className="w-full">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.nkp}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "tipe",
      header: "Tipe",
      cell: ({ row }) => (
        <div className="w-full text-sm">{tipeLabel(row.original.tipe)}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => (
        <div className="w-full text-sm truncate max-w-[280px]">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-full">
          <Badge variant={statusVariant(row.original.status)} className="capitalize">
            {row.original.status}
          </Badge>
        </div>
      ),
    },
    {
      id: "detail",
      header: "Detail",
      cell: ({ row }) => (
        <ApprovalDetailViewer item={row.original} onApprove={onApprove} onReject={onReject} />
      ),
      enableHiding: false,
    },
  ]
}

export function DataTableApprovals({
  data,
  onApprove,
  onReject,
}: {
  data: z.infer<typeof schema>[] | null | undefined
  onApprove?: ApprovalAction
  onReject?: ApprovalAction
}) {
  const safeData = React.useMemo(() => data ?? [], [data])
  const columns = React.useMemo(() => buildColumns(onApprove, onReject), [onApprove, onReject])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [searchColumn, setSearchColumn] = React.useState("all")

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchTerm) {
        setGlobalFilter("")
        setColumnFilters([])
        return
      }
      if (searchColumn === "all") {
        setGlobalFilter(searchTerm)
        setColumnFilters([])
      } else {
        setGlobalFilter("")
        setColumnFilters([{ id: searchColumn, value: searchTerm }])
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchTerm, searchColumn])

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.approval_id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 lg:px-6 pb-6">
  <div className="flex items-center gap-2 text-muted-foreground">
    
  </div>
  <div className="flex flex-wrap items-center gap-2">
    <Select value={searchColumn} onValueChange={setSearchColumn}>
      <SelectTrigger className="w-[140px] sm:w-[160px] h-9">
        <SelectValue placeholder="Pilih Kolom" />
      </SelectTrigger>
      <SelectContent side="bottom">
        <SelectItem value="all">Semua Kolom</SelectItem>
        <SelectItem value="nkp">NKP</SelectItem>
        <SelectItem value="tipe">Tipe</SelectItem>
        <SelectItem value="status">Status</SelectItem>
        <SelectItem value="description">Deskripsi</SelectItem>
      </SelectContent>
    </Select>

    <div className="relative flex-1 min-w-[140px] sm:flex-none">
      <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder="Cari approval..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-9 w-full sm:w-[200px] pl-8 lg:w-[250px]"
      />
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#2E6193] hover:bg-[#1477C2] text-white hover:text-white"
        >
          <IconLayoutColumns />
          <span className="hidden lg:inline">Customize Columns</span>
          <span className="lg:hidden">Columns</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>

      <div className="overflow-auto rounded-lg border h-[450px] mx-4 lg:mx-6">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-[#878e96] [&>tr:hover]:bg-[#878e96] [&>tr>th]:text-white [&>tr>th]:text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&>tr>td]:text-left">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <span className="flex justify-center">Data Not Found</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end px-4 lg:px-6 pt-4">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Baris per halaman
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Halaman sebelumnya</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Halaman berikutnya</span>
              <IconChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ApprovalDetailViewer({
  item,
  onApprove,
  onReject,
}: {
  item: z.infer<typeof schema>
  onApprove?: ApprovalAction
  onReject?: ApprovalAction
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [pendingAction, setPendingAction] = React.useState<"approve" | "reject" | null>(null)
  const [resultModal, setResultModal] = React.useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })
  const entries = Object.entries(item.data ?? {}).filter(([key]) => key !== "action")
  const isPending = item.status?.toLowerCase() === "pending"

  async function handleAction(type: "approve" | "reject") {
    const handler = type === "approve" ? onApprove : onReject
    if (!handler) return
    try {
      setPendingAction(type)
      await handler(item)
      setOpen(false)
      setResultModal({
        open: true,
        title: type === "approve" ? "Approval Disetujui" : "Approval Ditolak",
        description: `Approval #${item.approval_id} (${tipeLabel(item.tipe)}) untuk NKP ${item.nkp} berhasil di${
          type === "approve" ? "setujui" : "tolak"
        }.`,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi"
      setResultModal({
        open: true,
        title: type === "approve" ? "Gagal Menyetujui" : "Gagal Menolak",
        description: message,
      })
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <>
      <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Lihat Detail
        </Button>
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "sm:max-w-lg" : ""}>
        <DrawerHeader className="gap-4 pb-6 pt-8 text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1">
              <DrawerTitle className="text-xl">{tipeLabel(item.tipe)}</DrawerTitle>
              <DrawerDescription>{item.description}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-8 text-sm">
          <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-foreground">Ringkasan Approval</span>
            </div>
            <Separator className="mb-5" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fingerprint className="h-4 w-4" />
                  <span className="font-medium">NKP</span>
                </div>
                <div className="font-medium text-foreground">{item.nkp}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ListChecks className="h-4 w-4" />
                  <span className="font-medium">Status</span>
                </div>
                <div>
                  <Badge variant={statusVariant(item.status)} className="capitalize">
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-foreground">
                Data Perubahan ({tipeLabel(item.tipe)})
              </span>
            </div>
            <Separator className="mb-5" />
            {entries.length ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {entries.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <span className="font-medium text-muted-foreground">{fieldLabel(key)}</span>
                    <span className="font-medium text-foreground break-words">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada data perubahan.</p>
            )}
          </div>
        </div>

        <DrawerFooter className="flex-row gap-3 border-t pt-4">
          <Button
            variant="destructive"
            className="flex-1"
            disabled={!isPending || pendingAction !== null}
            onClick={() => handleAction("reject")}
          >
            <X className="h-4 w-4" />
            {pendingAction === "reject" ? "Memproses..." : "Reject"}
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!isPending || pendingAction !== null}
            onClick={() => handleAction("approve")}
          >
            <Check className="h-4 w-4" />
            {pendingAction === "approve" ? "Memproses..." : "Approve"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      </Drawer>

      <Modal
        title={resultModal.title}
        description={resultModal.description}
        open={resultModal.open}
        onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}