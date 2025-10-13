const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Routes pour les pages légales
  if (pathname === '/privacy') {
    const html = fs.readFileSync(path.join(__dirname, 'pages', 'privacy.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }
  
  if (pathname === '/terms') {
    const html = fs.readFileSync(path.join(__dirname, 'pages', 'terms.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }
  
  if (pathname === '/data-deletion') {
    const html = fs.readFileSync(path.join(__dirname, 'pages', 'data-deletion.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }
  
  if (pathname === '/search') {
    const html = fs.readFileSync(path.join(__dirname, 'pages', 'search.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }
  
  // Page d'accueil
  if (pathname === '/') {
    const html = fs.readFileSync(path.join(__dirname, 'pages', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }
  
  // 404 pour les autres routes
  res.status(404).send('Page not found');
};
