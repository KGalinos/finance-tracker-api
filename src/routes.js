const express = require('express');
const router = express.Router();
const { readData, writeData } = require('./data');

// Generate a simple unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// POST /transactions - add a new transaction
router.post('/transactions', (req, res) => {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
        return res.status(400).json({ error: 'amount, type and category are required' });
    }

    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'type must be income or expense' });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const transaction = {
        id: generateId(),
        amount: parseFloat(amount),
        type,
        category,
        description: description || '',
        date: date || new Date().toISOString().split('T')[0]
    };

    const data = readData();
    data.transactions.push(transaction);
    writeData(data);

    return res.status(201).json(transaction);
});

// GET /transactions - get all transactions with optional filters
router.get('/transactions', (req, res) => {
    const { category, type, month } = req.query;
    const data = readData();
    let transactions = data.transactions;

    if (category) {
        transactions = transactions.filter(t =>
            t.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }

    if (month) {
        transactions = transactions.filter(t => t.date.startsWith(month));
    }

    return res.json(transactions);
});

// GET /transactions/:id - get one transaction
router.get('/transactions/:id', (req, res) => {
    const data = readData();
    const transaction = data.transactions.find(t => t.id === req.params.id);

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json(transaction);
});

// DELETE /transactions/:id - delete a transaction
router.delete('/transactions/:id', (req, res) => {
    const data = readData();
    const index = data.transactions.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    const deleted = data.transactions.splice(index, 1);
    writeData(data);

    return res.json({ message: 'Transaction deleted', transaction: deleted[0] });
});

// GET /summary - totals and breakdown by category
router.get('/summary', (req, res) => {
    const { month } = req.query;
    const data = readData();
    let transactions = data.transactions;

    if (month) {
        transactions = transactions.filter(t => t.date.startsWith(month));
    }

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = transactions.reduce((acc, t) => {
        if (!acc[t.category]) {
            acc[t.category] = { income: 0, expenses: 0 };
        }
        if (t.type === 'income') {
            acc[t.category].income += t.amount;
        } else {
            acc[t.category].expenses += t.amount;
        }
        return acc;
    }, {});

    return res.json({
        period: month || 'all time',
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        byCategory
    });
});

module.exports = router;
