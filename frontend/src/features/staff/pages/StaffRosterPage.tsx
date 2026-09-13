import { Plus } from "lucide-react";

const ROSTER: [string, string, string][] = [
  ["Aarav Mehta", "Manager", "On shift"],
  ["Priya Nair", "Waiter", "On shift"],
  ["Rohan Das", "Chef", "On shift"],
  ["Simran Kaur", "Waiter", "Break"],
  ["Vikram Rao", "Cashier", "On shift"],
];

export function StaffRosterPage() {
  return (
    <>
      <div className="page-head">
        <div><div className="eyebrow">Team</div><h2>Staff</h2><p>{ROSTER.length} members on the roster today.</p></div>
        <button className="btn btn-primary" style={{ padding: "11px 16px", fontSize: 14 }}><Plus size={16} /> Add staff</button>
      </div>
      <div className="panel" style={{ padding: 6 }}>
        <table className="dtable">
          <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {ROSTER.map((s, i) => (
              <tr key={i}>
                <td><b>{s[0]}</b></td><td>{s[1]}</td>
                <td><span className={"chip " + (s[2] === "On shift" ? "c-green" : "c-amber")}>{s[2]}</span></td>
                <td><button className="tiny-btn">Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
