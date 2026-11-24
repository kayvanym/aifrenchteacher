# 🇫🇷 My French teacher

A personal French course run by Claude. Every morning a new interactive lesson page is
created in `days/` and published with GitHub Pages.

- **Instructions for the teacher:** `CLAUDE.md`
- **My progress:** `progress/` (log, vocabulary, mistakes, level checks, feedback)
- **Lessons:** open the GitHub Pages site → `index.html`

## Setup (once)
1. Create a GitHub repository (e.g. `french-teacher`) and upload all these files.
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
3. Connect the repository in Claude Code and create a daily scheduled task with the prompt in
   `prompts/daily-task.md`.

## Daily routine
1. Open today's page, do all sections (15–20 min).
2. Press **Send to my teacher** at the bottom of the page, then **Submit** on GitHub.
3. For speaking/writing practice, start a session connected to this repository
   (claude.ai/code or the Code tab in the desktop app → choose `kayvanym/aifrenchteacher`
   in the repository selector) and say "Bonjour ! Let's have a lesson."
   You can type, dictate or use voice mode. Your progress is saved automatically during the lesson.

## Starting a lesson
- **Chat (Project "My French teacher")** — best for voice practice. Start with:
  *"Attach my repository kayvanym/aifrenchteacher and be my French teacher."*
  The chat then reads `CLAUDE.md` and saves progress to GitHub itself. If it can't reach GitHub
  (e.g. in voice mode), say "fin de la leçon" and send the summary with the link it gives you.
- **Claude Code** (claude.ai/code or the desktop Code tab, repository `kayvanym/aifrenchteacher`) —
  best for writing lessons and for changing the teacher. Progress is saved automatically.
