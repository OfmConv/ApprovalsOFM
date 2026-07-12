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
import { MapPin, Building2 } from "lucide-react"

export const schema = z.object({
  id: z.number(),
  nama_lokasi: z.string(),
  status: z.string(),
  kota: z.string(),
  provinsi: z.string(),
  negara: z.string(),
  pemimpin: z.string(),
  jabatan: z.string(),
  periode_mulai: z.string().nullable().optional(),
  periode_selesai: z.string().nullable().optional(),
  fungsi_khusus: z.string().nullable().optional(),
})

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-"
  return String(value)
}

function formatDate(value: unknown) {
  if (value === null || value === undefined || value === "") return "-"
  const str = String(value)
  return str.split("T")[0]
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "biara":
      return "default"
    case "rumah filial":
      return "secondary"
    case "kantor provinsi":
      return "outline"
    default:
      return "secondary"
  }
}

function buildColumns(): ColumnDef<z.infer<typeof schema>>[] {
  return [
    {
      accessorKey: "nama_lokasi",
      header: "Komunitas",
      cell: ({ row }) => (
        <div className="w-full font-medium text-sm">{row.original.nama_lokasi}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Karya",
      cell: ({ row }) => (
          <div className="w-full">{row.original.status}</div>
      ),
    },
    {
      accessorKey: "kota",
      header: "Kota",
      cell: ({ row }) => <div className="w-full text-sm">{row.original.kota}</div>,
    },
    {
      accessorKey: "provinsi",
      header: "Provinsi",
      cell: ({ row }) => <div className="w-full text-sm">{row.original.provinsi}</div>,
    },
    {
      accessorKey: "pemimpin",
      header: "Guardian",
      cell: ({ row }) => (
        <div className="w-full text-sm truncate max-w-[220px]">{row.original.pemimpin}</div>
      ),
    },
    // {
    //   accessorKey: "jabatan",
    //   header: "Jabatan",
    //   cell: ({ row }) => (
    //     <div className="w-full">
    //       <Badge variant="outline" className="text-muted-foreground">
    //         {row.original.jabatan}
    //       </Badge>
    //     </div>
    //   ),
    // },
    {
      id: "detail",
      header: "Detail",
      cell: ({ row }) => <WilayahDetailViewer item={row.original} />,
      enableHiding: false,
    },
  ]
}

export function DataTableWilayah({
  data,
}: {
  data: z.infer<typeof schema>[] | null | undefined
}) {
  const safeData = React.useMemo(() => data ?? [], [data])
  const columns = React.useMemo(() => buildColumns(), [])
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
    getRowId: (row) => row.id.toString(),
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
      <div className="flex items-center justify-between px-4 lg:px-6 pb-6">
        <div className="flex items-center gap-2 text-muted-foreground"></div>
        <div className="flex items-center gap-2">
          {/* <Select value={searchColumn} onValueChange={setSearchColumn}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Pilih Kolom" />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="all">Semua Kolom</SelectItem>
              <SelectItem value="nama_lokasi">Nama Lokasi</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="kota">Kota</SelectItem>
              <SelectItem value="provinsi">Provinsi</SelectItem>
              <SelectItem value="pemimpin">Pemimpin</SelectItem>
            </SelectContent>
          </Select> */}

          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari wilayah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-8 lg:w-[250px]"
            />
          </div>

          {/* <DropdownMenu>
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
          </DropdownMenu> */}
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

function WilayahDetailViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

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
                <Building2 className="h-7 w-7" />
              </div>
              <div className="flex flex-col gap-1">
                <DrawerTitle className="text-xl">{item.nama_lokasi}</DrawerTitle>
                <DrawerDescription>
                  {item.kota}, {item.provinsi}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-8 text-sm">
            <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-foreground">Detail Wilayah</span>
              </div>
              <Separator className="mb-5" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Status</span>
                  <div>
                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Negara</span>
                  <span className="font-medium text-foreground">{formatValue(item.negara)}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Pemimpin</span>
                  <span className="font-medium text-foreground">{formatValue(item.pemimpin)}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Jabatan</span>
                  <span className="font-medium text-foreground">{formatValue(item.jabatan)}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Periode Mulai</span>
                  <span className="font-medium text-foreground">
                    {formatDate(item.periode_mulai)}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Periode Selesai</span>
                  <span className="font-medium text-foreground">
                    {formatDate(item.periode_selesai)}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <span className="font-medium text-muted-foreground">Fungsi Khusus</span>
                  <span className="font-medium text-foreground">
                    {formatValue(item.fungsi_khusus)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t pt-4">
            <DrawerTrigger asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Tutup
              </Button>
            </DrawerTrigger>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}