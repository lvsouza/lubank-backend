import { IUserInfo } from "./IUserInfo";

export class UserInfoProvider {
    async getByEmail(email: string): Promise<IUserInfo | null> {

        throw new Error("No implemented");
    }
}