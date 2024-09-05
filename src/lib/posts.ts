import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {marked} from 'marked';

const postsDirectory = path.join(process.cwd(), 'data', 'md')

export function getSortedPostsData(authorId?: string | null) {
    // Get file names under /data/md
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName) => {

        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        if (authorId && matterResult.data.authorId !== authorId) {
            return null
        }

        // Combine the data with the id
        return {
            id,
            title: matterResult.data.title,
            description: matterResult.data.description,
            authorId: matterResult.data.authorId,
            date: matterResult.data.date,
        }
    }).filter((item) => item != null)

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export async function getPostData(slug: string) {
    slug = decodeURIComponent(slug)
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const mdHtmlText = await marked(matterResult.content);

    // Combine the data with the id and contentHtml
    return {
        mdHtmlText,
        slug,
        authorId: matterResult.data.authorId,
        authorName: matterResult.data.authorName,
        lastModified: matterResult.data.lastModified,
        title: matterResult.data.title,
        description: matterResult.data.description,
        date: matterResult.data.date,
        // ... any other fields you want to include
    };
}

export async function getPostData2(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    const mdContent = matterResult.content
    // Combine the data with the id and contentHtml
    return {
        id,
        mdContent,
        ...matterResult.data
    }
}
