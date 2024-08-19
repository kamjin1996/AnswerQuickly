import ContributorList from "@/components/ContributorList";
import path from "path";
import {promises as fs} from 'fs';
import {localeQueryAccountsMap, preload} from "@/service/AccountService";

export const metadata = {
    title: 'Contributors',
    description: 'Explore the developers who are contributing documentation to the current site, and more.',
}


const getContributors = async () => {
    try {
        const articlesFilePath = path.join(process.cwd(), 'data', 'json', 'articles.json');
        const articlesJson = JSON.parse(await fs.readFile(articlesFilePath, 'utf8'));

        const idAccountMap = await localeQueryAccountsMap('id');
        const allContributors = articlesJson.map((article: any) => {
            const account = idAccountMap.get(article.authorId);
            if (account) {
                return {
                    authorId: account.id,
                    authorName: account.name,
                    name: account.name,
                    avatar: account.avatar,
                    github_page: account.github_page,
                };
            } else {
                return null;
            }
        }).filter((item: any | null) => item != null);

        return allContributors;
    } catch (error) {
        console.error('Error fetching contributors:', error);
        return [];
    }
}

export default async function Contributors() {
    preload('id')
    const allContributors = await getContributors();
    if (allContributors.length === 0) {
        return (
            <div className="container mx-auto py-12">
                <p>No contributors found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">

            <ContributorList contributors={allContributors} showMoreLink={false}/>

            <div className='mt-40 text-center font-sans text-xl'>
                <h1>If you have an article or tutorial, you can join us directly, submit resources or articles, and join
                    the
                    open source contribution!</h1>
            </div>
        </div>
    );
}

