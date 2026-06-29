import { Router } from "express";
import { db, leadsTable } from "@workspace/db";
import { SubmitLeadBody } from "@workspace/api-zod";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.post("/leads", async (req, res) => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const data = parsed.data;

  const [lead] = await db
    .insert(leadsTable)
    .values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      projectType: data.projectType,
      roomTypes: data.roomTypes,
      budget: data.budget,
      timeline: data.timeline,
      style: data.style,
      squareFootage: data.squareFootage ?? null,
      description: data.description,
      hearAboutUs: data.hearAboutUs ?? null,
    })
    .returning();

  return res.status(201).json({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  });
});

router.get("/leads", async (req, res) => {
  const leads = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
  return res.json(
    leads.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))
  );
});

router.get("/leads/stats", async (req, res) => {
  const total = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(leadsTable);

  const byStyle = await db
    .select({
      label: leadsTable.style,
      count: sql<number>`count(*)::int`,
    })
    .from(leadsTable)
    .groupBy(leadsTable.style);

  const byBudget = await db
    .select({
      label: leadsTable.budget,
      count: sql<number>`count(*)::int`,
    })
    .from(leadsTable)
    .groupBy(leadsTable.budget);

  const byProjectType = await db
    .select({
      label: leadsTable.projectType,
      count: sql<number>`count(*)::int`,
    })
    .from(leadsTable)
    .groupBy(leadsTable.projectType);

  return res.json({
    totalLeads: total[0]?.count ?? 0,
    byStyle,
    byBudget,
    byProjectType,
  });
});

router.get("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [lead] = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.id, id));

  if (!lead) return res.status(404).json({ error: "Lead not found" });

  return res.json({ ...lead, createdAt: lead.createdAt.toISOString() });
});

export default router;
