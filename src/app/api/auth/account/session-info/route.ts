import {auth} from "../../../../../../auth";
import {NextResponse} from "next/server";
import {localQueryAccountByGithubAvatar} from "@/service/AccountService";

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401})
    }

    const account = await localQueryAccountByGithubAvatar(session?.user.image)

    return NextResponse.json({
        name: session?.user.name,
        avatar: session?.user.image,
        github_page: account?.github_page,
        github_no: account?.github_no,
        id: account?.id,
    }, {status: 200})
}
