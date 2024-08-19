// pages/index.js
import fs from 'fs'
import path from 'path'
import {getSortedPostsData} from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import ContributorList from '@/components/ContributorList'
import {Metadata} from 'next'
import {localeQueryAccountsMap, preload} from "@/service/AccountService";
import {Suspense} from "react";

export const metadata: Metadata = {
    title: 'Answer Quickly - Give the answer you want quickly.',
    description: 'Articles, and resources to quickly find what you want.',
}

const Data = async () => {
    const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
    const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
    const allPostsData = getSortedPostsData().slice(0, 6)

    const articlesFilePath = path.join(process.cwd(), 'data', 'json', 'articles.json');
    const articlesJson = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));

    const idAccountMap = await localeQueryAccountsMap('id')

    const allContributors = articlesJson.map((article: any) => {
        const account = idAccountMap.get(article.authorId)
        if (account) {
            return {
                authorId: account.id,
                authorName: account.name,
                name: account.name,
                avatar: account.avatar,
                github_page: account.github_page,
            }
        } else {
            return null
        }
    }).filter((item: any | null) => item != null)
    return {
        resources, allPostsData, allContributors
    }
}

export default async function Home() {
    preload('id')
    const {resources, allPostsData, allContributors} = await Data()

    return (
        <div className="container mx-auto py-12 space-y-16">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">Answer Quickly
                </h1>
                <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">Articles, and resources to
                    quickly find what you want.</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                    If you have an article or tutorial, you can join us directly, submit resources or articles, and join
                    the open source contribution!

                </p>
            </section>

            <ResourceList resources={resources}/>
            <ArticleList articles={allPostsData}/>
            <Suspense fallback={<div>Loading...</div>}>
                <ContributorList contributors={allContributors}/>
            </Suspense>
        </div>

    )
}
