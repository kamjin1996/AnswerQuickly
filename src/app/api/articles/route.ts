import {NextResponse} from 'next/server';
import {updateMdFile, syncData, fetchArticles, getArticle} from "./dataHandler";
import {getSessionAccountOrNull} from "../../../utils/sessionUtil";
import path2 from "path";
import fs from "fs";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const sync = searchParams.get('sync');
    const path = searchParams.get('path');

    try {
        let result = await fetchArticles(path, sync)

        const obtainStatus = (file_path: string) => {
            //check the local file is on system?
            const articleFilePath = path2.join(process.cwd(), file_path);
            return fs.existsSync(articleFilePath) ? 'Published' : 'Syncing'
        }

        if (Array.isArray(result)) {
            result = result.map((item: any) => {
                item.status = obtainStatus(item.path);
                return item
            })
        }

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

        if (article.authorId && account.id !== article.authorId) {
            return NextResponse.json({error: 'Can\'t edit someone else\'s post! Contact the administrator or author.'}, {status: 406});
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
