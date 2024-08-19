import {NextResponse} from "next/server";

import {Octokit} from '@octokit/rest';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const githubPath = 'data/json/resources.json';

async function queryResources() {
    try {
        const {data} = await octokit.repos.getContent({
            owner,
            repo,
            path: githubPath,
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error fetching resources from GitHub:', error);
        throw error;
    }
}

export async function POST(req) {
    const needDeleteResource = await req.json();
    const allResources = await queryResources()

    const updatedResources = allResources.filter((resource) => {
        return !(resource.url === needDeleteResource.url && resource.name === needDeleteResource.name)
    })

    try {
        const {data: currentFile} = await octokit.repos.getContent({
            owner,
            repo,
            path: githubPath,
        });

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: githubPath,
            message: 'Update resources',
            content: Buffer.from(JSON.stringify(updatedResources, null, 2)).toString('base64'),
            sha: currentFile.sha,
        });

        // Update local file as well
        //fs.writeFileSync(localPath, JSON.stringify(updatedResources, null, 2));

        return NextResponse.json(updatedResources);
    } catch (error) {
        console.error('Error updating resources:', error);
        return NextResponse.json({error: 'Failed to update resources'}, {status: 500});
    }
}
