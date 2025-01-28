import { sql } from "../../../infrastructure/db";

export async function createAccountInRepository({ userId, amount }) {
    const accounts = await sql`
        INSERT INTO accounts (userId, amount)
        VALUES (${userId}, ${amount})
        RETURNING *
    `;

    return accounts[0];
}

export async function getAccountsFromRepository(userId) {
    const accounts = await sql`
        SELECT * WHERE userId = ${userId}
        FROM accounts
    `;
    return accounts[0];
}

export async function deleteAccountFromRepository(id, userId) {
    const accounts = await sql`
        DELETE FROM accounts 
        WHERE id = ${id} AND userId = ${userId}
    `;
    return accounts[0];
}