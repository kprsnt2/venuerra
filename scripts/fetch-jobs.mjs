#!/usr/bin/env node

/**
 * AI Job Finder for Venu Gopal Erra
 * Uses Vertex AI to query both Claude Opus 4.6 and Gemini 3.1 Pro
 * for curated job listings matching the profile.
 * 
 * Saves results as JSON to data/jobs.json for the website to render.
 * 
 * Environment variables required:
 *   GOOGLE_CLOUD_PROJECT         - GCP project ID
 *   GOOGLE_CLOUD_REGION_CLAUDE   - Region for Claude (e.g., us-east5)
 *   GOOGLE_CLOUD_REGION_GEMINI   - Region for Gemini (e.g., us-central1)
 *   GOOGLE_APPLICATION_CREDENTIALS_JSON - Base64 encoded service account key
 *   CLAUDE_MODEL_ID              - e.g., claude-opus-4-6@20250514 (default)
 *   GEMINI_MODEL_ID              - e.g., gemini-3.1-pro (default)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(BASE_DIR, 'data', 'jobs.json');

// Profile and prompt
import { PROFILE } from '../lib/profile-data.js';
import { buildJobSearchPrompt } from '../lib/job-search.js';

// Config
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || '';
const REGION_CLAUDE = process.env.GOOGLE_CLOUD_REGION_CLAUDE || 'us-east5';
const REGION_GEMINI = process.env.GOOGLE_CLOUD_REGION_GEMINI || 'us-central1';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL_ID || 'claude-opus-4-6@20250514';
const GEMINI_MODEL = process.env.GEMINI_MODEL_ID || 'gemini-3.1-pro';

/**
 * Set up GCP credentials from the base64-encoded JSON env variable
 */
function setupCredentials() {
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (credsJson) {
    const decoded = Buffer.from(credsJson, 'base64').toString('utf-8');
    const tmpPath = path.join(BASE_DIR, '.tmp-sa-key.json');
    fs.writeFileSync(tmpPath, decoded);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath;
    console.log('  ✅ Credentials set from GOOGLE_APPLICATION_CREDENTIALS_JSON');
    return tmpPath;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('  ✅ Using existing GOOGLE_APPLICATION_CREDENTIALS');
    return null;
  }
  console.log('  ⚠️  No credentials found, will use Application Default Credentials');
  return null;
}

/**
 * Generate job listings using Claude on Vertex AI (Anthropic API via Model Garden)
 */
async function generateWithClaude(prompt) {
  if (!PROJECT_ID) {
    console.log('  ⚠️  GOOGLE_CLOUD_PROJECT not set, skipping Claude');
    return null;
  }

  try {
    const { AnthropicVertex } = await import('@anthropic-ai/vertex-sdk');

    const client = new AnthropicVertex({
      projectId: PROJECT_ID,
      region: REGION_CLAUDE,
    });

    console.log(`  🟣 Calling Claude (${CLAUDE_MODEL}) on Vertex AI...`);

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    let text = response.content[0].text.trim();

    // Handle code fences
    if (text.startsWith('```')) {
      text = text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    }

    const result = JSON.parse(text);
    if (result?.jobs?.length > 0) {
      console.log(`  ✅ Claude found ${result.jobs.length} jobs`);
      result.model = CLAUDE_MODEL;
      return result;
    } else {
      console.log('  ⚠️  Claude response missing jobs');
      return null;
    }
  } catch (error) {
    console.error(`  ⚠️  Claude error: ${error.message}`);
    return null;
  }
}

/**
 * Generate job listings using Gemini on Vertex AI
 */
async function generateWithGemini(prompt) {
  if (!PROJECT_ID) {
    console.log('  ⚠️  GOOGLE_CLOUD_PROJECT not set, skipping Gemini');
    return null;
  }

  try {
    const { VertexAI } = await import('@google-cloud/vertexai');

    const vertexAI = new VertexAI({
      project: PROJECT_ID,
      location: REGION_GEMINI,
    });

    const model = vertexAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    console.log(`  🔵 Calling Gemini (${GEMINI_MODEL}) on Vertex AI...`);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response;
    let text = response.candidates[0].content.parts[0].text.trim();

    // Handle code fences
    if (text.startsWith('```')) {
      text = text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '').trim();
    }

    const parsed = JSON.parse(text);
    if (parsed?.jobs?.length > 0) {
      console.log(`  ✅ Gemini found ${parsed.jobs.length} jobs`);
      parsed.model = GEMINI_MODEL;
      return parsed;
    } else {
      console.log('  ⚠️  Gemini response missing jobs');
      return null;
    }
  } catch (error) {
    console.error(`  ⚠️  Gemini error: ${error.message}`);
    return null;
  }
}

/**
 * Merge new jobs with existing data, preserving any manual status updates
 */
function mergeWithExisting(newData, source) {
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
      const existingJobs = {};
      if (existing[source]?.jobs) {
        existing[source].jobs.forEach((j) => {
          existingJobs[j.id] = j;
        });
      }

      for (const job of newData.jobs || []) {
        if (existingJobs[job.id]) {
          const old = existingJobs[job.id];
          job.applied = old.applied || false;
          job.status = old.status || 'new';
        }
      }
      console.log(`  🔄 Merged with existing ${source} data (${Object.keys(existingJobs).length} existing jobs)`);
    }
  } catch (e) {
    console.log(`  ⚠️  Could not merge ${source}: ${e.message}`);
  }
  return newData;
}

/**
 * Verify job URLs are still active
 */
async function verifyJobs(jobs) {
  console.log('  🔎 Verifying job URLs...');
  let verified = 0;
  let failed = 0;

  for (const job of jobs) {
    const url = job.apply_url || '';
    if (!url || url === '#') {
      job.verified = false;
      failed++;
      continue;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timeout);
      job.verified = resp.status < 400;
      job.last_verified = new Date().toISOString().split('T')[0];
      if (job.verified) verified++;
      else {
        failed++;
        console.log(`    ⚠️  ${job.company} — HTTP ${resp.status}`);
      }
    } catch (e) {
      job.verified = false;
      job.last_verified = new Date().toISOString().split('T')[0];
      failed++;
    }
  }

  console.log(`  ✅ Verified: ${verified} active, ${failed} failed/unreachable`);
  return jobs;
}

/**
 * Main entry point
 */
async function main() {
  console.log('🔍 AI Job Finder — Venu Gopal Erra');
  console.log(`   Project: ${PROJECT_ID || '(not set)'}`);
  console.log(`   Claude region: ${REGION_CLAUDE}, Model: ${CLAUDE_MODEL}`);
  console.log(`   Gemini region: ${REGION_GEMINI}, Model: ${GEMINI_MODEL}`);

  const tmpKeyPath = setupCredentials();

  const prompt = buildJobSearchPrompt();

  // Run both models in parallel
  const [claudeResult, geminiResult] = await Promise.all([
    generateWithClaude(prompt),
    generateWithGemini(prompt),
  ]);

  if (!claudeResult && !geminiResult) {
    console.error('  ❌ Failed to generate with both Claude and Gemini');
    process.exit(1);
  }

  // Merge with existing data
  const claudeData = claudeResult
    ? mergeWithExisting(claudeResult, 'claude')
    : null;
  const geminiData = geminiResult
    ? mergeWithExisting(geminiResult, 'gemini')
    : null;

  // Verify job URLs
  if (claudeData?.jobs) {
    claudeData.jobs = await verifyJobs(claudeData.jobs);
  }
  if (geminiData?.jobs) {
    geminiData.jobs = await verifyJobs(geminiData.jobs);
  }

  // Build output
  const output = {
    lastUpdated: new Date().toISOString(),
    claude: claudeData || { model: CLAUDE_MODEL, generated_date: 'N/A', profile_summary: '', jobs: [] },
    gemini: geminiData || { model: GEMINI_MODEL, generated_date: 'N/A', profile_summary: '', jobs: [] },
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`  💾 Saved: ${OUTPUT_PATH}`);
  console.log(`  📊 Claude: ${claudeData?.jobs?.length || 0} jobs, Gemini: ${geminiData?.jobs?.length || 0} jobs`);

  // Clean up temp key
  if (tmpKeyPath && fs.existsSync(tmpKeyPath)) {
    fs.unlinkSync(tmpKeyPath);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
