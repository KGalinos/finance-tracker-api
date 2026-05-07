# Finance Tracker API

A RESTful API for tracking personal income and expenses, built with Node.js and Express.

## Features

- Add, retrieve, and delete transactions
- Filter transactions by category, type, or month
- Get a financial summary with total income, expenses, balance, and category breakdown

## Tech Stack

- Node.js
- Express

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/KGalinos/finance-tracker-api.git
cd finance-tracker-api
npm install
```

### Running the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| GET | /api/transactions/:id | Get a single transaction |
| POST | /api/transactions | Create a new transaction |
| DELETE | /api/transactions/:id | Delete a transaction |

### Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/summary | Get financial summary |

### Query Parameters

| Parameter | Endpoints | Description | Example |
|-----------|-----------|-------------|---------|
| category | GET /transactions | Filter by category | ?category=food |
| type | GET /transactions | Filter by income or expense | ?type=expense |
| month | GET /transactions, GET /summary | Filter by month | ?month=2026-05 |

## Example Requests

### Add a transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 1500, "type": "income", "category": "salary", "date": "2026-05-01"}'
```

### Get all expenses in May
```bash
curl "http://localhost:3000/api/transactions?type=expense&month=2026-05"
```

### Get monthly summary
```bash
curl "http://localhost:3000/api/summary?month=2026-05"
```

### Delete a transaction
```bash
curl -X DELETE http://localhost:3000/api/transactions/TRANSACTION_ID
```

## Transaction Object

```json
{
  "id": "moul1fu0342l37ydoi2",
  "amount": 1500,
  "type": "income",
  "category": "salary",
  "description": "Monthly salary",
  "date": "2026-05-01"
}
```

## Summary Response

```json
{
  "period": "2026-05",
  "totalIncome": 3000,
  "totalExpenses": 200,
  "balance": 2800,
  "byCategory": {
    "salary": { "income": 3000, "expenses": 0 },
    "food": { "income": 0, "expenses": 200 }
  }
}
```
