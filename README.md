# AdGuardian - Click Fraud Detection SaaS Platform

A comprehensive SaaS platform for detecting and preventing click fraud in digital advertising campaigns.

## Features

- **Real-time Click Analysis**: Detect suspicious click patterns in real-time
- **Machine Learning Detection**: Advanced ML algorithms to identify fraudulent clicks
- **Campaign Management**: Manage multiple advertising campaigns
- **Analytics Dashboard**: Comprehensive reporting and analytics
- **API Integration**: RESTful API for third-party integrations
- **Multi-tenant Support**: Scalable multi-tenant architecture
- **Compliance**: GDPR and CCPA compliant

## Project Structure

```
├── backend/           # Node.js/Express backend
├── frontend/          # React frontend
├── mobile/            # React Native mobile app
├── docs/              # Documentation
├── tests/             # Test suites
└── deployment/        # Docker and deployment configs
```

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL 12+
- Docker & Docker Compose

### Installation

1. Clone the repository
```bash
git clone https://github.com/samayhuf-star/click-fraud-saas.git
cd click-fraud-saas
```

2. Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

## Documentation

- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## License

MIT

## Contact

For support, email: support@adguardian.io
