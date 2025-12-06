import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2, User as UserIcon, Shield, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { User, userService } from "@/services/api";

interface AdminUserSelectorProps {
    onSelectUser: (userId: number | null) => void;
    selectedUserId: number | null;
}

// Helper to get initials
const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function AdminUserSelector({ onSelectUser, selectedUserId }: AdminUserSelectorProps) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch users once
    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await userService.getAll();
                if (isMounted) {
                    if (response.error) {
                        console.error("Error fetching users:", response.error);
                        setError(response.error);
                    } else if (response.data) {
                        setUsers(response.data);
                    } else {
                        setError("No data received");
                    }
                }
            } catch (e) {
                if (isMounted) {
                    console.error("Failed to fetch users exception:", e);
                    setError("Failed to load users");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchUsers();
        return () => { isMounted = false; };
    }, []);

    // Sync state with selectedUserId prop
    useEffect(() => {
        if (users.length > 0) {
            if (selectedUserId) {
                const found = users.find(u => u.id === selectedUserId);
                setSelectedUser(found || null);
            } else {
                setSelectedUser(null);
            }
        } else if (selectedUserId === null) {
            setSelectedUser(null);
        }
    }, [selectedUserId, users]);

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef} style={{ zIndex: open ? 1000 : 'auto' }}>
            {/* Trigger Button - Glassmorphic Premium Style */}
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                    "w-full justify-between font-medium border transition-all duration-200",
                    // Glassmorphic Base
                    "bg-white/10 backdrop-blur-md border-white/20 text-white",
                    // Hover State
                    "hover:bg-white/20 hover:text-white hover:border-white/30",
                    // Focus/Active
                    open && "bg-white/20 border-white/40 ring-2 ring-white/10"
                )}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2 truncate">
                    {selectedUser ? (
                        <>
                            {/* User Avatar Mini */}
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-white/20">
                                {selectedUser.profile_picture_url ? (
                                    <img src={selectedUser.profile_picture_url} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-bold text-white">{getInitials(selectedUser.full_name || selectedUser.email)}</span>
                                )}
                            </div>
                            <span className="truncate">{selectedUser.full_name || selectedUser.email}</span>
                        </>
                    ) : (
                        <>
                            <Shield className="h-4 w-4 text-white/90" />
                            <span>Select User to View</span>
                        </>
                    )}
                </div>
                <ChevronsUpDown className={cn(
                    "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
                    open ? "rotate-180 opacity-100" : "opacity-70"
                )} />
            </Button>

            {/* Dropdown Content */}
            {open && (
                <>
                    {/* Backdrop overlay for better visibility */}
                    <div 
                        className="fixed inset-0 bg-black/20 z-[999]"
                        onClick={() => setOpen(false)}
                        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    <div 
                        className="absolute top-full left-0 lg:left-auto lg:right-0 z-[1000] mt-2 w-full min-w-[320px] max-w-[400px] lg:max-w-[380px] rounded-xl border-2 border-purple-200 bg-white shadow-2xl outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden"
                        style={{
                            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(102, 126, 234, 0.1)'
                        }}
                    >
                        <Command className="rounded-xl">

                        {/* Search Input */}
                        <div className="flex items-center border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-white px-3 py-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 text-purple-500" />
                            <CommandInput
                                placeholder="Search by name or email..."
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0 text-gray-900 font-medium"
                            />
                        </div>

                        <CommandList className="max-h-[320px] overflow-y-auto p-1 custom-scrollbar">

                            {/* Feedback States */}
                            {loading && (
                                <div className="py-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    <span>Loading users directory...</span>
                                </div>
                            )}

                            {error && (
                                <div className="py-8 text-center text-sm text-red-500 px-4">
                                    <Info className="h-5 w-5 mx-auto mb-2 opacity-50" />
                                    {error}
                                </div>
                            )}

                            {!loading && !error && users.length === 0 && (
                                <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                                    No users found.
                                </CommandEmpty>
                            )}

                            {/* User List */}
                            {!loading && !error && users.length > 0 && (
                                <>
                                    <CommandGroup heading="View Mode">
                                        {/* Default / Reset Option */}
                                        <CommandItem
                                            onSelect={() => {
                                                onSelectUser(null);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "cursor-pointer m-1 rounded-lg transition-colors border border-dashed border-gray-200",
                                                selectedUserId === null
                                                    ? "bg-slate-100 text-slate-900 border-slate-300"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 py-1">
                                                <div className={cn(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                                    selectedUserId === null ? "bg-white border-slate-200" : "bg-gray-50 border-gray-200"
                                                )}>
                                                    <Shield className={cn("h-4 w-4", selectedUserId === null ? "text-slate-700" : "text-gray-400")} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">Default View</span>
                                                    <span className="text-xs text-muted-foreground">Show my dashboard</span>
                                                </div>
                                                {selectedUserId === null && <Check className="ml-auto h-4 w-4 text-slate-600" />}
                                            </div>
                                        </CommandItem>
                                    </CommandGroup>

                                    <CommandSeparator className="my-1" />

                                    <CommandGroup heading="Select User to Inspect">
                                        {users.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={`${user.full_name || ''} ${user.email} ${user.phone_number || ''}`}
                                                onSelect={() => {
                                                    onSelectUser(user.id);
                                                    setOpen(false);
                                                }}
                                                className={cn(
                                                    "cursor-pointer m-1 rounded-lg transition-colors",
                                                    selectedUserId === user.id
                                                        ? "bg-blue-50 text-blue-900"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 w-full py-0.5">
                                                    {/* Avatar */}
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                                        {user.profile_picture_url ? (
                                                            <img src={user.profile_picture_url} alt="Profile" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-bold text-gray-500">
                                                                {getInitials(user.full_name || user.email)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex flex-col flex-1 overflow-hidden">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-sm truncate pr-2">
                                                                {user.full_name || 'No Name'}
                                                            </span>
                                                            {/* Optional Role Badge could go here */}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground truncate font-normal">
                                                            {user.email}
                                                        </span>
                                                    </div>

                                                    {/* Checkmark */}
                                                    {selectedUserId === user.id && (
                                                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                    </div>
                </>
            )}
        </div>
    );
}
