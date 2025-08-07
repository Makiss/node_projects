import Sentiment from "sentiment";
import SpellChecker from "spellchecker";
import { SentimentScore } from "./db.js";
import prompt from "prompt";
import asciichart from "asciichart";

const chartConfig = {
  min: -1,
  max: 1,
  height: 10,
};

prompt.start({});
prompt.message = "";

class SentimentJournal {
  constructor() {
    this.sentiment = new Sentiment();
    this.scores = [0];
    this.entry = "";
  }

  correctSpelling(str) {
    const words = str.split(" ");
    const corrections = [];

    for (let word of words) {
      if (SpellChecker.isMisspelled(word)) {
        const options = SpellChecker.getCorrectionsForMisspelling(word);
        if (options.length > 0) {
          const correctedWord = options[0];
          corrections.push(correctedWord);
          console.log(`Corrected "${word}" → "${correctedWord}"`);
        } else {
          corrections.push(word);
          console.log(`No correction found for "${word}", keeping original`);
        }
      } else {
        corrections.push(word);
        console.log(`"${word}" is spelled correctly`);
      }
    }

    return corrections.join(" ");
  }

  async saveScore(score) {
    await SentimentScore.create({ score });
  }

  async fetchEntries() {
    const results = await SentimentScore.findAll({ limit: 100 });

    if (results.length) {
      this.scores = results.map(({ score }) => score);
    }
  }

  async analyzeSentiment() {
    if (!this.entry || this.entry === "") return;

    const { score } = this.sentiment.analyze(this.entry);
    const normalizedScore = Math.min(Math.max(score / 10, -1), 1);
    await this.saveScore(normalizedScore);
    this.scores.push(normalizedScore);
  }

  async promptEntry() {
    const { response } = await prompt.get([
      {
        name: "response",
        description: "How do you feel?",
      },
    ]);
    this.entry = this.correctSpelling(response);
  }

  setChartColor() {
    if (!this.scores.length) return;
    const recentScore = this.scores.at(-1);

    if (recentScore < 0) {
      chartConfig.colors = [asciichart.red];
    } else {
      chartConfig.colors = [asciichart.green];
    }
  }

  get sentimentLabel() {
    if (this.scores.length > 1) {
      const recentScore = this.scores.at(-1);

      if (recentScore > 0.3) {
        return "Positive";
      } else if (recentScore < -0.3) {
        return "Negative";
      } else {
        return "Neutral";
      }
    } else {
      return "No sentiment";
    }
  }

  printChart() {
    console.clear();
    this.setChartColor();
    console.log(asciichart.plot([this.scores], chartConfig));
    const sentimentLabel = this.sentimentLabel;

    console.log(sentimentLabel);
  }
}

export default SentimentJournal;
