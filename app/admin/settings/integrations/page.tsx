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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  BarChart3,
  Mail,
  CreditCard,
  Cloud,
  Webhook,
  Facebook,
  Twitter,
  Instagram,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react"

interface Integration {
  enabled: boolean
  status: string
  [key: string]: any
}

interface Integrations {
  analytics: {
    googleAnalytics: Integration
    googleTagManager: Integration
  }
  social: {
    facebook: Integration
    twitter: Integration
    instagram: Integration
  }
  email: {
    smtp: Integration
    mailgun: Integration
    sendgrid: Integration
  }
  payment: {
    stripe: Integration
    paypal: Integration
  }
  storage: {
    aws: Integration
    cloudinary: Integration
  }
  webhooks: Array<{
    id: number
    name: string
    url: string
    events: string[]
    status: string
    lastTriggered: string | null
  }>
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integrations | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [webhookDialog, setWebhookDialog] = useState(false)
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
  })

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/admin/settings/integrations")
      const result = await response.json()

      if (result.success) {
        setIntegrations(result.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveIntegrations = async () => {
    if (!integrations) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(integrations),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Integration settings updated successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async (integration: string) => {
    setTesting(integration)
    try {
      const response = await fetch("/api/admin/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_connection", integration }),
      })

      const result = await response.json()

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      })
    } finally {
      setTesting(null)
    }
  }

  const addWebhook = async () => {
    try {
      const response = await fetch("/api/admin/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_webhook", data: newWebhook }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Webhook added successfully",
        })
        setWebhookDialog(false)
        setNewWebhook({ name: "", url: "", events: [] })
        fetchIntegrations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add webhook",
        variant: "destructive",
      })
    }
  }

  const updateIntegration = (category: keyof Integrations, service: string, field: string, value: any) => {
    if (!integrations) return

    setIntegrations({
      ...integrations,
      [category]: {
        ...integrations[category],
        [service]: {
          ...integrations[category][service],
          [field]: value,
        },
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!integrations) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services and manage API integrations</p>
        </div>
        <Button onClick={saveIntegrations} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Google Analytics
                </CardTitle>
                <CardDescription>Track website traffic and user behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ga-enabled">Enable Google Analytics</Label>
                    {getStatusBadge(integrations.analytics.googleAnalytics.status)}
                  </div>
                  <Switch
                    id="ga-enabled"
                    checked={integrations.analytics.googleAnalytics.enabled}
                    onCheckedChange={(checked) => updateIntegration("analytics", "googleAnalytics", "enabled", checked)}
                  />
                </div>
                {integrations.analytics.googleAnalytics.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                      <Input
                        id="ga-tracking-id"
                        placeholder="GA-XXXXXXXXX-X"
                        value={integrations.analytics.googleAnalytics.trackingId}
                        onChange={(e) =>
                          updateIntegration("analytics", "googleAnalytics", "trackingId", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => testConnection("googleAnalytics")}
                      disabled={testing === "googleAnalytics"}
                    >
                      {testing === "googleAnalytics" ? "Testing..." : "Test Connection"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Google Tag Manager
                </CardTitle>
                <CardDescription>Manage tracking codes and marketing tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gtm-enabled">Enable Google Tag Manager</Label>
                    {getStatusBadge(integrations.analytics.googleTagManager.status)}
                  </div>
                  <Switch
                    id="gtm-enabled"
                    checked={integrations.analytics.googleTagManager.enabled}
                    onCheckedChange={(checked) =>
                      updateIntegration("analytics", "googleTagManager", "enabled", checked)
                    }
                  />
                </div>
                {integrations.analytics.googleTagManager.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gtm-container-id">Container ID</Label>
                      <Input
                        id="gtm-container-id"
                        placeholder="GTM-XXXXXXX"
                        value={integrations.analytics.googleTagManager.containerId}
                        onChange={(e) =>
                          updateIntegration("analytics", "googleTagManager", "containerId", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => testConnection("googleTagManager")}
                      disabled={testing === "googleTagManager"}
                    >
                      {testing === "googleTagManager" ? "Testing..." : "Test Connection"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="h-5 w-5" />
                  Facebook
                </CardTitle>
                <CardDescription>Connect Facebook for social login and sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fb-enabled">Enable Facebook Integration</Label>
                    {getStatusBadge(integrations.social.facebook.status)}
                  </div>
                  <Switch
                    id="fb-enabled"
                    checked={integrations.social.facebook.enabled}
                    onCheckedChange={(checked) => updateIntegration("social", "facebook", "enabled", checked)}
                  />
                </div>
                {integrations.social.facebook.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fb-app-id">App ID</Label>
                      <Input
                        id="fb-app-id"
                        value={integrations.social.facebook.appId}
                        onChange={(e) => updateIntegration("social", "facebook", "appId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fb-app-secret">App Secret</Label>
                      <Input
                        id="fb-app-secret"
                        type="password"
                        value={integrations.social.facebook.appSecret}
                        onChange={(e) => updateIntegration("social", "facebook", "appSecret", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="h-5 w-5" />
                  Twitter
                </CardTitle>
                <CardDescription>Connect Twitter for social sharing and login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="twitter-enabled">Enable Twitter Integration</Label>
                    {getStatusBadge(integrations.social.twitter.status)}
                  </div>
                  <Switch
                    id="twitter-enabled"
                    checked={integrations.social.twitter.enabled}
                    onCheckedChange={(checked) => updateIntegration("social", "twitter", "enabled", checked)}
                  />
                </div>
                {integrations.social.twitter.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter-api-key">API Key</Label>
                      <Input
                        id="twitter-api-key"
                        value={integrations.social.twitter.apiKey}
                        onChange={(e) => updateIntegration("social", "twitter", "apiKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter-api-secret">API Secret</Label>
                      <Input
                        id="twitter-api-secret"
                        type="password"
                        value={integrations.social.twitter.apiSecret}
                        onChange={(e) => updateIntegration("social", "twitter", "apiSecret", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5" />
                  Instagram
                </CardTitle>
                <CardDescription>Connect Instagram for media integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="instagram-enabled">Enable Instagram Integration</Label>
                    {getStatusBadge(integrations.social.instagram.status)}
                  </div>
                  <Switch
                    id="instagram-enabled"
                    checked={integrations.social.instagram.enabled}
                    onCheckedChange={(checked) => updateIntegration("social", "instagram", "enabled", checked)}
                  />
                </div>
                {integrations.social.instagram.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="instagram-token">Access Token</Label>
                    <Input
                      id="instagram-token"
                      type="password"
                      value={integrations.social.instagram.accessToken}
                      onChange={(e) => updateIntegration("social", "instagram", "accessToken", e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  SMTP
                </CardTitle>
                <CardDescription>Configure SMTP server for email delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="smtp-enabled">Enable SMTP</Label>
                    {getStatusBadge(integrations.email.smtp.status)}
                  </div>
                  <Switch
                    id="smtp-enabled"
                    checked={integrations.email.smtp.enabled}
                    onCheckedChange={(checked) => updateIntegration("email", "smtp", "enabled", checked)}
                  />
                </div>
                {integrations.email.smtp.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={integrations.email.smtp.host}
                        onChange={(e) => updateIntegration("email", "smtp", "host", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input
                        id="smtp-port"
                        type="number"
                        value={integrations.email.smtp.port}
                        onChange={(e) => updateIntegration("email", "smtp", "port", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input
                        id="smtp-username"
                        value={integrations.email.smtp.username}
                        onChange={(e) => updateIntegration("email", "smtp", "username", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        onChange={(e) => updateIntegration("email", "smtp", "password", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe
                </CardTitle>
                <CardDescription>Accept payments with Stripe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="stripe-enabled">Enable Stripe</Label>
                    {getStatusBadge(integrations.payment.stripe.status)}
                  </div>
                  <Switch
                    id="stripe-enabled"
                    checked={integrations.payment.stripe.enabled}
                    onCheckedChange={(checked) => updateIntegration("payment", "stripe", "enabled", checked)}
                  />
                </div>
                {integrations.payment.stripe.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-publishable">Publishable Key</Label>
                      <Input
                        id="stripe-publishable"
                        value={integrations.payment.stripe.publishableKey}
                        onChange={(e) => updateIntegration("payment", "stripe", "publishableKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret">Secret Key</Label>
                      <Input
                        id="stripe-secret"
                        type="password"
                        value={integrations.payment.stripe.secretKey}
                        onChange={(e) => updateIntegration("payment", "stripe", "secretKey", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Amazon S3
                </CardTitle>
                <CardDescription>Store files in Amazon S3</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="aws-enabled">Enable AWS S3</Label>
                    {getStatusBadge(integrations.storage.aws.status)}
                  </div>
                  <Switch
                    id="aws-enabled"
                    checked={integrations.storage.aws.enabled}
                    onCheckedChange={(checked) => updateIntegration("storage", "aws", "enabled", checked)}
                  />
                </div>
                {integrations.storage.aws.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aws-access-key">Access Key</Label>
                      <Input
                        id="aws-access-key"
                        value={integrations.storage.aws.accessKey}
                        onChange={(e) => updateIntegration("storage", "aws", "accessKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aws-secret-key">Secret Key</Label>
                      <Input
                        id="aws-secret-key"
                        type="password"
                        value={integrations.storage.aws.secretKey}
                        onChange={(e) => updateIntegration("storage", "aws", "secretKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aws-bucket">Bucket Name</Label>
                      <Input
                        id="aws-bucket"
                        value={integrations.storage.aws.bucket}
                        onChange={(e) => updateIntegration("storage", "aws", "bucket", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aws-region">Region</Label>
                      <Select
                        value={integrations.storage.aws.region}
                        onValueChange={(value) => updateIntegration("storage", "aws", "region", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>Configure webhooks for real-time notifications</CardDescription>
                </div>
                <Dialog open={webhookDialog} onOpenChange={setWebhookDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Webhook</DialogTitle>
                      <DialogDescription>Configure a new webhook endpoint</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-name">Name</Label>
                        <Input
                          id="webhook-name"
                          value={newWebhook.name}
                          onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">URL</Label>
                        <Input
                          id="webhook-url"
                          value={newWebhook.url}
                          onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setWebhookDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addWebhook}>Add Webhook</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{webhook.name}</h4>
                        <Badge variant={webhook.status === "active" ? "default" : "secondary"}>{webhook.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      <p className="text-xs text-muted-foreground">Events: {webhook.events.join(", ")}</p>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-muted-foreground">
                          Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
