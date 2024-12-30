import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import axios from 'axios'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("GET /api/auth/user");


    try {
        const session = await getSession({ req });
        console.log("session", session);

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }


        const { data } = await axios.get(
            `${process.env.BACKEND_URL}/accounts/user`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            error: 'Failed to fetch user data',
            details: error.message,
        });
    }
}

export const GET = handler;
