require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/faucet/claim', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Address required' });

  try {
    // FaucetPay API call
    const response = await axios.post('https://faucetpay.io/api/v1/send', null, {
      params: {
        api_key: process.env.FAUCETPAY_API_KEY,
        to: address,
        amount: process.env.FAUCET_AMOUNT,
        currency: process.env.FAUCET_CURRENCY,
      },
    });

    if (response.data.status === 200) {
      res.json({ success: true, message: 'Coins sent!' });
    } else {
      res.status(400).json({ error: response.data.message });
    }
  } catch (err) {
    res.status(500).json({ error: 'FaucetPay API error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));