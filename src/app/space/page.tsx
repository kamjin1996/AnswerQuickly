import ArticleList from "@/components/ArticleList";
import {getSortedPostsData} from '@/lib/posts';
import {Avatar} from "@/components/ui/account";

export default function Space({searchParams}: { searchParams: any | null | undefined }) {
    if (!searchParams) {
        return <div>No search parameters provided.</div>;
    }

    const articles = getSortedPostsData(searchParams.author_id);
    const authorName = searchParams.author_name || 'Unknown Author';
    const authorAvatar = searchParams.author_avatar || '/default-avatar.png';
    const authorGithubPage = searchParams.author_github || 'https://github.com/kamjin1996/answer-quickly';

    return (
        <div className="container mx-auto py-12">
            <div className='flex space-x-2 justify-end'>
                <h1 className='text-2xl font-semibold'>{authorName}&#39;s Space</h1>
                <Avatar src={authorAvatar} alt={authorName} link={authorGithubPage} size={32}></Avatar>
            </div>
            <ArticleList articles={articles} showMoreLink={false} showAuthor={false}/>
        </div>
    );
}
