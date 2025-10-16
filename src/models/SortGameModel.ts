import { GetContentForSort, Content } from "../services/apiClient";

export class SortGameModel {
    allContent: Content[] = [];
    sortCategory: string = "";
    maxTries: number = 3;
    triesRemaining: number = this.maxTries;

    async GetAllContent(amount: number) {
        const allContent = await GetContentForSort(amount, this.sortCategory);
        this.allContent = allContent;
    }

    returnAllContent(): Content[] {
        return this.allContent;
    }

    chooseSortCategory(category: string) {
        this.sortCategory = category
    }

    reorderContent(fromIndex: number, toIndex: number) {
        const updated = [...this.allContent];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        this.allContent = updated;
    }

    checkOrderCorrect(): boolean {
        if (!this.allContent || this.allContent.length === 0) {
            return false;
        }

        return this.allContent.every((item, index, array) => {
            if (index === array.length - 1) return true;
            return (item.vote_average || 0) >= (array[index + 1].vote_average || 0);
        });
    }

    countCorrectPlaces(): number {
        if (!this.allContent || this.allContent.length === 0) return 0;

        const correctOrder = [...this.allContent].sort(
            (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
        );

        return this.allContent.reduce(
            (count, item, i) => (item.id === correctOrder[i].id ? count + 1 : count),
            0
        );
    }

    decrementTriesRemaining() {
        if (this.triesRemaining > 0) {
            this.triesRemaining--;
        }
    }

    resetSortGame() {
        this.triesRemaining = this.maxTries;
        this.allContent = [];
        this.sortCategory = "";
    }

}