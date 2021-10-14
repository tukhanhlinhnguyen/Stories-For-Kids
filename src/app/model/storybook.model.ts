export class Storybook {
	hasAudio: boolean;
	quizId: number;
	storyName: string;
	storybookId: number;
	storybookReadingLevel: string;
	display?: boolean;
	playable?: boolean = false;
	coverImagePath?: string;
	isStoryCompleted: boolean;
	isQuizCompleted: boolean;
	inProgressStorySessionId: number;
	inProgressStorySessionPageNumber: number;
	inProgressQuizSessionId: number;
	inProgressQuizSessionPageNumber: number;
}