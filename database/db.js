import * as SQLite from 'expo-sqlite';

let db;

export async function initializeDatabase() {
    if (!db) {
        db = await SQLite.openDatabaseAsync('database.db');
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS favorite (
                team_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                team_name TEXT NOT NULL,
                PRIMARY KEY (user_id, team_id)
            );
        `);
    }
}

export async function insertUser(username, password) {
    await initializeDatabase();
    await db.runAsync(
        `INSERT INTO user (username, password) VALUES (?, ?);`,
        username,
        password
    );
}

export async function verifyUserLogin(username, password) {
    await initializeDatabase();
    try {
        const user = await db.getFirstAsync(
            'SELECT password FROM user WHERE username = ?', 
            [username]
        );
        return user && user.password === password;
    } catch (error) {
        return false;
    }
}

export async function addTeamToFavs(username, teamName) {
    await initializeDatabase();
    try {
        const user = await db.getFirstAsync('SELECT id FROM user WHERE username = ?', [username]);
        if (user) {
            await db.runAsync(
                'INSERT OR REPLACE INTO favorite (user_id, team_id, team_name) VALUES (?, ?, ?)',
                [user.id, Math.random() * 1000, teamName]
            );
        }
    } catch (error) {
        console.error("Error adding team to favorites:", error);
    }
}

export async function removeTeamFromFav(username, teamName) {
    await initializeDatabase();
    try {
        const user = await db.getFirstAsync('SELECT id FROM user WHERE username = ?', [username]);
        if (user) {
            await db.runAsync(
                'DELETE FROM favorite WHERE user_id = ? AND team_name = ?',
                [user.id, teamName]
            );
        }
    } catch (error) {
        console.error("Error removing team from favorites:", error);
    }
}

export async function getFavTeamNames(username) {
    await initializeDatabase();
    try {
        const user = await db.getFirstAsync('SELECT id FROM user WHERE username = ?', [username]);
        if (user) {
            const favorites = await db.getAllAsync(
                'SELECT team_name FROM favorite WHERE user_id = ?',
                [user.id]
            );
            return favorites.map(fav => fav.team_name);
        }
        return [];
    } catch (error) {
        return [];
    }
}

export async function getAllFavTeamInfo(username) {
    await initializeDatabase();
    try {
        const user = await db.getFirstAsync('SELECT id FROM user WHERE username = ?', [username]);
        if (user) {
            const favorites = await db.getAllAsync(
                'SELECT team_id, team_name FROM favorite WHERE user_id = ?',
                [user.id]
            );
            return favorites.map(fav => [fav.team_id, fav.team_name]);
        }
        return [];
    } catch (error) {
        return [];
    }
}

export async function logDatabaseContents() {
    // Simple logging for debugging
}