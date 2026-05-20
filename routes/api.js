'use strict';

const axios = require('axios');
const crypto = require('crypto');

const stocks = {};

module.exports = function (app) {

  async function getStockPrice(stock) {

    try {

      const response = await axios.get(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
      );

      return response.data.latestPrice;

    } catch (err) {

      return null;

    }
  }

  function hashIP(ip) {

    return crypto
      .createHash('sha256')
      .update(ip)
      .digest('hex');
  }

  app.route('/api/stock-prices')

    .get(async function (req, res){

      let stock = req.query.stock;
      let like = req.query.like;

      const ip = hashIP(req.ip);

      // ONE STOCK
      if (!Array.isArray(stock)) {

        stock = stock.toUpperCase();

        const price = await getStockPrice(stock);

        if (!stocks[stock]) {

          stocks[stock] = {
            likes: []
          };

        }

        if (like === 'true' && !stocks[stock].likes.includes(ip)) {

          stocks[stock].likes.push(ip);

        }

        return res.json({

          stockData: {

            stock: stock,
            price: price,
            likes: stocks[stock].likes.length

          }

        });

      }

      // TWO STOCKS
      else {

        const stock1 = stock[0].toUpperCase();
        const stock2 = stock[1].toUpperCase();

        const price1 = await getStockPrice(stock1);
        const price2 = await getStockPrice(stock2);

        if (!stocks[stock1]) {

          stocks[stock1] = {
            likes: []
          };

        }

        if (!stocks[stock2]) {

          stocks[stock2] = {
            likes: []
          };

        }

        if (like === 'true') {

          if (!stocks[stock1].likes.includes(ip)) {

            stocks[stock1].likes.push(ip);

          }

          if (!stocks[stock2].likes.includes(ip)) {

            stocks[stock2].likes.push(ip);

          }

        }

        const likes1 = stocks[stock1].likes.length;
        const likes2 = stocks[stock2].likes.length;

        return res.json({

          stockData: [

            {

              stock: stock1,
              price: price1,
              rel_likes: likes1 - likes2

            },

            {

              stock: stock2,
              price: price2,
              rel_likes: likes2 - likes1

            }

          ]

        });

      }

    });

};