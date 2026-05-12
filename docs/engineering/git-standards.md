# Git & Collaboration Standards

To maintain a clean and searchable history, we follow strict Git conventions.

## 1. Commit Messages

We follow the **Conventional Commits** specification.

**Format:** `<type>(<scope>): <description>`

### Types
- `feat`: A new feature for the user.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.

### Examples
- `feat(mobile): add passkey login support`
- `fix(server): resolve race condition in ticket sync`
- `docs(api): update event schema definition`

---

## 2. Branch Naming

Branches should be descriptive and prefixed with the type of change.

**Format:** `<type>/<short-description>`

- `feat/passkey-auth`
- `fix/map-flicker`
- `refactor/geo-service`

---

## 3. Pull Request (PR) Guidelines

Before opening a PR, ensure:
1.  The code builds locally (`pnpm run build`).
2.  Tests pass (`pnpm test`).
3.  The code is formatted (`pnpm run format`).

### PR Description Template
A good PR description should include:
- **Summary**: What does this PR do?
- **Related Issues**: Link to relevant tasks or specs.
- **Testing Done**: How did you verify these changes?
- **Screenshots/Videos**: Required for UI changes.

---

## 4. Code Review Process

- All PRs require at least one approval from a maintainer.
- Reviewers focus on architectural alignment, security, and the [Coding Standards](./coding-standards.md).
- Use "Nitpick" for minor styling issues that shouldn't block the PR.
