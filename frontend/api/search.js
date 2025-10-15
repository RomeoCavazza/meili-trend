import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const filePath = join(process.cwd(), 'pages', 'search.html');
    const content = await readFile(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(content);
  } catch (error) {
    console.error('Error serving search.html:', error);
    res.status(500).send('Internal Server Error');
  }
}