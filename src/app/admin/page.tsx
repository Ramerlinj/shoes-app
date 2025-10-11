"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { fetchUsers, updateUser, deleteUser, postUser } from "@/lib/auth"
import type { User, UserRole } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

interface EditableUserState {
  id: User["id"]
  name: string
  surname: string
  email: string
  role: UserRole
  password?: string
}

interface NewUserState {
  name: string
  surname: string
  email: string
  password: string
  role: UserRole
}

export default function AdminPage() {
  const { user: currentUser, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<EditableUserState | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [deletingUserId, setDeletingUserId] = useState<User["id"] | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newUser, setNewUser] = useState<NewUserState>({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "user",
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") return

    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const data = await fetchUsers()
        setUsers(data)
        setFetchError(null)
      } catch (error) {
        console.error(error)
        setFetchError(
          error instanceof Error
            ? error.message
            : "We couldn't load the users list. Please try again later.",
        )
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [currentUser])

  const tableDescription = useMemo(() => {
    const total = users.length
    const admins = users.filter((item) => item.role === "admin").length
    return `${total} total • ${admins} admin${admins === 1 ? "" : "s"}`
  }, [users])

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8 text-dodger-blue-600" />
      </main>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />
  }

  const handleOpenEditor = (userToEdit: User) => {
    if (!userToEdit.id) {
      toast.error("This user record cannot be edited because it has no identifier.")
      return
    }

    setEditingUser({
      id: userToEdit.id,
      name: userToEdit.name ?? userToEdit.firstName ?? "",
      surname: userToEdit.surname ?? userToEdit.lastName ?? "",
      email: userToEdit.email ?? "",
      role: (userToEdit.role ?? "user") as UserRole,
      password: userToEdit.password,
    })
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
  }

  const handleFieldChange = <K extends keyof EditableUserState>(field: K, value: EditableUserState[K]) => {
    setEditingUser((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    if (!editingUser.id) {
      toast.error("We can't update this user because it has no identifier.")
      return
    }

    setIsSaving(true)
    try {
      const payload: Partial<User> = {
        id: editingUser.id,
        name: editingUser.name.trim(),
        surname: editingUser.surname.trim(),
        email: editingUser.email.trim().toLowerCase(),
        role: editingUser.role,
        password: editingUser.password,
      }

      const updated = await updateUser(editingUser.id, payload)
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
      toast.success("User updated successfully")
      handleCloseDialog()
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't update this user. Please try again.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  const resetNewUserForm = () => {
    setNewUser({
      name: "",
      surname: "",
      email: "",
      password: "",
      role: "user",
    })
  }

  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Name, email, and password are required.")
      return
    }

    setIsCreating(true)
    try {
      const payload = {
        name: newUser.name.trim(),
        surname: newUser.surname.trim(),
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        role: newUser.role,
      }

      const created = await postUser(payload)
      setUsers((prev) => [created, ...prev])
      toast.success("User created successfully")
      setIsCreateDialogOpen(false)
      resetNewUserForm()
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : "We couldn't create the user. Please try again.",
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId?: User["id"]) => {
    if (userId === undefined || userId === null) {
      toast.error("This user cannot be removed because it has no identifier.")
      return
    }
    setDeletingUserId(userId)
    try {
      await deleteUser(userId)
      setUsers((prev) => prev.filter((item) => item.id !== userId))
      toast.success("User deleted")
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : "We couldn't delete this user. Please try again.",
      )
    } finally {
      setDeletingUserId(null)
    }
  }

  return (
    <main className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <Card>
          <CardHeader className="border-b">
            <div>
              <CardTitle className="text-2xl text-slate-900">Admin dashboard</CardTitle>
              <CardDescription>Manage customer accounts, roles, and access in real time.</CardDescription>
            </div>
            <CardDescription className="justify-self-end self-center text-xs font-medium uppercase tracking-wide text-dodger-blue-600">
              {tableDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="text-sm text-slate-500">
                Keep your roster up to date by inviting staff or upgrading loyal customers to admin.
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-dodger-blue-600 hover:bg-dodger-blue-700">
                Add user
              </Button>
            </div>
            {fetchError ? (
              <div className="px-6 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                  {fetchError}
                </div>
              </div>
            ) : isLoadingUsers ? (
              <div className="flex items-center gap-3 px-6 py-10 text-sm text-slate-500">
                <Spinner className="h-5 w-5 text-dodger-blue-600" /> Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-t border-slate-200 text-left text-sm">
                  <thead className="bg-slate-100/80 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => {
                      const fullName = [item.name ?? item.firstName, item.surname ?? item.lastName]
                        .filter(Boolean)
                        .join(" ")
                        .trim()

                      return (
                        <tr key={item.id ?? item.email} className="border-b border-slate-100 bg-white">
                          <td className="px-6 py-4 text-sm text-slate-900">
                            <div className="font-medium">{fullName || "Unnamed"}</div>
                            <div className="text-xs text-slate-500">ID: {item.id ?? "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{item.email ?? "—"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                item.role === "admin"
                                  ? "bg-dodger-blue-100 text-dodger-blue-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.role ?? "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditor(item)}
                              >
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={deletingUserId === item.id}
                                  >
                                    {deletingUserId === item.id ? "Deleting..." : "Delete"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete user</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The account for <strong>{fullName || item.email}</strong> will
                                      be removed permanently.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={deletingUserId === item.id}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deletingUserId === item.id}
                                      onClick={() => handleDeleteUser(item.id)}
                                    >
                                      Confirm delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (!open ? handleCloseDialog() : setIsDialogOpen(open))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>Update personal data and role assignments for this account.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">First name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-surname">Last name</Label>
                <Input
                  id="edit-surname"
                  value={editingUser.surname}
                  onChange={(event) => handleFieldChange("surname", event.target.value)}
                  placeholder="Last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => handleFieldChange("role", value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Complete the form to register a new account and assign the appropriate role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">First name</Label>
              <Input
                id="create-name"
                value={newUser.name}
                onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-surname">Last name</Label>
              <Input
                id="create-surname"
                value={newUser.surname}
                onChange={(event) => setNewUser((prev) => ({ ...prev, surname: event.target.value }))}
                placeholder="Last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={newUser.email}
                onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Temporary password</Label>
              <PasswordInput
                id="create-password"
                value={newUser.password}
                onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
