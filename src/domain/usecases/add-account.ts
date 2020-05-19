import { AccountModel } from "../models/account";
import { AddAccountRepository } from "../../data/protocols/add-account-repository";

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}
