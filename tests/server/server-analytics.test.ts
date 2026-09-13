import { describe, it, expect } from "vitest";
import { getServerAnalytics } from "@/lib/server-analytics";

describe("Server Analytics Computation", () => {
  it("should calculate analytics payload for '7d' range", async () => {
    const analytics = await getServerAnalytics("7d");

    expect(analytics).toBeDefined();
    expect(analytics.timeRange).toBe("7d");
    expect(analytics.overview).toHaveProperty("totalTasksCompleted");
    expect(analytics.overview).toHaveProperty("workflowSuccessRate");
    expect(analytics.overview).toHaveProperty("slaComplianceRate");
    expect(analytics.throughputTimeline.length).toBeGreaterThan(0);
    expect(analytics.assigneeWorkload.length).toBeGreaterThan(0);
    expect(analytics.priorityBreakdown.length).toBeGreaterThan(0);
  });

  it("should calculate analytics payload for '30d' and '90d' ranges", async () => {
    const analytics30 = await getServerAnalytics("30d");
    expect(analytics30.timeRange).toBe("30d");
    expect(analytics30.throughputTimeline).toHaveLength(6);

    const analytics90 = await getServerAnalytics("90d");
    expect(analytics90.timeRange).toBe("90d");
    expect(analytics90.throughputTimeline).toHaveLength(6);
  });
});
