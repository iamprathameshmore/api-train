import { useEffect, useState } from "react"
import apiClient from "@/api/axios-instance"
import { useAppSelector } from "@/store/hook"
import { selectUserRole } from "@/store/slices/auth-slice"
import { toast } from "sonner"

interface AuditLog {
  id: number
  user_id: number
  action: string
  target_type: string
  target_id: number
  details?: string
  timestamp: string
}

export default function AuditLogPage() {
  const userRole = useAppSelector((state) => selectUserRole(state.auth))
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get("/api/audit-logs")
        setLogs(res.data.data)
      } catch {
        toast.error("Failed to fetch audit logs or not authorized.")
      } finally {
        setLoading(false)
      }
    }
    if (userRole === "admin") fetchLogs()
  }, [userRole])

  if (userRole !== "admin") {
    return <div className="text-center py-10 text-destructive">Not authorized</div>
  }

  if (loading) return <div className="text-center py-10">Loading audit logs...</div>

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">📝 Audit Logs</h1>
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{log.user_id}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.target_type} #{log.target_id}</td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8">No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 