import {NextResponse} from 'next/server';
import {deleteArticle, syncData} from "../dataHandler";

export async function POST(request: Request) {
    const {path} = await request.json();
    try {
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
