const database = {
    getData: async () => {
        try {
            const response = await fetch("/data");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { data } = await response.json();
            return {
                totalMoney: data.total_money,
                moneySpent: data.money_spent,
                moneyRemaining: data.money_remaining,
                expenses: data.expenses || [],
                walet: data.walet,
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    setData: async (data) => {
        try {
            const response = await fetch("/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error("Error setting data:", error);
            throw error;
        }
    },
};

export default database;
