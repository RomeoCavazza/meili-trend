const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const favicon = fs.readFileSync(path.join(__dirname, '..', 'public', 'favicon.png'));
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.status(200).send(favicon);
};
