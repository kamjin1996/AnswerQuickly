import {auth} from "../../auth";
import {Account, remoteQueryAccountByGithubPage} from "@/service/AccountService";

export async function getSessionAccountOrNull(): Promise<Account | null | undefined> {
    const session = await auth();
    if (!session?.user) {
        return null
    }
    const account = remoteQueryAccountByGithubPage(session.user.id || '')
    return account
}
