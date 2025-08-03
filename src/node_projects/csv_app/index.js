import prompt from "prompt";
import { createObjectCsvWriter } from "csv-writer";
import { existsSync } from "fs";

prompt.start();
prompt.message = "";

const csvWriter = createObjectCsvWriter({
  path: "./contacts.csv",
  append: existsSync("./contacts.csv"),
  header: [
    { id: "name", title: "NAME" },
    { id: "number", title: "NUMBER" },
    { id: "email", title: "EMAIL" },
  ],
});

class Person {
  constructor(name = "", number = "", email = "") {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  async saveToCSV() {
    try {
      const { name, number, email } = this;
      await csvWriter.writeRecords([{ name, number, email }]);
      console.log(`${this.name} Saved!`);
    } catch (e) {
      console.error(e);
    }
  }
}

const startApp = async () => {
  const questions = [
    { name: "name", description: "Contact Name" },
    { name: "number", description: "Contact Number" },
    { name: "email", description: "Contact Email" },
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
