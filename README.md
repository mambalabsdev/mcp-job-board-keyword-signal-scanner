# Job Board Keyword Signal Scanner MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-job-board-keyword-signal-scanner)](https://smithery.ai/servers/mambabuilt/mcp-job-board-keyword-signal-scanner) [![Glama score](https://glama.ai/mcp/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner/badges/score.svg)](https://glama.ai/mcp/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner) [![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0%2Fservers%3Fsearch%3Dcom.mambabuilt%252Fmcp-job-board-keyword-signal-scanner%26limit%3D1&query=%24.servers%5B0%5D._meta%5B%22io.modelcontextprotocol.registry%2Fofficial%22%5D.status&label=mcp%20registry&color=blue)](https://registry.modelcontextprotocol.io/v0/servers?search=com.mambabuilt/mcp-job-board-keyword-signal-scanner&limit=1) [![npm version](https://img.shields.io/npm/v/@mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://www.npmjs.com/package/@mambalabsdev/mcp-job-board-keyword-signal-scanner) [![npm downloads](https://img.shields.io/npm/dm/@mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://www.npmjs.com/package/@mambalabsdev/mcp-job-board-keyword-signal-scanner) [![license](https://img.shields.io/github/license/mambalabsdev/mcp-job-board-keyword-signal-scanner)](https://github.com/mambalabsdev/mcp-job-board-keyword-signal-scanner/blob/main/LICENSE) [![mcpservers.org](https://img.shields.io/badge/mcpservers.org-listed-blue)](https://mcpservers.org/servers/mambalabsdev/mcp-job-board-keyword-signal-scanner)

An MCP server that scans a company's job board for the roles you care about. It wraps the Mamba Labs Job Board Keyword Signal Scanner actor on Apify and returns a Clay-ready flat JSON row to any MCP client.

## What's Inside

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [Prerequisites](#prerequisites)
- [Example prompts](#example-prompts)
- [Inputs](#inputs)
- [Output](#output)
- [Example output](#example-output)
- [Features](#features)
- [How each call runs](#how-each-call-runs)
- [Full actor documentation](#full-actor-documentation)
- [Mamba Labs GTM Suite](#mamba-labs-gtm-suite)
- [License](#license)

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

Every input the tool accepts, generated from the server's own tool list.

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `company_domain` | string | yes | Bare company domain without https:// and without a trailing slash. Example: stripe.com |
| `role_categories` | array of `GTM`, `Engineering`, `Finance`, `Operations`, `Executive`, `Marketing`, `HR`, `CustomerSuccess`, `Data`, `Product`, `Legal`, `Design`, `Custom` | yes | One or more role categories to scan for. Twelve categories plus Custom, which is used together with custom_keywords. Matching on the actor side is case insensitive and ignores separators, so customer_success and Customer Success both reach CustomerSuccess, and sales resolves to GTM. |
| `custom_keywords` | array of string | no | Keyword strings to match when Custom is included in role_categories. Required only if Custom is requested. |
| `enable_fallback` | boolean | no | If true, falls back to a pre-indexed job database when the live ATS cascade finds nothing. |
| `previous_roles_detected` | string | no | Comma-separated matched role titles from a previous run, used to compute newly added or removed roles. |
| `previous_run_date` | string | no | ISO date of the previous run, e.g. 2026-03-15. Used for tracking changes over time. |

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

## How each call runs

Each call starts the actor run, polls it until it finishes, then reads the dataset. The run is allowed 1,800 seconds. If the run is still going when this call stops waiting, the call returns the run id and a console link instead of a timeout, so the result is never lost.

## Full actor documentation

This server is a thin client and holds no scanning logic. For the complete input and output reference, pricing, and run history, see the Apify Store page:

https://apify.com/mambalabs/job-board-keyword-signal-scanner

---

## Mamba Labs GTM Suite

This server is one of 54 Mamba Labs MCP servers, each backed by a dedicated Apify actor and published under [@mambalabsdev on npm](https://www.npmjs.com/org/mambalabsdev). The ones closest to this server:

| Actor | Immutable Actor ID |
|---|---|
| [GTM Hiring Signal Scraper](https://apify.com/mambalabs/gtm-hiring-signal-scraper) | `D7O1SA2EqwHGsGr1P` |
| [Tech Stack Signal Detector](https://apify.com/mambalabs/gtm-tech-stack-signal-scraper) | `qyd7nNyqFPelQViBx` |
| [GTM Signals Aggregator](https://apify.com/mambalabs/b2b-buying-signals-hiring-tech-stack-intent-for-clay) | `xKdRfnfFNkdMpFuNs` |
| [Job Board Keyword Signal Scanner](https://apify.com/mambalabs/job-board-keyword-signal-scanner) | `4DvqpvhMR74NLcDDY` |
| [Domain to LinkedIn URL Resolver](https://apify.com/mambalabs/domain-to-linkedin-url-resolver) | `3HtnSaqPHOg1Qg5gx` |
| [ICP Fit Scorer](https://apify.com/mambalabs/icp-account-lead-scoring-fit-scorer-0-100-for-clay) | `W161DT8W4kW55dMFh` |
| [Domain Deliverability Checker](https://apify.com/mambalabs/domain-deliverability-checker) | `0tVgxI7A6o9jMlxmc` |
| [Company Firmographic Enricher](https://apify.com/mambalabs/company-firmographic-enricher) | `YlUtLWjfPpqykmB8g` |
| [Company Social Presence Mapper](https://apify.com/mambalabs/company-social-presence-mapper) | `4k6CCemkgBDz18m2h` |
| [Company Identity Resolver](https://apify.com/mambalabs/company-identity-resolver) | `lr8fTRAmZCBZmuwwh` |
| [Company Change Event Feed](https://apify.com/mambalabs/company-change-event-feed) | `oX44rS0fkEJ3rXLWe` |
| [Funding and Press Signal Scanner](https://apify.com/mambalabs/funding-press-signal-scanner) | `FS13X6dhQVgX3XOM6` |

To get twenty one of them in one install, use [@mambalabsdev/mcp-gtm-suite](https://www.npmjs.com/package/@mambalabsdev/mcp-gtm-suite).

> Built by [Mamba Labs](https://mambabuilt.com) | [npm](https://www.npmjs.com/org/mambalabsdev) | [Apify Store](https://apify.com/mambalabs)

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
