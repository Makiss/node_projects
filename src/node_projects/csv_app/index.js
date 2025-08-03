import prompt from "prompt";
import { createObjectCsvWriter } from "csv-writer";
import { existsSync } from "fs";

prompt.start();
prompt.message = "";

const csvWriter = createObjectCsvWriter({
  path: "./contacts.csv",
  header: [
    { id: "name", title: "NAME" },
    { id: "number", title: "NUMBER" },
    { id: "email", title: "EMAIL" },
    { id: "createdAt", title: "CREATED_AT" },
  ],
});

class Person {
  constructor(name = "", number = "", email = "") {
    this.name = name;
    this.number = number;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  async saveToCSV() {
    try {
      const { name, number, email, createdAt } = this;
      await csvWriter.writeRecords([{ name, number, email, createdAt }]);
      console.log(`${this.name} Saved!`);
    } catch (e) {
      console.error(e);
    }
  }
}

const startApp = async () => {
  const questions = [
    { name: "name", description: "Contact Name", required: true },
    {
      name: "number",
      description: "Contact Number",
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      message: "Wrong phone number format",
      required: true,
    },
    {
      name: "email",
      description: "Contact Email",
      pattern: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      message: "Wrong email format",
      required: true,
    },
  ];

  const responses = await prompt.get(questions);
  const person = new Person(responses.name, responses.number, responses.email);
  await person.saveToCSV();

  const { again } = await prompt.get([
    { name: "again", description: "Continue? [y to continue]" },
  ]);

  if (again.toLowerCase() === "y") {
    await startApp();
  } else {
    prompt.stop();
  }
};

startApp();
