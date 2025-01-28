import { describe, it, afterEach, vi, expect, assert, should } from "vitest";
import {createAccount, deleteAccount, getAccounts} from "./account.service";
import { createAccountInRepository, getAccountsFromRepository, deleteAccountFromRepository } from "./account.repository";

let tab=[]
// Mock : tester sans dépendre de la bdd
vi.mock("./account.repository", async (importOriginal) => ({
    ...(await importOriginal()),
    createAccountInRepository: vi.fn((data) => {
      const item = {
        id: tab.length + 1,
        userId: data.userId,
        amount: data.amount,
      };
      return item;
    }),
    getAccountsFromRepository: vi.fn((userId) => {
        //simuler le fait que l'objet a été ecrit en bdd et renvoyé
        const item = {
          userId: tab.length + 1,
        };
        return tab.filter( item => ({
            
        }))
        
      }),
      deleteAccountFromRepository: vi.fn((data) => {
        //simuler le fait que l'objet a été ecrit en bdd et renvoyé
        return {
          id: 2,
          userId: 6,
          amount: data.amount,
        };
        
      }),
  }));

  
//   createAccount réussi OK
//   createAccount échoue avec de mauvais paramètres OK
//   getAccounts réussi en vérifiant chaque élément de la liste OK
//   deleteAccount réussi OK
//   deleteAccount échoue avec un mauvais id d'Account OK


  describe("Account Service", () => {
    afterEach(() => vi.clearAllMocks());

    it("should create an account", async () => {
        const account = await createAccount({
            userId: 4,
            amount: 10.0,
        });
        expect(account).toBeDefined();

        expect(createAccountInRepository).toBeCalledTimes(1);
        expect(createAccountInRepository).toBeCalledWith({
            userId: 4,
            amount: 10.0,
        });
    });

    it("should trigger a bad request error when account creation", async () => {
        try {
            await createAccount({
                userId: 4,
                amount: "x",
            });
            assert.fail("create account should trigger an error.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    });

    it("should get accounts" , async () => {
        const account = await getAccounts({
            userId: 4,
        });
        expect(account).toBeDefined();

        expect(getAccountsFromRepository).toBeCalledTimes(1);
        expect(getAccountsFromRepository).toBeCalledWith({
            userId: 4,
        });
    });

    it("should delete an account"), async () => {
        const account = await deleteAccount({
            id: 2,
            userId: 6,
        });
        expect(account).toBeDefined;
        expect(deleteAccountFromRepository).toBeCalledTimes(1);
        expect(deleteAccountFromRepository).toBeCalledWith({
            id: 2,
            userId: 6,
        });
    }

    it("should trigger a bad request error when delete an account"), async () => {
        try {
            await deleteAccount({
                id: 2,
                userId: 6,
            });
            assert.fail("delete account should trigger an error.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    }

  })