import { useState, useEffect } from "react";
import { request } from "graphql-request";

const PORTFOLIO_QUERY = ``

export const usePortfolio = (userAddress) => {

    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userAddress) {
            setLoading(false);
            return;
        }

        const fetchPortfolio = async () => {
            try {

            } catch (err) {
                setError(err.message);
            }
        }

    })
    
    return { portfolio, loading, error };
}