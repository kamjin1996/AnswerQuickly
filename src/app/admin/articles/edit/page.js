'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {useAccount} from "../../../../context/AccountContext";
import {signIn} from "next-auth/react";

// Dynamically import the component that uses useSearchParams
const ArticleEditor = dynamic(() => import('@/components/ArticleEditor'), {
  ssr: false,
});

export default function ArticleEditorPage() {
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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <Suspense fallback={<div>Loading editor...</div>}>
        <ArticleEditor />
      </Suspense>
    </div>
  );
}
