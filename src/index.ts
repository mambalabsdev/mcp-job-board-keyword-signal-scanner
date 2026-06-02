#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(here, "..", "package.json"), "utf8"),
) as { version: string; name: string };

// Distinctive UA so Apify run meta.userAgent marks MCP-originated runs.
const USER_AGENT = `mambalabs-mcp ${pkg.name}@${pkg.version}`;

const APIFY_TOKEN = process.env.APIFY_TOKEN;

// The tilde between the org name and the actor name is Apify's required separator.
const ACTOR_ENDPOINT =
  "https://api.apify.com/v2/acts/mambalabs~job-board-keyword-signal-scanner/run-sync-get-dataset-items?timeout=300";

const server = new McpServer({
  name: "mamba-job-board-keyword-signal-scanner",
  version: pkg.version,
});

server.tool(
  "scan_job_board_keywords",
  "Scan a company's job board for roles in chosen categories across Greenhouse, Lever, Ashby, Workday, and Rippling. Pick from GTM, Engineering, Finance, Operations, Executive, or supply custom keywords. Returns a flat, Clay-ready JSON row of matched role counts and titles per category.",
  {
    company_domain: z
      .string()
      .describe(
        "Bare company domain without https:// and without a trailing slash. Example: stripe.com",
      ),
    role_categories: z
      .array(z.string())
      .describe(
        "One or more role categories to scan for. Valid values: GTM, Engineering, Finance, Operations, Executive, Custom. Use Custom together with custom_keywords.",
      ),
    custom_keywords: z
      .array(z.string())
      .optional()
      .describe(
        "Keyword strings to match when Custom is included in role_categories. Required only if Custom is requested.",
      ),
    enable_fallback: z
      .boolean()
      .optional()
      .describe(
        "If true, falls back to a pre-indexed job database when the live ATS cascade finds nothing.",
      ),
    previous_roles_detected: z
      .string()
      .optional()
      .describe(
        "Comma-separated matched role titles from a previous run, used to compute newly added or removed roles.",
      ),
    previous_run_date: z
      .string()
      .optional()
      .describe("ISO date of the previous run, e.g. 2026-03-15. Used for tracking changes over time."),
  },
  async ({
    company_domain,
    role_categories,
    custom_keywords,
    enable_fallback,
    previous_roles_detected,
    previous_run_date,
  }) => {
    if (!APIFY_TOKEN) {
      return { isError: true, content: [{ type: "text", text: "APIFY_TOKEN is not set. Create a token at https://console.apify.com/account/integrations and set it as the APIFY_TOKEN environment variable." }] };
    }

    const input: Record<string, unknown> = { company_domain, role_categories };
    if (custom_keywords !== undefined) input.custom_keywords = custom_keywords;
    if (enable_fallback !== undefined) input.enable_fallback = enable_fallback;
    if (previous_roles_detected !== undefined) input.previous_roles_detected = previous_roles_detected;
    if (previous_run_date !== undefined) input.previous_run_date = previous_run_date;

    let response: Response;
    try {
      response = await fetch(ACTOR_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${APIFY_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
        },
        body: JSON.stringify(input),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Could not reach the Apify API: ${message}` }],
      };
    }

    if (!response.ok) {
      let detail = "";
      try {
        const body = (await response.json()) as { error?: { message?: string } };
        if (body?.error?.message) detail = ` ${body.error.message}`;
      } catch {
        detail = "";
      }

      let message: string;
      switch (response.status) {
        case 401:
          message = "Invalid Apify token. Check your APIFY_TOKEN environment variable.";
          break;
        case 402:
          message =
            "Insufficient Apify credits. Check your account balance at https://console.apify.com/billing";
          break;
        case 408:
          message =
            "Actor run timed out after 300 seconds. Try again, or run the actor on Apify directly for longer jobs.";
          break;
        default:
          message = `Apify request failed with status ${response.status}.${detail}`;
      }
      return { isError: true, content: [{ type: "text", text: message }] };
    }

    const items = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
