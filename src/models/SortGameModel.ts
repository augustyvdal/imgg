import { GetContentForSort, Content } from "../services/apiClient";

export class SortGameModel {
    allContent: Content[] = [];
    sortCategory: string = "";

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
        
        for (let i = 0; i < this.allContent.length - 1; i++) {
            if ((this.allContent[i]?.vote_average || 0) < (this.allContent[i + 1]?.vote_average || 0)) {
                return false;
            }
        }
        return true
    }
}