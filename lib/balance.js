const got = require('got')
const plnx = require('plnx')

module.exports = function() {
  const credentials = {
    key: process.env.API_KEY,
    secret: process.env.API_SECRET
  }

  return new Promise((resolve, reject) => {
    plnx.returnCompleteBalances(credentials, (err, data) => {

      if (err) {
        reject(err);
        return ;
      }

      let sumBtcValues = 0;

      Object.keys(data).forEach(currency => {
        const item = data[currency]

        sumBtcValues += parseFloat(item.btcValue)
      })

      got('https://blockchain.info/fr/ticker', { json: true })
        .then(({ body }) => {
          const eur = parseFloat(body['EUR'].last) * sumBtcValues;
          const usd = parseFloat(body['USD'].last) * sumBtcValues;

          resolve({
            balance: data,
            total: sumBtcValues,
            estimations: {
              eur,
              usd
            }
          })
        })
        .catch(reject)
    })
  });
}