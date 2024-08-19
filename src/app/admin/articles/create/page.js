'use client';

import {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Alert} from "@/components/ui/alert";

export default function CreateArticlePage() {
    const [article, setArticle] = useState({title: '', description: '', content: '', slug: ''});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const titleRef = useRef(null)

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setArticle({...article, [name]: value});
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/articles/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(article),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create article');
            }

            router.push('/admin/articles');
        } catch (error) {
            console.error('Error creating article:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    function handleGenerateSlug() {
        function generateSlugFromTitle(title) {
            // Keep Chinese characters, and replace other non-alphanumeric characters with hyphens
            let filename = title
                .toLowerCase()
                // Converts all non-alphanumeric and non-Chinese characters to hyphens
                .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Controls the length of file names, limited to 50 characters
            const maxLength = 50;
            if (filename.length > maxLength) {
                filename = filename.slice(0, maxLength);
                // If the last character is a hyphen, delete it
                filename = filename.replace(/-+$/g, '');
            }

            return filename;
        }

        const slugByTitle = generateSlugFromTitle(titleRef.current.value)
        setArticle({...article, ['slug']: slugByTitle});
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
            {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
            <div className="space-y-4">
                <div className='flex space-x-2'>
                    <Input
                        ref={titleRef}
                        name="title"
                        value={article.title}
                        onChange={handleInputChange}
                        placeholder="Article Title"
                    />
                    <Button onClick={handleGenerateSlug}>Generate Slug</Button>
                </div>
                <Input
                    name="description"
                    value={article.description}
                    onChange={handleInputChange}
                    placeholder="Article Description"
                />
                <Input
                    name="slug"
                    value={article.slug}
                    onChange={handleInputChange}
                    placeholder="Article Slug (e.g., my-new-article)"
                />
                <Textarea
                    name="content"
                    value={article.content}
                    onChange={handleInputChange}
                    placeholder="Article Content (Markdown)"
                    rows={20}
                />
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Article'}
                </Button>
            </div>
        </div>
    );
}
