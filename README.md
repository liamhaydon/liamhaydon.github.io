# Liam Haydon · Portfolio

A hand-built HTML/CSS portfolio site for GitHub Pages. No build step and no framework.

```
index.html                              Home: hero, about, projects, skills, contact
projects/contoso-retail-analytics.html  SQL + Power BI case study
assets/css/style.css                    All styling (light + dark mode)
assets/img/                             Power BI screenshots (from the INFO 3402 deck)
sql/                                    The three queries as runnable .sql files
INTERVIEW-PREP.md                       Talking points for every query (not linked from the site)
```

## Before you publish: fill in the TODOs

Search the project for `TODO` / `YOUR-` and replace:

- [x] LinkedIn (linkedin.com/in/liamhaydon)
- [x] GitHub (liamhaydon) and email
- [ ] `assets/Liam-Haydon-Resume.pdf`: drop your résumé in with this name
- [ ] Headshot (optional): `assets/img/headshot.jpg`, then swap the "LH" avatar in `index.html`
- [ ] About: drafted from LinkedIn. Add graduation date and target roles, and reword it in your own voice
- [ ] Run each query in `sql/` on the real Contoso database and paste the results and one insight into the case study
- [ ] Add the remaining Power BI pages once they're finished (export each visual as a PNG into `assets/img/`)
- [ ] Record a 2-minute walkthrough (Shift-⌘-5 on a Mac) and embed it
- [ ] Rewrite "What I learned" in your own voice

## Publish on GitHub Pages (about 5 minutes)

1. Create a **public** repo named exactly `liamhaydon.github.io`.
2. Upload every file in this folder (drag and drop on github.com works), or from Terminal:
   ```bash
   git init && git add . && git commit -m "Initial portfolio" && git branch -M main
   git remote add origin https://github.com/liamhaydon/liamhaydon.github.io.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / root.
4. After a minute or so the site is live at `https://liamhaydon.github.io`.

Remove `INTERVIEW-PREP.md` before pushing if you don't want it public.

## Preview locally

```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## SQL dialect note

The queries are written in **SQL Server (T-SQL)**. If your class database is SQLite, replace `YEAR(OrderDate)` with
`CAST(strftime('%Y', OrderDate) AS INT)` and `MONTH(OrderDate)` with `CAST(strftime('%m', OrderDate) AS INT)`. Everything else runs unchanged.
For PostgreSQL, use `EXTRACT(YEAR FROM OrderDate)` and `EXTRACT(MONTH FROM OrderDate)`.
