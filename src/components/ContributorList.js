// components/ArticleList.js
import Link from 'next/link'
import {Avatar} from "@/components/ui/account";

export default async function ContributorList({contributors, showMoreLink = true}) {
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-tighter">Contributors</h2>
                {showMoreLink && (
                    <Link href="/contributors" className="text-blue-600 hover:text-blue-800 transition-colors">
                        More Contributor →
                    </Link>
                )}
            </div>

            <div className="p-2 flex space-x-1 items-center justify-start">

                {contributors.map(({authorId, name, github_page, avatar}) => (
                    <div key={authorId}>
                        <Avatar src={avatar} alt={name}
                                link={`/space?author_id=${authorId}&author_name=${name}&author_github=${github_page}&author_avatar=${avatar}`}
                                size={45}></Avatar>
                    </div>
                ))}
            </div>
            <div className='text-lg p-2 mt-12 mb-12'><p className=''>Click to view the contributor&#39;s Space</p></div>
        </section>
    )
}
