import axios from 'axios';

export async function fetchMastersData(token, masterTypeCode) {
  const response = await axios.get(process.env.MASTER_DATA_URL, {
    params: {
      master_type_code: masterTypeCode,
      from_timestamp: '2023-01-01',
      to_timestamp: '2026-01-01',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data || [];
}
