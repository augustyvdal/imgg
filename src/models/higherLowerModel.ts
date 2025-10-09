import { fetchHigherLower, Content } from "../services/apiClient";

export class HigherLowerModel {
  allContent: Content[] = [];
  contentA: Content | null = null;
  contentB: Content | null = null;
  score: number = 0;
  category: string = "";

  // Calls fetchHigherLower from apiClient and sets allContent, contentA, contentB and score
  async startNewGame() {
    // randomize page, fix so that it can pick any page and make it work for both tv shows and movies since they have different amount of pages
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const allContent = await fetchHigherLower(this.category, randomPage);

    // Sets allContent attribute to the fetched allContent
    this.allContent = allContent;

    // Shuffle content
    this.allContent.sort(() => Math.random() - 0.5);

    // Sets contentA and contentB to the first two movies/tv-shows from allContent and removes them from the list
    this.contentA = this.allContent.shift() || null;
    this.contentB = this.allContent.shift() || null;
    this.score = 0;
  }

  chosenCategory(category: "movie" | "tv") {
    this.category = category;
  }

  // Returns boolean if guess is correct or not and adds score if correct
  makeGuess(guess: "higher" | "lower"): boolean {
    // Makes sure the content is not null
    if (!this.contentA || !this.contentB) return false;

    const isHigher = (this.contentB?.vote_average || 0) > (this.contentA?.vote_average || 0);
    const correct = (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    if (correct) {
      this.score++;
    }

    return correct;
  }

  // When a new round is starting, contentB becomes contentA and a new contentB is drawn from the list
  nextItem() {
    if (!this.contentB) return;
    this.contentA = this.contentB;
    this.contentB = this.allContent.shift() || null;
  }

  reset() {
    this.allContent = [];
    this.contentA = null;
    this.contentB = null;
    this.score = 0;
  }

};

