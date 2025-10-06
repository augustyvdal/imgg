// ViewModel (hook) for Higher or Lower.
// Fetches 2 titles, compares ratings, tracks streak, updates score.
import { higherLowerModel, Movie } from "../models/higherLowerModel";

export class HigherLowerPresenter {
  private view: any;
  private movies: Movie[] = [];
  private currentIndex: number = 0;

  constructor(view: any) {
    this.view = view;
  }

  async init() {
    try {
      this.view.showLoading();
      this.movies = await higherLowerModel.getPopularMovies();
      this.currentIndex = 0;
      this.view.render(this.movies[this.currentIndex]);
    } catch (error) {
      this.view.showError(error);
    } finally {
      this.view.hideLoading();
    }
  }

  nextMovie() {
    if (this.movies.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
    this.view.render(this.movies[this.currentIndex]);
  }
}

