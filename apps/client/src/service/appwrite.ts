import { Client, TablesDB, ID, Query, Models } from "appwrite";

export type Metrics = {
  client_id: string;
  nickname: string;
  avatar: string;
  room_name: string;
  left_at?: Date;
};

const config = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  projectName: import.meta.env.VITE_APPWRITE_PROJECT_NAME,
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  tableId: import.meta.env.VITE_APPWRITE_TABLE_ID,
};

const client = new Client() //
  .setProject(config.projectId)
  .setEndpoint(config.endpoint);

const database = new TablesDB(client);

export async function createLoginMetrics(metrics: Metrics) {
  try {
    const response = await database.createRow<Models.DefaultRow & Metrics>({
      databaseId: config.databaseId,
      tableId: config.tableId,
      rowId: ID.unique(),
      data: metrics,
    });
    return response;
  } catch (error) {
    console.error("Failed to create login metrics:", error);
  }
}

export async function getUserMetrics() {
  try {
    const result = await database.listRows<Models.DefaultRow & Metrics>({
      databaseId: config.databaseId,
      tableId: config.tableId,
      queries: [Query.orderDesc("$createdAt")],
    });
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}
