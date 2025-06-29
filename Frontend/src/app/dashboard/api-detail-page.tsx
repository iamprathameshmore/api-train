// src/pages/ApiDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import apiClient from "@/api/axios-instance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ROUTES } from "@/constant/route-constant"


interface ApiModel {
  id: string
  name: string
  status: "active" | "inactive"
  created_at?: string
  updated_at?: string
}

export default function ApiDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [api, setApi] = useState<ApiModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await apiClient.get(`/api/apis/${id}`)
        setApi(res.data)
      } catch  {
        toast.error("Failed to fetch API details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchApi()
  }, [id])

  if (loading) return <div className="text-center py-10">Loading API...</div>
  if (!api) return <div className="text-center py-10 text-destructive">API not found</div>

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{api.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className={api.status === "active" ? "text-green-600" : "text-yellow-600"}>
              {api.status}
            </span>
          </div>
          {api.created_at && (
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {new Date(api.created_at).toLocaleString()}
            </div>
          )}
          {api.updated_at && (
            <div>
              <span className="font-semibold">Updated:</span>{" "}
              {new Date(api.updated_at).toLocaleString()}
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <Button variant="outline" onClick={() => navigate(ROUTES.APIS)}>
              Back
            </Button>
            <Button onClick={() => navigate(ROUTES.API_UPDATE(api.id))}>
              Edit API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
