# CLAUDE.md — Development Workflow Guide

This file defines the mandatory workflow for all AI-assisted development on the Reever project (river navigation for boats).

## Project Overview

Reever is a full-stack web application for river navigation for boats. The tech stack is not yet finalized; all workflow rules below are language- and framework-agnostic.

## Mandatory Workflow

Every change MUST follow these steps in order. No step may be skipped.

### 1. Plan First

Before writing or modifying any code, present a plan that includes:

- **What** is being changed and why.
- **Which files** will be created or modified.
- **How** it fits into the existing architecture.
- **What risks or trade-offs** exist.

Wait for approval before proceeding. Do not write code before the plan is accepted.

### 2. Write Specs Before Code

Before any implementation, write a specification that defines:

- **Requirements**: what the feature or fix must accomplish.
- **Acceptance criteria**: concrete, testable conditions for success.
- **Edge cases**: known boundary conditions and error scenarios.
- **API contracts** (if applicable): inputs, outputs, status codes, error shapes.

Specs live in the `specs/` directory at the project root (create it if it does not exist). Use Markdown files named descriptively (e.g., `specs/user-authentication.md`).

### 3. Write Tests Before Implementation

After the spec is written, write tests BEFORE writing the implementation code:

- **Unit tests** for individual functions, modules, or components.
- **Integration tests** for interactions between modules or services.
- **End-to-end (e2e) tests** for critical user-facing workflows.

Tests must directly reflect the acceptance criteria from the spec. Every acceptance criterion must have at least one corresponding test.

### 4. Implement the Code

Write the minimum code necessary to satisfy the spec and pass the tests. Follow existing project conventions for structure, naming, and style.

### 5. Run ALL Tests

After implementation, run the full test suite — not just the new tests. Check the project root for a `Makefile`, `package.json`, `Cargo.toml`, `pyproject.toml`, or equivalent to find the correct test command. Run linters and type checks in addition to tests if they are configured.

### 6. Iterate Until Green

If any test fails:

1. Read the failure output carefully.
2. Identify the root cause (do not guess).
3. Fix the code (not the test, unless the test itself is wrong).
4. Re-run ALL tests.
5. Repeat until every test passes.

Do NOT move on, commit, or declare the task complete until the full test suite is green.

### 7. Maintain .gitignore

Before committing, verify that `.gitignore` is up to date:

- New dependency directories (e.g., `node_modules/`, `venv/`, `target/`) must be listed.
- Build output directories must be listed.
- Environment and secret files (`.env`, `.env.*`) must be listed.
- OS and IDE artifacts must be listed.
- Only source code, configuration, specs, tests, and documentation should be versioned.

If you introduce a new tool, framework, or build system, update `.gitignore` in the same commit.

## Commit Conventions

- Write clear, descriptive commit messages.
- Keep commits focused: one logical change per commit.
- Do not commit generated files, build artifacts, secrets, or dependencies.

## Directory Structure

As the project grows, maintain a clean structure. At minimum:

```
Reever/
  CLAUDE.md
  README.md
  LICENSE
  .gitignore
  specs/           # Specifications and requirements
  src/             # Application source code
  tests/           # Test files (mirrors src/ structure where applicable)
```

Adapt subdirectories to the chosen tech stack, but keep specs and tests clearly separated from source code.
