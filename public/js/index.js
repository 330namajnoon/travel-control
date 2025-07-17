import database from "./database.js";
import getPrice from "./getPrice.js";

(async () => {
    const search = new URLSearchParams(window.location.search);
    const tlPrice = parseFloat(search?.get("tl") || 0) || (await getPrice.tl()).rates.EUR;
    const irrPrice = parseFloat(search?.get("irr") || 0) || 0.00000970873786407767;
    console.log("TL Price:", tlPrice);
    console.log("IRR Price:", irrPrice);

    const saveChangesButton = document.getElementById("saveChanges");

    const expensesDiv = document.getElementById("expenses");
    const loading = document.getElementById("loading");

    /**
     * @type {{expenses: {title: string; description: string; cost: {EUR: number}, fech: string}[], moneyRemaining: number; moneySpent: number; totalMoney: number; walet: {id: string; name: string}[]}}
     */
    const data = await database.getData();
    let data_ = data;

    loading.style.display = "none";

    const totalMonyInput = document.getElementById("totalMony");
    const moneyRemainingInput = document.getElementById("moneyRemaining");
    const moneySpentInput = document.getElementById("moneySpent");

    totalMonyInput.addEventListener("input", () => {
        data_.totalMoney = parseFloat(totalMonyInput.value);
        data_.moneyRemaining = data_.totalMoney - data_.moneySpent;
        moneyRemainingInput.value = data_.moneyRemaining;
        console.log("Total Money changed to:", data);
    });

    moneyRemainingInput.addEventListener("input", () => {
        data_.moneyRemaining = parseFloat(moneyRemainingInput.value);
        data_.moneySpent = data_.totalMoney - data_.moneyRemaining;
        moneySpentInput.value = data_.moneySpent;
    });

    moneySpentInput.addEventListener("input", () => {
        data_.moneySpent = parseFloat(moneySpentInput.value);
        data_.moneyRemaining = data_.totalMoney - data_.moneySpent;
        moneyRemainingInput.value = data_.moneyRemaining;
    });

    function updateInputValues(d) {
        data_ = d;
        if (!d.expenses) {
            const expenses = data.expenses.filter((expense) => (expense.walet || []).some((w) => w.id === d.id));
            d.moneySpent = expenses.reduce((total, expense) => total + expense.cost.EUR, 0).toFixed(2);
            d.moneyRemaining = (d.totalMoney - d.moneySpent).toFixed(2);
            totalMonyInput.value = d.totalMoney;
            moneySpentInput.value = d.moneySpent;
            moneyRemainingInput.value = d.moneyRemaining;
        } else {
            d.moneySpent = d.expenses.reduce((total, expense) => total + expense.cost.EUR, 0).toFixed(2);
            d.moneyRemaining = (d.totalMoney - d.moneySpent).toFixed(2);
            totalMonyInput.value = d.totalMoney;
            moneySpentInput.value = d.moneySpent;
            moneyRemainingInput.value = d.moneyRemaining;
        }
    }

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
        eurCostInput.value = expense.cost.EUR.toFixed(2);
        eurCostLabel.appendChild(eurCostInput);
        expenseDiv.appendChild(eurCostLabel);

        const tlCostLabel = document.createElement("label");
        tlCostLabel.className = "expense-title";
        tlCostLabel.textContent = "Cost (TL):";
        const tlCostInput = document.createElement("input");
        tlCostInput.type = "number";
        tlCostInput.value = (expense.cost.EUR / tlPrice).toFixed(2);
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
            tlCostInput.value = (expense.cost.EUR / tlPrice).toFixed(2);
            irrCostInput.value = (expense.cost.EUR / irrPrice).toFixed(2);
            updateInputValues(data);
        });
        tlCostInput.addEventListener("input", () => {
            expense.cost.EUR = parseFloat(tlCostInput.value) * tlPrice;
            eurCostInput.value = expense.cost.EUR.toFixed(2);
            irrCostInput.value = (expense.cost.EUR / irrPrice).toFixed(2);
            updateInputValues(data);
        });
        irrCostInput.addEventListener("input", () => {
            expense.cost.EUR = parseFloat(irrCostInput.value) * irrPrice;
            eurCostInput.value = expense.cost.EUR.toFixed(2);
            tlCostInput.value = (expense.cost.EUR / tlPrice).toFixed(2);
            updateInputValues(data);
        });

        const waletLabel = document.createElement("label");
        waletLabel.className = "expense-walet-title";
        waletLabel.textContent = "Add to new wallet:";
        const waletSelect = document.createElement("select");
        waletSelect.className = "walet-select";
        const selectOption = document.createElement("option");
        selectOption.value = "0";
        selectOption.textContent = "Select a wallet";
        waletSelect.appendChild(selectOption);

        data.walet.forEach((walet) => {
            const option = document.createElement("option");
            option.className = "walet-option";
            option.value = walet.id;
            option.textContent = walet.name;
            waletSelect.appendChild(option);
        });
        waletSelect.addEventListener("input", (event) => {
            const selectedWaletId = parseInt(event.target.value);
            if (selectedWaletId > 0) {
                const selectedWalet = data.walet.find((w) => w.id === selectedWaletId);
                if (selectedWalet && !expense?.walet?.some?.((w) => w.id === selectedWalet.id)) {
                    expense.walet = [selectedWalet, ...(expense.walet || [])];
                    waletSelect.value = "0";
                    renderExpenses(data.expenses);
                }
            }
        });
        waletLabel.appendChild(waletSelect);
        expense?.walet?.forEach?.((w) => {
            const option = document.createElement("button");
            option.value = w.id;
            option.textContent = w.name;
            option.addEventListener("click", () => {
                // preguntar al usuario si desea eliminar el wallet de la expense
                const confirmDelete = window.confirm(`Are you sure you want to remove ${w.name} from this expense?`);
                if (confirmDelete) {
                    expense.walet = expense.walet.filter((wallet) => wallet.id !== w.id);
                    waletLabel.removeChild(option);
                    const d = parseInt(document.getElementById("walets").value);
                    console.log(d)
                    renderExpenses(d > 0 ? data.expenses.filter((expense) => (expense?.walet || []).some((w) => w.id === d)) : data.expenses);
                    updateInputValues(data_);
                }
            });
            waletLabel.appendChild(option);
        });
        expenseDiv.appendChild(waletLabel);

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

    updateInputValues(data);


    saveChangesButton.addEventListener("click", async () => {
        loading.style.display = "flex";
        try {
            console.log(data);
            await database.setData(data);
        } catch (error) {
            alert("Error saving changes: " + error.message);
        } finally {
            loading.style.display = "none";
        }
    });

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

    function renderExpenses(expenses) {
        expensesDiv.innerHTML = "";
        expenses.forEach((expense) => {
            expensesDiv.appendChild(createExpense(expense, expensesDiv));
        });
    }

    function renderWalet() {
        const waletsSelect = document.getElementById("walets");
        waletsSelect.innerHTML = "";
        const selectOption = document.createElement("option");
        selectOption.value = "0";
        selectOption.textContent = "Select a wallet";
        waletsSelect.appendChild(selectOption);
        data.walet.forEach((walet) => {
            const option = document.createElement("option");
            option.value = walet.id;
            option.textContent = walet.name;
            waletsSelect.appendChild(option);
        });
        waletsSelect.addEventListener("input", (event) => {
            const selectedWaletId = parseInt(event.target.value);
            if (selectedWaletId === 0) {
                renderExpenses(data.expenses);
                updateInputValues(data);
                return;
            }
            const selectedWalet = data.walet.find((w) => w.id === selectedWaletId);
            const expenses = data.expenses.filter((expense) =>
                (expense.walet || []).some((w) => w.id === selectedWalet.id)
            );
            updateInputValues(selectedWalet);
            renderExpenses(expenses);
        });
    }

    renderExpenses(data.expenses);

    const addWaletButton = document.getElementById("addWallet");
    addWaletButton.addEventListener("click", () => {
        const prompt = window.prompt("Enter the name of the new wallet:");
        const newWalet = {
            id: Date.now(),
            name: prompt || "New Wallet",
            totalMoney: 0,
            moneySpent: 0,
            moneyRemaining: 0,
        };
        data.walet.unshift(newWalet);
        renderWalet();
        renderExpenses(data.expenses);
    });

    const deleteWaletButton = document.getElementById("deleteWallet");
    deleteWaletButton.addEventListener("click", () => {
        const selectedWaletId = parseInt(document.getElementById("walets").value);
        if (selectedWaletId === 0) {
            alert("Please select a wallet to delete.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this wallet?");
        if (confirmDelete) {
            data.walet = data.walet.filter((w) => w.id !== selectedWaletId);
            data.expenses.forEach((expense) => {
                expense.walet = (expense.walet || []).filter((w) => w.id !== selectedWaletId);
            });
            renderWalet();
            renderExpenses(data.expenses);
            updateInputValues(data);
        }
    });

    renderWalet();
    console.log(data);
})();
