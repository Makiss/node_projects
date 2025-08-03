import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import { MongoClient } from "mongodb";

const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);
let hasPasswords = false;
let passwordsCollection, authCollection;
const dbName = "passwordManager";

const prompt = promptModule();

const main = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    authCollection = db.collection("auth");
    passwordsCollection = db.collection("passwords");

    const hashedPassword = await authCollection.findOne({ type: "auth" });
    hasPasswords = !!hashedPassword;
  } catch (e) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const saveNewPassword = async (password, saltRounds = 10) => {
  const hash = bcrypt.hashSync(password, saltRounds);
  await authCollection.insertOne({ type: "auth", hash, saltRounds });
  console.log("Password has been saved!");

  await showMenu();
};

const compareHashedPassword = async (password) => {
  const { hash } = await authCollection.findOne({ type: "auth" });

  return !hash ? false : await bcrypt.compare(password, hash);
};

const promptNewPassword = () => {
  const response = prompt("Enter a main password: ");
  const saltRounds = prompt("Enter salt rounds count (defaults to 10): ", 10);

  return saveNewPassword(response, saltRounds);
};

const promptOldPassword = async () => {
  let verified = false;

  while (!verified) {
    const response = prompt("Enter your password: ");
    const result = await compareHashedPassword(response);

    if (result) {
      console.log("Password verified.");
      verified = true;
      await showMenu();
    } else {
      console.log("Password incorrect. Try again.");
    }
  }
};

const showMenu = async () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Find password by name 
    5. Exit 
        `);
  const response = prompt(">");

  switch (response) {
    case "1":
      await viewPasswords();
      break;
    case "2":
      await promptManageNewPassword();
      break;
    case "3":
      await promptOldPassword();
      break;
    case "4":
      await promptPasswordBySource();
      break;
    case "5":
      process.exit();
    default:
      console.log(`That's an invalid response.`);
      await showMenu();
  }
};

const promptPasswordBySource = async () => {
  const source = prompt("Enter name to find password for: ");
  const { password } = await passwordsCollection.findOne({ source });

  if (password) {
    console.log(`${source} => ${password}`);
  } else {
    console.log("No password saved for that source.");
  }
  await showMenu();
};

const viewPasswords = async () => {
  const passwords = await passwordsCollection.find({}).toArray();
  passwords.forEach(({ source, password }, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  await showMenu();
};

const promptManageNewPassword = async () => {
  const source = prompt("Enter name for password: ");
  const password = prompt("Enter password to save: ");

  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password } },
    {
      returnDocument: "after",
      upsert: true,
    }
  );
  console.log(`Password for ${source} has been saved!`);
  await showMenu();
};

await main();
if (!hasPasswords) {
  promptNewPassword();
} else {
  promptOldPassword();
}
