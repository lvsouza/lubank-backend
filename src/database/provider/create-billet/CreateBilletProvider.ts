import { ICreateBillet } from "./ICreateBillet";

export class CreateBilletProvider {
    async execute(billet: ICreateBillet): Promise<Omit<ICreateBillet, 'favored' | 'value'> | null> {
        throw new Error("Not implemented");
    }
}
