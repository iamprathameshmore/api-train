// src/pages/CreateApiPage.tsx
import apiClient from "@/api/axios-instance"
import ApiForm from "@/components/custom/api-from"

import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function CreateApiPage() {
  const navigate = useNavigate()

  const handleCreate = async (data: { name: string; status: string }) => {
    try {
      await apiClient.post("/api/apis", data)
      toast.success("API created successfully!")
      navigate("/apis")
    } catch {
      toast.error("Failed to create API.")
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">➕ Create New API</h1>
      <ApiForm onSubmit={handleCreate} />
    </div>
  )
}
