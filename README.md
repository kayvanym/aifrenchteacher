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
2. Press **Copy my results** and paste the text into `progress/feedback.md`.
3. For speaking/writing practice, start a session in Claude Code in this repository and say
   "Bonjour ! Let's have a lesson." End with "update my log".
