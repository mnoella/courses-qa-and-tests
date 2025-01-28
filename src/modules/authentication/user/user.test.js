import { describe, it, vi, expect, afterEach } from "vitest";
import {createUser, MAX_USER_AGE} from "./user.service";
import { createUserInRepository } from "./user.repository";


// Mock : tester sans dépendre de la bdd
vi.mock("./user.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createUserInRepository: vi.fn((data) => {
    //simuler le fait que l'objet a été ecrit en bdd et renvoyé
    return {
      id: 4,
      name: data.name,
      birthday: data.birthday,
    };
  }),
}));

describe("User Service", () => {
  afterEach(() => vi.clearAllMocks());
  // vérifier la création d'un User
  it("should create an user", async () => {
    const user = await createUser({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });
    expect(user).toBeDefined();
    // vérifier si le retour possède bien un id
    expect(user.id).toBeDefined();

    // s'il est bien du type "number"
    expect(user.id).toBeTypeOf("number");

    // Vérifier que l'objet possède bien "name" et qu'il contient bien le nom de notre user
    expect(user).toHaveProperty("name", "Valentin R");
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1997);
    expect(user.birthday.getMonth()).toBe(8);

    // Vérifier si la propriété birthday possède la bonne année et le bon mois.
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1997);
    expect(user.birthday.getMonth()).toBe(8);

    // vérifier notre Mock
    expect(createUserInRepository).toBeCalledTimes(1);
    // Appel du Mock avec les args
    expect(createUserInRepository).toBeCalledWith({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });
  });

  it("should trigger a bad request error when user creation", async () => {
    try {
      await createUser({
        name: "Valentin R",
      });
      assert.fail("createUser should trigger an error.");
    } catch (e) {
      expect(e.name).toBe('HttpBadRequest');
      expect(e.statusCode).toBe(400);
    }
  });

  it("Should trigger a forbidden error when user is too young", async () => {
    try {
      await createUser({
        name: "New_User",
        //birthday: new Date(2006, 8, 13),
        birthday: new Date(2010, 8, 13),
      });
      assert.fail("createUser should trigger an error.");
    } catch (e) {
      expect(e.name).toBe('HttpForbidden');
      expect(e.statusCode).toBe(403);
    }
  });
});
