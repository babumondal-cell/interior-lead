import { logger } from "./logger";

const BOBERDOO_BASE = "https://www.boberdoo.com/index.php";

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

  if (!apiKey || !srcId) {
    logger.warn("Boberdoo credentials not configured — skipping Boberdoo sync");
    return { success: false, error: "Boberdoo credentials not configured" };
  }

  const { min, max } = budgetToRange(lead.budget);

  const params = new URLSearchParams({
    KEY: apiKey,
    TYPE: "lead",
    SRC: srcId,
    FIRST_NAME: lead.firstName,
    LAST_NAME: lead.lastName,
    EMAIL: lead.email,
    PHONE: lead.phone,
    LEAD_TYPE: "Home Interior Design",
    PROJECT_TYPE: lead.projectType,
    ROOMS: lead.roomTypes.join(", "),
    BUDGET_MIN: min,
    BUDGET_MAX: max,
    TIMELINE: timelineLabel(lead.timeline),
    DESIGN_STYLE: lead.style,
    SQUARE_FOOTAGE: lead.squareFootage ? String(lead.squareFootage) : "",
    COMMENTS: lead.description,
    HOW_HEARD: lead.hearAboutUs ?? "",
    TCPA_OPTIN: "1",
    TCPA_OPTIN_DATE: new Date().toISOString(),
    TCPA_OPTIN_URL: "lumiere-interiors.replit.app",
  });

  try {
    const response = await fetch(`${BOBERDOO_BASE}?${params.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const text = await response.text();

    if (!response.ok) {
      logger.error({ status: response.status, body: text }, "Boberdoo lead submission failed");
      return { success: false, error: `Boberdoo error ${response.status}: ${text}` };
    }

    const leadIdMatch = text.match(/<LEAD_ID>(.*?)<\/LEAD_ID>/);
    const errorMatch = text.match(/<ERROR>(.*?)<\/ERROR>/);

    if (errorMatch?.[1]) {
      logger.error({ boberdooError: errorMatch[1] }, "Boberdoo returned an error");
      return { success: false, error: errorMatch[1] };
    }

    const leadId = leadIdMatch?.[1];
    logger.info({ leadId, response: text }, "Boberdoo lead submitted");
    return { success: true, leadId };
  } catch (err) {
    logger.error({ err }, "Boberdoo request threw an exception");
    return { success: false, error: String(err) };
  }
}
