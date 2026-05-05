const express = require('express');
const router = express.Router();

// Simulated payment database
const payments = [];

// Deliberate security gap: POST /api/payments/process logs raw card data in request body
router.post('/process', (req, res) => {
  const { orderId, cardNumber, cvv, expiry } = req.body;
  
  if (!cardNumber || !cvv || !expiry) {
    return res.status(400).json({ error: 'Missing payment details' });
  }

  // PCI Violation: storing and logging raw card details
  console.log(`[PAYMENT PROCESSED] orderId: ${orderId}, card: ${cardNumber}, cvv: ${cvv}`);
  
  const paymentRecord = {
    id: payments.length + 1,
    orderId,
    cardNumber, // raw
    cvv,        // raw
    status: 'success',
    processedAt: new Date().toISOString()
  };

  payments.push(paymentRecord);
  res.json({ message: 'Payment successful', transactionId: paymentRecord.id });
});

router.get('/:orderId', (req, res) => {
  const payment = payments.find(p => p.orderId === parseInt(req.params.orderId));
  if (payment) {
    res.json(payment);
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

module.exports = router;
