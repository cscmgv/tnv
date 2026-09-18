"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CallLog, CallStatus, CandidateListRow, Category, Profile } from "@/lib/supabase/types";
import { calculateAge } from "@/lib/age";
import { logCall } from "../interview/actions";
import {
  assignCandidate,
  deleteCandidate,
  previewCandidateImport,
  commitCandidateImport,
  revokeUploadBatch,
  type ImportRow,
  type ImportPreviewRow,
} from "./actions";
import { CONSTITUENCIES } from "@/lib/data/constituencies";

const DECISIONS = ["Recommended", "Hold", "Not Recommended", "Pending Interview"];
const CALL_STATUSES: CallStatus[] = ["Attending", "Not Attending", "Postponed", "No Answer"];

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={path} />
    </svg>
  );
}
const PhoneIcon = (p: { className?: string }) => (
  <Icon
    {...p}
    path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
  />
);
const MapPinIcon = (p: { className?: string }) => (
  <Icon {...p} path="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
);
const BuildingIcon = (p: { className?: string }) => (
  <Icon
    {...p}
    path="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18 M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2 M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2 M10 6h1 M10 10h1 M10 14h1 M13 6h1 M13 10h1 M13 14h1 M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
  />
);
const IdCardIcon = (p: { className?: string }) => (
  <Icon
    {...p}
    path="M16 10h2 M16 14h2 M6.17 15a3 3 0 0 1 5.66 0 M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
  />
);
const CalendarIcon = (p: { className?: string }) => (
  <Icon {...p} path="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
);
const MoreVerticalIcon = (p: { className?: string }) => (
  <Icon {...p} path="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
);
const FilterIcon = (p: { className?: string }) => <Icon {...p} path="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />;
const ArrowUpDownIcon = (p: { className?: string }) => (
  <Icon {...p} path="m21 16-4 4-4-4 M17 20V4 M3 8l4-4 4 4 M7 4v16" />
);
const SearchIcon = (p: { className?: string }) => <Icon {...p} path="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.35-4.35" />;

// Keyed by header text stripped down to bare lowercase letters/digits (see
// `normalizeHeaderKey`), so "Mobile No.", "Mobile_Number", and "mobile no"
// all collapse to the same "mobileno" key instead of only matching one exact
// phrasing of the column header.
const IMPORT_HEADER_MAP: Record<string, keyof ImportRow> = {
  name: "candidate_name",
  fullname: "candidate_name",
  candidatename: "candidate_name",
  candidatefullname: "candidate_name",
  mobile: "candidate_mobile",
  mobileno: "candidate_mobile",
  mobilenumber: "candidate_mobile",
  phone: "candidate_mobile",
  phoneno: "candidate_mobile",
  phonenumber: "candidate_mobile",
  contact: "candidate_mobile",
  contactno: "candidate_mobile",
  contactnumber: "candidate_mobile",
  candidatemobile: "candidate_mobile",
  candidatephone: "candidate_mobile",
  email: "candidate_email",
  emailid: "candidate_email",
  candidateemail: "candidate_email",
  interviewdate: "interview_date",
  dateofinterview: "interview_date",
  district: "district",
  constituency: "assembly_constituency",
  assemblyconstituency: "assembly_constituency",
  ac: "assembly_constituency",
  panchayat: "panchayat_area",
  panchayatarea: "panchayat_area",
  area: "panchayat_area",
  village: "panchayat_area",
  pincode: "pincode",
  pin: "pincode",
  pincode6digit: "pincode",
  ngo: "ngo",
  dob: "dob",
  dateofbirth: "dob",
  birthdate: "dob",
  role: "current_tnv_role",
  currentrole: "current_tnv_role",
  currenttnvrole: "current_tnv_role",
  tnvrole: "current_tnv_role",
};

function normalizeHeaderKey(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Excel's day 0 is 1899-12-30 (accounting for its 1900 leap-year bug); serial
// 25569 corresponds to 1970-01-01. Needed because sheet_to_json returns raw
// date cells as numbers, not strings, when the sheet doesn't force text.
function excelSerialToISODate(serial: number): string {
  return new Date((serial - 25569) * 86400 * 1000).toISOString().slice(0, 10);
}

function normalizeImportRow(raw: Record<string, unknown>): ImportRow {
  const row: Partial<ImportRow> = {};
  for (const [key, value] of Object.entries(raw)) {
    const field = IMPORT_HEADER_MAP[normalizeHeaderKey(key)];
    if (!field || value == null || value === "") continue;
    const isDateField = field === "dob" || field === "interview_date";
    row[field] = isDateField && typeof value === "number" ? excelSerialToISODate(value) : String(value).trim();
  }
  return row as ImportRow;
}

const CALL_STATUS_CLS: Record<CallStatus, string> = {
  Attending: "bg-green-100 text-green-700",
  "Not Attending": "bg-red-100 text-red-700",
  Postponed: "bg-amber-100 text-amber-700",
  "No Answer": "bg-gray-100 text-gray-500",
};

const SHOW_OPTIONS = [50, 100, 250, "all"] as const;

export default function CandidatesTable({
  records,
  totalCount,
  interviewers: interviewerOptions,
  callsByCandidate,
  categoryId,
  currentUserId,
  viewerRole = "admin",
}: {
  records: CandidateListRow[];
  totalCount?: number;
  interviewers: Profile[];
  callsByCandidate: Record<number, CallLog[]>;
  categoryId?: number;
  currentUserId?: string;
  // "interviewer" hides admin-only actions (Add Candidate, Upload/Export
  // Excel, Delete, reassigning to another interviewer) and points "Take
  // Interview" at the interviewer's own flow — used when this table is
  // reused for an interviewer's own (already RLS-scoped) candidate list.
  viewerRole?: "admin" | "interviewer";
}) {
  const isAdmin = viewerRole === "admin";
  const [linkCopied, setLinkCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLimit = searchParams.get("limit") || "100";

  function setShowLimit(value: (typeof SHOW_OPTIONS)[number]) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(value));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleShareLink() {
    const params = new URLSearchParams();
    if (currentUserId) params.set("ref", currentUserId);
    if (categoryId) params.set("cat", String(categoryId));
    const qs = params.toString();
    const url = `${window.location.origin}/apply${qs ? `?${qs}` : ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    });
  }

  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [pincode, setPincode] = useState("");
  const [ngo, setNgo] = useState("");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [decision, setDecision] = useState("");
  const [status, setStatus] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isPending, startTransition] = useTransition();
  const [assignError, setAssignError] = useState("");
  const [openCallRow, setOpenCallRow] = useState<number | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("Attending");
  const [callNotes, setCallNotes] = useState("");
  const [callError, setCallError] = useState("");
  const importFileRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<ImportPreviewRow[] | null>(null);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const checkingLabel = importProgress ? `Checking… (${importProgress.done}/${importProgress.total})` : "Checking…";
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [lastBatchInfo, setLastBatchInfo] = useState<{ batchId: string; filename: string; count: number } | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sortCol, setSortCol] = useState<"serial" | "interview_date" | "candidate_name" | "district" | "assembly_constituency" | "score" | "status" | "decision">("serial");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("asc");

  const districts = useMemo(() => Array.from(new Set(records.map((r) => r.district).filter(Boolean))).sort(), [records]);
  const constituencies = useMemo(
    () =>
      Array.from(new Set([...CONSTITUENCIES, ...records.map((r) => r.assembly_constituency).filter(Boolean)])).sort(),
    [records]
  );
  const pincodes = useMemo(() => Array.from(new Set(records.map((r) => r.pincode).filter(Boolean))).sort(), [records]);
  const ngos = useMemo(() => Array.from(new Set(records.map((r) => r.ngo).filter(Boolean))).sort(), [records]);
  const categoryOptions = useMemo(() => {
    const byId = new Map<number, string>();
    records.forEach((r) => r.categories?.forEach((cat) => byId.set(cat.id, cat.name)));
    return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [records]);
  const roles = useMemo(() => Array.from(new Set(records.map((r) => r.auto_suggested_role).filter(Boolean))).sort(), [records]);
  const interviewers = useMemo(
    () => Array.from(new Set(records.map((r) => r.interviewer_name).filter(Boolean))).sort(),
    [records]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return records.filter((r) => {
      if (q) {
        const hay = `${r.candidate_name} ${r.candidate_mobile} ${r.district} ${r.assembly_constituency} ${r.pincode ?? ""} ${r.ngo ?? ""} ${(r.categories || []).map((c) => c.name).join(" ")} ${r.auto_suggested_role} ${r.interviewer_name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (district && r.district !== district) return false;
      if (constituency && r.assembly_constituency !== constituency) return false;
      if (pincode && r.pincode !== pincode) return false;
      if (ngo && r.ngo !== ngo) return false;
      if (category && !r.categories?.some((cat) => String(cat.id) === category)) return false;
      if (role && r.auto_suggested_role !== role) return false;
      if (decision) {
        if (decision === "Pending Interview") {
          if (!r.pending) return false;
        } else if (r.final_decision !== decision) return false;
      }
      if (status) {
        const rowStatus = r.pending ? (r.interview_started ? "In Progress" : "Not Started") : "Completed";
        if (rowStatus !== status) return false;
      }
      if (interviewer && r.interviewer_name !== interviewer) return false;
      if (dateFrom && r.interview_date < dateFrom) return false;
      if (dateTo && r.interview_date > dateTo) return false;
      return true;
    });
  }, [records, query, district, constituency, pincode, ngo, category, role, decision, status, interviewer, dateFrom, dateTo]);

  const hasFilters = district || constituency || pincode || ngo || category || role || decision || status || interviewer || dateFrom || dateTo;

  const visibleRows = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortCol === "serial") {
        cmp = (a.serial_number ?? 0) - (b.serial_number ?? 0);
      } else if (sortCol === "interview_date") {
        cmp = (a.interview_date || "").localeCompare(b.interview_date || "");
      } else if (sortCol === "candidate_name") {
        cmp = (a.candidate_name || "").localeCompare(b.candidate_name || "");
      } else if (sortCol === "district") {
        cmp = (a.district || "").localeCompare(b.district || "");
      } else if (sortCol === "assembly_constituency") {
        cmp = (a.assembly_constituency || "").localeCompare(b.assembly_constituency || "");
      } else if (sortCol === "score") {
        const sa = Number(a.final_score) || 0;
        const sb = Number(b.final_score) || 0;
        cmp = sa - sb;
      } else if (sortCol === "status") {
        const sa = a.pending ? (a.interview_started ? "In Progress" : "Not Started") : "Completed";
        const sb = b.pending ? (b.interview_started ? "In Progress" : "Not Started") : "Completed";
        cmp = sa.localeCompare(sb);
      } else if (sortCol === "decision") {
        const da = a.pending ? "Pending Interview" : (a.final_decision || "");
        const db = b.pending ? "Pending Interview" : (b.final_decision || "");
        cmp = da.localeCompare(db);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortCol, sortDir]);

  function clearFilters() {
    setDistrict("");
    setConstituency("");
    setPincode("");
    setNgo("");
    setCategory("");
    setRole("");
    setDecision("");
    setStatus("");
    setInterviewer("");
    setDateFrom("");
    setDateTo("");
  }

  async function handleExport() {
    const XLSX = await import("xlsx");
    const clean = filtered.map((r) => {
      if (r.pending) {
        return {
          "S.No": r.serial_number,
          "Interview Date": r.interview_date,
          Status: r.interview_started ? "In Progress — interview started but not finished" : "Not Started",
          "Candidate Name": r.candidate_name,
          "Candidate Mobile": r.candidate_mobile,
          "Candidate Email": r.candidate_email,
          District: r.district,
          "Assembly Constituency": r.assembly_constituency,
          Pincode: r.pincode,
          NGO: r.ngo,
          "Date of Birth": r.dob,
          Age: calculateAge(r.dob) ?? "",
        };
      }
      const row: Record<string, unknown> = {
        "S.No": r.serial_number,
        "Interview Date": r.interview_date,
        Status: "Completed",
        "Interviewer Register No": r.interviewer_reg_no,
        "Interviewer Name": r.interviewer_name,
        "Interviewer Email": r.interviewer_email,
        "Interviewer Mobile": r.interviewer_phone,
        "Candidate Name": r.candidate_name,
        "Candidate Mobile": r.candidate_mobile,
        "Candidate Email": r.candidate_email,
        District: r.district,
        "Assembly Constituency": r.assembly_constituency,
        "Panchayat / Area": r.panchayat_area,
        Pincode: r.pincode,
        NGO: r.ngo,
        "Date of Birth": r.dob,
        Age: calculateAge(r.dob) ?? "",
        "Current TNV Role": r.current_tnv_role,
      };
      for (let i = 1; i <= 16; i++) row[`Q${i} Score`] = (r as Record<string, unknown>)[`q${i}_score`] ?? "";
      row["Base Score (/16)"] = r.base_score;
      row["Tie-Breaker Applied"] = r.tie_breaker_applied ? "Yes (+0.5)" : "No";
      row["Final Score"] = r.final_score;
      row["Auto-Suggested Role"] = r.auto_suggested_role;
      row["Additional Suggested Role"] = r.additional_suggested_role;
      row["Final Decision"] = r.final_decision;
      row["Verification Status"] = r.verification_status;
      row["Assessor Signature / Name"] = r.assessor_signature;
      row["Additional Notes"] = r.additional_notes;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(clean);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TNV Assessment");
    XLSX.writeFile(wb, `TNV_AllCandidates_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function handleDelete(assessmentId: number | null, candidateId: number) {
    if (!confirm("Delete this candidate record? It will be moved to the Recycle Bin.")) return;
    setAssignError("");
    startTransition(async () => {
      const result = await deleteCandidate(assessmentId, candidateId);
      if (result && "error" in result && result.error) {
        setAssignError(result.error);
      }
    });
  }

  function toggleCallRow(candidateId: number) {
    if (openCallRow === candidateId) {
      setOpenCallRow(null);
      return;
    }
    setOpenCallRow(candidateId);
    setCallStatus("Attending");
    setCallNotes("");
    setCallError("");
  }

  function submitCallLog(candidateId: number) {
    setCallError("");
    startTransition(async () => {
      try {
        const result = await logCall(candidateId, callStatus, callNotes);
        if (result?.error) {
          setCallError(result.error);
          return;
        }
        setOpenCallRow(null);
      } catch {
        setCallError("Something went wrong logging this call. If the app was just updated, refresh the page and try again.");
      }
    });
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setImportError("");
    setImportSuccess("");
    setImportPreview(null);
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    const rows = raw.map(normalizeImportRow).filter((r) => r.candidate_name && r.candidate_mobile);
    if (!rows.length) {
      setImportError(
        "No valid rows found. Make sure the first row has column headers, with a name column (e.g. \"Name\") and a mobile column (e.g. \"Mobile\")."
      );
      return;
    }
    setPreviewing(true);
    setImportProgress({ done: 0, total: rows.length });

    const PREVIEW_BATCH_SIZE = 200;
    const mergedPreview: ImportPreviewRow[] = [];
    for (let i = 0; i < rows.length; i += PREVIEW_BATCH_SIZE) {
      const chunk = rows.slice(i, i + PREVIEW_BATCH_SIZE);
      const result = await previewCandidateImport(chunk, categoryId ?? null);
      if (result.error || !("preview" in result)) {
        setPreviewing(false);
        setImportProgress(null);
        setImportError(result.error || "Something went wrong checking this file.");
        return;
      }
      mergedPreview.push(...(result.preview ?? []));
      setImportProgress({ done: Math.min(i + PREVIEW_BATCH_SIZE, rows.length), total: rows.length });
    }
    setPreviewing(false);
    setImportProgress(null);
    setImportPreview(mergedPreview);
  }

  const IMPORT_BATCH_SIZE = 10;

  async function handleConfirmImport() {
    if (!importPreview) return;
    setImporting(true);
    setImportError("");
    setImportProgress({ done: 0, total: importPreview.length });

    const batchId = "batch_" + Date.now();
    const filename = uploadedFileName || "Upload.xlsx";
    let created = 0;
    let updated = 0;

    for (let i = 0; i < importPreview.length; i += IMPORT_BATCH_SIZE) {
      const batch = importPreview.slice(i, i + IMPORT_BATCH_SIZE);
      const result = await commitCandidateImport(batch, categoryId ?? null, { batchId, filename });
      if (result.error || !("created" in result)) {
        setImporting(false);
        setImportProgress(null);
        setImportError(
          (result.error || "Something went wrong importing this file.") +
            ` (${i} of ${importPreview.length} rows were imported before this failed.)`
        );
        return;
      }
      created += result.created ?? 0;
      updated += result.updated ?? 0;
      setImportProgress({ done: Math.min(i + IMPORT_BATCH_SIZE, importPreview.length), total: importPreview.length });
    }

    setImporting(false);
    setImportProgress(null);
    const parts: string[] = [];
    if (created) parts.push(`${created} added`);
    if (updated) parts.push(`${updated} updated`);
    const unchanged = importPreview.filter((r) => r.status === "unchanged").length;
    if (unchanged) parts.push(`${unchanged} unchanged`);
    setImportSuccess(parts.length ? parts.join(", ") + "." : "Nothing changed.");
    if (created > 0 || updated > 0) {
      setLastBatchInfo({ batchId, filename, count: created + updated });
    }
    setImportPreview(null);
    if (importFileRef.current) importFileRef.current.value = "";
  }

  function handleRevokeBatch(batchId: string) {
    if (!confirm("Revoke this Excel upload? Newly added candidates from this file will be moved to the Recycle Bin.")) return;
    startTransition(async () => {
      const res = await revokeUploadBatch(batchId);
      if (res && "error" in res && res.error) {
        setActionMessage({ type: "error", text: res.error });
      } else if (res && "success" in res) {
        setLastBatchInfo(null);
        setActionMessage({
          type: "success",
          text: `Revoked upload "${res.filename || 'batch'}". ${res.count ?? 0} candidate(s) moved to the Recycle Bin. You can restore them anytime.`,
        });
        router.refresh();
      }
    });
  }

  function cancelImport() {
    setImportPreview(null);
    setImportError("");
    if (importFileRef.current) importFileRef.current.value = "";
  }

  function handleAssign(candidateId: number, interviewerId: string) {
    setAssignError("");
    startTransition(async () => {
      try {
        const result = await assignCandidate(candidateId, interviewerId || null);
        if (result?.error) setAssignError(result.error);
      } catch {
        setAssignError("Something went wrong. If the app was just updated, refresh the page and try again.");
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
      {assignError && (
        <p className="text-sm text-red-600 bg-red-50 border-b border-red-200 px-4 py-2">
          Couldn&rsquo;t assign interviewer: {assignError}
        </p>
      )}
      <div className="p-4 border-b border-[#e2e6ed] space-y-3">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates, district, role, interviewer…"
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
          />
        </div>

        {/* Shared, always-rendered file input so both the mobile and
            desktop Upload Excel buttons can trigger it via importFileRef. */}
        <input
          ref={importFileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Mobile action rows: Add Candidate, then Share + Filters, then Upload/Export Excel */}
        <div className="flex sm:hidden flex-col gap-2">
          {isAdmin && (
            <Link
              href={categoryId ? `/admin/candidates/new?category_id=${categoryId}` : "/admin/candidates/new"}
              className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-4 py-2.5 whitespace-nowrap text-center"
            >
              + Add Candidate
            </Link>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleShareLink}
              title={categoryId ? "Candidates who fill this link join this category automatically" : undefined}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2.5 whitespace-nowrap"
            >
              {linkCopied ? "Copied!" : categoryId ? "Share Category Link" : "Share Link"}
            </button>
            <button
              onClick={() => setShowMobileFilters((v) => !v)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold rounded-lg px-4 py-2.5 border ${
                showMobileFilters ? "bg-gray-200 border-gray-300 text-gray-800" : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              Filters
              <span className="bg-white text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{filtered.length}</span>
            </button>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => importFileRef.current?.click()}
                disabled={previewing}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2.5 whitespace-nowrap"
              >
                {previewing ? checkingLabel : "Upload Excel"}
              </button>
              <button
                onClick={handleExport}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2.5 whitespace-nowrap"
              >
                Export Excel
              </button>
            </div>
          )}
        </div>

        {/* Desktop action row */}
        <div className="hidden sm:flex gap-2 justify-end">
          {isAdmin && (
            <Link
              href={categoryId ? `/admin/candidates/new?category_id=${categoryId}` : "/admin/candidates/new"}
              className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-4 py-2 whitespace-nowrap text-center"
            >
              + Add Candidate
            </Link>
          )}
          {isAdmin && (
            <button
              onClick={() => importFileRef.current?.click()}
              disabled={previewing}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2 whitespace-nowrap"
            >
              {previewing ? "Checking…" : "Upload Excel"}
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleExport}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2 whitespace-nowrap"
            >
              Export Excel
            </button>
          )}
          <button
            onClick={handleShareLink}
            title={categoryId ? "Candidates who fill this link join this category automatically" : undefined}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2 whitespace-nowrap"
          >
            {linkCopied ? "✓ Link Copied!" : categoryId ? "🔗 Share Category Registration Link" : "🔗 Share Registration Link"}
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`text-sm border-b px-4 py-3 flex items-center justify-between gap-2 ${
            actionMessage.type === "success" ? "text-green-800 bg-green-50 border-green-200" : "text-red-800 bg-red-50 border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {lastBatchInfo && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">⚠️ Uploaded &ldquo;{lastBatchInfo.filename}&rdquo;</span>
            <span className="text-xs text-amber-700">({lastBatchInfo.count} records processed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-800 font-medium">Wrong spreadsheet uploaded?</span>
            <button
              onClick={() => handleRevokeBatch(lastBatchInfo.batchId)}
              disabled={isPending}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-all"
            >
              ↩ Revoke / Undo This Upload
            </button>
          </div>
        </div>
      )}

      {importSuccess && !importPreview && !lastBatchInfo && (
        <p className="text-sm text-green-700 bg-green-50 border-b border-green-200 px-4 py-2">{importSuccess}</p>
      )}

      {importPreview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={cancelImport}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-5"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-1">Upload Excel</h3>
            <p className="text-xs text-gray-500 mb-3">
              Matched by mobile number. New candidates will be added; existing ones will be updated in place — nothing is duplicated.
            </p>
            {importError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{importError}</p>
            )}
            <div className="flex items-center gap-3 mb-2 text-xs">
              <span className="font-semibold text-gray-800">{importPreview.length} row(s)</span>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                {importPreview.filter((r) => r.status === "new").length} new
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                {importPreview.filter((r) => r.status === "update").length} to update
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
                {importPreview.filter((r) => r.status === "unchanged").length} unchanged
              </span>
            </div>
            <div className="overflow-x-auto border border-[#e2e6ed] rounded-lg max-h-96 mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50 border-b border-[#e2e6ed]">
                    <th className="p-2">Status</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Mobile</th>
                    <th className="p-2">What&rsquo;s changing</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.map((r, i) => (
                    <tr key={i} className="border-b border-[#f0f2f6] align-top">
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                            r.status === "new"
                              ? "bg-green-100 text-green-700"
                              : r.status === "update"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.status === "new" ? "New" : r.status === "update" ? "Update" : "No change"}
                        </span>
                      </td>
                      <td className="p-2 font-semibold whitespace-nowrap">{r.row.candidate_name}</td>
                      <td className="p-2 whitespace-nowrap">{r.row.candidate_mobile}</td>
                      <td className="p-2">
                        {r.status === "new" ? (
                          <span className="text-gray-400">New candidate record</span>
                        ) : r.status === "unchanged" ? (
                          <span className="text-gray-400">Already up to date</span>
                        ) : (
                          <ul className="space-y-0.5">
                            {r.changes.map((c, ci) => (
                              <li key={ci}>
                                <span className="font-semibold text-gray-600">{c.label}:</span>{" "}
                                <span className="text-gray-400 line-through">{c.from}</span>{" "}
                                <span className="text-[#1a6b1a] font-semibold">→ {c.to}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmImport}
                disabled={importing}
                className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-5 py-2"
              >
                {importing
                  ? importProgress
                    ? `Importing… (${importProgress.done}/${importProgress.total})`
                    : "Importing…"
                  : `Import ${importPreview.length} candidate(s)`}
              </button>
              <button
                onClick={cancelImport}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${showMobileFilters ? "grid" : "hidden"} grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center p-4 border-b border-[#e2e6ed] bg-[#f9fafb]`}
      >
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={constituency}
          onChange={(e) => setConstituency(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Taluks / Constituencies</option>
          {constituencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Pincodes</option>
          {pincodes.map((p) => (
            <option key={p} value={p as string}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={ngo}
          onChange={(e) => setNgo(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All NGOs</option>
          {ngos.map((n) => (
            <option key={n} value={n as string}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r as string}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Decisions</option>
          {DECISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white"
        >
          <option value="">All Interviewers</option>
          {interviewers.map((iv) => (
            <option key={iv} value={iv}>
              {iv}
            </option>
          ))}
        </select>
        <div className="col-span-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-8 shrink-0">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-8 shrink-0">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white"
            />
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="col-span-2 sm:col-span-1 text-xs font-semibold text-red-600 hover:underline sm:ml-1 text-left sm:text-center"
          >
            Clear filters
          </button>
        )}
        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-gray-400">
            {filtered.length} of {totalCount ?? records.length}
          </span>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs font-semibold">
            {SHOW_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setShowLimit(opt)}
                className={`px-2.5 py-1 ${
                  currentLimit === String(opt) ? "bg-[#1a6b1a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt === "all" ? "All" : opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile summary + sort row */}
      <div className="flex sm:hidden flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[#e2e6ed] text-xs bg-gray-50">
        <span className="font-semibold text-gray-700">{visibleRows.length} Candidates</span>
        <div className="flex items-center gap-1.5">
          <select
            value={sortCol}
            onChange={(e) => setSortCol(e.target.value as typeof sortCol)}
            className="rounded border border-gray-300 px-2 py-1 text-xs bg-white text-gray-700"
          >
            <option value="serial">S.No</option>
            <option value="interview_date">Date</option>
            <option value="candidate_name">Name</option>
            <option value="district">District</option>
            <option value="assembly_constituency">Taluk / Constituency</option>
            <option value="score">Score</option>
            <option value="status">Status</option>
            <option value="decision">Decision</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 font-medium"
          >
            {sortDir === "asc" ? "▲ Asc" : "▼ Desc"}
          </button>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-[#f0f2f6]">
        {visibleRows.map((r, index) => {
          const key = r.pending ? `pending-${r.candidate_id}` : `assessment-${r.assessment_id}`;
          const initials = r.candidate_name
            .split(" ")
            .map((p) => p[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();
          const score = Number(r.final_score) || 0;
          const scorePillCls = score >= 11 ? "bg-green-100 text-green-800" : score >= 7 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
          const decisionCls = r.pending
            ? r.interview_started
              ? "bg-orange-100 text-orange-700"
              : "bg-amber-100 text-amber-700"
            : r.final_decision === "Recommended"
              ? "bg-green-100 text-green-700"
              : r.final_decision === "Hold"
                ? "bg-yellow-100 text-yellow-700"
                : r.final_decision === "Not Recommended"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-500";
          const decisionLabel = r.pending
            ? r.interview_started
              ? "In Progress"
              : "Not Started"
            : r.final_decision || "—";
          const avatarCls = r.pending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-[#1a6b1a]";

          return (
            <div key={key} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${avatarCls}`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                      <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 text-[11px] font-bold px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <span>{r.candidate_name}</span>
                    </p>
                    <div className="relative shrink-0">
                      {(r.pending || isAdmin) && (
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === r.candidate_id ? null : r.candidate_id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>
                      )}
                      {openMenuRow === r.candidate_id && (
                        <div className="absolute right-0 top-7 z-10 bg-white border border-[#e2e6ed] rounded-lg shadow-lg py-1 w-40 text-xs">
                          {r.pending ? (
                            <>
                              <button
                                onClick={() => {
                                  setOpenMenuRow(null);
                                  toggleCallRow(r.candidate_id);
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                              >
                                Log Call
                              </button>
                              {isAdmin && (
                                <button
                                  disabled={isPending}
                                  onClick={() => {
                                    setOpenMenuRow(null);
                                    handleDelete(null, r.candidate_id);
                                  }}
                                  className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          ) : (
                            isAdmin && (
                              <button
                                disabled={isPending}
                                onClick={() => {
                                  setOpenMenuRow(null);
                                  handleDelete(r.assessment_id, r.candidate_id);
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                              >
                                Delete
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${decisionCls}`}>{decisionLabel}</span>
                    {!r.pending && <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${scorePillCls}`}>{score.toFixed(1)}</span>}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-gray-600 pl-13">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{r.candidate_mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{r.district} District</span>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{r.assembly_constituency} Constituency</span>
                </div>
                {!!r.categories?.length && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <CategoryTags categories={r.categories} />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IdCardIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{r.pending ? "—" : `${r.auto_suggested_role} (Suggested Role)`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{r.interview_date}</span>
                </div>
                {calculateAge(r.dob) !== null && (
                  <div className="flex items-center gap-2">
                    <IdCardIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Age {calculateAge(r.dob)}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pl-13 text-xs text-gray-500">
                Interviewer:{" "}
                {r.pending ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                    {r.assigned_to ? "Assigned" : "Unassigned"}
                  </span>
                ) : (
                  <span className="font-medium text-gray-700">{r.interviewer_name}</span>
                )}
              </div>

              {openCallRow === r.candidate_id && (
                <div className="mt-3 pl-13 pr-1 space-y-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {CALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCallStatus(s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                          callStatus === s ? "bg-[#1a6b1a] text-white border-[#1a6b1a]" : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <input
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Notes (optional)"
                  />
                  <button
                    onClick={() => submitCallLog(r.candidate_id)}
                    disabled={isPending}
                    className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-4 py-2 w-full"
                  >
                    {isPending ? "Saving…" : "Save Call Log"}
                  </button>
                  {callError && <p className="text-xs text-red-600">{callError}</p>}
                </div>
              )}

              <div className="mt-3 pl-13 flex gap-2">
                {r.pending ? (
                  <>
                    <Link
                      href={isAdmin ? `/admin/candidates/${r.candidate_id}/take` : `/interview/${r.candidate_id}`}
                      className="flex-1 text-center flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f0f8f0] text-[#1a6b1a] border border-[#1a6b1a33]"
                    >
                      Take Interview
                    </Link>
                    <a
                      href={`tel:${r.candidate_mobile}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" /> Call
                    </a>
                    <button
                      onClick={() => toggleCallRow(r.candidate_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-600 border border-gray-300"
                    >
                      •••
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href={`tel:${r.candidate_mobile}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#1a6b1a] border border-[#1a6b1a55]"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" /> Call
                    </a>
                    {isAdmin && (
                      <>
                        <Link
                          href={`/admin/candidates/${r.assessment_id}/edit`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-sky-700 border border-sky-200"
                        >
                          ✎ Edit
                        </Link>
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === r.candidate_id ? null : r.candidate_id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-600 border border-gray-300"
                        >
                          •••
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!visibleRows.length && <div className="text-center text-gray-400 py-12 text-sm">No candidate records yet.</div>}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-[#e2e6ed] select-none bg-gray-50/50">
              <th
                onClick={() => {
                  if (sortCol === "serial") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("serial"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                S.No {sortCol === "serial" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th
                onClick={() => {
                  if (sortCol === "interview_date") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("interview_date"); setSortDir("desc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Date {sortCol === "interview_date" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th
                onClick={() => {
                  if (sortCol === "candidate_name") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("candidate_name"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Candidate {sortCol === "candidate_name" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th className="p-3">Mobile</th>
              <th
                onClick={() => {
                  if (sortCol === "district") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("district"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                District {sortCol === "district" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th
                onClick={() => {
                  if (sortCol === "assembly_constituency") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("assembly_constituency"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Taluk / Constituency {sortCol === "assembly_constituency" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th className="p-3">Pincode</th>
              <th className="p-3">NGO</th>
              <th className="p-3">Category</th>
              <th className="p-3">Age</th>
              <th
                onClick={() => {
                  if (sortCol === "status") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("status"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Status {sortCol === "status" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th
                onClick={() => {
                  if (sortCol === "score") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("score"); setSortDir("desc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Score {sortCol === "score" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th className="p-3">Suggested Role</th>
              <th
                onClick={() => {
                  if (sortCol === "decision") setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  else { setSortCol("decision"); setSortDir("asc"); }
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 transition-colors font-semibold"
              >
                Decision {sortCol === "decision" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th className="p-3">Calls</th>
              <th className="p-3">Interviewer</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, index) => {
              const key = r.pending ? `pending-${r.candidate_id}` : `assessment-${r.assessment_id}`;

              if (r.pending) {
                return (
                  <React.Fragment key={key}>
                  <tr className="border-b border-[#f0f2f6] hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">
                      <span>{index + 1}</span>
                      {r.serial_number && r.serial_number !== index + 1 ? (
                        <span className="text-[10px] text-gray-400 block font-normal" title="Database Serial Number">
                          (SN {r.serial_number})
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3">{r.interview_date}</td>
                    <td className="p-3 font-semibold">{r.candidate_name}</td>
                    <td className="p-3">{r.candidate_mobile}</td>
                    <td className="p-3">{r.district}</td>
                    <td className="p-3">{r.assembly_constituency}</td>
                    <td className="p-3">{r.pincode || "—"}</td>
                    <td className="p-3">{r.ngo || "—"}</td>
                    <td className="p-3"><CategoryTags categories={r.categories} /></td>
                    <td className="p-3">{calculateAge(r.dob) ?? "—"}</td>
                    <td className="p-3">
                      {r.interview_started ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 whitespace-nowrap">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 whitespace-nowrap">
                          Not Started
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">—</span>
                    </td>
                    <td className="p-3 text-xs text-gray-400">—</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        Pending Interview
                      </span>
                    </td>
                    <td className="p-3">
                      {r.call_count ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-700">{r.call_count}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              r.latest_call_status === "Attending"
                                ? "bg-green-100 text-green-700"
                                : r.latest_call_status === "Not Attending"
                                  ? "bg-red-100 text-red-700"
                                  : r.latest_call_status === "Postponed"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {r.latest_call_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isAdmin ? (
                        <>
                          <select
                            value={r.assigned_to || ""}
                            onChange={(e) => handleAssign(r.candidate_id, e.target.value)}
                            disabled={isPending}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs bg-white"
                          >
                            <option value="">Unassigned</option>
                            {interviewerOptions.map((iv) => (
                              <option key={iv.id} value={iv.id}>
                                {iv.profile_completed ? iv.full_name : `${iv.reg_no} (pending setup)`}
                              </option>
                            ))}
                          </select>
                          {!r.assigned_to && r.district_covered_by.length > 0 && (
                            <p className="text-[10px] text-[#1a6b1a] mt-1 leading-tight">
                              Already visible to {r.district_covered_by.join(", ")} via district/constituency/category access
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">You</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === r.candidate_id ? null : r.candidate_id)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        >
                          •••
                        </button>
                        {openMenuRow === r.candidate_id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-[#e2e6ed] rounded-lg shadow-lg py-1 w-44 text-xs">
                            <a
                              href={`tel:${r.candidate_mobile}`}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                            >
                              📞 Call
                            </a>
                            <button
                              onClick={() => {
                                setOpenMenuRow(null);
                                toggleCallRow(r.candidate_id);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                            >
                              {openCallRow === r.candidate_id ? "Cancel Log Call" : "Log Call"}
                            </button>
                            <Link
                              href={isAdmin ? `/admin/candidates/${r.candidate_id}/take` : `/interview/${r.candidate_id}`}
                              onClick={() => setOpenMenuRow(null)}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-[#1a6b1a] font-semibold"
                            >
                              Take Interview
                            </Link>
                            {isAdmin && (
                              <button
                                disabled={isPending}
                                onClick={() => {
                                  setOpenMenuRow(null);
                                  handleDelete(null, r.candidate_id);
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {openCallRow === r.candidate_id && (
                    <tr className="border-b border-[#f0f2f6] bg-[#f9fafb]">
                      <td colSpan={16} className="p-3">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Outcome</label>
                            <div className="flex gap-1.5 flex-wrap">
                              {CALL_STATUSES.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setCallStatus(s)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                                    callStatus === s
                                      ? "bg-[#1a6b1a] text-white border-[#1a6b1a]"
                                      : "bg-white text-gray-600 border-gray-300"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes (optional)</label>
                            <input
                              value={callNotes}
                              onChange={(e) => setCallNotes(e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              placeholder="e.g. asked to call back tomorrow evening"
                            />
                          </div>
                          <button
                            onClick={() => submitCallLog(r.candidate_id)}
                            disabled={isPending}
                            className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-4 py-2 whitespace-nowrap"
                          >
                            {isPending ? "Saving…" : "Save Call Log"}
                          </button>
                        </div>
                        {callError && <p className="text-xs text-red-600 mt-2">{callError}</p>}
                        {(callsByCandidate[r.candidate_id] || []).length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-semibold text-gray-600">Call history</p>
                            {(callsByCandidate[r.candidate_id] || []).map((log) => (
                              <div key={log.id} className="flex items-center gap-2 text-xs text-gray-500">
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${CALL_STATUS_CLS[log.status]}`}>
                                  {log.status}
                                </span>
                                <span>{new Date(log.called_at).toLocaleString()}</span>
                                {log.notes && <span className="text-gray-400">— {log.notes}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              }

              const score = Number(r.final_score) || 0;
              const pillCls = score >= 11 ? "bg-green-100 text-green-800" : score >= 7 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
              const decisionCls =
                r.final_decision === "Recommended"
                  ? "bg-green-100 text-green-700"
                  : r.final_decision === "Hold"
                    ? "bg-yellow-100 text-yellow-700"
                    : r.final_decision === "Not Recommended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500";
              return (
                <tr key={key} className="border-b border-[#f0f2f6] hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-800">
                    <span>{index + 1}</span>
                    {r.serial_number && r.serial_number !== index + 1 ? (
                      <span className="text-[10px] text-gray-400 block font-normal" title="Database Serial Number">
                        (SN {r.serial_number})
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3">{r.interview_date}</td>
                  <td className="p-3 font-semibold">{r.candidate_name}</td>
                  <td className="p-3">{r.candidate_mobile}</td>
                  <td className="p-3">{r.district}</td>
                  <td className="p-3">{r.assembly_constituency}</td>
                  <td className="p-3">{r.pincode || "—"}</td>
                  <td className="p-3">{r.ngo || "—"}</td>
                  <td className="p-3"><CategoryTags categories={r.categories} /></td>
                  <td className="p-3">{calculateAge(r.dob) ?? "—"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
                      Completed
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pillCls}`}>{score.toFixed(1)}</span>
                  </td>
                  <td className="p-3 text-xs">{r.auto_suggested_role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${decisionCls}`}>
                      {r.final_decision || "—"}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-400">—</td>
                  <td className="p-3 text-xs text-gray-500">{r.interviewer_name}</td>
                  <td className="p-3">
                    {isAdmin ? (
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === r.candidate_id ? null : r.candidate_id)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        >
                          •••
                        </button>
                        {openMenuRow === r.candidate_id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-[#e2e6ed] rounded-lg shadow-lg py-1 w-32 text-xs">
                            <Link
                              href={`/admin/candidates/${r.assessment_id}/edit`}
                              onClick={() => setOpenMenuRow(null)}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sky-700 font-semibold"
                            >
                              Edit
                            </Link>
                            <button
                              disabled={isPending}
                              onClick={() => {
                                setOpenMenuRow(null);
                                handleDelete(r.assessment_id, r.candidate_id);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={`tel:${r.candidate_mobile}`}
                        className="px-2 py-1 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap"
                      >
                        📞 Call
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div className="text-center text-gray-400 py-12 text-sm">No candidate records yet.</div>}
      </div>
    </div>
  );
}

// A candidate can belong to more than one category at once — render each as
// its own small tag rather than a single value, so multi-membership is
// visible at a glance in the table.
function CategoryTags({ categories }: { categories?: Category[] }) {
  if (!categories?.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((cat) => (
        <span key={cat.id} className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f0f8f0] text-[#1a6b1a] whitespace-nowrap">
          {cat.name}
        </span>
      ))}
    </div>
  );
}
