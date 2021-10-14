import { TeacherQuizSession } from "./teacher-quiz-session.model"

export class TeacherQuizSessionResponse{
    currentWeekSessions: TeacherQuizSession[];
    lastWeekSessions: TeacherQuizSession[];
}
