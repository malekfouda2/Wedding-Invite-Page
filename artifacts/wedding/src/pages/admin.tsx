import { useAdminMe, useAdminLogin, useAdminLogout, useGetAllRsvps, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Admin() {
  const qc = useQueryClient();
  const { data: session, isLoading } = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { data: { username, password } },
      {
        onSuccess: () => qc.invalidateQueries({ queryKey: getAdminMeQueryKey() }),
        onError: () => setError("Invalid username or password."),
      }
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getAdminMeQueryKey() }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <p className="font-script text-foreground/30" style={{ fontSize: "2rem" }}>Loading...</p>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "hsl(var(--background))" }}>
        <div
          className="w-full max-w-sm p-10 rounded-[2px]"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--primary)/0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          <div className="text-center mb-8">
            <p className="font-sans uppercase tracking-[0.35em] text-foreground/35 mb-1" style={{ fontSize: "0.58rem" }}>
              restricted
            </p>
            <h1 className="font-script" style={{ fontSize: "2.8rem", color: "hsl(var(--primary))", lineHeight: 1 }}>
              Admin Access
            </h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-sans uppercase tracking-[0.2em] text-foreground/40 block mb-2" style={{ fontSize: "0.58rem" }}>
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
                className="rounded-[2px] font-serif"
                style={{ borderColor: "hsl(var(--primary)/0.2)", height: "2.8rem" }}
                required
              />
            </div>
            <div>
              <label className="font-sans uppercase tracking-[0.2em] text-foreground/40 block mb-2" style={{ fontSize: "0.58rem" }}>
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                className="rounded-[2px] font-serif"
                style={{ borderColor: "hsl(var(--primary)/0.2)", height: "2.8rem" }}
                required
              />
            </div>
            {error && (
              <p className="font-sans text-destructive text-center" style={{ fontSize: "0.72rem" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              data-testid="button-login"
              disabled={loginMutation.isPending}
              className="w-full py-3 font-sans uppercase tracking-[0.3em] rounded-[2px] transition-all duration-200 disabled:opacity-50"
              style={{ fontSize: "0.65rem", background: "hsl(var(--primary))", color: "white" }}
            >
              {loginMutation.isPending ? "Signing in..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data: rsvps, isLoading } = useGetAllRsvps();

  const attending = rsvps?.filter((r) => r.attending).length ?? 0;
  const notAttending = rsvps?.filter((r) => !r.attending).length ?? 0;
  const plusOnes = rsvps?.filter((r) => r.hasPlusOne).length ?? 0;
  const totalGuests = attending + plusOnes;

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans uppercase tracking-[0.3em] text-foreground/35 mb-1" style={{ fontSize: "0.58rem" }}>
              admin
            </p>
            <h1 className="font-script" style={{ fontSize: "3rem", color: "hsl(var(--primary))", lineHeight: 1 }}>
              RSVP Dashboard
            </h1>
          </div>
          <button
            onClick={onLogout}
            data-testid="button-logout"
            className="font-sans uppercase tracking-[0.25em] text-foreground/40 hover:text-foreground/80 transition-colors"
            style={{ fontSize: "0.6rem" }}
          >
            Log out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Responses", value: rsvps?.length ?? 0, color: "hsl(var(--foreground))" },
            { label: "Attending", value: attending, color: "hsl(var(--primary))" },
            { label: "Not Attending", value: notAttending, color: "hsl(var(--muted))" },
            { label: "Total Guests", value: totalGuests, color: "hsl(var(--secondary))" },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-[2px]"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              <p className="font-sans uppercase tracking-[0.2em] text-foreground/35 mb-2" style={{ fontSize: "0.55rem" }}>
                {s.label}
              </p>
              <p className="font-serif font-light" style={{ fontSize: "2.5rem", color: s.color, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-[2px] overflow-x-auto"
          style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          {isLoading ? (
            <p className="text-center py-12 font-sans text-foreground/30 uppercase tracking-widest" style={{ fontSize: "0.6rem" }}>
              Loading...
            </p>
          ) : (
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow style={{ background: "hsl(var(--primary)/0.04)" }}>
                  {["Guest Name", "Status", "+1", "+1 Name", "Submitted"].map((h) => (
                    <TableHead
                      key={h}
                      className="font-sans uppercase tracking-[0.2em] text-foreground/40"
                      style={{ fontSize: "0.58rem" }}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps?.map((r) => (
                  <TableRow key={r.id} data-testid={`row-rsvp-${r.id}`}>
                    <TableCell className="font-serif" style={{ fontSize: "0.95rem" }}>{r.guestName}</TableCell>
                    <TableCell>
                      <span
                        className="font-sans uppercase tracking-wider px-2 py-1 rounded-[2px]"
                        style={{
                          fontSize: "0.58rem",
                          background: r.attending ? "hsl(var(--primary)/0.1)" : "hsl(var(--muted)/0.15)",
                          color: r.attending ? "hsl(var(--primary))" : "hsl(var(--muted))",
                        }}
                      >
                        {r.attending ? "Attending" : "Declined"}
                      </span>
                    </TableCell>
                    <TableCell className="font-sans text-foreground/50" style={{ fontSize: "0.78rem" }}>
                      {r.hasPlusOne ? "Yes" : "—"}
                    </TableCell>
                    <TableCell className="font-sans text-foreground/50" style={{ fontSize: "0.78rem" }}>
                      {r.plusOneName || "—"}
                    </TableCell>
                    <TableCell className="font-sans text-foreground/35" style={{ fontSize: "0.72rem" }}>
                      {new Date(r.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))}
                {(!rsvps || rsvps.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 font-sans text-foreground/25 uppercase tracking-widest" style={{ fontSize: "0.6rem" }}>
                      No responses yet
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
