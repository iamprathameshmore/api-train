import { useEffect, useState } from "react"
import apiClient from "@/api/axios-instance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { logout } from "@/store/slices/auth-slice"

function ProfilePage() {
  const [email, setEmail] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dispatch = useAppDispatch()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get("/users/me")
        setEmail(res.data.email)
        setWebhookUrl(res.data.webhook_url || "")
        setUserId(res.data.id)
      } catch {
        toast.error("Failed to fetch profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiClient.put("/users/me", { webhook_url: webhookUrl })
      toast.success("Webhook URL updated!")
    } catch {
      toast.error("Failed to update webhook URL.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return
    try {
      await apiClient.delete(`/users/${userId}/delete-account`)
      toast.success("Account deleted. Goodbye!")
      dispatch(logout())
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account.")
    }
  }

  if (loading) return <div className="text-center py-10">Loading profile...</div>

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">👤 Profile</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Email (for notifications):</label>
        <Input value={email} disabled />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Webhook URL (for notifications):</label>
        <Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-webhook-url.com" />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      <hr className="my-8" />
      <Button variant="destructive" onClick={handleDeleteAccount}>
        Delete Account
      </Button>
    </div>
  )
}

export default ProfilePage