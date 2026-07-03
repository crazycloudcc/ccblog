export type SessionGeo = {
  ip: string;
  location: string;
};

export function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || ip === "unknown") {
    return true;
  }

  if (ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return true;
  }

  const match = /^172\.(\d+)\./.exec(ip);
  if (match) {
    const second = Number(match[1]);
    return second >= 16 && second <= 31;
  }

  return ip.startsWith("fc") || ip.startsWith("fd");
}

export function formatLocation(
  city?: string | null,
  region?: string | null,
  country?: string | null,
): string {
  const parts = [city, region, country].filter((part) => part && part.trim().length > 0);
  return parts.join(", ") || "Unknown";
}

export function readClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}
