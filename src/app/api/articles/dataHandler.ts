import {NextResponse} from "next/server";
import matter from "gray-matter";

import {Octokit} from '@octokit/rest';
import {Account} from "@/service/AccountService";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';

const articlesJsonPath = 'data/json/articles.json';
const mdFolderPath = 'data/md';

export async function deleteArticle(path: string) {
    const {data} = await octokit.repos.getContent({
        owner,
        repo,
        path,
    });
    const message = `File deleted: ${path}`
    // delete
    const response = await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        //@ts-ignore
        sha: data.sha,
    });

    console.log(`File deleted: ${response.data.commit.html_url}`);
    return true
}

export async function getArticle(pathOrDir: string) {
    const {data: files} = await octokit.repos.getContent({
        owner,
        repo,
        path: pathOrDir,
    });
    return files
}

export async function createArticle(account: Account, title: string, description: string, content: string, slug: string) {
    const path = `data/md/${slug}.md`;

    // Create new file
    const fileContent = matter.stringify(content, {
        title,
        description,
        authorId: account.id,
        authorName: account.name,
        date: new Date().toISOString(),
    });

    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Create new article: ${title}`,
        content: Buffer.from(fileContent).toString('base64'),
    });
    return true
}

export async function syncData(type: 'article') {
    switch (type) {
        case 'article':
            const articles = await queryArticlesMetadata()
            await syncArticle(articles)
    }
}

async function syncArticle(articles: any[]) {
    try {
        // Update articles.json
        const {data: jsonFile} = await octokit.repos.getContent({
            owner,
            repo,
            path: articlesJsonPath,
        });

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            // @ts-ignore
            path: articlesJsonPath,
            message: 'Sync Articles',
            content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
            sha: (jsonFile as any).sha,
        });
    } catch (error) {
        console.error('Error syncing articles:', error);
        throw error;
    }
}

async function queryArticlesMetadata() {
    // Fetch all MD files
    const {data: files} = await octokit.repos.getContent({
        owner,
        repo,
        path: mdFolderPath,
    });

    const mdFiles = (files as any[]).filter((file: any) => file.name.endsWith('.md'));

    const articles = await Promise.all(mdFiles.map(async file => {
        const filepath = file.path

        const {data} = await octokit.repos.getContent({
            owner,
            repo,
            path: filepath,
        });

        const content = Buffer.from((data as any).content, 'base64').toString('utf8');
        const {data: frontMatter, content: articleContent} = matter(content);

        // Fetch the last commit for this file
        const {data: commits} = await octokit.repos.listCommits({
            owner,
            repo,
            path: file.path,
            per_page: 1
        });

        const lastModified = commits[0]?.commit?.committer?.date || (data as any).sha;

        return {
            title: frontMatter.title,
            description: frontMatter.description,
            date: frontMatter.date,
            authorId: frontMatter.authorId,
            authorName: frontMatter.authorName,
            lastModified: lastModified,
            path: file.path,
        };
    }));
    return articles
}

export async function updateMdFile(account: Account, article: any) {
    try {
        const {data: currentFile} = await octokit.repos.getContent({
            owner,
            repo,
            path: article.path,
        });

        // @ts-ignore
        const currentContent = Buffer.from(currentFile.content, 'base64').toString('utf8');
        const {data: frontMatter, content: articleContent} = matter(currentContent);

        const updatedFrontMatter = {
            ...frontMatter,
            title: article.title,
            description: article.description,
            authorId: article.authorId,
            authorName: article.authorName,
            lastModified: new Date().toISOString(),
        };

        const updatedContent = matter.stringify(article.content, updatedFrontMatter);

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: article.path,
            message: `Update article: ${article.title}`,
            content: Buffer.from(updatedContent).toString('base64'),
            sha: (currentFile as any).sha,
        });

    } catch (error) {
        console.error('Error updating MD file:', error);
        throw error;
    }
}

// @ts-ignore
export async function fetchArticles(path, sync) {
    if (path) {
        // Fetch single article
        try {
            const {data} = await octokit.repos.getContent({
                owner,
                repo,
                path: decodeURIComponent(path),
            });

            // @ts-ignore
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            const {data: frontMatter, content: articleContent} = matter(content);

            const result = {
                ...frontMatter,
                content: articleContent,
                path: (data as any).path,
            }

            return result
        } catch (error) {
            console.error('Error fetching article:', error);
            return NextResponse.json({error: 'Failed to fetch article'}, {status: 500});
        }
    } else if (sync === 'true') {
        await syncData('article');
    }

    const {data} = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
    });

    // @ts-ignore
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    const articles = JSON.parse(content);
    return articles
}
