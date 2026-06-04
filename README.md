# Job Board Keyword Signal Scanner MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-job-board-keyword-signal-scanner)](https://smithery.ai/server/mambabuilt/mcp-job-board-keyword-signal-scanner) [![Glama score](https://glama.ai/mcp/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner/badges/score.svg)](https://glama.ai/mcp/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner) [![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0%2Fservers%3Fsearch%3Dcom.mambabuilt%252Fmcp-job-board-keyword-signal-scanner%26limit%3D1&query=%24.servers%5B0%5D._meta%5B%22io.modelcontextprotocol.registry%2Fofficial%22%5D.status&label=mcp%20registry&color=blue)](https://registry.modelcontextprotocol.io/v0/servers?search=com.mambabuilt/mcp-job-board-keyword-signal-scanner&limit=1) [![npm version](https://img.shields.io/npm/v/@mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://www.npmjs.com/~mambalabsdev) [![npm downloads](https://img.shields.io/npm/dm/@mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://www.npmjs.com/~mambalabsdev) [![license](https://img.shields.io/github/license/mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://github.com/mambalabsdev) [![mcpservers.org](https://img.shields.io/badge/mcpservers.org-listed-blue)](https://mcpservers.org/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner)

An MCP server that scans a company's job board for the roles you care about. It wraps the Mamba Labs Job Board Keyword Signal Scanner actor on Apify and returns a Clay-ready flat JSON row to any MCP client.

## What it does

Give it a company domain and a set of role categories, and it scans Greenhouse, Lever, Ashby, Workday, and Rippling for matching open roles. Pick from GTM, Engineering, Finance, Operations, Executive, or pass your own custom keywords. You get back a flat row of matched role counts and titles per category, ready for Clay, a CRM, or an AI agent workflow. All of the scanning runs on Apify. This package is a thin client that calls the actor and hands back the result.

## Quick start

You need Node.js 18 or newer and an Apify account with an API token.

Add this to your Claude Desktop config:

```json
{
  "mcpServers": {
    "mamba-job-board-scanner": {
      "command": "npx",
      "args": ["-y", "@mambalabsdev/mcp-job-board-keyword-signal-scanner"],
      "env": {
        "APIFY_TOKEN": "your-apify-token"
      }
    }
  }
}
```

Get your token at https://console.apify.com/account/integrations, paste it in, and restart Claude Desktop. The `scan_job_board_keywords` tool will be available.

## Prerequisites

- Node.js 18 or newer
- An Apify account with an API token

## Example prompts

- "Is stripe.com hiring engineers? Scan their job board for Engineering roles."
- "Check openai.com for GTM and Executive openings."
- "Scan figma.com for Finance and Operations roles."
- "Look for roles matching 'machine learning' and 'platform' at datadoghq.com using custom keywords."

## Inputs

- `company_domain` (required): the bare company domain, no `https://` and no trailing slash. Example: `stripe.com`
- `role_categories` (required): one or more of GTM, Engineering, Finance, Operations, Executive, Custom.
- `custom_keywords` (optional): keyword strings to match when Custom is included.
- `enable_fallback` (optional): fall back to a pre-indexed job database when the live ATS cascade finds nothing.
- `previous_roles_detected` and `previous_run_date` (optional): pass a prior run's results to compute newly added or removed roles over time.

## Output

The tool returns the actor's flat JSON row for the scanned company, including matched role counts and titles per requested category, the ATS platform detected, and optional change tracking. See the Apify Store page for the full output schema.

## Example output

```json
{
  "company_domain": "figma.com",
  "hiring_signal": true,
  "ats_platform": "greenhouse",
  "categories_searched": [
    "Engineering"
  ],
  "matched_role_count": 8,
  "signal_strength": "high",
  "top_matched_role": "Staff Engineer",
  "most_recent_posting_date": "2026-05-27",
  "run_date": "2026-05-28"
}
```

## Features

- Configurable role categories: GTM, Engineering, Finance, Operations, Executive, Custom
- User-defined keyword arrays for custom scanning
- Per-category counts via roles_by_category, with category-level signal scoring
- Same ATS cascade as the Hiring Signal Scraper

## Full actor documentation

This server is a thin client and holds no scanning logic. For the complete input and output reference, pricing, and run history, see the Apify Store page:

https://apify.com/mambalabs/job-board-keyword-signal-scanner

## Mamba Labs GTM Suite

This is one of six actors in the Mamba Labs GTM Suite, covering hiring signals, tech stack detection, signal aggregation, job board keyword scanning, LinkedIn URL resolution, and ICP scoring. See them all at https://apify.com/mambalabs.

## Related Mamba Labs MCP servers

The rest of the Mamba Labs GTM toolkit, each as its own MCP server:

- [Mamba Labs GTM Suite (all six tools)](https://github.com/mambalabsdev/mcp-gtm-suite)
- [GTM Hiring Signal Scraper](https://github.com/mambalabsdev/mcp-gtm-hiring-signal-scraper)
- [GTM Tech Stack Signal Enrichment](https://github.com/mambalabsdev/mcp-gtm-tech-stack-signal-scraper)
- [GTM Signals Aggregator](https://github.com/mambalabsdev/mcp-gtm-signals-aggregator)
- [Domain to LinkedIn URL Resolver](https://github.com/mambalabsdev/mcp-domain-to-linkedin-url-resolver)
- [ICP Fit Scorer](https://github.com/mambalabsdev/mcp-icp-fit-scorer)

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
