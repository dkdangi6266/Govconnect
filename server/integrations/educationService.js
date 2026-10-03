const educationService = async (governmentId) => {
  const educationDatabase = {
    ID001: {
      userId: "ID001",
      qualification: "B.Tech",
      institution: "Government Engineering College",
      passingYear: 2025,
      verified: true
    },

    ID002: {
      userId: "ID002",
      qualification: "B.Sc",
      institution: "Government College",
      passingYear: 2024,
      verified: true
    }
  };

  const normalizedGovernmentId = String(governmentId)
    .trim()
    .toUpperCase();

  const educationRecord = educationDatabase[normalizedGovernmentId];

  if (!educationRecord) {
    throw new Error("Education record not found");
  }

  return {
    success: true,
    source: "MOCK_EDUCATION_GOVERNMENT_API",
    data: educationRecord
  };
};

module.exports = educationService;