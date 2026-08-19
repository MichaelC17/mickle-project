"use client";

import { Youtube, Twitch } from "lucide-react";

const platformConfig: Record<
  string,
  { bg: string; color: string; label: string; iconBg: string }
> = {
  youtube: { bg: "bg-red-500", color: "text-red-500", label: "YouTube", iconBg: "bg-red-500/10" },
  twitch: { bg: "bg-violet-500", color: "text-violet-500", label: "Twitch", iconBg: "bg-violet-500/10" },
  tiktok: { bg: "bg-pink-500", color: "text-pink-500", label: "TikTok", iconBg: "bg-pink-500/10" },
  instagram: { bg: "bg-gradient-to-r from-purple-500 to-pink-500", color: "text-purple-500", label: "Instagram", iconBg: "bg-purple-500/10" },
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case "youtube":
      return <Youtube className={className} />;
    case "twitch":
      return <Twitch className={className} />;
    case "tiktok":
      return <TikTokIcon className={className} />;
    default:
      return null;
  }
}

export function PlatformBadgeSolid({ platform }: { platform: string }) {
  const config = platformConfig[platform] || { bg: "bg-gray-500", color: "text-gray-500", label: platform, iconBg: "bg-gray-500/10" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wide ${config.bg}`}>
      <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export function PlatformBadgeSmall({ platform }: { platform: string }) {
  const config = platformConfig[platform] || { bg: "bg-gray-500", color: "text-gray-500", label: platform, iconBg: "bg-gray-500/10" };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide ${config.bg}`}>
      {config.label}
    </span>
  );
}

export function PlatformBadgeSubtle({ platform }: { platform: string }) {
  const config = platformConfig[platform] || { bg: "bg-gray-500/10", color: "text-gray-500", label: platform, iconBg: "bg-gray-500/10" };
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${config.iconBg}`}>
      <PlatformIcon platform={platform} className={`w-3.5 h-3.5 ${config.color}`} />
    </span>
  );
}

export function PlatformBadgeIconOnly({ platform }: { platform: string }) {
  const config = platformConfig[platform] || { bg: "bg-gray-500", color: "text-gray-500", label: platform, iconBg: "bg-gray-500/10" };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${config.iconBg}`} title={config.label}>
      <PlatformIcon platform={platform} className={`w-3 h-3 ${config.color}`} />
    </span>
  );
}

export { PlatformIcon };
