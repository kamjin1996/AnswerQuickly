import {NextResponse} from 'next/server';
import {deleteArticle, getArticle, syncData} from "../dataHandler";
import {getSessionAccountOrNull} from "@/utils/sessionUtil";

export async function POST(request: Request) {
    const {path} = await request.json();
    try {

        // Check Account access
        const account = await getSessionAccountOrNull()
        if (!account) {
            return NextResponse.json({message: 'Unauthorized.'}, {status: 401})
        }

        // Query article and check author
        const article = await getArticle(path) as any | null | undefined
        if (!article) return NextResponse.json({error: 'Failed to delete article,article not found'}, {status: 404});
        if (account.id !== article.authorId) {
            return NextResponse.json({error: 'Can\'t delete someone else\'s post! Contact the administrator or author.'}, {status: 406});
        }

        // Check if file already exists
        try {
            await deleteArticle(path)
        } catch (error) {
            //@ts-ignore
            if (error.status !== 404) {
                throw error;
            }
        }

        // Sync articles
        await syncData('article');

        return NextResponse.json({message: 'Article deleted successfully'});
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json({error: 'Failed to delete article'}, {status: 500});
    }
}
