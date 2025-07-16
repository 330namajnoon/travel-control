import database from "./database.js";
import getPrice from "./getPrice.js";


(async () => {
    const tlPrice = await getPrice.tl();
    const irrPrice = 0.00097;

    const totalMonyInput = document.getElementById("totalMony");
    const moneyRemainingInput = document.getElementById("moneyRemaining");
    const moneySpentInput = document.getElementById("moneySpent");

    const saveChangesButton = document.getElementById("saveChanges");

    const loading = document.getElementById("loading");

    function createExpense(expense, parent) {
        const expenseDiv = document.createElement("div");
        expenseDiv.className = "expense";
        const titleLabel = document.createElement("label");
        titleLabel.className = "expense-title";
        titleLabel.textContent = "Title:";
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = expense.title;
        titleInput.addEventListener("input", () => {
            console.log("Title changed to:", titleInput.value);
            expense.title = titleInput.value;
        });
        titleLabel.appendChild(titleInput);
        expenseDiv.appendChild(titleLabel);

        const descriptionLabel = document.createElement("label");
        descriptionLabel.className = "expense-title";
        descriptionLabel.textContent = "Description:";
        const descriptionInput = document.createElement("textarea");
        descriptionInput.value = expense.description;
        descriptionInput.rows = 4;
        descriptionInput.addEventListener("input", () => {
            console.log("Description changed to:", descriptionInput.value);
            expense.description = descriptionInput.value;
        });
        descriptionLabel.appendChild(descriptionInput);
        expenseDiv.appendChild(descriptionLabel);

        const dateLabel = document.createElement("label");
        dateLabel.className = "expense-title";
        dateLabel.textContent = "Date:";
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = new Date(expense.fech).toISOString().split("T")[0];
        dateInput.addEventListener("input", () => {
            console.log("Date changed to:", dateInput.value);
            expense.fech = new Date(dateInput.value).toISOString();
        });
        dateLabel.appendChild(dateInput);
        expenseDiv.appendChild(dateLabel);

        const eurCostLabel = document.createElement("label");
        eurCostLabel.className = "expense-title";
        eurCostLabel.textContent = "Cost (EUR):";
        const eurCostInput = document.createElement("input");
        eurCostInput.type = "number";
        eurCostInput.value = expense.cost.EUR;
        eurCostLabel.appendChild(eurCostInput);
        expenseDiv.appendChild(eurCostLabel);

        const tlCostLabel = document.createElement("label");
        tlCostLabel.className = "expense-title";
        tlCostLabel.textContent = "Cost (TL):";
        const tlCostInput = document.createElement("input");
        tlCostInput.type = "number";
        tlCostInput.value = (expense.cost.EUR / tlPrice.rates.EUR).toFixed(2);
        tlCostLabel.appendChild(tlCostInput);
        expenseDiv.appendChild(tlCostLabel);

        const irrCostLabel = document.createElement("label");
        irrCostLabel.className = "expense-title";
        irrCostLabel.textContent = "Cost (IRR):";
        const irrCostInput = document.createElement("input");
        irrCostInput.type = "number";
        irrCostInput.value = (expense.cost.EUR / irrPrice).toFixed(2);
        irrCostLabel.appendChild(irrCostInput);
        expenseDiv.appendChild(irrCostLabel);

        eurCostInput.addEventListener("input", () => {
            expense.cost.EUR = parseFloat(eurCostInput.value);
            tlCostInput.value = (expense.cost.EUR / tlPrice.rates.EUR).toFixed(2);
            irrCostInput.value = (expense.cost.EUR / irrPrice).toFixed(2);
        });
        tlCostInput.addEventListener("input", () => {
            expense.cost.EUR = parseFloat(tlCostInput.value) * tlPrice.rates.EUR;
            eurCostInput.value = expense.cost.EUR.toFixed(2);
            irrCostInput.value = (expense.cost.EUR / irrPrice).toFixed(2);
        });
        irrCostInput.addEventListener("input", () => {
            expense.cost.EUR = parseFloat(irrCostInput.value) * irrPrice;
            eurCostInput.value = expense.cost.EUR.toFixed(2);
            tlCostInput.value = (expense.cost.EUR / tlPrice.rates.EUR).toFixed(2);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Expense";
        deleteButton.className = "delete-expense";
        deleteButton.addEventListener("click", () => {
            const index = data.expenses.indexOf(expense);
            if (index > -1) {
                data.expenses.splice(index, 1);
                parent.removeChild(expenseDiv);
            }
        });
        expenseDiv.appendChild(deleteButton);

        return expenseDiv;
    }

    /**
     * @type {{expenses: {title: string; description: string; cost: {EUR: number}, fech: string}[], moneyRemaining: number; moneySpent: number; totalMoney: number}}
     */
    const data = await database.getData();

    loading.style.display = "none";

	data.moneySpent = data.expenses.reduce((total, expense) => total + expense.cost.EUR, 0);
	data.moneyRemaining = data.totalMoney - data.moneySpent;

    totalMonyInput.value = data.totalMoney;
    moneySpentInput.value = data.moneySpent;
    moneyRemainingInput.value = data.moneyRemaining;

    totalMonyInput.addEventListener("input", () => {
        data.totalMoney = parseFloat(totalMonyInput.value);
		data.moneyRemaining = data.totalMoney - data.moneySpent;
		moneyRemainingInput.value = data.moneyRemaining;
    });

    moneyRemainingInput.addEventListener("input", () => {
        data.moneyRemaining = parseFloat(moneyRemainingInput.value);
		data.moneySpent = data.totalMoney - data.moneyRemaining;
		moneySpentInput.value = data.moneySpent;
    });

    moneySpentInput.addEventListener("input", () => {
        data.moneySpent = parseFloat(moneySpentInput.value);
		data.moneyRemaining = data.totalMoney - data.moneySpent;
		moneyRemainingInput.value = data.moneyRemaining;
    });

    saveChangesButton.addEventListener("click", async () => {
        loading.style.display = "flex";
        try {
            await database.setData(data);
        } catch (error) {
            alert("Error saving changes: " + error.message);
        } finally {
            loading.style.display = "none";
        }
    });

    const expensesDiv = document.getElementById("expenses");

    const addExpenseButton = document.getElementById("addExpense");
    addExpenseButton.addEventListener("click", () => {
        const newExpense = {
            title: "",
            description: "",
            cost: { EUR: 0 },
            fech: new Date().toISOString(),
        };
        data.expenses.unshift(newExpense);
        expensesDiv.insertBefore(createExpense(newExpense), expensesDiv.firstChild);
    });

    data.expenses.forEach((expense) => expensesDiv.appendChild(createExpense(expense, expensesDiv)));

    console.log(data);
})();
