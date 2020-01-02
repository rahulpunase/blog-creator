export const fetch = {
    fetchFromDual: async (db) => {
        return db.execute("select 1 from dual", []);
    },

    fetchCategories: async (db) => {
        return await db.execute("SELECT `category_id`, `category_name` FROM `categories` where rowstate = 1");
    }
}