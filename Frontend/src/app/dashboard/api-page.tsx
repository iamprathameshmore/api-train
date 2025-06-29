import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from "lucide-react"

interface ApiEntry {
  id: number
  name: string
  status: string
  createdAt: string
}

const dummyApis: ApiEntry[] = [
  { id: 1, name: "Water Usage API", status: "Active", createdAt: "2025-06-29" },
  { id: 2, name: "Health Risk Predictor", status: "Inactive", createdAt: "2025-06-27" },
  { id: 3, name: "Loan Score Model", status: "Active", createdAt: "2025-06-24" },
]

export default function ApisPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApis = dummyApis.filter((api) => {
    const matchesSearch = api.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || api.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🧪 Your APIs</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add API
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search APIs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">API Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApis.map((api) => (
              <TableRow key={api.id}>
                <TableCell className="font-medium">{api.name}</TableCell>
                <TableCell>{api.status}</TableCell>
                <TableCell>{api.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredApis.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No APIs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
