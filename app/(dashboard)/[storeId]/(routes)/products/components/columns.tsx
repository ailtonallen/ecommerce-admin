"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-actions"

export type ProductColumn = {
  id: string
  name: string;
  price: string;
  sizes: string;
  category: string;
  colors: string;
  isFeatured: boolean;
  isArchived:boolean;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome:",
  },
  {
    accessorKey: "price",
    header: "Preço:",
  },
  {
    accessorKey: "isArchived",
    header: "Arquivado:",
  },
  {
    accessorKey: "isFeatured",
    header: "Apresentado:",
  },
  {
    accessorKey: "size",
    header: "Tamanho:",
  },
  {
    accessorKey: "colors",
    header: "Cor:",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
      {row.original.colors}
      <div className="h6 w-6 rounded-full border" 
      style={{backgroundColor: row.original.colors}}/>
      </div>
    )
  },
  {
    accessorKey: "category",
    header: "Categoria:",
  },
  {
    accessorKey: "createdAt",
    header: "Data:",
  },
  {
  id: "actions",
  cell: ({row}) => <CellAction data={row.original}/>
},
];
