import { createClient } from "@/lib/supabase/server";
import type { RoleDistributionRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const COLORS = ["#6366f1", "#1a6b1a", "#c8a000", "#f97316", "#d946ef", "#6b7280"];

export default async function RolesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("v_role_distribution").select("*");
  const rows = (data || []) as RoleDistributionRow[];
  const total = rows.reduce((a, r) => a + r.count, 0);

  if (!rows.length) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-16 text-center text-gray-400">
        No role data yet.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
      {rows.map((r, i) => {
        const color = COLORS[i % COLORS.length];
        const pct = total ? Math.round((r.count / total) * 100) : 0;
        return (
          <div key={r.role} className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5">
            <div className="text-sm font-bold mb-2" style={{ color }}>
              {r.role}
            </div>
            <div className="text-3xl font-extrabold" style={{ color }}>
              {r.count}
            </div>
            <div className="text-xs text-gray-500 mt-1">{pct}% of total candidates</div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
