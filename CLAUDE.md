# Working on this site

Liam Haydon's portfolio, live at https://liamhaydon.github.io. Plain HTML and CSS, no build step, hosted on GitHub Pages from the `main` branch. This file tells an AI assistant (or a person) how to change the site without breaking its patterns.

## Files

```
index.html                  Home: contour-map cover, one "chapter" per project with a live demo, about, contact
projects/<slug>.html        One page per project, all on the same template
assets/css/style.css        The only stylesheet ("Field Notes" style). Tokens at the top, then one block per pattern
assets/js/site.js           Homepage only: live demos and the Boulder clock
assets/img/, assets/video/  Project images and screen recordings; contours.svg is the cover art
assets/favicon.svg          The LH mark (browser tab icon)
assets/Liam-Haydon-Resume.pdf
llms.txt                    Plain-text summary of the site for AI readers
sitemap.xml, robots.txt     For search engines
sql/                        SQL shown on the Contoso page, as runnable files
```

## Rules

1. **Liam approves before anything is published.** Preview locally, show him, then commit and push.
2. **Keep it lean.** No frameworks, no outside scripts, no new fonts (Source Serif 4 + system sans only). One stylesheet. If a new pattern is needed, add it to `style.css` once and reuse it; do not put `<style>` blocks or one-off classes in pages.
3. **Use the tokens.** Colors, fonts and widths come from the variables at the top of `style.css`. Light and dark mode both come from those variables, so never hard-code a color in a page.
4. **Only say what is true.** Every number on a project page comes from Liam's own work. Do not round up, add results, or claim something was verified unless it was.
5. **Voice.** First person, plain words, a student who is still learning. Say what Liam did and found. Do not speak for employers ("companies want…").
6. **When the stylesheet changes,** raise the version in every page's stylesheet link (`style.css?v=12` → `?v=13`) so visitors get the new file.

## Add a project

1. Copy `projects/fair-ml-risk-audit.html` to `projects/<new-slug>.html`. It is the simplest example of the template.
2. Fill in, in order: the `<head>` (title, description, canonical URL, `og:` tags, JSON-LD), the header (`.kicker`, `<h1>`, `.lead`, `.facts`), then the sections.
3. Findings go in `<article class="finding">` inside `<div class="findings">`. They number themselves. Add `class="findings grid"` for two columns when every finding has an image.
4. Key numbers go in `<ul class="stats"><li><b>64.7%</b>Label</li></ul>`.
5. End with the "How this applies to your role" section (`.three`) and the `.next` links. Update the `.next` link on the project that used to be last so the pages still form a loop.
6. On `index.html`, copy a chapter `<section>` to the top of the work (newest first) and renumber the `No.` kickers. Each chapter has a question as its title, one result in `.result`, a `.tools` line, and a demo.
7. To give it a live demo, add a builder to `assets/js/site.js` (see `demoAI`) using only numbers from the project page, then mount it with `<div data-demo="name"></div>`.
8. Add the project to `llms.txt` and `sitemap.xml`.

## Preview and publish

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Check the page at desktop width, at phone width (375px), and in dark mode. Then commit to `main` and push; GitHub Pages rebuilds in about a minute.

## Known gaps

- The two SQL queries on the Contoso page were tested on sample data, not yet run against the real Contoso database.
- The `ai-analyst-eval` code repository is private, so the project page does not link to it.
