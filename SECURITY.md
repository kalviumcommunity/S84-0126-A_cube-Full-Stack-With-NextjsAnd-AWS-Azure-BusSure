# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of BusSure seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please do not open a public GitHub issue for security vulnerabilities. This helps prevent malicious actors from exploiting the vulnerability before a fix is available.

### 2. Contact Us Privately

Send an email to: **security@bussure.example.com** (replace with actual contact)

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### 3. Response Timeline

- **Initial Response**: Within 48 hours of your report
- **Status Update**: Within 5 business days with an assessment
- **Fix Timeline**: We aim to release a patch within 30 days for critical vulnerabilities

### 4. Security Patch Process

Once a vulnerability is confirmed:

1. We will develop and test a fix
2. A security advisory will be published
3. A new version with the patch will be released
4. Credit will be given to the reporter (if desired)

## Security Best Practices

When using BusSure, please follow these security practices:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique values for `JWT_SECRET` and `SESSION_SECRET`
- Rotate secrets regularly in production

### Database Security
- Use strong database passwords
- Enable SSL/TLS for database connections in production
- Regularly backup your database
- Implement proper access controls

### Authentication
- Enforce strong password policies
- Implement rate limiting on login endpoints
- Use secure session management
- Enable two-factor authentication when possible

### API Security
- Validate all user input
- Implement proper authorization checks
- Use HTTPS in production
- Set appropriate CORS policies
- Implement rate limiting

### Dependencies
- Regularly update npm packages
- Use `npm audit` to check for known vulnerabilities
- Monitor security advisories for dependencies

## Known Security Considerations

### Data Storage
- User passwords are hashed using bcrypt
- Sensitive data should be encrypted at rest
- PII (Personally Identifiable Information) requires special handling

### Session Management
- Sessions use secure, HTTP-only cookies
- Implement session timeouts
- Clear sessions on logout

### File Uploads
- Validate file types and sizes
- Scan uploaded files for malware
- Store files outside the web root
- Use signed URLs for file access

## Security Tools

We recommend using these tools to enhance security:

- **Helmet.js**: Security headers for Express/Next.js
- **npm audit**: Check for vulnerable dependencies
- **ESLint Security Plugin**: Static code analysis
- **OWASP ZAP**: Dynamic security testing

## Disclosure Policy

- We follow coordinated disclosure practices
- Vulnerabilities are disclosed after a fix is available
- We credit researchers who report vulnerabilities (if desired)

## Questions?

For general security questions (non-vulnerability), you can:
- Open a GitHub discussion
- Contact the maintainers

Thank you for helping keep BusSure and our users safe!
