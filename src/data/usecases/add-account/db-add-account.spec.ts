import { DbAddAccount } from "./db-add-account";
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-accounts-protocols";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email",
    password: "hashed_password",
  };
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccountData = (): AddAccountModel => {
  return {
    name: "valid_name",
    email: "valid_email",
    password: "valid_password",
  };
};
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    encrypterStub,
    sut,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Shoud call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Shoud throw if encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Shoud throw if encrypter throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Shoud call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = makeFakeAccountData();
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Shoud return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccountData();
    const account = await sut.add(accountData);
    expect(account).toEqual(makeFakeAccount());
  });
});
