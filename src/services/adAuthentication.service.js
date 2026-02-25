import axios from 'axios';
import dotenv from 'dotenv';

import { generateAccessToken } from './pasToken.service.js';
dotenv.config({ path: '.env' });
export async function authenticateWithAD(email, password) {
  try {
    const token = await generateAccessToken();

    const response = await axios.post(
      process.env.AD_CREDENTIALS_URL,
      {
        user_id: email,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': process.env.AD_SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.log('AD Authentication Error:', error.response);
    return error.response;
  }
}
