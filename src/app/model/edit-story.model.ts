export class EditStory { 
    storybookId: number;
    storybookReadingLevel: string;
    storyFileUpload?: File | null;
    // storyFileName?: string;
    soundFileUpload?: File | null;
    hasAudio: boolean;
    // soundFileName?: string;
    storyName: string;
    coverImageFilePath?: string;
    isStoryUploaded?: boolean;
    isSoundUploaded?: boolean;
}

export class RequestEditStory { 
    storybookId: number;
    storybookReadingLevel: string;
    // storyFileUpload?: File | null;
    // storyFileName?: string;
    // soundFileUpload?: File | null;
    hasAudio: boolean;
    // soundFileName?: string;
    storyName: string;
    coverImageFilePath?: string;
    storyUploaded?: boolean;
    soundUploaded?: boolean;
}