"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Shield, Key, Users, Activity, AlertTriangle } from "lucide-react"

interface SecuritySettings {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    passwordExpiry: number
    preventReuse: number
  }
  twoFactorAuth: {
    enabled: boolean
    method: string
    backupCodes: number
  }
  loginSecurity: {
    maxAttempts: number
    lockoutDuration: number
    sessionTimeout: number
    requireEmailVerification: boolean
  }
  ipRestrictions: {
    enabled: boolean
    allowedIPs: string[]
    blockedIPs: string[]
  }
  auditLog: {
    enabled: boolean
    retentionDays: number
    logFailedAttempts: boolean
    logSuccessfulLogins: boolean
  }
}

interface SecurityLog {
  id: number
  timestamp: string
  event: string
  user: string
  ip: string
  userAgent: string
}

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSecuritySettings()
  }, [])

  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch("/api/admin/settings/security")
      const result = await response.json()

      if (result.success) {
        setSettings(result.data.settings)
        setLogs(result.data.logs)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch security settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Security settings updated successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (section: keyof SecuritySettings, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const getEventBadge = (event: string) => {
    switch (event) {
      case "login_success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Login Success
          </Badge>
        )
      case "login_failed":
        return <Badge variant="destructive">Login Failed</Badge>
      case "password_changed":
        return <Badge variant="secondary">Password Changed</Badge>
      default:
        return <Badge variant="outline">{event}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage security policies and monitor access</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Password Policy
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Two-Factor Auth
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Login Security
          </TabsTrigger>
          <TabsTrigger value="ip" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            IP Restrictions
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Configure password requirements and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => updateSettings("passwordPolicy", "minLength", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordPolicy.passwordExpiry}
                    onChange={(e) =>
                      updateSettings("passwordPolicy", "passwordExpiry", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Character Requirements</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase</Label>
                    <Switch
                      id="requireUppercase"
                      checked={settings.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => updateSettings("passwordPolicy", "requireUppercase", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireLowercase">Require Lowercase</Label>
                    <Switch
                      id="requireLowercase"
                      checked={settings.passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => updateSettings("passwordPolicy", "requireLowercase", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={settings.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => updateSettings("passwordPolicy", "requireNumbers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={settings.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => updateSettings("passwordPolicy", "requireSpecialChars", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Configure two-factor authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa-enabled">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require users to use 2FA for login</p>
                </div>
                <Switch
                  id="2fa-enabled"
                  checked={settings.twoFactorAuth.enabled}
                  onCheckedChange={(checked) => updateSettings("twoFactorAuth", "enabled", checked)}
                />
              </div>

              {settings.twoFactorAuth.enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Authentication Method</Label>
                      <Select
                        value={settings.twoFactorAuth.method}
                        onValueChange={(value) => updateSettings("twoFactorAuth", "method", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">Authenticator App</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupCodes">Backup Codes Count</Label>
                      <Input
                        id="backupCodes"
                        type="number"
                        value={settings.twoFactorAuth.backupCodes}
                        onChange={(e) =>
                          updateSettings("twoFactorAuth", "backupCodes", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login Security</CardTitle>
              <CardDescription>Configure login attempt limits and session management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={settings.loginSecurity.maxAttempts}
                    onChange={(e) => updateSettings("loginSecurity", "maxAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.loginSecurity.lockoutDuration}
                    onChange={(e) =>
                      updateSettings("loginSecurity", "lockoutDuration", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.loginSecurity.sessionTimeout}
                    onChange={(e) => updateSettings("loginSecurity", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify their email before login</p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.loginSecurity.requireEmailVerification}
                  onCheckedChange={(checked) => updateSettings("loginSecurity", "requireEmailVerification", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ip">
          <Card>
            <CardHeader>
              <CardTitle>IP Restrictions</CardTitle>
              <CardDescription>Control access based on IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ip-enabled">Enable IP Restrictions</Label>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  id="ip-enabled"
                  checked={settings.ipRestrictions.enabled}
                  onCheckedChange={(checked) => updateSettings("ipRestrictions", "enabled", checked)}
                />
              </div>

              {settings.ipRestrictions.enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Allowed IP Addresses</Label>
                      <div className="space-y-2">
                        {settings.ipRestrictions.allowedIPs.map((ip, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={ip} readOnly />
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm">
                          Add IP
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Monitor security events and access attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit-enabled">Enable Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Log security events and user activities</p>
                </div>
                <Switch
                  id="audit-enabled"
                  checked={settings.auditLog.enabled}
                  onCheckedChange={(checked) => updateSettings("auditLog", "enabled", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Recent Security Events</h4>
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getEventBadge(log.event)}
                        <div>
                          <p className="font-medium">{log.user}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()} • {log.ip}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
