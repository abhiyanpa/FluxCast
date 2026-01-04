# Contributing to FluxCast

Thank you for your interest in FluxCast! 

## ⚠️ Important Notice

This repository is published for **portfolio and educational purposes only**. It is NOT traditional open-source software. Please read the [LICENSE](LICENSE) file carefully before contributing.

### What This Means

- This is a **portfolio project** to demonstrate coding skills
- Contributions are welcome for **improvements and learning**
- Any production use requires proper attribution (see LICENSE)
- The production site is https://tv.abhiyanpa.in/

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Features

We're always open to new ideas! To suggest a feature:
1. Check if the feature has already been requested
2. Open an issue with the `enhancement` label
3. Clearly describe the feature and its benefits
4. Provide examples or mockups if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/fluxcast-frontend.git
   cd fluxcast-frontend
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```

   Commit message format:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Code Style Guidelines

- Use ES6+ features
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add PropTypes for component props (if applicable)
- Format code consistently (consider using Prettier)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (routes)
├── utils/          # Utility functions
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── style.css       # Global styles
```

## Testing

Before submitting a PR, ensure:
- [ ] Code runs without errors
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Changes don't break existing functionality

## Legal Considerations

**IMPORTANT:** By contributing to this project, you acknowledge that:

- This is NOT an MIT/open-source licensed project
- Any production use requires attribution in player, footer, about page, and FAQs
- The copyright holder has rights to enforce takedowns for unauthorized use
- Your contributions will be under the same custom license
- You grant the project maintainer rights to use your contributions
- You have the right to submit the code and it doesn't violate any copyrights

### Attribution Requirements

If you or anyone uses this code in production, they MUST provide attribution:
- In the video player interface
- In the website footer
- On the about/credits page  
- In the FAQ page

Format: "Built using FluxCast by Abhiyan PA (https://tv.abhiyanpa.in/)"

See [LICENSE](LICENSE) for complete terms.

## Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Check existing issues and pull requests
- Review the README.md for project information

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers and help others
- Focus on what is best for the community
- Show empathy towards other community members

---

Thank you for contributing to FluxCast! 🎉
