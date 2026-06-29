import { logger } from "./logger";

const GHL_BASE = "https://services.leadconnectorhq.com";

interface GhlContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locationId: string;
  tags?: string[];
  customFields?: Array<{ id: string; key: string; field_value: string }>;
  source?: string;
}

interface GhlContactResponse {
  contact: { id: string };
}

export async function createGhlContact(lead: {
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
}): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    logger.warn("GHL credentials not configured — skipping GHL sync");
    return { success: false, error: "GHL credentials not configured" };
  }

  const payload: GhlContactPayload = {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    locationId,
    source: "Lumière Interiors Website",
    tags: ["interior-design-lead", lead.style, lead.projectType],
    customFields: [
      { id: "project_type", key: "project_type", field_value: lead.projectType },
      { id: "room_types", key: "room_types", field_value: lead.roomTypes.join(", ") },
      { id: "budget", key: "budget", field_value: lead.budget },
      { id: "timeline", key: "timeline", field_value: lead.timeline },
      { id: "design_style", key: "design_style", field_value: lead.style },
      {
        id: "square_footage",
        key: "square_footage",
        field_value: lead.squareFootage ? String(lead.squareFootage) : "",
      },
      { id: "project_description", key: "project_description", field_value: lead.description },
      { id: "hear_about_us", key: "hear_about_us", field_value: lead.hearAboutUs ?? "" },
    ],
  };

  try {
    const response = await fetch(`${GHL_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error({ status: response.status, body: text }, "GHL contact creation failed");
      return { success: false, error: `GHL API error ${response.status}: ${text}` };
    }

    const data = (await response.json()) as GhlContactResponse;
    logger.info({ contactId: data.contact?.id }, "GHL contact created");
    return { success: true, contactId: data.contact?.id };
  } catch (err) {
    logger.error({ err }, "GHL request threw an exception");
    return { success: false, error: String(err) };
  }
}
