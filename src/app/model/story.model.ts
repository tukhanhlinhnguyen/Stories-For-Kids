export class Story {
	hasAudio: boolean;
	quizId: number;
	storyName: string;
	storybookId: number;
	storybookReadingLevel: string;
	text?: string[];
	images?: string[];
	display?: boolean;
	playable?: boolean = false;
	isStoryUploaded: boolean;
	isSoundUploaded: boolean;
}