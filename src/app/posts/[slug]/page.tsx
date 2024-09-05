import {getPostData} from '@/lib/posts';
import Link from 'next/link';
import {ArrowLeft, ChevronRight} from 'lucide-react';


export async function generateMetadata({params}: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);
    return {
        title: `${postData.title}`,
        description: postData.description || `Read about ${postData.title} on Answer Quickly`,
    };
}

export default async function Post({params}: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);
    return (
        <article className="container mx-auto px-4 py-12 max-w-3xl">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <ChevronRight className="mx-2" size={16}/>
                <Link href="/posts" className="hover:text-blue-600">Articles</Link>
                <ChevronRight className="mx-2" size={16}/>
                <span className="text-gray-900">{postData.title}</span>
            </nav>

            {/* Meta information card */}
            <div className="bg-gray-100 rounded-lg p-6 mb-8">
                <div className='flex justify-between'>
                    {postData.date && (
                        <p className="text-gray-600 mb-2">{new Date(postData.date).toLocaleDateString()}</p>
                    )}
                    <p className="text-gray-700 text-sm">{postData.authorName}</p>
                </div>
                {postData.description && (
                    <p className="text-gray-800 mb-2">{postData.description}</p>
                )}

            </div>

            {/* Article content */}
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: postData.mdHtmlText }}
            >

            </div>

            {/* Back to articles link */}
            <div className="mt-12">
                <Link href="/posts"
                      className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2">
                    <ArrowLeft size={20}/>
                    Back to articles
                </Link>
            </div>
        </article>
    );
}
