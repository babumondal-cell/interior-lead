import { logger } from "./logger";

function budgetToRange(budget: string): { min: string; max: string } {
  const map: Record<string, { min: string; max: string }> = {
    under_10k: { min: "0", max: "10000" },
    "10k_25k": { min: "10000", max: "25000" },
    "25k_50k": { min: "25000", max: "50000" },
    "50k_100k": { min: "50000", max: "100000" },
    over_100k: { min: "100000", max: "" },
  };
  return map[budget] ?? { min: "0", max: "" };
}

function timelineLabel(timeline: string): string {
  const map: Record<string, string> = {
    immediately: "Immediately",
    "1_3_months": "1-3 Months",
    "3_6_months": "3-6 Months",
    "6_12_months": "6-12 Months",
    flexible: "Flexible",
  };
  return map[timeline] ?? timeline;
}

export async function submitBoberdooLead(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  roomTypes: string[];
  budget: string;
  timeline: string;
  style: string;
  squareFootage?: number | null;
  description: string;
  hearAboutUs?: string | null;
}): Promise<{ success: boolean; leadId?: string; error?: string }> {
  const apiKey = process.env.BOBERDOO_API_KEY;
  const srcId = process.env.BOBERDOO_SRC_ID;
  const subdomainRaw = process.env.BOBERDOO_SUBDOMAIN;

  if (!apiKey || !srcId) {
    logger.warn("Boberdoo credentials not configured — skipping Boberdoo sync");
    return { success: false, error: "Boberdoo credentials not configured" };
  }

  if (!subdomainRaw) {
    logger.warn("BOBERDOO_SUBDOMAIN not set — skipping Boberdoo sync");
    return { success: false, error: "BOBERDOO_SUBDOMAIN not configured" };
  }

  const { min, max } = budgetToRange(lead.budget);

  const params = new URLSearchParams({
    Key: apiKey,
    SRC: srcId,
    First_Name: lead.firstName,
    Last_Name: lead.lastName,
    Email: lead.email,
    Phone: lead.phone,
    Project_Type: lead.projectType,
    Rooms: lead.roomTypes.join(", "),
    Budget_Min: min,
    Budget_Max: max,
    Timeline: timelineLabel(lead.timeline),
    Design_Style: lead.style,
    Square_Footage: lead.squareFootage ? String(lead.squareFootage) : "",
    Comments: lead.description,
    How_Heard: lead.hearAboutUs ?? "",
    TCPA_Optin: "1",
    TCPA_Optin_Date: new Date().toISOString(),
  });

  // Accept either a full URL or just the subdomain name
  const url = subdomainRaw.startsWith("http")
    ? subdomainRaw
    : `https://${subdomainRaw}.leadportal.com/api.php`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const text = await response.text();

    if (!response.ok) {
      logger.error({ status: response.status, body: text }, "Boberdoo lead submission failed");
      return { success: false, error: `Boberdoo error ${response.status}: ${text}` };
    }

    const statusMatch = text.match(/<status>(.*?)<\/status>/i);
    const leadIdMatch = text.match(/<lead_id>(.*?)<\/lead_id>/i);
    const errorMatch = text.match(/<error>(.*?)<\/error>/i);

    if (errorMatch?.[1] && errorMatch[1].trim()) {
      logger.error({ boberdooError: errorMatch[1], body: text }, "Boberdoo returned an error");
      return { success: false, error: errorMatch[1] };
    }

    const status = statusMatch?.[1] ?? "unknown";
    const leadId = leadIdMatch?.[1];

    if (status === "Error") {
      return { success: false, error: `Boberdoo status: Error — ${text}` };
    }

    logger.info({ leadId, status }, "Boberdoo lead submitted");
    return { success: true, leadId };
  } catch (err) {
    logger.error({ err }, "Boberdoo request threw an exception");
    return { success: false, error: String(err) };
  }
}
