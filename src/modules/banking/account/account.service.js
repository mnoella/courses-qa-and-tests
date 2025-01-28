import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import { z } from "zod";
import { createAccountInRepository, deleteAccountFromRepository, getAccountsFromRepository } from "./account.repository";

const AccountSchema = z.object({
    userId: z.number(),
    amount: z.number(),
});


export async function createAccount(data) {
    const result = AccountSchema.safeParse(data);

    if (result.success) {
        return createAccountInRepository(result.data);
    } else {
        throw new HttpBadRequest(result.error);
    }
}

export async function getAccounts(userId) {
    if (userId) {
        return getAccountsFromRepository(userId);
    } else {
        throw new Error("User Id must be defined");
    }
}

export async function deleteAccount(id, userId){
    if(getAccounts(userId)) {
        return deleteAccountFromRepository(id, userId);
    } else {
        throw new Error("No items to be deleted")
    }
}