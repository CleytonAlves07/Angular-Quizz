import { Component } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quizz',
  imports: [CommonModule],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})
export class QuizzComponent {
  title: string = "";

  questions: any;
  questionSelected: any;

  answers: string[] = [];
  answerSelected: string = "";

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  progress: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.resetQuiz();
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;
    this.updateProgress();

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
    }
  }

  async checkResult(anwsers: string[]) {
    const result = anwsers.reduce((previous, current, i, arr) => {
      if (
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });

    return result;
  }

  updateProgress() {
    this.progress = ((this.questionIndex + 1) / this.questionMaxIndex) * 100;
  }

  resetQuiz() {
    this.finished = false;
    this.title = quizz_questions.title;

    this.questions = quizz_questions.questions;
    this.questionSelected = this.questions[0];

    this.questionIndex = 0;
    this.questionMaxIndex = this.questions.length;

    this.answers = [];
    this.answerSelected = "";

    this.progress = 0;
  }
}
