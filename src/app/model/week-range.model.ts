import { TeacherQuizSession } from "./teacher-quiz-session.model";

export class WeekRange {
    startDate: Date;
    endDate: Date;
    quizCount?: number;
    quizSessions?: TeacherQuizSession[];
}