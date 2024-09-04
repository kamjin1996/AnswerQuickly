'use client';

import {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";

export default function ArticleEditor() {
    const [article, setArticle] = useState({title: '', description: '', content: '', path: ''});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const path = searchParams.get('path');
    const router = useRouter();

    useEffect(() => {
        if (path) {
            fetchArticle(decodeURIComponent(path));
        } else {
            setError('No article path provided');
            setIsLoading(false);
        }
    }, [path]);

    const fetchArticle = async (articlePath) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/articles?path=${encodeURIComponent(articlePath)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch article');
            }
            const data = await response.json();
            setArticle(data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Failed to fetch article. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setArticle({...article, [name]: value});
    };

    const handleSave = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({article}),
            });
            if (!response.ok) {
                throw new Error('Failed to save article');
            }
            alert('Article saved successfully');
            router.push('/admin/articles')
        } catch (error) {
            console.error('Error saving article:', error);
            setError('Failed to save article. Please try again.');
        } finally {
            setIsLoading(false)
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4">
            <Input
                name="title"
                value={article.title}
                onChange={handleInputChange}
                placeholder="Article Title"
            />
            <Input
                name="description"
                value={article.description}
                onChange={handleInputChange}
                placeholder="Article Description"
            />
            <div className='flex'>
                    <Textarea
                        className={'w-1/2'}
                        name="content"
                        value={article.content}
                        onChange={handleInputChange}
                        placeholder="Article Content"
                        rows={20}
                    />

                <div>
                    <div className="m-1 h-full min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-35 dark:via-neutral-400"></div>
                </div>

                <div className='border w-1/2'>
                    <div className="container" data-color-mode="light">
                        <MDEditor.Markdown source={article.content} />
                    </div>
                </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Handling...' : 'Save Article'}
            </Button>
        </div>
    );
}
