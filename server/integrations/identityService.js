const identityService = async (userId) => {
  // Mock government identity database
  const identityDatabase = {
    "ID001": {
      identityId: "ID001",
      name: "Rahul Sharma",
      dateOfBirth: "2002-05-15",
      gender: "Male",
      verified: true
    },

    "ID002": {
      identityId: "ID002",
      name: "Priya Verma",
      dateOfBirth: "2001-09-20",
      gender: "Female",
      verified: true
    }
  };

  const citizen = identityDatabase[userId];

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