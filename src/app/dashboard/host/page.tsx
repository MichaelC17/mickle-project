"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Package {
  id: string
  name: string
  price: number
  description: string | null
  includes: string[]
}

interface Host {
  id: string
  channelName: string
  channelHandle: string | null
  channelThumbnail: string | null
  subscriberCount: number
  niche: string | null
  bio: string | null
  packages: Package[]
}

interface PackageInput {
  name: string
  price: string
  description: string
  includes: string[]
}

export default function HostDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [host, setHost] = useState<Host | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState("")
  
  const [niche, setNiche] = useState("")
  const [bio, setBio] = useState("")
  const [packages, setPackages] = useState<PackageInput[]>([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login?callbackUrl=/dashboard/host")
      return
    }

    const fetchHost = async () => {
      try {
        const res = await fetch("/api/host/create")
        if (res.ok) {
          const data = await res.json()
          if (data.host) {
            setHost(data.host)
            setNiche(data.host.niche || "")
            setBio(data.host.bio || "")
            setPackages(data.host.packages.map((pkg: Package) => ({
              name: pkg.name,
              price: pkg.price.toString(),
              description: pkg.description || "",
              includes: pkg.includes.length > 0 ? pkg.includes : [""],
            })))
          }
        }
      } catch (error) {
        console.error("Failed to fetch host:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHost()
  }, [session, status, router])

  const addPackage = () => {
    setPackages([...packages, { name: "", price: "", description: "", includes: [""] }])
  }

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter((_, i) => i !== index))
    }
  }

  const updatePackage = (index: number, field: keyof PackageInput, value: string | string[]) => {
    const updated = [...packages]
    updated[index] = { ...updated[index], [field]: value }
    setPackages(updated)
  }

  const addInclude = (pkgIndex: number) => {
    const updated = [...packages]
    updated[pkgIndex].includes = [...updated[pkgIndex].includes, ""]
    setPackages(updated)
  }

  const updateInclude = (pkgIndex: number, includeIndex: number, value: string) => {
    const updated = [...packages]
    updated[pkgIndex].includes[includeIndex] = value
    setPackages(updated)
  }

  const removeInclude = (pkgIndex: number, includeIndex: number) => {
    const updated = [...packages]
    if (updated[pkgIndex].includes.length > 1) {
      updated[pkgIndex].includes = updated[pkgIndex].includes.filter((_, i) => i !== includeIndex)
      setPackages(updated)
    }
  }

  const handleSave = async () => {
    const validPackages = packages.filter(pkg => pkg.name && pkg.price)
    if (validPackages.length === 0) {
      setError("Please add at least one package with a name and price")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/host/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          bio,
          packages: validPackages.map(pkg => ({
            name: pkg.name,
            price: parseInt(pkg.price, 10),
            description: pkg.description,
            includes: pkg.includes.filter(inc => inc.trim() !== ""),
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to save changes")
        return
      }

      setHost(data.host)
      setEditing(false)
    } catch (err) {
      setError("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const res = await fetch("/api/host/create", {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/browse")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete profile")
      }
    } catch (err) {
      setError("Failed to delete profile")
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!host) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold text-text-primary mb-4">No Host Profile</h1>
            <p className="text-text-secondary mb-6">You haven&apos;t created a host profile yet.</p>
            <Link
              href="/apply"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-secondary mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-text-primary">Manage Host Profile</h1>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {host.channelThumbnail ? (
                <img 
                  src={host.channelThumbnail} 
                  alt={host.channelName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center text-2xl font-medium text-text-primary">
                  {host.channelName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{host.channelName}</h2>
                <p className="text-text-muted">
                  {host.channelHandle ? `@${host.channelHandle.replace("@", "")}` : ""} · {formatNumber(host.subscriberCount)} subscribers
                </p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select your niche</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Tech">Tech</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="Food & Cooking">Food & Cooking</option>
                    <option value="Travel">Travel</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-text-muted">Niche:</span>
                  <span className="ml-2 text-text-primary">{host.niche || "Not set"}</span>
                </div>
                <div>
                  <span className="text-sm text-text-muted">Bio:</span>
                  <p className="mt-1 text-text-secondary">{host.bio || "No bio set"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Packages</h3>
              {editing && (
                <button
                  onClick={addPackage}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  + Add Package
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                {packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-text-muted">Package {pkgIndex + 1}</span>
                      {packages.length > 1 && (
                        <button
                          onClick={() => removePackage(pkgIndex)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                        placeholder="Package name"
                        className="px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                        placeholder="Price (USD)"
                        className="px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <input
                      type="text"
                      value={pkg.description}
                      onChange={(e) => updatePackage(pkgIndex, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent mb-4"
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">What&apos;s included</span>
                        <button
                          onClick={() => addInclude(pkgIndex)}
                          className="text-xs text-accent hover:text-accent-hover"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {pkg.includes.map((inc, incIndex) => (
                          <div key={incIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) => updateInclude(pkgIndex, incIndex, e.target.value)}
                              placeholder="e.g., 5 min feature"
                              className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                            />
                            {pkg.includes.length > 1 && (
                              <button
                                onClick={() => removeInclude(pkgIndex, incIndex)}
                                className="p-2 text-text-muted hover:text-red-500"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {host.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{pkg.name}</h4>
                      <span className="font-semibold text-text-primary">${pkg.price}</span>
                    </div>
                    {pkg.description && (
                      <p className="text-sm text-text-secondary mb-2">{pkg.description}</p>
                    )}
                    {pkg.includes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pkg.includes.map((inc, i) => (
                          <span key={i} className="text-xs bg-surface-raised px-2 py-1 rounded text-text-muted">
                            {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {editing && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setEditing(false)
                  setNiche(host.niche || "")
                  setBio(host.bio || "")
                  setPackages(host.packages.map((pkg) => ({
                    name: pkg.name,
                    price: pkg.price.toString(),
                    description: pkg.description || "",
                    includes: pkg.includes.length > 0 ? pkg.includes : [""],
                  })))
                }}
                className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Danger Zone</h3>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Delete Host Profile</h4>
                  <p className="text-sm text-red-600 dark:text-red-500">
                    This will permanently delete your host profile and all packages.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Delete Host Profile?</h3>
                <p className="text-text-secondary mb-6">
                  This action cannot be undone. Your host profile, all packages, and any associated data will be permanently deleted.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
