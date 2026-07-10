// "use client"

// import * as React from "react"
// import {
//   closestCenter,
//   DndContext,
//   KeyboardSensor,
//   MouseSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type UniqueIdentifier,
// } from "@dnd-kit/core"
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconGripVertical,
//   IconLayoutColumns,
//   IconSearch,
//   IconFileSpreadsheet,
// } from "@tabler/icons-react"
// import {
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type ColumnDef,
//   type ColumnFiltersState,
//   type Row,
//   type SortingState,
//   type VisibilityState,
// } from "@tanstack/react-table"
// import { z } from "zod"
// import * as XLSX from "xlsx"
// import { useIsMobile } from "@/hooks/use-mobile"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { BookOpen, CalendarDays, Fingerprint, Mail, MapPin, Phone, UserCircle, Users, Briefcase, Cross } from "lucide-react"

// export const schema = z.object({
//   id: z.number(),
//   full_name: z.string(),
//   nkp: z.string(),
//   email: z.string(),
//   ktp_name: z.string().optional(),
//   place_of_birth: z.string().optional(),
//   date_of_birth: z.string().optional().nullable(),
//   family_name: z.string().optional(),
//   is_admin: z.boolean(),
//   phone_number: z.string().optional(),
//   other_information: z.string().optional(),
//   religious_name: z.string().optional(),
//   education: z.array(z.any()).optional(),
//   assignment: z.array(z.any()).optional(),
//   feastival: z.array(z.any()).optional(),
// })

// // Helper: format tanggal dengan aman, kembalikan "-" kalau null/invalid
// function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
//   if (!value) return "-"
//   const date = new Date(value)
//   if (isNaN(date.getTime())) return "-"
//   return date.toLocaleDateString("id-ID", options)
// }

// function DragHandle({ id }: { id: number }) {
//   const { attributes, listeners } = useSortable({ id })

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="size-7 text-muted-foreground hover:bg-transparent"
//     >
//       <IconGripVertical className="size-3 text-muted-foreground" />
//       <span className="sr-only">Drag to reorder</span>
//     </Button>
//   )
// }

// const columns: ColumnDef<z.infer<typeof schema>>[] = [
//   {
//     id: "drag",
//     header: () => null,
//     cell: ({ row }) => <DragHandle id={row.original.id} />,
//   },
//   {
//     accessorKey: "full_name",
//     header: "Full Name",
//     cell: ({ row }) => {
//       return <div className="w-full"><TableCellViewer item={row.original} /></div>
//     },
//     enableHiding: false,
//   },
//   {
//     accessorKey: "nkp",
//     header: "NKP",
//     cell: ({ row }) => (
//       <div className="w-full">
//         <Badge variant="outline" className="px-1.5 text-muted-foreground">
//           {row.original.nkp}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     cell: ({ row }) => (
//       <div className="w-full text-sm truncate">
//         {row.original.email}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "ktp_name",
//     header: "KTP Name",
//     cell: ({ row }) => (
//       <div className="w-full">
//         <div className="w-full text-sm truncate">
//           {row.original.ktp_name || "-"}
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "place_of_birth",
//     header: "Place Of Birth",
//     cell: ({ row }) => (
//       <div className="w-full text-sm">
//         {row.original.place_of_birth || "-"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "date_of_birth",
//     header: "Date Birth",
//     cell: ({ row }) => (
//       <div className="w-full text-sm">
//         {formatDate(row.original.date_of_birth)}
//       </div>
//     ),
//   },
//   // {
//   //   accessorKey: "is_admin",
//   //   header: "Status",
//   //   cell: ({ row }) => (
//   //     <div className="w-full">
//   //       <Badge variant={row.original.is_admin ? "default" : "secondary"}>
//   //         {row.original.is_admin ? "Ya" : "Tidak"}
//   //       </Badge>
//   //     </div>
//   //   ),
//   // },
// ]

// function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
//   const { transform, transition, setNodeRef, isDragging } = useSortable({
//     id: row.original.id,
//   })

//   return (
//     <TableRow
//       data-state={row.getIsSelected() && "selected"}
//       data-dragging={isDragging}
//       ref={setNodeRef}
//       className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition: transition,
//       }}
//     >
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   )
// }

// export function DataTable({ data: initialData }: {
//   data: z.infer<typeof schema>[]
// }) {
//   const [data, setData] = React.useState(() => initialData)

//   React.useEffect(() => {
//     setData(initialData)
//   }, [initialData])

//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })
//   const [globalFilter, setGlobalFilter] = React.useState("")
//   const [searchTerm, setSearchTerm] = React.useState("")
//   const [searchColumn, setSearchColumn] = React.useState("all")

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (!searchTerm) {
//         setGlobalFilter("")
//         setColumnFilters([])
//         return
//       }

//       if (searchColumn === "all") {
//         setGlobalFilter(searchTerm)
//         setColumnFilters([])
//       } else {
//         setGlobalFilter("")
//         setColumnFilters([{ id: searchColumn, value: searchTerm }])
//       }
//     }, 500)

//     return () => clearTimeout(timeout)
//   }, [searchTerm, searchColumn])

//   const sortableId = React.useId()
//   const sensors = useSensors(
//     useSensor(MouseSensor, {}),
//     useSensor(TouchSensor, {}),
//     useSensor(KeyboardSensor, {})
//   )
//   const dataIds = React.useMemo<UniqueIdentifier[]>(
//     () => data?.map(({ id }) => id) || [],
//     [data]
//   )

//   const globalFilterFn = React.useCallback(
//     (row: Row<z.infer<typeof schema>>, _columnId: string, filterValue: string) => {
//       const search = String(filterValue).toLowerCase()
//       const item = row.original

//       return [
//         item.full_name,
//         item.nkp,
//         item.email,
//         item.ktp_name,
//         item.place_of_birth,
//         item.family_name,
//         item.religious_name,
//         item.phone_number,
//       ].some((field) => field?.toLowerCase().includes(search))
//     },
//     []
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//       globalFilter,
//     },
//     globalFilterFn,
//     onGlobalFilterChange: setGlobalFilter,
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event
//     if (active && over && active.id !== over.id) {
//       setData((data) => {
//         const oldIndex = dataIds.indexOf(active.id)
//         const newIndex = dataIds.indexOf(over.id)
//         return arrayMove(data, oldIndex, newIndex)
//       })
//     }
//   }

//   // ===== EXPORT EXCEL =====

//   const exportProfile = () => {
//     return data.map((item) => ({
//       "NKP": item.nkp,
//       "Full Name": item.full_name,
//       "Email": item.email,
//       "KTP Name": item.ktp_name || "-",
//       "Place Of Birth": item.place_of_birth || "-",
//       "Date Birth": formatDate(item.date_of_birth),
//       "Family Name": item.family_name || "-",
//       "Religious Name": item.religious_name || "-",
//       "Phone Number": item.phone_number || "-",
//     }))
//   }

//   const exportEducation = () => {
//     return data.flatMap((item) =>
//       (item.education ?? []).map((edu: any) => ({
//         "NKP": item.nkp,
//         "Full Name": item.full_name,
//         "Institution": edu.institution || "-",
//         "Level": edu.level || "-",
//         "Start Year": edu.start_year || "-",
//         "End Year": edu.end_year || "-",
//       }))
//     )
//   }

//   const exportAssignment = () => {
//     return data.flatMap((item) =>
//       (item.assignment ?? []).map((asg: any) => ({
//         "NKP": item.nkp,
//         "Full Name": item.full_name,
//         "Tugas": asg.tugas || "-",
//         "Location": asg.location || "-",
//         "Date": formatDate(asg.date),
//       }))
//     )
//   }

//   const exportFeastival = () => {
//     return data.flatMap((item) =>
//       (item.feastival ?? []).map((f: any) => ({
//         "NKP": item.nkp,
//         "Full Name": item.full_name,
//         "Formation Type": f.formation_type || "-",
//         "Location": f.location || "-",
//         "Formation Date": formatDate(f.formation_date),
//         "Notes": f.notes || "-",
//       }))
//     )
//   }

//   const exportCombined = () => {
//     return data.map((item) => {
//       const educationList = item.education ?? []
//       const assignmentList = item.assignment ?? []
//       const feastivalList = item.feastival ?? []

//       return {
//         "NKP": item.nkp,
//         "Full Name": item.full_name,
//         "Email": item.email,
//         "KTP Name": item.ktp_name || "-",
//         "Place Of Birth": item.place_of_birth || "-",
//         "Date Birth": formatDate(item.date_of_birth),
//         "Family Name": item.family_name || "-",
//         "Religious Name": item.religious_name || "-",
//         "Phone Number": item.phone_number || "-",

//         // Pendidikan - per kolom
//         "Institusi": educationList.map((edu: any) => edu.institution || "-").join("; ") || "-",
//         "Jenjang": educationList.map((edu: any) => edu.level || "-").join("; ") || "-",
//         "Tahun Mulai": educationList.map((edu: any) => edu.start_year || "-").join("; ") || "-",
//         "Tahun Selesai": educationList.map((edu: any) => edu.end_year || "-").join("; ") || "-",

//         // Penugasan - per kolom
//         "Tugas": assignmentList.map((asg: any) => asg.tugas || "-").join("; ") || "-",
//         "Lokasi Tugas": assignmentList.map((asg: any) => asg.location || "-").join("; ") || "-",
//         "Tanggal Tugas": assignmentList.map((asg: any) => formatDate(asg.date)).join("; ") || "-",

//         // Pesta Religius - per kolom
//         "Formasi": feastivalList.map((f: any) => f.formation_type || "-").join("; ") || "-",
//         "Lokasi Formasi": feastivalList.map((f: any) => f.location || "-").join("; ") || "-",
//         "Tanggal Formasi": feastivalList.map((f: any) => formatDate(f.formation_date)).join("; ") || "-",
//         "Catatan Formasi": feastivalList.map((f: any) => f.notes || "-").join("; ") || "-",
//       }
//     })
// }

//   const downloadWorkbook = (sheets: { name: string; rows: any[] }[], filenamePrefix: string) => {
//     const workbook = XLSX.utils.book_new()

//     sheets.forEach(({ name, rows }) => {
//       const worksheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ "Info": "Tidak ada data" }])
//       XLSX.utils.book_append_sheet(workbook, worksheet, name)
//     })

//     const today = new Date().toISOString().split("T")[0]
//     XLSX.writeFile(workbook, `${filenamePrefix}-${today}.xlsx`)
//   }

//   const handleExportAll = () => {
//     downloadWorkbook([{ name: "Data Lengkap", rows: exportCombined() }], "data-gabungan")
//   }

//   const handleExportProfileOnly = () => {
//     downloadWorkbook([{ name: "Profil", rows: exportProfile() }], "data-profil")
//   }

//   const handleExportEducationOnly = () => {
//     downloadWorkbook([{ name: "Pendidikan", rows: exportEducation() }], "data-pendidikan")
//   }

//   const handleExportAssignmentOnly = () => {
//     downloadWorkbook([{ name: "Penugasan", rows: exportAssignment() }], "data-penugasan")
//   }

//   const handleExportFeastivalOnly = () => {
//     downloadWorkbook([{ name: "Pesta Religius", rows: exportFeastival() }], "data-pesta-religius")
//   }

//   return (
//     <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 ">
//       <div className="flex items-center justify-between px-4 lg:px-6">
//         <Label htmlFor="view-selector" className="sr-only">
//           View
//         </Label>
//         <div></div>
//         <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
//           <TabsTrigger value="outline">Outline</TabsTrigger>
//           <TabsTrigger value="past-performance">
//             Past Performance <Badge variant="secondary">3</Badge>
//           </TabsTrigger>
//           <TabsTrigger value="key-personnel">
//             Key Personnel <Badge variant="secondary">2</Badge>
//           </TabsTrigger>
//           <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
//         </TabsList>
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
//                 >
//                   <IconFileSpreadsheet />
//                   <span className="hidden lg:inline">Export to Excel</span>
//                   <span className="lg:hidden">Export</span>
//                   <IconChevronDown />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportAll}>
//                   Export Semua (Gabungan)
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportProfileOnly}>
//                   Export Profil Saja
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportEducationOnly}>
//                   Export Pendidikan Saja
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportAssignmentOnly}>
//                   Export Penugasan Saja
//                 </DropdownMenuCheckboxItem>
//                 <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportFeastivalOnly}>
//                   Export Pesta Religius Saja
//                 </DropdownMenuCheckboxItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Select value={searchColumn} onValueChange={setSearchColumn}>
//               <SelectTrigger className="w-[160px] h-9">
//                 <SelectValue placeholder="Pilih Kolom" />
//               </SelectTrigger>
//               <SelectContent side="bottom">
//                 <SelectItem value="all">Select Column</SelectItem>
//                 <SelectItem value="full_name">Full Name </SelectItem>
//                 <SelectItem value="nkp">NKP</SelectItem>
//                 <SelectItem value="email">Email</SelectItem>
//                 <SelectItem value="ktp_name">KTP Name</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="relative">
//             <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
//             <Input
//               placeholder="Cari semua data..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="h-9 w-[200px] pl-8 lg:w-[250px]"
//             />
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="bg-[#2E6193] hover:bg-[#1477C2] text-white hover:text-white">
//                 <IconLayoutColumns />
//                 <span className="hidden lg:inline">Customize Columns</span>
//                 <span className="lg:hidden">Columns</span>
//                 <IconChevronDown />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {table
//                 .getAllColumns()
//                 .filter(
//                   (column) =>
//                     typeof column.accessorFn !== "undefined" &&
//                     column.getCanHide()
//                 )
//                 .map((column) => (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//       <TabsContent
//         value="outline"
//         className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
//       >
//         <div className="overflow-auto rounded-lg border h-[450px]">
//           <DndContext
//             collisionDetection={closestCenter}
//             modifiers={[restrictToVerticalAxis]}
//             onDragEnd={handleDragEnd}
//             sensors={sensors}
//             id={sortableId}
//           >
//             <Table>
//               <TableHeader className="sticky top-0 z-10 bg-[#878e96] [&>tr:hover]:bg-[#878e96] [&>tr>th]:text-white [&>tr>th]:text-left">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id} colSpan={header.colSpan}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody className="**:data-[slot=table-cell]:first:w-8 [&>tr>td]:text-left">
//                 {table.getRowModel().rows?.length ? (
//                   <SortableContext
//                     items={dataIds}
//                     strategy={verticalListSortingStrategy}
//                   >
//                     {table.getRowModel().rows.map((row) => (
//                       <DraggableRow key={row.id} row={row} />
//                     ))}
//                   </SortableContext>
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <span className="flex justify-center">Data Not Found</span>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </DndContext>
//         </div>
//         <div className="flex items-center justify-end px-4">
//           <div className="flex w-full items-center gap-8 lg:w-fit">
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Baris per halaman
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => table.setPageSize(Number(value))}
//               >
//                 <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                   <SelectValue placeholder={table.getState().pagination.pageSize} />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex w-fit items-center justify-center text-sm font-medium">
//               Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
//               {table.getPageCount()}
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 <span className="sr-only">Halaman sebelumnya</span>
//                 <IconChevronLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 <span className="sr-only">Halaman berikutnya</span>
//                 <IconChevronRight />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </TabsContent>
//       <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//       <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//       <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//     </Tabs>
//   )
// }

// function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
//   const isMobile = useIsMobile()

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .substring(0, 2)
//       .toUpperCase()
//   }

//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="w-fit px-0 text-left text-foreground font-medium">
//           {item.full_name}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className={!isMobile ? "sm:max-w-lg" : ""}>
//         <DrawerHeader className="gap-4 pb-6 pt-8 text-left">
//           <div className="flex items-center gap-4">
//             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
//               {getInitials(item.full_name)}
//             </div>
//             <div className="flex flex-col gap-1">
//               <DrawerTitle className="text-2xl">{item.full_name}</DrawerTitle>
//               <DrawerDescription>Detail informasi data pribadi</DrawerDescription>
//             </div>
//           </div>
//         </DrawerHeader>

//         <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-8 text-sm">
//           <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
//             <div className="mb-4 flex items-center gap-2">
//               <UserCircle className="h-5 w-5 text-primary" />
//               <span className="text-base font-semibold text-foreground">Data Pribadi</span>
//             </div>
//             <Separator className="mb-5" />

//             <div className="grid grid-cols-1 gap-x-6 gap-y-6 ">

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Fingerprint className="h-4 w-4" />
//                   <span className="font-medium">NKP</span>
//                 </div>
//                 <div className="font-medium text-foreground">{item.nkp}</div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Mail className="h-4 w-4" />
//                   <span className="font-medium">Email</span>
//                 </div>
//                 <div className="font-medium text-foreground">{item.email}</div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <UserCircle className="h-4 w-4" />
//                   <span className="font-medium">KTP Name</span>
//                 </div>
//                 <div className="font-medium text-foreground">{item.ktp_name || "-"}</div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <MapPin className="h-4 w-4" />
//                   <span className="font-medium">Place Of Birth</span>
//                 </div>
//                 <div className="font-medium text-foreground">{item.place_of_birth || "-"}</div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <CalendarDays className="h-4 w-4" />
//                   <span className="font-medium">Date Birth</span>
//                 </div>
//                 <div className="font-medium text-foreground">
//                   {formatDate(item.date_of_birth, { day: "numeric", month: "long", year: "numeric" })}
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Users className="h-4 w-4" />
//                   <span className="font-medium">Family Name</span>
//                 </div>
//                 <div className="font-medium text-foreground">{item.family_name || "-"}</div>
//               </div>

//               {item.religious_name && (
//                 <div className="flex flex-col gap-1.5">
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <BookOpen className="h-4 w-4" />
//                     <span className="font-medium">Religious Name</span>
//                   </div>
//                   <div className="font-medium text-foreground">{item.religious_name}</div>
//                 </div>
//               )}

//               {item.phone_number && (
//                 <div className="flex flex-col gap-1.5">
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <Phone className="h-4 w-4" />
//                     <span className="font-medium">Phone Number</span>
//                   </div>
//                   <div className="font-medium text-foreground">{item.phone_number}</div>
//                 </div>
//               )}

//             </div>
//           </div>

//           {Array.isArray(item.education) && item.education.length > 0 && (
//             <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
//               <div className="mb-4 flex items-center gap-2">
//                 <BookOpen className="h-5 w-5 text-primary" />
//                 <span className="text-base font-semibold text-foreground">Pendidikan</span>
//               </div>
//               <Separator className="mb-5" />
//               <div className="flex flex-col gap-4">
//                 {item.education.map((edu: any) => (
//                   <div key={edu.education_id} className="flex flex-col gap-1">
//                     <div className="font-medium text-foreground">{edu.institution || "-"}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {edu.level}{edu.start_year && edu.end_year ? ` (${edu.start_year} - ${edu.end_year})` : ""}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {Array.isArray(item.assignment) && item.assignment.length > 0 && (
//             <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
//               <div className="mb-4 flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-primary" />
//                 <span className="text-base font-semibold text-foreground">Penugasan</span>
//               </div>
//               <Separator className="mb-5" />
//               <div className="flex flex-col gap-4">
//                 {item.assignment.map((asg: any) => (
//                   <div key={asg.assignment_id} className="flex flex-col gap-1">
//                     <div className="font-medium text-foreground">{asg.tugas || "-"}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {asg.location}{asg.date ? ` - ${formatDate(asg.date)}` : ""}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {Array.isArray(item.feastival) && item.feastival.length > 0 && (
//             <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
//               <div className="mb-4 flex items-center gap-2">
//                 <Cross className="h-5 w-5 text-primary" />
//                 <span className="text-base font-semibold text-foreground">Pesta Religius</span>
//               </div>
//               <Separator className="mb-5" />
//               <div className="flex flex-col gap-4">
//                 {item.feastival.map((f: any) => (
//                   <div key={f.religious_id} className="flex flex-col gap-1">
//                     <div className="font-medium text-foreground">{f.formation_type || "-"}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {f.location}{f.formation_date ? ` - ${formatDate(f.formation_date)}` : ""}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconGripVertical,
  IconLayoutColumns,
  IconSearch,
  IconFileSpreadsheet,
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
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"
import * as XLSX from "xlsx"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BookOpen, CalendarDays, Fingerprint, Mail, MapPin, Phone, UserCircle, Users, Briefcase, Cross, Pencil } from "lucide-react"

export const schema = z.object({
  id: z.number(),
  full_name: z.string(),
  nkp: z.string(),
  email: z.string(),
  ktp_name: z.string().optional(),
  place_of_birth: z.string().optional(),
  date_of_birth: z.string().optional().nullable(),
  family_name: z.string().optional(),
  is_admin: z.boolean(),
  phone_number: z.string().optional(),
  other_information: z.string().optional(),
  religious_name: z.string().optional(),
  education: z.array(z.any()).optional(),
  assignment: z.array(z.any()).optional(),
  feastival: z.array(z.any()).optional(),
})

// Helper: format tanggal dengan aman, kembalikan "-" kalau null/invalid
function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "-"
  const date = new Date(value)
  if (isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("id-ID", options)
}

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => {
      return <div className="w-full"><TableCellViewer item={row.original} /></div>
    },
    enableHiding: false,
  },
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-full text-sm truncate">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "ktp_name",
    header: "KTP Name",
    cell: ({ row }) => (
      <div className="w-full">
        <div className="w-full text-sm truncate">
          {row.original.ktp_name || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "place_of_birth",
    header: "Place Of Birth",
    cell: ({ row }) => (
      <div className="w-full text-sm">
        {row.original.place_of_birth || "-"}
      </div>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Date Birth",
    cell: ({ row }) => (
      <div className="w-full text-sm">
        {formatDate(row.original.date_of_birth)}
      </div>
    ),
  },
  // {
  //   accessorKey: "is_admin",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <div className="w-full">
  //       <Badge variant={row.original.is_admin ? "default" : "secondary"}>
  //         {row.original.is_admin ? "Ya" : "Tidak"}
  //       </Badge>
  //     </div>
  //   ),
  // },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({ data: initialData }: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const [rowSelection, setRowSelection] = React.useState({})
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

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const globalFilterFn = React.useCallback(
    (row: Row<z.infer<typeof schema>>, _columnId: string, filterValue: string) => {
      const search = String(filterValue).toLowerCase()
      const item = row.original

      return [
        item.full_name,
        item.nkp,
        item.email,
        item.ktp_name,
        item.place_of_birth,
        item.family_name,
        item.religious_name,
        item.phone_number,
      ].some((field) => field?.toLowerCase().includes(search))
    },
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    globalFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // ===== EXPORT EXCEL =====

  const exportProfile = () => {
    return data.map((item) => ({
      "NKP": item.nkp,
      "Full Name": item.full_name,
      "Email": item.email,
      "KTP Name": item.ktp_name || "-",
      "Place Of Birth": item.place_of_birth || "-",
      "Date Birth": formatDate(item.date_of_birth),
      "Family Name": item.family_name || "-",
      "Religious Name": item.religious_name || "-",
      "Phone Number": item.phone_number || "-",
    }))
  }

  const exportEducation = () => {
    return data.flatMap((item) =>
      (item.education ?? []).map((edu: any) => ({
        "NKP": item.nkp,
        "Full Name": item.full_name,
        "Institution": edu.institution || "-",
        "Level": edu.level || "-",
        "Start Year": edu.start_year || "-",
        "End Year": edu.end_year || "-",
      }))
    )
  }

  const exportAssignment = () => {
    return data.flatMap((item) =>
      (item.assignment ?? []).map((asg: any) => ({
        "NKP": item.nkp,
        "Full Name": item.full_name,
        "Tugas": asg.tugas || "-",
        "Location": asg.location || "-",
        "Date": formatDate(asg.date),
      }))
    )
  }

  const exportFeastival = () => {
    return data.flatMap((item) =>
      (item.feastival ?? []).map((f: any) => ({
        "NKP": item.nkp,
        "Full Name": item.full_name,
        "Formation Type": f.formation_type || "-",
        "Location": f.location || "-",
        "Formation Date": formatDate(f.formation_date),
        "Notes": f.notes || "-",
      }))
    )
  }

  const exportCombined = () => {
    return data.map((item) => {
      const educationList = item.education ?? []
      const assignmentList = item.assignment ?? []
      const feastivalList = item.feastival ?? []

      return {
        "NKP": item.nkp,
        "Full Name": item.full_name,
        "Email": item.email,
        "KTP Name": item.ktp_name || "-",
        "Place Of Birth": item.place_of_birth || "-",
        "Date Birth": formatDate(item.date_of_birth),
        "Family Name": item.family_name || "-",
        "Religious Name": item.religious_name || "-",
        "Phone Number": item.phone_number || "-",

        // Pendidikan - per kolom
        "Institusi": educationList.map((edu: any) => edu.institution || "-").join("; ") || "-",
        "Jenjang": educationList.map((edu: any) => edu.level || "-").join("; ") || "-",
        "Tahun Mulai": educationList.map((edu: any) => edu.start_year || "-").join("; ") || "-",
        "Tahun Selesai": educationList.map((edu: any) => edu.end_year || "-").join("; ") || "-",

        // Penugasan - per kolom
        "Tugas": assignmentList.map((asg: any) => asg.tugas || "-").join("; ") || "-",
        "Lokasi Tugas": assignmentList.map((asg: any) => asg.location || "-").join("; ") || "-",
        "Tanggal Tugas": assignmentList.map((asg: any) => formatDate(asg.date)).join("; ") || "-",

        // Pesta Religius - per kolom
        "Formasi": feastivalList.map((f: any) => f.formation_type || "-").join("; ") || "-",
        "Lokasi Formasi": feastivalList.map((f: any) => f.location || "-").join("; ") || "-",
        "Tanggal Formasi": feastivalList.map((f: any) => formatDate(f.formation_date)).join("; ") || "-",
        "Catatan Formasi": feastivalList.map((f: any) => f.notes || "-").join("; ") || "-",
      }
    })
}

  const downloadWorkbook = (sheets: { name: string; rows: any[] }[], filenamePrefix: string) => {
    const workbook = XLSX.utils.book_new()

    sheets.forEach(({ name, rows }) => {
      const worksheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ "Info": "Tidak ada data" }])
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    })

    const today = new Date().toISOString().split("T")[0]
    XLSX.writeFile(workbook, `${filenamePrefix}-${today}.xlsx`)
  }

  const handleExportAll = () => {
    downloadWorkbook([{ name: "Data Lengkap", rows: exportCombined() }], "data-gabungan")
  }

  const handleExportProfileOnly = () => {
    downloadWorkbook([{ name: "Profil", rows: exportProfile() }], "data-profil")
  }

  const handleExportEducationOnly = () => {
    downloadWorkbook([{ name: "Pendidikan", rows: exportEducation() }], "data-pendidikan")
  }

  const handleExportAssignmentOnly = () => {
    downloadWorkbook([{ name: "Penugasan", rows: exportAssignment() }], "data-penugasan")
  }

  const handleExportFeastivalOnly = () => {
    downloadWorkbook([{ name: "Pesta Religius", rows: exportFeastival() }], "data-pesta-religius")
  }

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 ">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div></div>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
                >
                  <IconFileSpreadsheet />
                  <span className="hidden lg:inline">Export to Excel</span>
                  <span className="lg:hidden">Export</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportAll}>
                  Export Semua (Gabungan)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportProfileOnly}>
                  Export Profil Saja
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportEducationOnly}>
                  Export Pendidikan Saja
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportAssignmentOnly}>
                  Export Penugasan Saja
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleExportFeastivalOnly}>
                  Export Pesta Religius Saja
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select value={searchColumn} onValueChange={setSearchColumn}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Pilih Kolom" />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectItem value="all">Select Column</SelectItem>
                <SelectItem value="full_name">Full Name </SelectItem>
                <SelectItem value="nkp">NKP</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="ktp_name">KTP Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari semua data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-8 lg:w-[250px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-[#2E6193] hover:bg-[#1477C2] text-white hover:text-white">
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
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
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
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-auto rounded-lg border h-[450px]">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-[#878e96] [&>tr:hover]:bg-[#878e96] [&>tr>th]:text-white [&>tr>th]:text-left">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8 [&>tr>td]:text-left">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <span className="flex justify-center">Data Not Found</span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-end px-4">
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
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
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
      </TabsContent>
      <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const handleEdit = () => {
    // Admin login (token dari localStorage) yang mengedit, target datanya item.nkp.
    // isAdmin: true -> ProfilePage pakai jalur direct-update, bukan request-change.
    const adminToken = localStorage.getItem("token")
    setOpen(false)
    navigate(`/anggota/${adminToken}`, {
      state: {
        nkp: item.nkp,
        isAdmin: true,
      },
    })
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground font-medium">
          {item.full_name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "sm:max-w-lg" : ""}>
        <DrawerHeader className="gap-4 pb-6 pt-8 text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {getInitials(item.full_name)}
            </div>
            <div className="flex flex-col gap-1">
              <DrawerTitle className="text-2xl">{item.full_name}</DrawerTitle>
              <DrawerDescription>Detail informasi data pribadi</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-8 text-sm">
          <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-foreground">Data Pribadi</span>
            </div>
            <Separator className="mb-5" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 ">

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fingerprint className="h-4 w-4" />
                  <span className="font-medium">NKP</span>
                </div>
                <div className="font-medium text-foreground">{item.nkp}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email</span>
                </div>
                <div className="font-medium text-foreground">{item.email}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span className="font-medium">KTP Name</span>
                </div>
                <div className="font-medium text-foreground">{item.ktp_name || "-"}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Place Of Birth</span>
                </div>
                <div className="font-medium text-foreground">{item.place_of_birth || "-"}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-medium">Date Birth</span>
                </div>
                <div className="font-medium text-foreground">
                  {formatDate(item.date_of_birth, { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Family Name</span>
                </div>
                <div className="font-medium text-foreground">{item.family_name || "-"}</div>
              </div>

              {item.religious_name && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Religious Name</span>
                  </div>
                  <div className="font-medium text-foreground">{item.religious_name}</div>
                </div>
              )}

              {item.phone_number && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Phone Number</span>
                  </div>
                  <div className="font-medium text-foreground">{item.phone_number}</div>
                </div>
              )}

            </div>
          </div>

          {Array.isArray(item.education) && item.education.length > 0 && (
            <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-foreground">Pendidikan</span>
              </div>
              <Separator className="mb-5" />
              <div className="flex flex-col gap-4">
                {item.education.map((edu: any) => (
                  <div key={edu.education_id} className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">{edu.institution || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {edu.level}{edu.start_year && edu.end_year ? ` (${edu.start_year} - ${edu.end_year})` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(item.assignment) && item.assignment.length > 0 && (
            <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-foreground">Penugasan</span>
              </div>
              <Separator className="mb-5" />
              <div className="flex flex-col gap-4">
                {item.assignment.map((asg: any) => (
                  <div key={asg.assignment_id} className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">{asg.tugas || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {asg.location}{asg.date ? ` - ${formatDate(asg.date)}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(item.feastival) && item.feastival.length > 0 && (
            <div className="rounded-xl border bg-muted/20 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Cross className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-foreground">Pesta Religius</span>
              </div>
              <Separator className="mb-5" />
              <div className="flex flex-col gap-4">
                {item.feastival.map((f: any) => (
                  <div key={f.religious_id} className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">{f.formation_type || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.location}{f.formation_date ? ` - ${formatDate(f.formation_date)}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <DrawerFooter className="border-t pt-4">
          <Button
            onClick={handleEdit}
            className="w-full gap-2 text-white hover:opacity-90"
            style={{ backgroundColor: "#1B3A5C" }}
          >
            <Pencil className="h-4 w-4" />
            Edit Data
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}