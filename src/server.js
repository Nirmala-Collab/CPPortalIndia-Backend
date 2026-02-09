import dotenv from 'dotenv';

import app from './app.js';
dotenv.config({ path: '.env.uat' });
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`CP Portal backend listening on port ${PORT}`);
});
