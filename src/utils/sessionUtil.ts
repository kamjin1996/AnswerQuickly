import {auth} from "../../auth";
import {Account, remoteQueryAccountByGithubNo} from "@/service/AccountService";

export async function getSessionAccountOrNull(): Promise<Account | null | undefined> {
    const session = await auth();
    if (!session?.user) {
        return null
    }

    if (!session.user.image) return null
    const match = session.user.image.match(/\/u\/(\d+)\?/);
    if (!match) return null;
    const githubNo = match[1];
    const account = remoteQueryAccountByGithubNo(githubNo)
    return account
}
