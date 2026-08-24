# Pranshu Thakkar Portfolio

A terminal-inspired developer portfolio built with Java + Spring Boot, with a static GitHub Pages version for public hosting.

## Live Site

- https://pranshu1606.github.io/

## Highlights

- Terminal-style UI with boot screen interaction
- Multi-section portfolio (Home, Projects, Tech Stack, Resume, Contact)
- Command-style prompt experience (`help`, `about`, `projects`, `skills`, `contact`, `date`, `clear`)
- Dedicated static deployment folder for GitHub Pages

## Tech Stack

- Java 17
- Spring Boot 3.3.5
- Gradle
- HTML, CSS, JavaScript

## Project Structure

```text
src/main/resources/static/   -> Spring Boot-served frontend assets
src/main/java/               -> Spring Boot backend entrypoint
github-pages/                -> Standalone static site (separate Git repo)
```

## Run Locally (Spring Boot)

### Windows (PowerShell)

```powershell
./gradlew.bat bootRun
```

### macOS/Linux

```bash
./gradlew bootRun
```

Then open:

- http://localhost:8080

## Build JAR

```powershell
./gradlew.bat clean build
```

Output JAR will be available under:

- build/libs/

## GitHub Pages Deployment (Current Setup)

This project uses the `github-pages/` folder as a separate Git repository connected to:

- https://github.com/pranshu1606/pranshu1606.github.io

To publish updates:

```powershell
git -C github-pages add .
git -C github-pages commit -m "Update portfolio site"
git -C github-pages push origin main
```

Your user site is served from the `main` branch of `pranshu1606.github.io`.

## Notes

- The Spring Boot app and GitHub Pages site are intentionally decoupled.
- For GitHub Pages compatibility, static assets in `github-pages/index.html` should use relative paths (`./styles.css`, `./app.js`, etc.).
