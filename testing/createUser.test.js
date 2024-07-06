const axios = require("axios");
const uuidv4 = require("uuid").v4;

describe("createUser", () => {
  it("should create 50 users", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjAyNjc1MTcsImV4cCI6MTcyMDI3MTExN30.HABWxbkBARU_oJDfZCfhw29Bmnu27l-IsM5BGfxPqPQ";

    for (let i = 0; i < 50; i++) {
      const name = `User ${i}`;
      const email = `user${i}@example.com`;
      const address = `Address ${i}`;
      const phoneNumber = `PhoneNumber ${i}`;

      const response = await axios.post(
        "http://localhost:4000/api/create-user-data",
        {
          name,
          email,
          address,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Successfully add user");
    }
  });
});
