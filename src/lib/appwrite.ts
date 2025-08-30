import { Client, Account, Databases } from "appwrite";
import {
  PUBLIC_APPWRITE_ENDPOINT,
  PUBLIC_APPWRITE_PROJECT_ID,
} from "$env/static/public";

const client: Client = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID);

const account: Account = new Account(client);
const databases: Databases = new Databases(client);

export { client, account, databases };