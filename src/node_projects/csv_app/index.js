import prompt from "prompt";
import { appendFileSync } from "fs";

prompt.start();
prompt.message = "";

class Person {
  constructor(name = "", number = "", email = "") {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  saveToCSV() {
    const content = `${this.name},${this.number},${this.email}\n`;
    try {
      appendFileSync("./contacts.csv", content);
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
