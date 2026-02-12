# Contributing to BusSure

Thank you for your interest in contributing to the Intercity Bus Refund Transparency System! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs
- Check if the bug has already been reported in the Issues section
- If not, create a new issue with a clear title and description
- Include steps to reproduce the bug
- Add screenshots if applicable

### Suggesting Enhancements
- Open an issue with the "enhancement" label
- Clearly describe the feature and its benefits
- Explain why this enhancement would be useful

### Pull Request Process

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** ensuring code quality:
   - Follow the existing code style
   - Write clear, concise commit messages
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes** thoroughly:
   - Ensure all existing tests pass
   - Add new tests for new features
   - Test manually in development environment

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Provide a clear description of changes
   - Reference any related issues
   - Wait for code review

## Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/kalviumcommunity/S84-0126-A_cube-Full-Stack-With-NextjsAnd-AWS-Azure-BusSure.git
   ```

2. Install dependencies
   ```bash
   cd bus_sure
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start development server
   ```bash
   npm run dev
   ```

## Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint rules configured in the project
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add refund status tracking API`

## Code Review Process

- All pull requests require at least one approval
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Be respectful and constructive in discussions

## Questions?

Feel free to open an issue for any questions or join our community discussions.

Thank you for contributing! 🚀
