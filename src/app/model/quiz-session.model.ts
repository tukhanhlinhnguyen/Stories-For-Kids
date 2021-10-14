export class QuizSession{
    quizSessionId?: number;
    forQuizId: number;
    byStudentId: string;
    quizScore: number;
    sessionStatus: string;
    stoppedOnQuestionNumber?: number;
    createdDate: number;
    storybookName?: string;
    storybookReadingLevel?: string;
}