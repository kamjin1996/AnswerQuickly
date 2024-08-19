// components/ArticleList.js
import Link from 'next/link'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {localeQueryAccountsMap} from "@/service/AccountService";
import {Avatar} from "@/components/ui/account";

export default async function ArticleList({articles, showMoreLink = true, showAuthor = true}) {
    const idAccountMap = await localeQueryAccountsMap('id');

    const account = (authorId) => idAccountMap?.get(authorId)

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-tighter">Articles</h2>
                {showMoreLink && (
                    <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors">
                        More articles →
                    </Link>
                )}
            </div>
            <div className="space-y-6">
                {articles.map(({id, title, description, authorId, authorName}) => (
                    <Card key={id}>
                        <CardHeader>
                            <Link
                                href={`/posts/${id}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                            >
                                <CardTitle>{title}</CardTitle>
                                →
                            </Link>
                            <CardDescription>{description}</CardDescription>
                            {
                                showAuthor && <div className='flex justify-end'>
                                    <Avatar link={account(authorId)?.github_page} alt={account(authorId)?.name}
                                            src={account(authorId)?.avatar}></Avatar>
                                </div>
                            }
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    )
}
