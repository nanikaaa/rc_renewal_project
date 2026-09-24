# nrc_company: GitHub workflow


## 1. Before starting a new task

Check that you have no uncommitted work. If `git status` lists changes, commit them on the appropriate branch or set them aside before switching branches.

```bash
git status
git switch main
git pull origin main
```

Do your work on that branch; do not commit directly to `main`.


The `git pull` command for the feature branch assumes you have already pushed that branch to `origin`. If the branch only exists on your computer, skip that line. If Git reports a conflict or says a pull cannot fast forward, resolve it before making more changes; do not force push over someone else's work.

## 3. Save your work and push the branch

After making your changes, review what you are about to commit. Run the project's relevant checks, then commit and push.

```bash
git status
git add .
git commit -m "Describe the change briefly"
git push -u branch-name
```

Check the staged diff before committing so that private or unrelated files are not included. Use the same branch name you created in step 1. For later commits on the same branch, use `git push`.

## 4. Check for conflicts, then open a pull request

When your working tree is clean, bring in any changes merged into `main` since you started. Resolve reported conflicts and confirm your section still loads and works with the other sections before requesting review.

```bash
git status
git fetch origin
git merge origin/main
git diff --check origin/main...HEAD
git push
```

Review the changed files in your branch with `git diff --name-only origin/main...HEAD`. 
Check open pull requests on GitHub for work that touches the same files; Git cannot detect a conflict with another branch until those changes are brought together. 
If `git merge` stops on a conflict, resolve it, finish the merge, and test before pushing.

On GitHub, open the repository, select **Compare & pull request** for your pushed branch, and set the base branch to `main`. Add a clear title and a short description of your changes and checks. In the **Reviewers** section, choose the person who should review it, then select **Create pull request**. Share the pull request link with your team.


## 5. Ask for review and merge in Slack

After opening the pull request, post its actual URL in the project's Slack channel and ask the team to review and merge it once approved. If another open pull request changes the same shared files, mention the overlap so the team can agree on the merge order.

## Where to add a new section

Follow the existing folder structure shown in this project. Keep each section's markup, styling, and behavior in separate files:

| Part | Location | Example for a new FAQ section |
| --- | --- | --- |
| HTML fragment | `sections/` | `sections/faq.html` |
| Section styles | `assets/css/sections/` | `assets/css/sections/faq.css` |
| Section behavior, if needed | `assets/js/sections/` | `assets/js/sections/faq.js` |

Use `assets/css/components/` and `assets/js/components/` for reusable components. Before adding a section, inspect `index.html`, `assets/css/main.css`, `assets/js/script.js`, and the loaders in `assets/js/core/` to see how existing sections are included. Register the new HTML, CSS, and JavaScript using those existing patterns. Keep section-only selectors and variables scoped to the section, use unique IDs, and check that event listeners run after the section's HTML loads. Do not put a whole new section directly into a shared file if it has a dedicated section file.

Check GitHub's open pull requests and coordinate with anyone editing the same section or shared entry files. Changes to `index.html`, `assets/css/main.css`, `assets/js/script.js`, and `assets/js/core/` can overlap with other work even when each person has separate section files.
