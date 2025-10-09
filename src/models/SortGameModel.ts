import { GetContentForSort, Content } from "../services/apiClient";

export class SortGameModel {
    allContent: Content[] = [];

    async GetAllContent(amount: number): Promise<Content[]> {
        const allContent = await GetContentForSort(amount);
        this.allContent = allContent;
        return allContent;
    }

    getAllContent(): Content[] {
        return this.allContent;
    }
}