"use client";

import Link from "next/link";
import {
  Briefcase,
  MapPin,
  CheckCircle,
  Send,
  Clock,
  Bookmark,
  ArrowUpDown,
  Banknote,
  Globe,
  Building2,
  Users,
  LayoutDashboard,
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
          className="w-full block text-center bg-eduBlue text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          Login to Apply
        </Link>
      );
    }

    if (user.role !== "EDUCATEE") return;

    switch (applicationStatus) {
      case "APPLIED":
        return (
          <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-semibold border border-emerald-200 text-sm">
            <CheckCircle className="w-4 h-4" />
            Applied
          </div>
        );

      case "REVIEWED":
        return (
          <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold border border-blue-200 text-sm">
            <CheckCircle className="w-4 h-4" />
            Under Review
          </div>
        );

      case "ACCEPTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg font-semibold border border-green-200 text-sm">
            Accepted
          </div>
        );

      case "REJECTED":
        return (
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg font-semibold border border-red-200 text-sm">
            Rejected
          </div>
        );

      default:
        return (
          <form action={applyJob.bind(null, job.id)}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-eduBlue hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-sm"
            >
              <Send className="w-4 h-4" />
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
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-9">
          <BackButton />
          <div className="mt-8 space-y-4 flex flex-col">
            <span className="bg-eduBlue px-4 py-1 rounded-full text-xs font-bold uppercase w-fit">
              {job.category.name}
            </span>
            <h1 className="text-4xl font-extrabold">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location?.toUpperCase() ??
                  job.user.profile?.companyAddress?.toUpperCase() ??
                  "JOB LOCATION"}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.level || "ANY"}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {job.type.replace("_", " ")}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                {job.workMode}
              </div>
            </div>
            <div className="text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Company Profile
            </h2>
          </div>
          <div className="p-4 flex-1">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 shrink-0 rounded-lg border border-slate-100 bg-slate-50 p-1.5 flex items-center justify-center">
                <img
                  src={job.user.profile?.pictureUrl || "/avatars/male.svg"}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-slate-900 truncate">
                  {job.user.profile?.name || "Company Name"}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mt-0.5">
                  <p className="text-slate-500 text-xs flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.user.profile?.companyAddress || "Address"}
                  </p>
                  {job.user.profile?.companyWebsite && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-eduBlue hover:text-blue-700 transition-colors text-xs truncate"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100">
              <div className="md:w-2/3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  About
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {job.user.profile?.bio || "No bio available."}
                </p>
              </div>
              <div className="md:w-1/3 flex gap-2">
                <div className="flex-1 bg-slate-50 p-2.5 rounded border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                    Posted
                  </div>
                  <div className="text-lg font-bold text-slate-900 leading-none">
                    {job.user.profile?.totalJobs || 0}
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 p-2.5 rounded border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                    Hire Rate
                  </div>
                  <div className="text-lg font-bold text-slate-900 leading-none">
                    {Math.round(hireRate) || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-full flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            Overview
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-auto">
            <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
              <span className="block text-lg font-bold text-slate-900">
                {job.applicators}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                Applied
              </span>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100 text-center">
              <span className="block text-lg font-bold text-emerald-700">
                {job.hired}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">
                Hired
              </span>
            </div>
          </div>

          {user && user.role === "EDUCATEE" && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              {!profile ||
              !profile.name ||
              !profile.gender ||
              !profile.dob ? (
                <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded border border-red-100 font-medium text-center">
                  Complete profile to apply.
                </p>
              ) : (
                renderApplyButton()
              )}
            </div>
          )}
        </div>

        <section className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-full flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            Job Description
          </h2>
          <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line text-sm flex-1">
            {job.description}
          </div>
        </section>

        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-full flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-slate-400" />
            Details
          </h3>

          <div className="space-y-2.5 flex-1">
            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <span className="font-medium text-slate-900 text-xs capitalize truncate">
                {job.location ??
                  job.user.profile?.companyAddress ??
                  "Job Location"}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Level
              </span>
              <span className="font-medium text-slate-900 text-xs capitalize">
                {job.level?.toLowerCase() || "Any"}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Type
              </span>
              <span className="font-medium text-slate-900 text-xs capitalize">
                {job.type.replace("_", " ").toLowerCase()}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Work Mode
              </span>
              <span className="font-medium text-slate-900 text-xs capitalize">
                {job.workMode.toLowerCase()}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Banknote className="w-3 h-3" /> Salary
              </span>
              <span className="font-medium text-slate-900 text-xs">
                {formatPaycheck(job.paycheckMin, job.paycheckMax)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}