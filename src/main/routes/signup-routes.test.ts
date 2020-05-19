import request from "supertest";
import app from "../config/app";

import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("Signup Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Guilherme",
        email: "guilhermefaleiros2000@gmail.con",
        password: "gui2000",
        passwordConfirmation: "gui2000",
      })
      .expect(200);
  });
});
