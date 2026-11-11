# Katha: Hindu scripture stories in Hindi, cut paper, 9:16

Devotional storybook in the Paper Atlas look (cut paper on parchment, gold ribbons, crimson key words), narrated in
**Hindi** with Devanagari captions. For stories of the gods from the Puranas, Ramayana and Mahabharata.
Example: `example/` = **समुद्र मंथन: विष से अमृत तक** (Samudra Manthan; 113 s, 37 shots). Sheet: `style-sheet.png`.
Engine, kit and caption strip are Paper Atlas's (read `../paper-atlas/STYLE.md` too); this file lists what's different.

## 1. Rules
- **Length:** reels of 90-120 s are normal here (~280-300 Hindi words at speed 1.15). One line = one cut, 2-5 s.
- **Hook first (always).** Line 0-1 = a question + "नहीं? तो आइए, मैं बताता हूँ।" e.g. "क्या आप जानते हैं, कि भगवान
  शिव का कंठ नीला क्यों है?" Pick the most surprising fact of the story for the question. Hook shots get ids H0, H1;
  the story shots use `OFF = 2` in `shots.js` so `at(i)` / `w(word, i)` count story lines from 0.
- **Pace:** `"speed": 1.15, "lead": 0.3, "gap": 0.25` (the user found 1.0 boring). End with a one-line lesson (सीख) that loops.
- Voice `hm_omega` (Hindi male; also hm_psi, hf_alpha, hf_beta). Music `"bed"`.
- Deities drawn simply and respectfully: no faces, halos for divine figures, no violence shown (tell it with objects).
- Sources: name the scripture + chapter for every event in `script.json` "sources"; mark popular/folk additions as such.
- Captions: Noto Serif Devanagari 800 on the torn strip, 1-3 words, exactly ONE crimson word (`*`) per caption, words
  exactly as spoken.

## 2. Kit additions (in `example/src/shots.js`)
- `person({ ...VISHNU|SHIVA|DEVA|ASURA|INDRA|SAGE|LAKSHMI|PARVATI|MOHINI, x, y, h, dir, arm, back, arms4, halo, throat,
  hold/holdBack/holdUp1/holdUp2: (hx, hy) => draw item, sari, bob, walk })`; `arm(px, py, deg, col)` returns the hand point.
- Items: `chakra, shankh, trishul, kalash(x,y,s,glow,t), garland, petals, lotus, glow, sparkles`.
- Beings/places: `elephant` (Airavata), `cow` (Kamadhenu), `horse`, `tree` (Kalpavriksha), `tortoise` (Kurma), `snake`,
  `coils`, `mountain`, `palace`, `poisonCloud`, `cloud`, `ocean(t, y0, mid, swirl)`, `skyPage`, `cloudGround`, `churn`.

## 3. Hindi pipeline notes (already patched in scripts/)
- `voice.py`: voices starting with `h` use `lang='hi'`; `।` ends a sentence.
- `words.py`, `timing.js`, `captions.js`: word matching is Unicode-aware (Devanagari works with `Wd('शिव', 3)`).
- Whisper small.en is English-only; for Hindi the words are spread inside the exact TTS line times (fine for captions).
- Fonts: `fonts/NotoSerifDeva-*.woff2` registered as `NotoDeva` in index.html and loaded in main.js; kit `SERIF = 'NotoDeva'`.

## 4. QA pitfalls we've hit
- The slip's red pin covered the Devanagari headline: slips are taller now, pin in the corner.
- An arrow with p = 0 still drew its head: return early when p is ~0.
- A lesson card that pops everything on later words opens blank: show the first element at once.
