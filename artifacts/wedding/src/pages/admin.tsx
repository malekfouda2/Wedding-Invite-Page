import { useAdminMe, useAdminLogin, useAdminLogout, useGetAllRsvps } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = useAdminMe();
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        refetchSession();
      },
      onError: () => {
        toast.error("Invalid credentials");
      }
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out");
        refetchSession();
      }
    });
  };

  if (sessionLoading) return <div className="min-h-screen flex items-center justify-center text-primary font-serif">Loading...</div>;

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border">
          <h1 className="text-3xl font-serif text-primary text-center mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: rsvps, isLoading } = useGetAllRsvps();

  const totalAttending = rsvps?.filter(r => r.attending).length || 0;
  const totalPlusOnes = rsvps?.filter(r => r.attending && r.hasPlusOne).length || 0;
  const totalGuests = totalAttending + totalPlusOnes;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-primary">RSVP Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Responses</h3>
            <p className="text-4xl font-serif text-primary">{rsvps?.length || 0}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Attending</h3>
            <p className="text-4xl font-serif text-secondary">{totalAttending}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Guest Count</h3>
            <p className="text-4xl font-serif text-accent">{totalGuests}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading RSVPs...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>+1 Included</TableHead>
                  <TableHead>+1 Name</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps?.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell className="font-medium">{rsvp.guestName}</TableCell>
                    <TableCell>
                      <Badge variant={rsvp.attending ? "default" : "secondary"} className={rsvp.attending ? "bg-primary text-white" : ""}>
                        {rsvp.attending ? "Attending" : "Not Attending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rsvp.hasPlusOne ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-muted-foreground">{rsvp.plusOneName || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(rsvp.submittedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!rsvps || rsvps.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No RSVPs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
