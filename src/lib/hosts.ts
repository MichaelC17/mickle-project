export interface PackageStats {
  avgSubGrowth: string;
  avgSubGrowthPercent: number;
  avgViewGrowth: string;
  avgViewGrowthPercent: number;
  costPerSub: string;
}

export interface Package {
  name: string;
  price: number;
  description: string;
  includes: string[];
  stats: PackageStats;
}

export interface Host {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: "youtube" | "twitch" | "tiktok" | "instagram";
  subscribers: string;
  subscriberCount: number;
  niche: string;
  bio: string;
  price: number;
  completionRate: string;
  totalGuestSpots: number;
  packages: Package[];
}

export const hosts: Host[] = [];

export function getHostById(id: string): Host | undefined {
  return hosts.find((host) => host.id === id);
}

export function getPlatformColor(platform: Host["platform"]): string {
  switch (platform) {
    case "youtube":
      return "text-red-500";
    case "twitch":
      return "text-violet-500";
    case "tiktok":
      return "text-pink-500";
    case "instagram":
      return "text-purple-500";
  }
}

export function getPlatformIcon(platform: Host["platform"]): string {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "twitch":
      return "Twitch";
    case "tiktok":
      return "TikTok";
    case "instagram":
      return "Instagram";
  }
}
