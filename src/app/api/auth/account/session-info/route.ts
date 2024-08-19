import {auth} from "../../../../../../auth";
import {NextResponse} from "next/server";
import {localQueryAccountByGithubNo} from "@/service/AccountService";

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401})
    }

    const match = session?.user?.image?.match(/\/u\/(\d+)\?/);
    if (!match) {
        return NextResponse.json({error: 'Avatar Url Invalid'}, {status: 500});
    }
    const githubId = match[1];
    const account = await localQueryAccountByGithubNo(githubId)

    return NextResponse.json({
        name: session?.user.name,
        avatar: session?.user.image,
        github_page: account?.github_page,
        github_no: account?.github_no,
        id: account?.id,
    }, {status: 200})
}
