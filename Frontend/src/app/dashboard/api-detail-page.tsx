// src/pages/ApiDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import apiClient from "@/api/axios-instance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ROUTES } from "@/constant/route-constant"
import { useAppSelector } from "@/store/hook"
import { selectUserRole } from "@/store/slices/auth-slice"


interface ApiModel {
  id: string
  name: string
  status: "active" | "inactive"
  created_at?: string
  updated_at?: string
  username: string
  model_name: string
}

interface ModelVersion {
  id: number;
  version: number;
  is_active: boolean;
  createdAt: string;
}

interface ApiKey {
  id: number;
  key: string;
  is_active: boolean;
  createdAt: string;
}

export default function ApiDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [api, setApi] = useState<ApiModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyLoading, setKeyLoading] = useState(false);
  const userRole = useAppSelector((state) => selectUserRole(state.auth));

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await apiClient.get(`/api/apis/${id}`)
        // Ensure username and model_name are present
        setApi({
          ...res.data,
          username: res.data.username || "",
          model_name: res.data.model_name || res.data.name || "",
        })
      } catch  {
        toast.error("Failed to fetch API details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchApi()
  }, [id])

  // All subsequent API calls use api.username and api.model_name
  // Fetch model versions
  useEffect(() => {
    const fetchVersions = async () => {
      if (!api) return;
      setVersionLoading(true);
      try {
        // Assume api has username and model_name fields or fetch them as needed
        const res = await apiClient.get(`/api/${api.username}/models/${api.model_name}/versions`);
        setVersions(res.data.data);
      } catch {
        toast.error("Failed to fetch model versions.");
      } finally {
        setVersionLoading(false);
      }
    };
    if (api) fetchVersions();
  }, [api]);

  // Fetch API keys
  const fetchApiKeys = async () => {
    if (!api) return;
    setKeyLoading(true);
    try {
      const res = await apiClient.get(`/api/${api.username}/models/${api.model_name}/keys`);
      setApiKeys(res.data.data);
    } catch {
      toast.error("Failed to fetch API keys.");
    } finally {
      setKeyLoading(false);
    }
  };

  useEffect(() => {
    if (api) fetchApiKeys();
  }, [api]);

  const handleRollback = async (version: number) => {
    if (!api) return;
    try {
      await apiClient.post(`/api/${api.username}/models/${api.model_name}/rollback/${version}`);
      toast.success(`Rolled back to version ${version}`);
      // Refresh versions
      const res = await apiClient.get(`/api/${api.username}/models/${api.model_name}/versions`);
      setVersions(res.data.data);
    } catch {
      toast.error("Failed to rollback version.");
    }
  };

  const handleRegenerateKey = async () => {
    if (!api) return;
    try {
      await apiClient.post(`/api/${api.username}/models/${api.model_name}/keys`);
      toast.success("New API key generated.");
      fetchApiKeys();
    } catch {
      toast.error("Failed to generate new API key.");
    }
  };

  const handleRevokeKey = async (keyId: number) => {
    if (!api) return;
    try {
      await apiClient.delete(`/api/${api.username}/models/${api.model_name}/keys/${keyId}`);
      toast.success("API key revoked.");
      fetchApiKeys();
    } catch {
      toast.error("Failed to revoke API key.");
    }
  };

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

          {/* Model Versioning UI */}
          <div>
            <div className="font-semibold mb-2">Model Versions:</div>
            {versionLoading ? (
              <div>Loading versions...</div>
            ) : (
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li key={v.id} className={v.is_active ? "font-bold text-green-700" : ""}>
                    Version {v.version} {v.is_active && <span>(Active)</span>} - {new Date(v.createdAt).toLocaleString()}
                    {!v.is_active && (
                      <Button size="sm" className="ml-2" onClick={() => handleRollback(v.version)}>
                        Rollback
                      </Button>
                    )}
                  </li>
                ))}
                {versions.length === 0 && <li>No versions found.</li>}
              </ul>
            )}
          </div>

          {/* API Key Management UI */}
          <div>
            <div className="font-semibold mb-2 mt-6">API Keys:</div>
            {keyLoading ? (
              <div>Loading keys...</div>
            ) : (
              <>
                <Button size="sm" onClick={handleRegenerateKey} className="mb-2">Regenerate Key</Button>
                <ul className="space-y-2">
                  {apiKeys.map((k) => (
                    <li key={k.id} className={k.is_active ? "" : "text-gray-400 line-through"}>
                      <span className="font-mono select-all">{k.key}</span> {k.is_active ? <span className="text-green-600">(Active)</span> : <span>(Revoked)</span>}
                      {k.is_active && (
                        <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleRevokeKey(k.id)}>
                          Revoke
                        </Button>
                      )}
                      <span className="ml-2 text-xs text-gray-500">{new Date(k.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                  {apiKeys.length === 0 && <li>No API keys found.</li>}
                </ul>
              </>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="outline" onClick={() => navigate(ROUTES.USER_DASHBOARD.APIS)}>
              Back
            </Button>
            {/* Admin-only: Audit Logs */}
            {userRole === "admin" && (
              <Button variant="secondary" onClick={() => navigate("/admin/audit-logs")}>Audit Logs</Button>
            )}
            {/* Update navigation: implement or link to update page if available */}
            {/* <Button onClick={() => navigate(`/apis/update/${api.id}`)}>Edit API</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
