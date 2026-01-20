import axios from "axios";

export async function generateAccessToken() {

    const response = await axios.post(
        process.env.PAS_ACCESS_TOKEN_URL,
        {

            "grant_type": "client_credentials",
            "clientId": process.env.CLIENT_ID,
            "clientSecret": process.env.CLIENT_SECRET,
            "scope": "api://65ff5402-594a-4c9c-b9a2-53c01e013df2/.default"
        },
        {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.SUBSCRIPTION_KEY,
                "Content-type": "application/json"
            }
        }

    );
    return response.data.access_token;


}