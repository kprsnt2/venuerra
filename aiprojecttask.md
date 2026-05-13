# Neuro-Logistics Project Checklist

## Phase 1: Data Engineering & GCP Setup
- [ ] Set up GCP Project (BigQuery, Pub/Sub, Cloud Run)
- [ ] Create BigQuery Datasets and GIS Tables
- [/] Develop Python ingestion script: Global News & Events (RSS Feeds)
- [ ] Develop Python ingestion script: Global Weather & Maritime (NOAA/AIS simulators)
- [ ] Build data pipeline: route JSON payloads from Pub/Sub to BigQuery

## Phase 2: AI Engineering & Big Compute (192GB VRAM)
- [ ] Set up local/cloud inference script to process daily news batches
- [ ] Prompt engineer an LLM to extract "Logistics Threat Levels", "Locations", and "Affected Assets"
- [ ] Write a script to update BigQuery records with the AI-parsed risk scores and summaries
- [ ] (Optional) Fine-tune a quantized Llama-3 model specifically for logistics named entity recognition

## Phase 3: Data Analytics & 3D Visualization
- [ ] Initialize frontend application (Next.js / FastAPI backend)
- [ ] Integrate Deck.gl / Kepler.gl for 3D Earth visualization
- [ ] Create API endpoints to serve BigQuery data to the frontend
- [ ] Build the God-Mode dashboard (Risk panels, AI summaries, geographic heatmaps)

## Phase 4: Final Polish & Portfolio Assets
- [ ] Document the architecture (Draw.io / Excalidraw)
- [ ] Record a video demonstration showcasing the Data -> AI -> Dashboard flow
