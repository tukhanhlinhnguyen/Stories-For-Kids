import { UserAvatarResponse } from "./user-avatar-response.model";

export class SaveUserAvatarResponse {
    avatarType: string;
    email: string;
    gender: string;
    id: number;
    userAvatar: UserAvatarResponse;
}