const incomeService = async (governmentId) => {
  const incomeDatabase = {
    ID001: {
      userId: "ID001",
      annualIncome: 180000,
      incomeYear: "2025-26",
      verified: true
    },

    ID002: {
      userId: "ID002",
      annualIncome: 450000,
      incomeYear: "2025-26",
      verified: true
    }
  };

  const normalizedGovernmentId = String(governmentId)
    .trim()
    .toUpperCase();

  const governmentIdAliases = {
    IDOO1: "ID001",
    IDOO2: "ID002"
  };

  const finalGovernmentId =
    governmentIdAliases[normalizedGovernmentId] ||
    normalizedGovernmentId;

  const incomeRecord = incomeDatabase[finalGovernmentId];

  if (!incomeRecord) {
    throw new Error("Income record not found");
  }

  return {
    success: true,
    source: "MOCK_INCOME_GOVERNMENT_API",
    data: incomeRecord
  };
};

module.exports = incomeService;