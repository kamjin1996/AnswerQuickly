import {NextResponse} from 'next/server';

import {createArticle, getArticle, syncData} from "../dataHandler";
import {getSessionAccountOrNull} from "../../../../utils/sessionUtil";


export async function POST(request: Request) {
    const {title, description, content, slug} = await request.json();

    // Validate slug
    if (!/^[a-z0-9\u4e00-\u9fa5]+(?:-[a-z0-9\u4e00-\u9fa5]+)*$/.test(slug)) {
        return NextResponse.json({error: 'Invalid slug format'}, {status: 400});
    }

    try {
        const path = `data/md/${slug}.md`;
        // Check if file already exists
        try {
            await getArticle(path)
            return NextResponse.json({error: 'Article with this slug already exists'}, {status: 400});
        } catch (error) {
            //@ts-ignore
            if (error.status !== 404) {
                throw error;
            }
        }

        const account = await getSessionAccountOrNull()
        if (!account) {
            return NextResponse.json({message: 'Unauthorized.'}, {status: 401})
        }

        await createArticle(account, title, description, content, slug)

        // Sync articles
        await syncData("article");

        return NextResponse.json({message: 'Article created successfully'});
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({error: 'Failed to create article'}, {status: 500});
    }
}
