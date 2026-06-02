# Job Board Keyword Signal Scanner MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-job-board-keyword-signal-scanner)](https://smithery.ai/servers/mambabuilt/mcp-job-board-keyword-signal-scanner)

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

## Full actor documentation

This server is a thin client and holds no scanning logic. For the complete input and output reference, pricing, and run history, see the Apify Store page:

https://apify.com/mambalabs/job-board-keyword-signal-scanner

## Mamba Labs GTM Suite

This is one of six actors in the Mamba Labs GTM Suite, covering hiring signals, tech stack detection, signal aggregation, job board keyword scanning, LinkedIn URL resolution, and ICP scoring. See them all at https://apify.com/mambalabs.

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
