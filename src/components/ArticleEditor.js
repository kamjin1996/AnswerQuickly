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

    const handleMdTextChange = (mdText)=>{
        setArticle({...article, content: mdText});
    }

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
                <MDEditor data-color-mode="light" className={'w-full'} height={"100%"} visibleDragbar={false} value={article.content} onChange={handleMdTextChange} />
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Handling...' : 'Save Article'}
            </Button>
        </div>
    );
}
