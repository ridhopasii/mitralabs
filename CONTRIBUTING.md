# Contributing to Mitralabs.id

Terima kasih atas minat Anda untuk berkontribusi pada proyek Mitralabs.id! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

Proyek ini mengikuti prinsip:
- **Respect**: Hormati semua kontributor
- **Collaboration**: Bekerja sama dengan baik
- **Quality**: Prioritaskan kualitas code
- **Learning**: Belajar dan berbagi pengetahuan

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork repository di GitHub
# Clone fork Anda
git clone https://github.com/YOUR_USERNAME/mitralabs-web.git
cd mitralabs-web

# Add upstream remote
git remote add upstream https://github.com/mitralabs/mitralabs-web.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Setup database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

### 3. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

## 💻 Development Workflow

### Branch Naming Convention

- `feature/` - Fitur baru (e.g., `feature/add-search`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-images`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `test/` - Testing (e.g., `test/add-unit-tests`)
- `chore/` - Maintenance (e.g., `chore/update-deps`)

### Development Process

1. **Write Code**: Implement your feature/fix
2. **Test Locally**: Ensure everything works
3. **Run Tests**: `npm test`
4. **Run Linter**: `npm run lint`
5. **Commit Changes**: Follow commit guidelines
6. **Push Branch**: `git push origin feature/your-feature-name`
7. **Create PR**: Open pull request di GitHub

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  // Implementation
};

// ❌ Bad
const getUser = async (id: any) => {
  // No type safety
};
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ Bad - No types, unclear props
export default function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### File Naming

- **Components**: PascalCase (e.g., `Navbar.tsx`, `BlogCard.tsx`)
- **Utilities**: camelCase (e.g., `supabase.ts`, `utils.ts`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Types**: PascalCase (e.g., `types.ts`, `interfaces.ts`)

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes untuk strings
- **Semicolons**: Required
- **Line Length**: Max 100 characters
- **Trailing Commas**: Yes

### CSS/Tailwind

```tsx
// ✅ Good - Organized classes
<div className="flex items-center justify-between gap-4 px-6 py-4 bg-white rounded-xl shadow-lg">

// ❌ Bad - Unorganized, hard to read
<div className="bg-white flex px-6 shadow-lg items-center py-4 gap-4 rounded-xl justify-between">
```

**Class Order**:
1. Layout (flex, grid, block)
2. Positioning (relative, absolute)
3. Sizing (w-, h-, max-, min-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-)
6. Colors (bg-, text-, border-)
7. Effects (shadow-, opacity-, transition-)

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(blog): add search functionality"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(components): optimize image loading"
git commit -m "test(utils): add unit tests for helpers"

# Bad commits
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Commit Best Practices

- **Atomic commits**: One logical change per commit
- **Clear messages**: Describe what and why, not how
- **Present tense**: "add feature" not "added feature"
- **Imperative mood**: "fix bug" not "fixes bug"

## 🔄 Pull Request Process

### Before Creating PR

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation updated (if needed)
- [ ] Commits are clean and descriptive
- [ ] Branch is up to date with main

### PR Title Format

```
<type>: <description>

Examples:
feat: Add search functionality to blog
fix: Resolve login redirect issue
docs: Update setup guide
refactor: Optimize image loading
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: PR gets approved
5. **Merge**: Maintainer merges PR

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15 Jan 2024');
  });

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });
});
```

### Test Coverage

- **Unit Tests**: Test individual functions
- **Component Tests**: Test React components
- **Integration Tests**: Test feature workflows
- **Minimum Coverage**: 70%

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test utils.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want

**Describe alternatives you've considered**
Alternative solutions

**Additional context**
Mockups, examples, etc.
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🙏 Thank You!

Terima kasih telah berkontribusi pada Mitralabs.id! Setiap kontribusi, sekecil apapun, sangat berarti bagi kami. 🚀

---

**Questions?** Hubungi kami di hello@mitralabs.id
