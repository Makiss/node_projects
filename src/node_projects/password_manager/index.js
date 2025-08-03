import bcrypt from "bcrypt";
import promptModule from "prompt-sync";

const prompt = promptModule();
const mockDB = { passwords: {} };

const saveNewPassword = (password) => {
  mockDB.hash = bcrypt.hashSync(password, 10);
  console.log("Password has been saved!");
  showMenu();
};

const compareHashedPassword = async (password) =>
  await bcrypt.compare(password, mockDB.hash);

const promptNewPassword = () => {
  const response = prompt("Enter a main password: ");

  return saveNewPassword(response);
};

const promptOldPassword = async () => {
  let verified = false;

  while (!verified) {
    const response = prompt("Enter your password: ");
    const result = await compareHashedPassword(response);

    if (result) {
      console.log("Password verified.");
      verified = true;
      showMenu();
    } else {
      console.log("Password incorrect. Try again.");
    }
  }
};

const showMenu = () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit    
        `);
  const response = prompt(">");

  switch (response) {
    case "1":
      viewPasswords();
      break;
    case "2":
      promptManageNewPassword();
      break;
    case "3":
      promptOldPassword();
      break;
    case "4":
      process.exit();
      break;
    default:
      console.log(`That's an invalid response.`);
      showMenu();
  }
};

const viewPasswords = () => {
  const { passwords } = mockDB;
  Object.entries(passwords).forEach(([key, value], index) => {
    console.log(`${index + 1}. ${key} => ${value}`);
  });
  showMenu();
};

const promptManageNewPassword = () => {
  const source = prompt("Enter name for password: ");
  const password = prompt("Enter password to save: ");

  mockDB.passwords[source] = password;
  console.log(`Password for ${source} has been saved!`);
  showMenu();
};

if (!mockDB.hash) {
  promptNewPassword();
} else {
  promptOldPassword();
}
