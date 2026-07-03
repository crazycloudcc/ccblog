import {
  formatLocation,
  isPrivateIp,
  readClientIp,
  type SessionGeo,
} from "@/lib/session-geo";

async function lookupGeo(ip: string): Promise<string> {
  const response = await fetch(`https://ipwho.is/${ip}?lang=zh-CN`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return "未知";
  }

  const data = (await response.json()) as {
    success?: boolean;
    city?: string;
    region?: string;
    country?: string;
  };

  if (!data.success) {
    return "未知";
  }

  return formatLocation(data.city, data.region, data.country);
}

export async function GET(request: Request) {
  const ip = readClientIp(request);

  if (isPrivateIp(ip)) {
    const payload: SessionGeo = { ip: "local", location: "本地" };
    return Response.json(payload);
  }

  const vercelCity = request.headers.get("x-vercel-ip-city");
  const vercelCountry = request.headers.get("x-vercel-ip-country");

  if (vercelCity || vercelCountry) {
    const payload: SessionGeo = {
      ip,
      location: formatLocation(vercelCity, null, vercelCountry),
    };
    return Response.json(payload);
  }

  try {
    const location = await lookupGeo(ip);
    const payload: SessionGeo = { ip, location };
    return Response.json(payload);
  } catch {
    const payload: SessionGeo = { ip, location: "未知" };
    return Response.json(payload);
  }
}
