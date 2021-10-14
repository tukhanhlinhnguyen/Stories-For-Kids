import { QuizSession } from "./quiz-session.model";
import { StorySession } from "./story-session.model";
import { Story } from "./story.model";
import { Storybook } from "./storybook.model";

export class HomeData {
    data:[
        userData: {
            age?: number;
            name?: string;
            studentId?: number;
            teacherId?: number;
            userId: number;
            userType: string;
            username: string;
            gender: string;
            avatarType?: string;
            avatarData?: string;
        },
        storybooks: Storybook[],
        inProgressQuiz?: QuizSession,
        inProgressStory?: StorySession
    ]
}