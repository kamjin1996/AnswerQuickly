import ArticleList from '@/components/ArticleList'
import {getSortedPostsData} from '@/lib/posts';
import {Button} from "../../components/ui/button";
import Link from 'next/link'

export const metadata = {
    title: 'Articles',
    description: 'Read our latest articles on web development, GitHub tips, and best practices.',
};

export default function Articles({searchParams}: { searchParams: any | null | undefined }) {
    let searchText = searchParams?.text
    let allPostsData = getSortedPostsData();
    if (searchText && searchText.length > 0) {
        searchText = searchText.toLowerCase()
        allPostsData = allPostsData.filter((postData) => {
            return postData?.title?.toLowerCase()?.includes(searchText) || postData?.description?.toLowerCase()?.includes(searchText)
        })
    }

    return (
        <div className="container mx-auto py-12">
            <div className='flex justify-end'>
                <Link href='/admin/articles'>
                    <Button>Manage</Button>
                </Link>
            </div>
            <ArticleList articles={allPostsData} showMoreLink={false}/>
        </div>
    )
}

