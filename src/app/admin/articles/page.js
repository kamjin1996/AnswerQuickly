'use client';

import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useAccount} from "../../../context/AccountContext";
import {signIn} from "next-auth/react";

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const {accountInfo, acquired} = useAccount();

    const checkAuth = useCallback(async () => {
        try {
            if (acquired && !accountInfo.name) {
                if (confirm("Become a contributor to benefit other developers, to login now?")) {
                    await signIn('github', {redirect: true, callbackUrl: '/admin/articles'})
                } else {
                    router.push('/')
                }
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    }, [router]);

    const fetchArticles = useCallback(async (sync = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/articles${sync ? '?sync=true' : ''}`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data.sort((a, b) => {
                return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
            }));
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to fetch articles. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        fetchArticles();
    }, [checkAuth, accountInfo.name, fetchArticles]);

    const handleSync = useCallback(() => {
        fetchArticles(true);
    }, [fetchArticles]);

    if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

    const handleDelete = async (e, article) => {
        e.preventDefault()

        if (!confirm(`Will delete: ${article.title}, confirm?`)) {
            return
        }
        try {
            const response = await fetch('/api/articles/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(article),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete article');
            }

            setArticles(articles.filter((item) => {
                return item.path !== article.path
            }))
        } catch (error) {
            console.error('Error creating article:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = async (e, article) => {
        e.preventDefault()
        if (accountInfo.id === article.authorId) {
            router.push(`/admin/articles/edit?path=${encodeURIComponent(article.path)}`)
        } else {
            alert("Can't edit someone else's post! Contact the administrator or author.")
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Article Management</h1>
            <div className="mb-4 flex justify-between">
                <Link href="/admin">
                    <Button>Back to Admin Dashboard</Button>
                </Link>
                <div>
                    <Button onClick={handleSync} className="mr-2">Sync Articles</Button>
                    <Link href="/admin/articles/create">
                        <Button>Create New Article</Button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article, index) => (
                        <TableRow key={index}>
                            <TableCell>{article.title}</TableCell>
                            <TableCell>{article.description}</TableCell>
                            <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                            <TableCell>{article.status}</TableCell>
                            <TableCell>{article.authorName}</TableCell>
                            <TableCell>{new Date(article.lastModified).toLocaleString()}</TableCell>
                            <TableCell>
                                <div className='flex space-x-2'>
                                    <Button onClick={async (e) => {
                                        await handleEdit(e, article)
                                    }}>Edit</Button>
                                    <Button onClick={async (e) => {
                                        await handleDelete(e, article)
                                    }}>Delete</Button></div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
