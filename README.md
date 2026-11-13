# Katha Reels: daily Hindi mythology reels on Instagram (handover guide)

Read this first. It explains the whole system so any person or AI assistant can understand, run, fix or move it.
Everything lives on the `katha-reels` branch of github.com/divyanshu744/myupload.

## What it does
Every day it makes one new ~60-75 s vertical reel (1080×1920) telling a story of the gods from Hindu scriptures
(Puranas, Ramayana, Mahabharata, Upanishads), in Hindi, and posts it to Instagram **@divyanshu.koshta** at **1 PM IST**.
Everything is made in code: cut-paper style animation (canvas + headless Chrome), a free local AI voice
(Kokoro, Hindi voice `hm_omega`), Devanagari captions, procedural music, ffmpeg. No paid AI image/video tools.

## The owner's preferences (keep these)
- Hindi narration, Devanagari captions, exactly one red word per caption.
- Topics: mostly the **Ramayana**, mostly **little-known facts** (what Valmiki actually says vs popular versions).
- Always start with the hook: "क्या आप जानते हैं, कि …? नहीं? तो आइए, मैं बताता हूँ।"
- **Fast**: voice speed **1.5x** (1.0 and 1.15 were "boring"), short pauses, a new scene every 1.5-3 s.
- Every fact from a named scripture + chapter (listed in each project's `script.json` "sources"). Deities drawn with
  respect, no violence shown.
- Post automatically at 1 PM IST, no approval step. If anything fails, post nothing and report.

## How the automation runs (nothing runs on a laptop)
1. **Scheduled task "Daily Katha Reel"** on claude.ai (Claude Code → Scheduled), every day at 09:43 IST.
   It starts a fresh cloud session with this repo attached and the **Metricool** connector.
   It follows `DAILY.md`: picks the next unticked story in `STORIES.md`, writes the script, renders the reel,
   checks the frames, saves it to `reels/<date>-<slug>.mp4`, ticks the story, commits and pushes.
2. **Hosting**: the mp4 in this public repo is fetched by Metricool from
   `https://raw.githubusercontent.com/divyanshu744/myupload/katha-reels/reels/<file>.mp4`.
3. **Metricool** (brand `divyanshu.koshta`, blogId 7966124, timezone Asia/Calcutta) schedules it as an Instagram
   REEL for the NEXT day at 13:00 IST with auto-publish. So there is always one day of buffer.

## Files
| Path | What |
|---|---|
| `README.md` | this guide |
| `CLAUDE.md` | short note for Claude Code sessions |
| `DAILY.md` | the exact daily steps (the routine follows this) |
| `STORIES.md` | story queue; `[x]` = done with date. Add/reorder stories here |
| `.claude/skills/faceless-shorts/` | the video-making skill. Style used: `styles/katha/` (Hindi mythology). `SKILL.md` + `styles/katha/STYLE.md` explain the engine and kit |
| `projects/<slug>/` | each reel's source: `script.json` (narration, captions, sources) and `src/shots.js` (the animation) |
| `reels/` | finished reels (`.mp4`) and covers (`.jpg`), named by post date |

## Common tasks
- **Change stories**: edit `STORIES.md` on GitHub (branch `katha-reels`).
- **Change time / pause / stop**: claude.ai → Code → Scheduled → "Daily Katha Reel" (Show hidden) → edit or disable.
  Also change the hour in `DAILY.md` step 8 if the post time changes.
- **Check what's scheduled/posted**: Metricool → Planner (app.metricool.com).
- **Make a reel by hand**: open a Claude Code session with this repo and say "follow DAILY.md".
- **Run it in another AI tool**: give it this repo; it needs Node 22+, ffmpeg, Chrome, Python 3.10+;
  run `.claude/skills/faceless-shorts/scripts/setup.sh`, then follow `DAILY.md`. Posting needs Metricool access.

## Accounts involved
GitHub (divyanshu744), claude.ai (scheduled task + Metricool connector), Metricool (connected to Instagram
@divyanshu.koshta). Moving to a new laptop needs nothing: just log in to these.
