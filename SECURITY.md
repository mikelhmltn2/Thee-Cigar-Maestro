# Security Policy

## Supported Versions

The following versions of Thee Cigar Maestro are currently supported with security updates:

| Version | Supported          | Notes                   |
| ------- | ------------------ | ----------------------- |
| 1.2.x   | :white_check_mark: | Current stable release  |
| 1.1.x   | :white_check_mark: | Previous stable release |
| 1.0.x   | :warning:          | Limited support         |
| < 1.0   | :x:                | No longer supported     |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 🚨 For Critical Security Issues

- **DO NOT** open a public GitHub issue
- Email us directly at: security@theecigarmaestro.com
- Include "SECURITY VULNERABILITY" in the subject line
- Provide detailed information about the vulnerability

### 📧 Email Template

```
Subject: SECURITY VULNERABILITY - [Brief Description]

Vulnerability Type: [XSS, SQL Injection, etc.]
Affected Component: [Component/File name]
Severity: [Critical/High/Medium/Low]
Description: [Detailed description]
Steps to Reproduce: [Step-by-step instructions]
Potential Impact: [Description of potential damage]
Suggested Fix: [If you have suggestions]
```

### 🔒 Security Response Process

1. **Acknowledgment**: We will acknowledge receipt within 24 hours
2. **Assessment**: Initial assessment within 72 hours
3. **Investigation**: Detailed investigation within 7 days
4. **Resolution**: Fix deployed within 30 days for critical issues
5. **Disclosure**: Public disclosure after fix is deployed

### 🛡️ Security Measures in Place

- **Content Security Policy (CSP)** headers implemented
- **Input validation** and sanitization on all user inputs
- **XSS prevention** through secure coding practices
- **HTTPS-only** external resource loading
- **Error handling** prevents information disclosure
- **Rate limiting** on API endpoints
- **Authentication** security best practices

### 🏆 Security Hall of Fame

We recognize security researchers who help us improve:

- Report will be acknowledged in our security documentation
- Credit given in release notes (with permission)
- Invitation to join our security advisory team

### 📋 Security Best Practices for Users

- Keep your browser updated
- Enable JavaScript only for trusted sites
- Report suspicious behavior immediately
- Use strong passwords if authentication features are added

### 🔄 Regular Security Updates

- Dependencies are regularly audited and updated
- Security patches are released as needed
- Security documentation is reviewed quarterly

---

**Last Updated**: January 2025  
**Next Review**: April 2025
