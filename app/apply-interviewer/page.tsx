import ApplyInterviewerForm from "./ApplyInterviewerForm";

export const dynamic = "force-dynamic";

export default function ApplyInterviewerPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="w-full bg-white border-b border-[#e2e6ed] shadow-sm">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-4">
          <div className="text-[10px] tracking-[2px] uppercase text-[#1a6b1a] font-bold">Tamil Nadu Volunteers</div>
          <div className="text-lg font-bold text-gray-900">Interviewer Registration</div>
        </div>
      </div>
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-6">
        <ApplyInterviewerForm />
      </div>
    </div>
  );
}
