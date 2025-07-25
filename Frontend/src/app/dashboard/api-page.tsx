import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
import ApiTable from "@/components/api/table/api-table"
import PageWrapper from "@/components/page-wrapper"



export default function ApisPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")



  return (
    <PageWrapper
      title="Your APIs"
      subtitle="Manage your APIs and their configurations"
      
      actions={
        <>
          <Button className="rounded-none">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add API
        </Button>
        <Button className="rounded-none">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add API
        </Button>
        </>
      }
      filters={
        <>
          <Input
            placeholder="Search APIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-white rounded-none"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter} >
            <SelectTrigger className="w-[150px] bg-white rounded-none" >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      <ApiTable />
    </PageWrapper>
  )
}
