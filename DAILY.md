# Daily routine: one new Katha reel on Instagram (@divyanshu.koshta) at 1 PM IST

The owner wants: Hindi narration, Devanagari captions, ~90-120 s, stories of the gods from Hindu scriptures,
hook first ("क्या आप जानते हैं, कि …? नहीं? तो आइए, मैं बताता हूँ।"), FAST pace (owner said 1.15 felt slow and boring):
voice `"speed": 1.5, "lead": 0.2, "gap": 0.12, "outro": 1.0` (the owner approved 1.5x on the Ganesh reel), no line gap above 0.15,
a new cut every 1.5-3 s, ~60-75 s total (~250-280 words, tight script, no filler sentences), posted automatically at 13:00 IST.
Do not ask the owner anything during this routine: use these defaults. If something fails, stop and report it.

## Steps
1. Setup: `CHROME=/opt/pw-browsers/chromium bash .claude/skills/faceless-shorts/scripts/setup.sh` (Whisper may fail on
   the network: that's fine, words.py falls back to line times). Read `.claude/skills/faceless-shorts/SKILL.md` and
   `styles/katha/STYLE.md` + `styles/paper-atlas/STYLE.md` in full, and `projects/samudra-manthan/src/shots.js` as the model.
2. Pick the first unticked story in `STORIES.md`. `D` = TOMORROW's date in IST (YYYY-MM-DD): each run makes the next day's reel,
   so there is always a one-day buffer. If Metricool already has an Instagram post scheduled on D, use the next free day.
3. `bash .claude/skills/faceless-shorts/scripts/new_video.sh katha <slug> --dir projects`, write `script.json`
   (2 hook lines + story, ~280-300 words, sources with chapter refs, one crimson word per caption), voice.py, words.py.
4. Write `src/shots.js` (reuse the kit: person/VISHNU/SHIVA/…; add new beings/props in the same cut-paper look).
   `node tools/capture.mjs check` → CHECK OK. QA with `sheet review/all.jpg 1 14` and key frames: read them, fix
   anything wrong (wrong scene for the line, overlaps with the caption strip, empty frames, unreadable slips).
5. `node tools/capture.mjs cues`, `tools/mix.py .`, `node tools/capture.mjs video renders/<slug>.mp4`.
   Copy to `reels/D-<slug>.mp4` and a cover frame to `reels/D-<slug>.jpg`. Keep each mp4 under 45 MB
   (else re-encode: `ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 160k -movflags +faststart out.mp4`).
   Don't commit `projects/*/data/*.wav`, `renders/` or `review/` (see .gitignore).
6. Tick the story in `STORIES.md` with the date, commit, `git push origin katha-reels`.
7. Check `https://raw.githubusercontent.com/divyanshu744/myupload/katha-reels/reels/D-<slug>.mp4` returns 200.
8. Metricool: `getBrandSettings` (brand label divyanshu.koshta, blogId 7966124, timezone Asia/Calcutta), then
   `createScheduledPost` for D 13:00 Asia/Calcutta:
   providers instagram, instagramData {type: "REEL", showReelOnFeed: true, isAiGenerated: true}, media [the raw URL],
   videoThumbnailUrl the raw .jpg URL, autoPublish true, text = Hindi caption (2-3 lines: hook question + one line of the
   story + 🙏) + 6-8 hashtags (#HinduMythology #SanatanDharma #<story> …).
9. Report: story, length, the GitHub link and Metricool plannerUrl.
