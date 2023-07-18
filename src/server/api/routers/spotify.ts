import express, { Request, Response } from 'express';

const app = express();
const port = 3000; // 指定服务器监听的端口号

app.get('/login', (req: Request, res: Response) => {
  res.send('Log in to Spotify');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});