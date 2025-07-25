import { useState } from "react"
import PageWrapper from "@/components/page-wrapper"



export default function SettingPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")



  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your APIs and their configurations"
      
    
    >
      {/* <ApiTable /> */}
      <div>hello</div>
    </PageWrapper>
  )
}
