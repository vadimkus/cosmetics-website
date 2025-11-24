// Script to fetch all products and prepare for translation
const https = require('http');

const productIds = [
  '1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '52',
  'cmgj9ifoi00008o07p4eqmfb7', 'cmhf1a6p400000xfa0iu3bw42', 'cmhowxw4x00008ofct2ivnq2j',
  'cmhoyg0r400008o7s4va63hsw', 'cmhoyw7d500008o9tdprqkkhb', 'cmhozfrep00008oxxizeqk8a0', 'cmhp0jfrq00008odr033fg0ly'
];

async function fetchProduct(id) {
  return new Promise((resolve, reject) => {
    https.get(`http://localhost:3000/api/products/${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching products...');
  for (const id of productIds) {
    try {
      const product = await fetchProduct(id);
      console.log(`Product ${id}: ${product.name}`);
    } catch (e) {
      console.error(`Error fetching ${id}:`, e.message);
    }
  }
}

main();

