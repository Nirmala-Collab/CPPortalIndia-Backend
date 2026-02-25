import dotenv from 'dotenv';

import app from './app.js';
dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Evolv Portal backend listening on port`);
});
