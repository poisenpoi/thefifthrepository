"use client";

import Link from "next/link";
import {
  Briefcase,
  MapPin,
  CheckCircle,
  Send,
  Clock,
  ArrowUpDown,
  Banknote,
  Globe,
  Building2,
  Users,
  UserCheck,
} from "lucide-react";
import { JobUI } from "@/types/job.ui";
import { ApplicationStatus, User, Profile } from "@prisma/client";
import BackButton from "../BackButton";
import { applyJob } from "@/actions/applyJob";

interface JobDetailsProps {
  job: JobUI;
  applicationStatus: ApplicationStatus | null;
  user: User | null;
  profile: Profile | null;
}

export default function JobDetail({
  job,
  applicationStatus,
  user,
  profile,
}: JobDetailsProps) {
  const renderApplyButton = () => {
    if (!user) {
      return (
        <Link
          href="/login"
          className="w-full block text-center bg-eduBlue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Login to Apply
        </Link>
      );
    }

    if (user.role !== "EDUCATEE") return null;

    switch (applicationStatus) {
      case "APPLIED":
        return (
          <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-3 rounded-lg font-semibold">
            <CheckCircle className="w-5 h-5" />
            Applied
          </div>
        );

      case "REVIEWED":
        return (
          <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold">
            <CheckCircle className="w-5 h-5" />
            Under Review
          </div>
        );

      case "ACCEPTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-lg font-semibold">
            Accepted
          </div>
        );

      case "REJECTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-3 rounded-lg font-semibold">
            Rejected
          </div>
        );

      default:
        return (
          <form action={applyJob.bind(null, job.id)}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              <Send className="w-5 h-5" />
              Apply Now
            </button>
          </form>
        );
    }
  };

  const formatPaycheck = (min: number | null, max: number | null) => {
    if (!min && !max) return "Undisclosed";

    const format = (num: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 1,
        notation: "compact",
      }).format(num);

    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `From ${format(min)}`;
    if (max) return `Up to ${format(max)}`;
    return "";
  };

  const hireRate =
    ((job.user.profile?.totalHired ?? 0) /
      Math.max(job.user.profile?.totalApplicants ?? 1, 1)) *
    100;

  const websiteUrl = job.user.profile?.companyWebsite
    ? job.user.profile.companyWebsite.startsWith("http")
      ? job.user.profile.companyWebsite
      : `https://${job.user.profile.companyWebsite}`
    : "#";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-4 flex flex-col">
            <BackButton />
            <span className="bg-eduBlue px-4 py-1 rounded-full text-xs font-bold uppercase w-fit tracking-wide">
              {job.category.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location?.toUpperCase() ??
                  job.user.profile?.companyAddress?.toUpperCase() ??
                  "JOB LOCATION"}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {job.level || "ANY"}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {job.type.replace("_", " ")}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                {job.workMode}
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-slate-400" />
                {formatPaycheck(job.paycheckMin, job.paycheckMax)}
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Last Updated:{" "}
              {new Date(job.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Profile Card */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-slate-100 bg-slate-50 p-2 shrink-0 flex items-center justify-center">
                  <img
                    src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900 truncate">
                    {job.user.profile?.name || "Company Name"}
                  </h2>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {job.user.profile?.companyAddress || "Company Address"}
                      </span>
                    </div>
                    {job.user.profile?.companyWebsite && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-eduBlue hover:text-blue-700 hover:underline transition-colors truncate"
                        >
                          {job.user.profile.companyWebsite}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-slate-100" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                    About the Company
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {job.user.profile?.bio || "No bio available."}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 space-y-5 border border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      <Briefcase className="w-3.5 h-3.5" /> Jobs Posted
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {job.user.profile?.totalJobs || 0}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      <UserCheck className="w-3.5 h-3.5" /> Hire Rate
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {Math.round(hireRate) || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Description Card */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Job Description
            </h2>
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Application Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Application Status
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {job.applicators}
                </div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Applicants
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                  {job.hired}
                </div>
                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                  Hired
                </div>
              </div>
            </div>

            {user && user.role === "EDUCATEE" && (
              <div className="pt-5 border-t border-slate-100">
                {!profile ||
                !profile.name ||
                !profile.gender ||
                !profile.dob ? (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                    Please complete your profile first before applying.
                  </div>
                ) : (
                  renderApplyButton()
                )}
              </div>
            )}
          </div>

          {/* Job Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Job Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <span className="font-medium text-slate-900 text-sm capitalize text-right max-w-[60%] truncate">
                  {job.location ??
                    job.user.profile?.companyAddress ??
                    "Job Location"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Briefcase className="w-4 h-4" />
                  Level
                </div>
                <span className="font-medium text-slate-900 text-sm capitalize">
                  {job.level?.toLowerCase() || "Any"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  Type
                </div>
                <span className="font-medium text-slate-900 text-sm capitalize">
                  {job.type.replace("_", " ").toLowerCase()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Building2 className="w-4 h-4" />
                  Work Mode
                </div>
                <span className="font-medium text-slate-900 text-sm capitalize">
                  {job.workMode.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}