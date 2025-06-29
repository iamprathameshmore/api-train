import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import apiClient from "@/api/axios-instance"
import ApiForm from "@/components/custom/api-from"

export default function UpdateApiPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [defaultValues, setDefaultValues] = useState<{ name: string; status: "active" | "inactive" }>()


    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await apiClient.get(`/api/apis/${id}`)
                setDefaultValues({
                    name: res.data.name,
                    status: res.data.status.toLowerCase() as "active" | "inactive",
                })
            } catch {
                toast.error("Failed to fetch API data.")
            }
        }
        fetchApi()
    }, [id])

    const handleUpdate = async (data: { name: string; status: string }) => {
        setLoading(true)
        try {
            await apiClient.put(`/api/apis/${id}`, data)
            toast.success("API updated successfully!")
            navigate("/apis")
        } catch {
            toast.error("Update failed.")
        } finally {
            setLoading(false)
        }
    }

    if (!defaultValues) return <div className="text-center py-10">Loading...</div>

    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">✏️ Update API</h1>
            <ApiForm defaultValues={defaultValues} onSubmit={handleUpdate} loading={loading} />
        </div>
    )
}
