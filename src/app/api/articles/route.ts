import {NextResponse} from 'next/server';
import {updateMdFile, syncData, fetchArticles} from "./dataHandler";
import {getSessionAccountOrNull} from "../../../utils/sessionUtil";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const sync = searchParams.get('sync');
    const path = searchParams.get('path');

    try {
        const result = await fetchArticles(path, sync)
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({error: 'Failed to fetch articles'}, {status: 500});
    }
}

export async function POST(request: Request) {
    const {article} = await request.json();

    try {
        const account = await getSessionAccountOrNull()
        if (!account) {
            return NextResponse.json({message: 'Unauthorized.'}, {status: 401})
        }

        // Update the MD file
        await updateMdFile(account, article);

        // Sync articles
        await syncData('article');

        return NextResponse.json({message: 'Article updated successfully'});
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({error: 'Failed to update article'}, {status: 500});
    }
}
