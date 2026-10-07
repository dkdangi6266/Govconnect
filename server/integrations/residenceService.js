const residenceService = async (governmentId) => {
  const residenceDatabase = {
    ID001: {
      userId: "ID001",
      state: "Madhya Pradesh",
      district: "Indore",
      residenceType: "Permanent",
      verified: true
    },

    ID002: {
      userId: "ID002",
      state: "Madhya Pradesh",
      district: "Bhopal",
      residenceType: "Permanent",
      verified: true
    },

    // Mock citizens created through GovConnect
    "MOCK-ID001": {
      userId: "MOCK-ID001",
      state: "Madhya Pradesh",
      district: "Indore",
      residenceType: "Permanent",
      verified: true
    },

    "MOCK-ID002": {
      userId: "MOCK-ID002",
      state: "Madhya Pradesh",
      district: "Bhopal",
      residenceType: "Permanent",
      verified: true
    }
  };

  const normalizedGovernmentId = String(governmentId)
    .trim()
    .toUpperCase();

  const residenceRecord = residenceDatabase[normalizedGovernmentId];

  if (!residenceRecord) {
    throw new Error("Residence record not found");
  }

  return {
    success: true,
    source: "MOCK_RESIDENCE_GOVERNMENT_API",
    data: residenceRecord
  };
};

module.exports = residenceService;