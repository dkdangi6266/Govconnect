const identityService = async (governmentId) => {
  // Mock government identity database
  const identityDatabase = {
    ID001: {
      identityId: "ID001",
      name: "Rahul Sharma",
      dateOfBirth: "2002-05-15",
      gender: "Male",
      verified: true
    },

    ID002: {
      identityId: "ID002",
      name: "Priya Verma",
      dateOfBirth: "2001-09-20",
      gender: "Female",
      verified: true
    },

    // Mock citizens registered through GovConnect
    "MOCK-ID001": {
      identityId: "MOCK-ID001",
      name: "Dinesh Test",
      dateOfBirth: "2002-01-01",
      gender: "Male",
      verified: true
    },

    "MOCK-ID002": {
      identityId: "MOCK-ID002",
      name: "Demo Citizen",
      dateOfBirth: "2001-01-01",
      gender: "Male",
      verified: true
    }
  };

  const normalizedGovernmentId = String(governmentId)
    .trim()
    .toUpperCase();

  const citizen = identityDatabase[normalizedGovernmentId];

  if (!citizen) {
    throw new Error("Identity record not found");
  }

  return {
    success: true,
    source: "MOCK_IDENTITY_GOVERNMENT_API",
    data: citizen
  };
};

module.exports = identityService;